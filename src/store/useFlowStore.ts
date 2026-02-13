import { create } from 'zustand';
import { temporal } from 'zundo';
import debounce from 'lodash.debounce';
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
import { useAIStore } from './useAIStore';
import { useAppStore } from './useAppStore';
import { createContextSnapshot } from '../utils/ai';

interface FlowState {
  nodes: NoteTreeNode[];
  edges: NoteTreeEdge[];
  editingNodeId: string | null;
  deletingNodeId: string | null;
  isLoading: boolean;
  onNodesChange: OnNodesChange<NoteTreeNode>;
  onEdgesChange: OnEdgesChange<NoteTreeEdge>;
  onConnect: OnConnect;
  setNodes: (nodes: NoteTreeNode[]) => void;
  setEdges: (edges: NoteTreeEdge[]) => void;
  addNode: (node: NoteTreeNode) => void;
  addBranch: (parentId: string) => NoteTreeNode | undefined;
  addAIChild: (parentId: string) => NoteTreeNode | undefined;
  deleteNodeOnly: (nodeId: string) => void;
  deleteNodeAndDescendants: (nodeId: string) => void;
  setEditingNodeId: (nodeId: string | null) => void;
  setDeletingNodeId: (nodeId: string | null) => void;
  updateNodeContent: (nodeId: string, label: string) => void;
  updateNodeThinking: (nodeId: string, thinking: boolean) => void;
  loadProjectData: (projectId: string) => Promise<void>;
  forceSave: () => Promise<void>;
  removeOrphanedNodes: () => Promise<void>;
  removeEmptyNodes: () => Promise<void>;
  reLayoutTree: () => Promise<void>;
  saveStatus: 'idle' | 'saving' | 'saved';
  clearData: () => void;
}

