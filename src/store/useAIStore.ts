import { create } from 'zustand';
import { ContextSnapshot } from '../utils/ai';

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
    
    try {
      console.log(`[AI Queue] Processing node ${item.nodeId}...`);
      // Stub for generation logic (to be implemented in next plan)
      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(`[AI Queue] Finished node ${item.nodeId}`);
    } catch (error) {
      console.error(`[AI Queue] Error processing node ${item.nodeId}:`, error);
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
