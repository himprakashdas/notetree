import { db } from './schema';
import { Project, NoteTreeNode, NoteTreeEdge, DBNode, DBEdge } from '../types';
import { nanoid } from 'nanoid';

export const projectRepository = {
  async getAllProjects() {
    return db.projects.orderBy('lastModified').reverse().toArray();
  },

  async createProject(name: string): Promise<Project> {
    const now = Date.now();
    const project: Project = {
      id: nanoid(),
      name,
      createdAt: now,
      lastModified: now,
      systemPrompt: 'You are a helpful creative writing assistant that helps brainstorm and organize ideas in a tree structure.',
    };
    await db.projects.add(project);
    return project;
  },

  async deleteProject(id: string) {
    return db.transaction('rw', [db.projects, db.nodes, db.edges], async () => {
      await db.nodes.where('projectId').equals(id).delete();
      await db.edges.where('projectId').equals(id).delete();
      await db.projects.delete(id);
    });
  },

  async updateProject(id: string, updates: Partial<Project>) {
    return db.projects.update(id, {
      ...updates,
      lastModified: Date.now(),
    });
  },

  // Node & Edge persistence
  async saveNodes(projectId: string, nodes: NoteTreeNode[]) {
    const dbNodes: DBNode[] = nodes.map(node => ({
      ...node,
      projectId
    }));
    return db.nodes.bulkPut(dbNodes);
  },

  async saveEdges(projectId: string, edges: NoteTreeEdge[]) {
    const dbEdges: DBEdge[] = edges.map(edge => ({
      ...edge,
      projectId
    }));
    return db.edges.bulkPut(dbEdges);
  },

  async getProjectData(projectId: string) {
    const nodes = await db.nodes.where('projectId').equals(projectId).toArray();
    const edges = await db.edges.where('projectId').equals(projectId).toArray();
    return { nodes, edges };
  },

  async getAIContext(
    projectId: string, 
    parentNodeId: string, 
    providedNodes?: NoteTreeNode[], 
    providedEdges?: NoteTreeEdge[]
  ): Promise<{ systemPrompt: string; contextNodes: NoteTreeNode[] }> {
    const project = await db.projects.get(projectId);
    if (!project) throw new Error('Project not found');

    const allNodes = providedNodes || await db.nodes.where('projectId').equals(projectId).toArray() as NoteTreeNode[];
    const allEdges = (providedEdges || await db.edges.where('projectId').equals(projectId).toArray()) as NoteTreeEdge[];

    const nodeMap = new Map(allNodes.map(n => [n.id, n]));
    const parentToChildren = new Map<string, string[]>();
    const childToParent = new Map<string, string>();

    allEdges.forEach(edge => {
      if (!parentToChildren.has(edge.source)) {
        parentToChildren.set(edge.source, []);
      }
      parentToChildren.get(edge.source)!.push(edge.target);
      childToParent.set(edge.target, edge.source);
    });

    // 1. Find Ancestor Path for parentNodeId
    const path: NoteTreeNode[] = [];
    let currentId: string | undefined = parentNodeId;
    while (currentId) {
      const node = nodeMap.get(currentId);
      if (node) {
        path.unshift(node);
        currentId = childToParent.get(currentId);
      } else {
        currentId = undefined;
      }
    }

    // 2. Pruning: Root + 3 most recent ancestors
    const root = path[0];
    const recentAncestors = path.slice(-3);
    
    const contextNodesSet = new Set<NoteTreeNode>();
    if (root) contextNodesSet.add(root);
    recentAncestors.forEach(n => contextNodesSet.add(n));

    // 3. Uncles: Siblings of parentNodeId
    const grandParentId = childToParent.get(parentNodeId);
    if (grandParentId) {
      const siblingsIds = parentToChildren.get(grandParentId) || [];
      siblingsIds.forEach(id => {
        const node = nodeMap.get(id);
        if (node && id !== parentNodeId) {
          contextNodesSet.add(node);
        }
      });
    }

    // 4. Return unique nodes sorted by createdAt
    const contextNodes = Array.from(contextNodesSet).sort((a, b) => 
      (a.data.createdAt || 0) - (b.data.createdAt || 0)
    );

    return {
      systemPrompt: project.systemPrompt,
      contextNodes
    };
  }
};

