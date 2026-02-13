import { create } from 'zustand';
import { 
  Connection, 
  Edge, 
  EdgeChange, 
  Node, 
  NodeChange, 
  addEdge, 
  applyNodeChanges, 
  applyEdgeChanges,
  OnNodesChange,
  OnEdgesChange,
  OnConnect
} from '@xyflow/react';
import { nanoid } from 'nanoid';
import { NoteTreeNode, NoteTreeEdge } from '../types';

interface FlowState {
  nodes: NoteTreeNode[];
  edges: NoteTreeEdge[];
  onNodesChange: OnNodesChange<NoteTreeNode>;
  onEdgesChange: OnEdgesChange<NoteTreeEdge>;
  onConnect: OnConnect;
  setNodes: (nodes: NoteTreeNode[]) => void;
  setEdges: (edges: NoteTreeEdge[]) => void;
  addNode: (node: NoteTreeNode) => void;
  addChildNode: (parentId: string) => NoteTreeNode | undefined;
  deleteNode: (nodeId: string) => void;
}

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  onNodesChange: (changes: NodeChange<NoteTreeNode>[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange<NoteTreeEdge>[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  addNode: (node) => set({ nodes: [...get().nodes, node] }),
  
  addChildNode: (parentId: string) => {
    const { nodes, edges } = get();
    const parentNode = nodes.find((n) => n.id === parentId);
    if (!parentNode) return;

    const newNodeId = nanoid();
    const isParentUser = parentNode.data.type === 'user';
    
    const newNode: NoteTreeNode = {
      id: newNodeId,
      type: 'chatNode',
      position: {
        x: parentNode.position.x + (Math.random() - 0.5) * 50,
        y: parentNode.position.y + 200,
      },
      data: {
        label: '',
        content: '',
        type: isParentUser ? 'ai' : 'user',
      },
    };

    const newEdge: NoteTreeEdge = {
      id: `e-${parentId}-${newNodeId}`,
      source: parentId,
      target: newNodeId,
    };

    set({
      nodes: [...nodes, newNode],
      edges: [...edges, newEdge],
    });

    return newNode;
  },

  deleteNode: (nodeId: string) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
    });
  },
}));
