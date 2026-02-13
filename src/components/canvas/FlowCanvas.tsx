import { useCallback } from 'react';
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
import { ChevronLeft, Plus, Maximize } from 'lucide-react';

import { useFlowStore } from '../../store/useFlowStore';
import { useAppStore } from '../../store/useAppStore';
import ChatNode from './ChatNode';
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
    addNode 
  } = useFlowStore();

  const { setActiveProject } = useAppStore();
  const { fitView, setCenter } = useReactFlow();

  const startChat = useCallback(() => {
    const newNode: NoteTreeNode = {
      id: nanoid(),
      type: 'chatNode',
      position: { x: 0, y: 0 },
      data: { 
        label: 'Hello! This is the first node.', 
        content: '', 
        type: 'user' 
      },
    };
    addNode(newNode);
    
    // Smoothly center on the first node
    setTimeout(() => {
      setCenter(125, 100, { duration: 800, zoom: 1 });
    }, 50);
  }, [addNode, setCenter]);

  return (
    <div className="w-full h-full bg-black relative">
      {/* HUD - Top Left */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button
          onClick={() => setActiveProject(null)}
          className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-md transition-colors text-sm font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Gallery
        </button>
      </div>

      {/* HUD - Bottom Left */}
      <div className="absolute bottom-4 left-4 z-10 flex gap-2">
        <button
          onClick={() => fitView({ duration: 800 })}
          className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-md transition-colors text-sm font-medium shadow-xl"
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
        nodeTypes={nodeTypes}
        fitView
        nodesConnectable={false}
        edgesReconnectable={false}
        elementsSelectable={true}
        colorMode="dark"
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
    </div>
  );
};

const FlowCanvas = () => (
  <ReactFlowProvider>
    <FlowCanvasInternal />
  </ReactFlowProvider>
);

export default FlowCanvas;
