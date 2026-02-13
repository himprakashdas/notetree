import { db } from './schema';
import { Project } from '../types';
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
  }
};
