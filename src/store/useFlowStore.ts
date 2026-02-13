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
import { projectRepository } from '../db/repository';

interface FlowState {
  nodes: NoteTreeNode[];
  edges: NoteTreeEdge[];
  editingNodeId: string | null;
  isLoading: boolean;
  onNodesChange: OnNodesChange<NoteTreeNode>;
  onEdgesChange: OnEdgesChange<NoteTreeEdge>;
  onConnect: OnConnect;
  setNodes: (nodes: NoteTreeNode[]) => void;
  setEdges: (edges: NoteTreeEdge[]) => void;
  addNode: (node: NoteTreeNode) => void;
  addChildNode: (parentId: string) => NoteTreeNode | undefined;
  deleteNode: (nodeId: string) => void;
  setEditingNodeId: (nodeId: string | null) => void;
  updateNodeContent: (nodeId: string, label: string) => void;
  loadProjectData: (projectId: string) => Promise<void>;
  clearData: () => void;
}

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  editingNodeId: null,
  isLoading: false,
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
    const newEdges = addEdge(connection, get().edges);
    set({
      edges: newEdges as NoteTreeEdge[],
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

  setEditingNodeId: (nodeId: string | null) => set({ editingNodeId: nodeId }),

  updateNodeContent: (nodeId: string, label: string) => {
    set({
      nodes: get().nodes.map((node) => 
        node.id === nodeId 
          ? { ...node, data: { ...node.data, label } } 
          : node
      ),
    });
  },

  loadProjectData: async (projectId: string) => {
    set({ isLoading: true });
    try {
      const { nodes, edges } = await projectRepository.getProjectData(projectId);
      set({ 
        nodes: nodes as NoteTreeNode[], 
        edges: edges as NoteTreeEdge[], 
        isLoading: false 
      });
    } catch (error) {
      console.error('Failed to load project data:', error);
      set({ isLoading: false });
    }
  },

  clearData: () => set({ nodes: [], edges: [], editingNodeId: null }),
}));
