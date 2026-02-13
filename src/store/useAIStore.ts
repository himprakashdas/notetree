import { create } from 'zustand';
import { ContextSnapshot, getGeminiModel } from '../utils/ai';
import { useFlowStore } from './useFlowStore';
import { projectRepository } from '../db/repository';
import { useAppStore } from './useAppStore';

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
    
    try {
      console.log(`[AI Queue] Processing node ${nodeId}...`);
      
      const model = getGeminiModel();
      
      // The last message in history is often the one we want to "respond" to
      // but if we are generating for a specific node, we might want to take all but last as history
      // and last as the message.
      // However, formatPrompt currently includes everything.
      // Gemini startChat history should not include the current message.
      
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

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
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

      // Final save
      if (projectId) {
        await projectRepository.updateNodeContent(projectId, nodeId, accumulatedText);
      }
      
      console.log(`[AI Queue] Finished node ${nodeId}`);
    } catch (error) {
      console.error(`[AI Queue] Error processing node ${nodeId}:`, error);
      useFlowStore.getState().updateNodeThinking(nodeId, false);
      useFlowStore.getState().updateNodeContent(nodeId, `Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      set((state) => ({
        queue: state.queue.slice(1),
        isProcessing: false,
      }));
      // Recurse to process next item
      get().processNext();
    }
  },
}));
