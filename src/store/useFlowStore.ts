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
}));
