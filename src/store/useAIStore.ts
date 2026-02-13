import { create } from 'zustand';
import { ContextSnapshot, getGeminiModel } from '../utils/ai';
import { useFlowStore } from './useFlowStore';
import { projectRepository } from '../db/repository';
import { useAppStore } from './useAppStore';
import { toast } from 'sonner';

interface QueueItem {
  nodeId: string;
  snapshot: ContextSnapshot;
}

interface AIState {
  queue: QueueItem[];
  isProcessing: boolean;
  enqueue: (nodeId: string, snapshot: ContextSnapshot) => void;
  processNext: () => Promise<void>;
}

export const useAIStore = create<AIState>((set, get) => ({
  queue: [],
  isProcessing: false,

  enqueue: (nodeId: string, snapshot: ContextSnapshot) => {
    set((state) => ({
      queue: [...state.queue, { nodeId, snapshot }],
    }));
    get().processNext();
  },

  processNext: async () => {
    const { isProcessing, queue } = get();
    if (isProcessing || queue.length === 0) return;

    set({ isProcessing: true });

    const item = queue[0];
    const { nodeId, snapshot } = item;
    const projectId = useAppStore.getState().activeProject?.id;
    
    let retryCount = 0;
    const maxRetries = 3;
    const backoff = [1000, 2000, 4000];

    while (retryCount <= maxRetries) {
      try {
        console.log(`[AI Queue] Processing node ${nodeId} (Attempt ${retryCount + 1})...`);
        
        const model = getGeminiModel();
        
        const history = [...snapshot.history];
        const lastMessage = history.pop();
        
        if (!lastMessage) {
          throw new Error("No message history found for AI generation");
        }

        const chat = model.startChat({
          history: history,
        });

        const result = await chat.sendMessageStream(lastMessage.parts[0].text);
        
        let accumulatedText = '';
        let chunkCount = 0;
        let isFirstChunk = true;
        let wasSafetyBlocked = false;

        for await (const chunk of result.stream) {
          // Task 2: Safety Filter Handling
          const finishReason = chunk.candidates?.[0]?.finishReason;
          if (finishReason === 'SAFETY') {
            accumulatedText += "\n\n⚠️ Content Blocked: This response was filtered by safety settings.";
            useFlowStore.getState().updateNodeContent(nodeId, accumulatedText);
            useFlowStore.getState().updateNodeThinking(nodeId, false);
            if (projectId) {
              await projectRepository.updateNodeContent(projectId, nodeId, accumulatedText);
            }
            wasSafetyBlocked = true;
            break; 
          }

          let chunkText = "";
          try {
            chunkText = chunk.text();
          } catch (e) {
            console.warn("Could not get text from chunk (might be blocked):", e);
          }

          accumulatedText += chunkText;
          chunkCount++;

          // Update UI
          useFlowStore.getState().updateNodeContent(nodeId, accumulatedText);
          
          if (isFirstChunk) {
            useFlowStore.getState().updateNodeThinking(nodeId, false);
            isFirstChunk = false;
          }

          // Task 3: Throttled Persistence (every 10 chunks)
          if (projectId && chunkCount % 10 === 0) {
            projectRepository.updateNodeContent(projectId, nodeId, accumulatedText);
          }
        }

        if (wasSafetyBlocked) {
          break; // Exit retry loop on safety block
        }

        // Final save
        if (projectId) {
          await projectRepository.updateNodeContent(projectId, nodeId, accumulatedText);
        }
        
        console.log(`[AI Queue] Finished node ${nodeId}`);
        break; // Success
      } catch (error: any) {
        console.error(`[AI Queue] Error on attempt ${retryCount + 1}:`, error);
        
        const errorMessage = error instanceof Error ? error.message : String(error);
        const isAuthError = errorMessage.includes('401') || errorMessage.toLowerCase().includes('unauthorized') || errorMessage.toLowerCase().includes('api key');
        const isQuotaError = errorMessage.includes('429') || errorMessage.toLowerCase().includes('quota');
        
        if (isAuthError) {
          toast.error("Invalid API Key. Please check your settings.", { duration: 10000 });
          useFlowStore.getState().updateNodeThinking(nodeId, false);
          useFlowStore.getState().deleteNodeOnly(nodeId);
          break;
        }

        if (isQuotaError) {
          toast.error("API Quota exceeded. Please try again later.", { duration: 10000 });
          useFlowStore.getState().updateNodeThinking(nodeId, false);
          useFlowStore.getState().deleteNodeOnly(nodeId);
          break;
        }

        // Connectivity error check
        const isConnectivityError = 
          errorMessage.includes('fetch failed') || 
          errorMessage.includes('Network Error') || 
          errorMessage.includes('Failed to fetch') ||
          errorMessage.includes('Deadline Exceeded') ||
          errorMessage.includes('503') || 
          errorMessage.includes('504');

        if (isConnectivityError && retryCount < maxRetries) {
          const delayTime = backoff[retryCount];
          useFlowStore.getState().updateNodeContent(nodeId, `Retrying in ${delayTime / 1000}s...`);
          await new Promise(resolve => setTimeout(resolve, delayTime));
          retryCount++;
        } else {
          // Final failure
          toast.error(`Failed to generate response: ${errorMessage}`, { duration: 10000 });
          useFlowStore.getState().updateNodeThinking(nodeId, false);
          useFlowStore.getState().deleteNodeOnly(nodeId);
          break;
        }
      }
    }

    set((state) => ({
      queue: state.queue.slice(1),
      isProcessing: false,
    }));
    // Recurse to process next item
    get().processNext();
  },
}));
