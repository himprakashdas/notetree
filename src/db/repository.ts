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
  }
};