export const useFlowStore = create<FlowState>()(
  temporal(
    (set, get) => ({
      nodes: [],
      edges: [],
      editingNodeId: null,
      deletingNodeId: null,
      isLoading: false,
      saveStatus: 'idle',

      onNodesChange: (changes) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        });
      },

      onEdgesChange: (changes) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        });
      },

      onConnect: (connection) => {
        const newEdges = addEdge(connection, get().edges);
        set({
          edges: newEdges as NoteTreeEdge[],
        });
      },

      setNodes: (nodes) => set({ nodes }),
      setEdges: (edges) => set({ edges }),
      addNode: (node) => set({ nodes: [...get().nodes, node] }),

      addBranch: (parentId: string) => {
        const { nodes, edges } = get();
        const parentNode = nodes.find((n) => n.id === parentId);
        if (!parentNode || parentNode.data.thinking) return undefined;

        const role: 'user' | 'ai' = 'user';
        const isSameRole = role === parentNode.data.type;
        const newNodeId = nanoid();
        const parentEdge = edges.find(e => e.target === parentId);
        const actualParentId = (isSameRole && parentEdge) ? parentEdge.source : parentId;

        const H_GAP = 280;
        const V_GAP = 180;
        const siblingsCount = edges.filter(e => e.source === actualParentId).length;

        const getOffset = (index: number) => {
          if (index === 0) return 0;
          const side = index % 2 === 0 ? -1 : 1;
          const rank = Math.ceil(index / 2);
          return side * rank * H_GAP;
        };

        const newNode: NoteTreeNode = {
          id: newNodeId,
          type: 'chatNode',
          position: {
            x: isSameRole
              ? parentNode.position.x + H_GAP
              : parentNode.position.x + getOffset(siblingsCount),
            y: isSameRole
              ? parentNode.position.y
              : parentNode.position.y + V_GAP,
          },
          data: {
            label: '',
            content: '',
            type: role,
            thinking: false,
            createdAt: Date.now(),
          },
          style: { width: 250, height: 120 },
        };

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
        if (!parentNode || parentNode.data.thinking) return undefined;

        const newNodeId = nanoid();
        const H_GAP = 280;
        const V_GAP = 180;
        const childrenCount = edges.filter(e => e.source === parentId).length;

        const getOffset = (index: number) => {
          if (index === 0) return 0;
          const side = index % 2 === 0 ? -1 : 1;
          const rank = Math.ceil(index / 2);
          return side * rank * H_GAP;
        };

        const newNode: NoteTreeNode = {
          id: newNodeId,
          type: 'chatNode',
          position: {
            x: parentNode.position.x + getOffset(childrenCount),
            y: parentNode.position.y + V_GAP,
          },
          data: {
            label: '',
            content: '',
            type: 'ai',
            thinking: true,
            createdAt: Date.now(),
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

        const projectId = useAppStore.getState().activeProject?.id;
        if (projectId) {
          createContextSnapshot(projectId, parentId, get().nodes, get().edges).then(snapshot => {
            useAIStore.getState().enqueue(newNodeId, snapshot);
          });
        }

        return newNode;
      },

      deleteNodeOnly: (nodeId) => {
        set({
          nodes: get().nodes.filter((node) => node.id !== nodeId),
          edges: get().edges.filter(
            (edge) => edge.source !== nodeId && edge.target !== nodeId
          ),
        });
      },

      deleteNodeAndDescendants: (nodeId) => {
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

      setEditingNodeId: (nodeId) => set({ editingNodeId: nodeId }),
      setDeletingNodeId: (nodeId) => set({ deletingNodeId: nodeId }),

      updateNodeContent: (nodeId, label) => {
        set({
          nodes: get().nodes.map((node) =>
            node.id === nodeId
              ? { ...node, data: { ...node.data, label } }
              : node
          ),
        });
      },

      updateNodeThinking: (nodeId, thinking) => {
        set({
          nodes: get().nodes.map((node) =>
            node.id === nodeId
              ? { ...node, data: { ...node.data, thinking } }
              : node
          ),
        });
      },

      loadProjectData: async (projectId) => {
        set({ isLoading: true });
        try {
          const { nodes, edges } = await projectRepository.getProjectData(projectId);
          // clear history when loading a new project
          useFlowStore.temporal.getState().clear();
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

      forceSave: async () => {
        const { nodes, edges } = get();
        const activeProject = useAppStore.getState().activeProject;
        if (!activeProject) return;

        set({ saveStatus: 'saving' });
        try {
          await projectRepository.saveNodes(activeProject.id, nodes);
          await projectRepository.saveEdges(activeProject.id, edges);
          await projectRepository.updateProject(activeProject.id, {});
          set({ saveStatus: 'saved' });
          setTimeout(() => set({ saveStatus: 'idle' }), 2000);
        } catch (error) {
          console.error('Manual save failed:', error);
          set({ saveStatus: 'idle' });
        }
      },

      removeOrphanedNodes: async () => {
        const { nodes, edges } = get();
        const connectedNodeIds = new Set();
        edges.forEach(edge => {
          connectedNodeIds.add(edge.source);
          connectedNodeIds.add(edge.target);
        });
        const filteredNodes = nodes.filter((node, index) => index === 0 || connectedNodeIds.has(node.id));
        set({ nodes: filteredNodes });
        await get().forceSave();
      },

      removeEmptyNodes: async () => {
        const { nodes, edges } = get();
        const emptyNodeIds = nodes
          .filter(n => !n.data.label || n.data.label.trim().length === 0)
          .map(n => n.id);
        if (emptyNodeIds.length === 0) return;
        set({
          nodes: nodes.filter(n => !emptyNodeIds.includes(n.id)),
          edges: edges.filter(e => !emptyNodeIds.includes(e.source) && !emptyNodeIds.includes(e.target))
        });
        await get().forceSave();
      },

      reLayoutTree: async () => {
        const { nodes, edges } = get();
        if (nodes.length === 0) return;
        const H_GAP = 280;
        const V_GAP = 180;
        const newNodes = [...nodes];
        const processed = new Set<string>();

        const layout = (nodeId: string, x: number, y: number) => {
          const nodeIndex = newNodes.findIndex(n => n.id === nodeId);
          if (nodeIndex === -1 || processed.has(nodeId)) return;
          newNodes[nodeIndex] = { ...newNodes[nodeIndex], position: { x, y } };
          processed.add(nodeId);
          const childrenNodes = edges.filter(e => e.source === nodeId).map(e => e.target);
          childrenNodes.forEach((childId, index) => {
            const side = index % 2 === 0 ? -1 : 1;
            const rank = Math.ceil(index / 2);
            const horizontalOffset = index === 0 ? 0 : side * rank * H_GAP;
            layout(childId, x + horizontalOffset, y + V_GAP);
          });
        };

        const leafIds = new Set(edges.map(e => e.target));
        const roots = nodes.filter(n => !leafIds.has(n.id));
        roots.forEach((root, i) => layout(root.id, i * 600, 0));
        set({ nodes: newNodes });

        // Automatically save after layout
        await get().forceSave();
      },

      clearData: () => {
        useFlowStore.temporal.getState().clear();
        set({ nodes: [], edges: [], editingNodeId: null, saveStatus: 'idle' });
      },
    }), {
    limit: 200, // Reduced limit as steps are now "chunky" stop-points
    handleSet: (handleSet) => debounce(handleSet, 500), // Wait for 500ms lull before committing a snapshot
    partialize: (state) => ({
      // Exclude ephemeral UI state (dragging/selection) from history
      nodes: state.nodes.map(node => ({
        ...node,
        selected: false,
        dragging: false
      })),
      edges: state.edges,
    }),
  }
  )
);
