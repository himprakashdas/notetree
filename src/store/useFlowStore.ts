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
  deletingNodeId: string | null;
  nextRoleOverride: 'user' | 'ai' | null;
  isLoading: boolean;
  onNodesChange: OnNodesChange<NoteTreeNode>;
  onEdgesChange: OnEdgesChange<NoteTreeEdge>;
  onConnect: OnConnect;
  setNodes: (nodes: NoteTreeNode[]) => void;
  setEdges: (edges: NoteTreeEdge[]) => void;
  addNode: (node: NoteTreeNode) => void;
  setNextRoleOverride: (role: 'user' | 'ai' | null) => void;
  addBranch: (parentId: string) => NoteTreeNode | undefined;
  addAIChild: (parentId: string) => NoteTreeNode | undefined;
  deleteNodeOnly: (nodeId: string) => void;
  deleteNodeAndDescendants: (nodeId: string) => void;
  setEditingNodeId: (nodeId: string | null) => void;
  setDeletingNodeId: (nodeId: string | null) => void;
  updateNodeContent: (nodeId: string, label: string) => void;
  loadProjectData: (projectId: string) => Promise<void>;
  clearData: () => void;
}

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  editingNodeId: null,
  deletingNodeId: null,
  nextRoleOverride: null,
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
  
  setNextRoleOverride: (role) => set({ nextRoleOverride: role }),

  addBranch: (parentId: string) => {
    const { nodes, edges, nextRoleOverride, setNextRoleOverride } = get();
    const parentNode = nodes.find((n) => n.id === parentId);
    if (!parentNode) return;

    let role: 'user' | 'ai';
    if (nextRoleOverride) {
      role = nextRoleOverride;
      setNextRoleOverride(null);
    } else {
      // Default logic: AI -> User child, User -> User sibling
      role = parentNode.data.type === 'ai' ? 'user' : 'user';
    }

    const isSameRole = role === parentNode.data.type;
    const newNodeId = nanoid();

    // Sibling (same role) offset X+300, Child (diff role) offset Y+200
    const newNode: NoteTreeNode = {
      id: newNodeId,
      type: 'chatNode',
      position: {
        x: parentNode.position.x + (isSameRole ? 300 : 0),
        y: parentNode.position.y + (isSameRole ? 0 : 200),
      },
      data: {
        label: '',
        content: '',
        type: role,
        thinking: role === 'ai',
      },
      style: { width: 250, height: 120 },
    };

    // Edge handling
    const parentEdge = edges.find(e => e.target === parentId);
    const actualParentId = (isSameRole && parentEdge) ? parentEdge.source : parentId;

    const newEdge: NoteTreeEdge = {
      id: `e-${actualParentId}-${newNodeId}`,
      source: actualParentId,
      target: newNodeId,
    };

    set({
      nodes: [...nodes, newNode],
      edges: (isSameRole && !parentEdge) ? edges : [...edges, newEdge],
    });

    return newNode;
  },

  addAIChild: (parentId: string) => {
    const { nodes, edges } = get();
    const parentNode = nodes.find((n) => n.id === parentId);
    if (!parentNode) return;

    const newNodeId = nanoid();
    const newNode: NoteTreeNode = {
      id: newNodeId,
      type: 'chatNode',
      position: {
        x: parentNode.position.x,
        y: parentNode.position.y + 200,
      },
      data: {
        label: '',
        content: '',
        type: 'ai',
        thinking: true,
      },
      style: { width: 250, height: 120 },
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

  deleteNodeOnly: (nodeId: string) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
    });
  },

  deleteNodeAndDescendants: (nodeId: string) => {
    const { nodes, edges } = get();
    const descendants = new Set<string>();
    
    const findDescendants = (id: string) => {
      edges.forEach((edge) => {
        if (edge.source === id) {
          descendants.add(edge.target);
          findDescendants(edge.target);
        }
      });
    };

    descendants.add(nodeId);
    findDescendants(nodeId);

    set({
      nodes: nodes.filter((node) => !descendants.has(node.id)),
      edges: edges.filter(
        (edge) => !descendants.has(edge.source) && !descendants.has(edge.target)
      ),
    });
  },

  setEditingNodeId: (nodeId: string | null) => set({ editingNodeId: nodeId }),

  setDeletingNodeId: (nodeId: string | null) => set({ deletingNodeId: nodeId }),

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
