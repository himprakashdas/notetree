import { useCallback, useEffect } from 'react';
import { 
  ReactFlow, 
  Background, 
  BackgroundVariant,
  NodeTypes,
  ReactFlowProvider,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { nanoid } from 'nanoid';
import { ChevronLeft, Plus, Maximize, Loader2, User, Sparkles } from 'lucide-react';

import { useFlowStore } from '../../store/useFlowStore';
import { useAppStore } from '../../store/useAppStore';
import { useHotkeys } from '../../hooks/useHotkeys';
import { usePersistence } from '../../hooks/usePersistence';
import ChatNode from './ChatNode';
import ChatOverlay from '../chat/ChatOverlay';
import { DeletionModal } from './DeletionModal';
import { NoteTreeNode } from '../../types';

const nodeTypes: NodeTypes = {
  chatNode: ChatNode,
};

const FlowCanvasInternal = () => {
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect,
    addNode,
    setEditingNodeId,
    editingNodeId,
    deletingNodeId,
    setDeletingNodeId,
    deleteNodeOnly,
    deleteNodeAndDescendants,
    nextRoleOverride,
    setNextRoleOverride,
    isLoading,
    loadProjectData,
    clearData
  } = useFlowStore();

  const { activeProject, setActiveProject } = useAppStore();
  const activeProjectId = activeProject?.id;
  const { fitView, setCenter } = useReactFlow();

  // Initialize keyboard shortcuts and persistence
  useHotkeys();
  usePersistence();

  // Load project data on mount or when activeProjectId changes
  useEffect(() => {
    if (activeProjectId) {
      loadProjectData(activeProjectId);
    }
  }, [activeProjectId, loadProjectData]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: NoteTreeNode) => {
    setEditingNodeId(node.id);
  }, [setEditingNodeId]);

  const handleBack = useCallback(() => {
    setActiveProject(null);
    clearData();
  }, [setActiveProject, clearData]);

  const startChat = useCallback(() => {
    const newNodeId = nanoid();
    const newNode: NoteTreeNode = {
      id: newNodeId,
      type: 'chatNode',
      position: { x: 0, y: 0 },
      data: { 
        label: 'Hello! This is the first node.', 
        content: '', 
        type: 'user' 
      },
      style: { width: 250, height: 120 },
    };
    addNode(newNode);
    
    // Smoothly center on the first node
    setTimeout(() => {
      setCenter(125, 100, { duration: 800, zoom: 1 });
    }, 50);
  }, [addNode, setCenter]);

  const handleDeleteOnly = useCallback(() => {
    if (deletingNodeId) {
      deleteNodeOnly(deletingNodeId);
      setDeletingNodeId(null);
    }
  }, [deletingNodeId, deleteNodeOnly, setDeletingNodeId]);

  const handleDeleteAll = useCallback(() => {
    if (deletingNodeId) {
      deleteNodeAndDescendants(deletingNodeId);
      setDeletingNodeId(null);
    }
  }, [deletingNodeId, deleteNodeAndDescendants, setDeletingNodeId]);

  const isEditing = !!editingNodeId;
  const isDeleting = !!deletingNodeId;

  if (isLoading) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
          <p className="text-zinc-500 animate-pulse">Loading your tree...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full bg-background relative ${(isEditing || isDeleting) ? 'overflow-hidden' : ''}`}>
      {/* HUD - Top Left */}
      <div className={`absolute top-6 left-6 z-10 flex gap-4 items-center transition-opacity duration-300 ${(isEditing || isDeleting) ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex items-center gap-2 pr-4 border-r border-zinc-800">
          <img src="/favicon.png" alt="Logo" className="w-6 h-6" />
          <span className="font-bold text-rose-500 tracking-tight select-none">NoteTree</span>
        </div>
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 backdrop-blur-md border border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-lg transition-colors text-sm font-medium shadow-xl"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Gallery
        </button>
      </div>

      {/* HUD - Top Right (Role Toggle) */}
      <div className={`absolute top-6 right-6 z-10 flex p-1 bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-lg transition-opacity duration-300 ${(isEditing || isDeleting) ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <button
          onClick={() => setNextRoleOverride('user')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all text-xs font-bold ${
            nextRoleOverride === 'user' || nextRoleOverride === null
              ? 'bg-zinc-800 text-white shadow-sm'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <User className={`w-3.5 h-3.5 ${nextRoleOverride === 'user' || nextRoleOverride === null ? 'text-zinc-300' : 'text-zinc-600'}`} />
          USER
        </button>
        <button
          onClick={() => setNextRoleOverride('ai')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all text-xs font-bold ${
            nextRoleOverride === 'ai'
              ? 'bg-rose-500/20 text-rose-500 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${nextRoleOverride === 'ai' ? 'text-rose-500' : 'text-zinc-600'}`} />
          ASSISTANT
        </button>
      </div>

      {/* HUD - Bottom Left */}
      <div className={`absolute bottom-6 left-6 z-10 flex gap-2 transition-opacity duration-300 ${(isEditing || isDeleting) ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <button
          onClick={() => fitView({ duration: 800 })}
          className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 backdrop-blur-md border border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-lg transition-colors text-sm font-medium shadow-xl"
          title="Fit to View"
        >
          <Maximize className="w-4 h-4" />
          Fit View
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        nodesConnectable={false}
        edgesReconnectable={false}
        elementsSelectable={!isEditing && !isDeleting}
        nodesDraggable={!isEditing && !isDeleting}
        panOnDrag={!isEditing && !isDeleting}
        zoomOnScroll={!isEditing && !isDeleting}
        colorMode="dark"
        paneClickDistance={5}
        deleteKeyCode={null} // Handled by useHotkeys
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1} 
          color="#333"
        />
      </ReactFlow>

      {/* Empty State Overlay */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <button
            onClick={startChat}
            className="pointer-events-auto flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-full shadow-2xl shadow-rose-900/20 transition-all transform hover:scale-105 font-bold"
          >
            <Plus className="w-5 h-5" />
            Start chat
          </button>
        </div>
      )}

      <ChatOverlay />

      <DeletionModal
        isOpen={isDeleting}
        onClose={() => setDeletingNodeId(null)}
        onDeleteOnly={handleDeleteOnly}
        onDeleteAll={handleDeleteAll}
      />
    </div>
  );
};

const FlowCanvas = () => (
  <ReactFlowProvider>
    <FlowCanvasInternal />
  </ReactFlowProvider>
);

export default FlowCanvas;
