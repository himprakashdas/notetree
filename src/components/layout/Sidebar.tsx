import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useFlowStore } from '../../store/useFlowStore';
import {
    Plus,
    Search,
    Folder,
    ChevronRight,
    MoreVertical,
    Trash2,
    Archive,
    LayoutGrid,
    RefreshCw,
    Check,
    Type,
    Edit2
} from 'lucide-react';
import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { Tooltip } from '../ui/Tooltip';
import { ProjectDeleteModal } from './ProjectDeleteModal';

export function Sidebar() {
    const {
        projects,
        activeProject,
        setActiveProject,
        fetchProjects,
        createProject,
        deleteProject,
        fontSize,
        setFontSize,
        renameProject
    } = useAppStore();
    const { clearData, saveStatus, forceSave } = useFlowStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [projectToDelete, setProjectToDelete] = useState<{ id: string; name: string } | null>(null);
    const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
    const [editingProjectName, setEditingProjectName] = useState('');

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProjectName.trim()) return;
        const project = await createProject(newProjectName.trim());
        setNewProjectName('');
        setIsCreating(false);
        setActiveProject(project);
    };

    const handleDelete = (e: React.MouseEvent, id: string, name: string) => {
        e.stopPropagation();
        setProjectToDelete({ id, name });
    };

    const confirmDelete = async () => {
        if (projectToDelete) {
            await deleteProject(projectToDelete.id);
            setProjectToDelete(null);
        }
    };

    const handleProjectClick = (project: any) => {
        if (activeProject?.id === project.id) return;
        clearData();
        setActiveProject(project);
    };

    const handleProjectDoubleClick = (e: React.MouseEvent, project: any) => {
        e.stopPropagation();
        setEditingProjectId(project.id);
        setEditingProjectName(project.name);
    };

    const handleRenameSubmit = async () => {
        if (editingProjectId && editingProjectName.trim()) {
            await renameProject(editingProjectId, editingProjectName.trim());
        }
        setEditingProjectId(null);
    };

    const handleRenameKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleRenameSubmit();
        } else if (e.key === 'Escape') {
            setEditingProjectId(null);
        }
    };

    return (
        <div className="w-72 h-screen bg-zinc-950 border-r border-zinc-900 flex flex-col z-50 overflow-hidden select-none">
            {/* Header */}
            <div className="p-6 border-b border-zinc-900">
                <div className="flex items-center gap-3 mb-6">
                    <img src="/logo.png" alt="NoteTree" className="w-8 h-8 rounded-lg shadow-lg shadow-rose-900/40" />
                    <h1 className="font-bold text-xl tracking-tight text-zinc-100">NoteTree</h1>
                </div>

                <button
                    onClick={() => setIsCreating(true)}
                    className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 py-2.5 rounded-xl transition-all group"
                >
                    <Plus className="w-4 h-4 group-hover:text-rose-500 transition-colors" />
                    <span className="text-sm font-medium">New Project</span>
                </button>
            </div>

            {/* Search */}
            <div className="px-4 py-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-900/50 border border-zinc-900 focus:border-zinc-800 focus:outline-none rounded-lg pl-9 py-2 text-xs text-zinc-300 placeholder:text-zinc-600 transition-colors"
                    />
                </div>
            </div>

            {/* Project List */}
            <div className="flex-1 overflow-y-auto px-3 custom-scrollbar">
                <div className="space-y-1">
                    {isCreating && (
                        <form onSubmit={handleCreate} className="px-1 py-2 lg:px-2">
                            <input
                                autoFocus
                                type="text"
                                value={newProjectName}
                                onChange={(e) => setNewProjectName(e.target.value)}
                                onBlur={() => !newProjectName && setIsCreating(false)}
                                className="w-full bg-zinc-900 border border-rose-500/50 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-700 outline-none shadow-[0_0_15px_rgba(244,63,94,0.1)]"
                                placeholder="Name your project..."
                            />
                        </form>
                    )}

                    {filteredProjects.map((project) => (
                        <div
                            key={project.id}
                            onClick={() => handleProjectClick(project)}
                            className={clsx(
                                "group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all border border-transparent",
                                activeProject?.id === project.id
                                    ? "bg-rose-500/5 border-rose-500/10 text-rose-500 shadow-sm"
                                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                            )}
                        >
                            <div className={clsx(
                                "w-2 h-2 rounded-full",
                                activeProject?.id === project.id ? "bg-rose-500 animate-pulse" : "bg-zinc-800 group-hover:bg-zinc-600"
                            )} />
                            <div className="flex-1 min-w-0">
                                {editingProjectId === project.id ? (
                                    <input
                                        autoFocus
                                        type="text"
                                        value={editingProjectName}
                                        onChange={(e) => setEditingProjectName(e.target.value)}
                                        onBlur={handleRenameSubmit}
                                        onKeyDown={handleRenameKeyDown}
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-full bg-zinc-900 border border-rose-500/50 rounded px-2 py-1 text-sm font-medium outline-none"
                                    />
                                ) : (
                                    <div
                                        onDoubleClick={(e) => handleProjectDoubleClick(e, project)}
                                        className="text-sm font-medium truncate"
                                    >
                                        {project.name}
                                    </div>
                                )}
                                <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                                    {formatDistanceToNow(project.lastModified)} ago
                                </div>
                            </div>
                            <Tooltip content="Delete project" position="left">
                                <button
                                    onClick={(e) => handleDelete(e, project.id, project.name)}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-zinc-800 text-zinc-600 hover:text-red-500 rounded-md transition-all"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </Tooltip>
                        </div>
                    ))}

                    {filteredProjects.length === 0 && !isCreating && (
                        <div className="py-10 text-center">
                            <Folder className="w-8 h-8 text-zinc-800 mx-auto mb-3 opacity-20" />
                            <span className="text-xs text-zinc-600">No projects found</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Settings Quick Access */}
            <div className="px-4 py-4 border-t border-zinc-900 bg-zinc-950/30">
                <div className="flex items-center justify-between gap-2 overflow-hidden">
                    <div className="flex items-center gap-2 group">
                        <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 group-hover:text-zinc-300 transition-colors">
                            <Type className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Text Size</span>
                    </div>

                    <div className="flex items-center bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                        {(['small', 'medium', 'large'] as const).map((size) => (
                            <button
                                key={size}
                                onClick={() => setFontSize(size)}
                                className={clsx(
                                    "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all",
                                    fontSize === size
                                        ? "bg-rose-500 text-white shadow-sm"
                                        : "text-zinc-500 hover:text-zinc-300"
                                )}
                            >
                                {size === 'small' ? 'S' : size === 'medium' ? 'M' : 'L'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer / Status */}
            <div className="p-4 bg-zinc-950/50 border-t border-zinc-900">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-rose-500 to-amber-500 opacity-20" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-zinc-200">Local Space</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <div className={clsx(
                                "w-1.5 h-1.5 rounded-full transition-colors duration-500",
                                saveStatus === 'saving' ? "bg-amber-500 animate-pulse" :
                                    saveStatus === 'saved' ? "bg-emerald-500" : "bg-zinc-600"
                            )} />
                            <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-tighter">
                                {saveStatus === 'saving' ? 'Syncing...' :
                                    saveStatus === 'saved' ? 'Synced' : 'Ready'}
                            </span>
                        </div>
                    </div>
                    <Tooltip content="Manual Sync" position="top">
                        <button
                            onClick={() => forceSave()}
                            disabled={saveStatus === 'saving'}
                            className={clsx(
                                "p-2 rounded-lg border transition-all duration-300",
                                saveStatus === 'saving' ? "bg-amber-500/10 border-amber-500/20 text-amber-500 cursor-wait" :
                                    saveStatus === 'saved' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                                        "bg-zinc-900 border-zinc-800 text-zinc-600 hover:text-zinc-200 hover:border-zinc-700"
                            )}
                        >
                            {saveStatus === 'saving' ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : saveStatus === 'saved' ? (
                                <Check className="w-3.5 h-3.5" />
                            ) : (
                                <RefreshCw className="w-3.5 h-3.5" />
                            )}
                        </button>
                    </Tooltip>
                </div>
            </div>

            <ProjectDeleteModal
                isOpen={!!projectToDelete}
                projectName={projectToDelete?.name || ''}
                onClose={() => setProjectToDelete(null)}
                onConfirm={confirmDelete}
            />
        </div>
    );
}
