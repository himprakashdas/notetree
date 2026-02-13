import { useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useFlowStore } from '../store/useFlowStore';

/**
 * Custom hook to handle canvas-level keyboard shortcuts.
 */
export const useHotkeys = () => {
  const { getNodes, setCenter } = useReactFlow();
  const addBranch = useFlowStore((state) => state.addBranch);
  const addAIChild = useFlowStore((state) => state.addAIChild);
  const setDeletingNodeId = useFlowStore((state) => state.setDeletingNodeId);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Avoid triggering shortcuts when typing in an input or textarea
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target as HTMLElement).isContentEditable
      ) {
        // Still allow Cmd+Enter to branch even when focused in an editor
        if (!((event.metaKey || event.ctrlKey) && event.key === 'Enter')) {
          return;
        }
        // Stop propagation for the special case
        event.stopPropagation();
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
        event.preventDefault();
        const selectedNodes = getNodes().filter((n) => n.selected);
        if (selectedNodes.length === 1) {
          const selectedNode = selectedNodes[0];
          const parentId = selectedNode.id;
          
          let newNode;
          if (selectedNode.data.type === 'user') {
            newNode = addAIChild(parentId);
          } else {
            newNode = addBranch(parentId);
          }

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

    window.addEventListener('keydown', handleKeyDown, true); // Use capture phase to intercept
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [getNodes, addBranch, addAIChild, setCenter, setDeletingNodeId]);
};
