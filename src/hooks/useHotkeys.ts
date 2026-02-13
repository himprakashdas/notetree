import { useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useFlowStore } from '../store/useFlowStore';

/**
 * Custom hook to handle canvas-level keyboard shortcuts.
 */
export const useHotkeys = () => {
  const { getNodes, deleteElements, setCenter } = useReactFlow();
  const addChildNode = useFlowStore((state) => state.addChildNode);

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

      // Delete selected nodes
      if (event.key === 'Delete' || (event.key === 'Backspace' && event.metaKey)) {
        const selectedNodes = getNodes().filter((n) => n.selected);
        if (selectedNodes.length > 0) {
          deleteElements({ nodes: selectedNodes });
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
  }, [getNodes, deleteElements, addChildNode, setCenter]);
};
