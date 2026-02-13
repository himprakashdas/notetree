import { useEffect, useRef } from 'react';
import { useFlowStore } from '../store/useFlowStore';
import { useAppStore } from '../store/useAppStore';
import { projectRepository } from '../db/repository';

export function usePersistence() {
  const { nodes, edges } = useFlowStore();
  const { activeProject } = useAppStore();
  const activeProjectId = activeProject?.id;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!activeProjectId || nodes.length === 0) return;

    // Debounce save
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      try {
        await projectRepository.saveNodes(activeProjectId, nodes);
        await projectRepository.saveEdges(activeProjectId, edges);
        await projectRepository.updateProject(activeProjectId, {}); // Update lastModified
        console.log('Auto-saved to IndexedDB');
      } catch (error) {
        console.error('Failed to auto-save:', error);
      }
    }, 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [nodes, edges, activeProjectId]);
}
