import { useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useFlowStore } from '../store/useFlowStore';

/**
 * Custom hook to handle canvas-level keyboard shortcuts.
 */
export const useHotkeys = () => {
  const { getNodes, setCenter } = useReactFlow();
  const addChildNode = useFlowStore((state) => state.addChildNode);
  const setDeletingNodeId = useFlowStore((state) => state.setDeletingNodeId);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Avoid triggering shortcuts when typing in an input or textarea
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      // Trigger deletion modal for selected node
      if (event.key === 'Delete' || (event.key === 'Backspace' && event.metaKey)) {
        const selectedNodes = getNodes().filter((n) => n.selected);
        if (selectedNodes.length === 1) {
          setDeletingNodeId(selectedNodes[0].id);
        }
      }

      // Cmd+Enter or Ctrl+Enter to branch from selected node
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        const selectedNodes = getNodes().filter((n) => n.selected);
        if (selectedNodes.length === 1) {
          const parentId = selectedNodes[0].id;
          const newNode = addChildNode(parentId);
          if (newNode) {
            // Auto-pan to the new node
            setCenter(newNode.position.x + 125, newNode.position.y + 100, { 
              duration: 800,
              zoom: 1 
            });
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [getNodes, addChildNode, setCenter, setDeletingNodeId]);
};
