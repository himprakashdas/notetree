import { create } from 'zustand';
import { Project } from '../types';
import { projectRepository } from '../db/repository';

interface AppState {
  projects: Project[];
  activeProject: Project | null;
  isLoading: boolean;
  fontSize: 'small' | 'medium' | 'large';

  // Actions
  fetchProjects: () => Promise<void>;
  setActiveProject: (project: Project | null) => void;
  updateActiveProject: (updates: Partial<Project>) => Promise<void>;
  createProject: (name: string) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  projects: [],
  activeProject: null,
  isLoading: false,

  fetchProjects: async () => {
    set({ isLoading: true });
    try {
      const projects = await projectRepository.getAllProjects();
      set({ projects, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      set({ isLoading: false });
    }
  },

  setActiveProject: (project) => {
    set({ activeProject: project });
  },

  updateActiveProject: async (updates) => {
    const { activeProject } = get();
    if (!activeProject) return;

    const updatedProject = { ...activeProject, ...updates };
    await projectRepository.updateProject(activeProject.id, updates);
    set({ activeProject: updatedProject });
  },

  createProject: async (name) => {
    const project = await projectRepository.createProject(name);
    await get().fetchProjects();
    return project;
  },

  deleteProject: async (id) => {
    await projectRepository.deleteProject(id);
    if (get().activeProject?.id === id) {
      set({ activeProject: null });
    }
    await get().fetchProjects();
  },
  fontSize: (localStorage.getItem('notetree-font-size') as any) || 'medium',
  setFontSize: (size) => {
    localStorage.setItem('notetree-font-size', size);
    set({ fontSize: size });
  },
}));
