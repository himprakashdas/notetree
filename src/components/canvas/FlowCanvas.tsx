import { useCallback, useEffect, useState } from 'react';
import { clsx } from 'clsx';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  NodeTypes,
  ReactFlowProvider,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { nanoid } from 'nanoid';
import { ChevronLeft, Plus, Maximize, Loader2, Settings, X, RefreshCw, Check, Unlink, Eraser, GitGraph, Undo2, Redo2, Type } from 'lucide-react';

import { useFlowStore } from '../../store/useFlowStore';
import { useAppStore } from '../../store/useAppStore';
import { useHotkeys } from '../../hooks/useHotkeys';
import { usePersistence } from '../../hooks/usePersistence';
import ChatNode from './ChatNode';
import ChatOverlay from '../chat/ChatOverlay';
import { DeletionModal } from './DeletionModal';
import { NoteTreeNode } from '../../types';
import { Tooltip } from '../ui/Tooltip';
import { useStore } from 'zustand';

const nodeTypes: NodeTypes = {
  chatNode: ChatNode,
};

const FlowCanvasInternal = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    setEditingNodeId,
    editingNodeId,
    deletingNodeId,
    setDeletingNodeId,
    deleteNodeOnly,
    deleteNodeAndDescendants,
    isLoading,
    loadProjectData,
    clearData,
    saveStatus,
    forceSave,
    removeOrphanedNodes,
    removeEmptyNodes,
    reLayoutTree
  } = useFlowStore();

  const { activeProject, setActiveProject, updateActiveProject, renameProject, fontSize, setFontSize } = useAppStore();
  const activeProjectId = activeProject?.id;
  const { fitView, setCenter } = useReactFlow();

  const { undo, redo, pastStates, futureStates } = useStore(useFlowStore.temporal, (state) => state);

  const [showSettings, setShowSettings] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(activeProject?.systemPrompt || '');
  const [model, setModel] = useState(activeProject?.model || 'gemini-2.5-flash');
  const [isEditingProjectName, setIsEditingProjectName] = useState(false);
  const [editedProjectName, setEditedProjectName] = useState('');

  // Initialize keyboard shortcuts and persistence
  useHotkeys();
  usePersistence();

  // Load project data ONLY when switching projects
  useEffect(() => {
    if (activeProjectId) {
      loadProjectData(activeProjectId);
    }
  }, [activeProjectId, loadProjectData]);

  // Sync local settings state when project data changes
  useEffect(() => {
    if (activeProject) {
      setSystemPrompt(activeProject.systemPrompt || '');
      setModel(activeProject.model || 'gemini-2.5-flash');
    }
  }, [activeProject?.id]); // Only reset when project ID changes

  const onNodeDoubleClick = useCallback((_: React.MouseEvent, node: NoteTreeNode) => {
    setEditingNodeId(node.id);
  }, [setEditingNodeId]);

  const handleBack = useCallback(() => {
    setActiveProject(null);
    clearData();
  }, [setActiveProject, clearData]);

  const handleProjectNameClick = () => {
    if (activeProject) {
      setEditedProjectName(activeProject.name);
      setIsEditingProjectName(true);
    }
  };

  const handleProjectNameSave = async () => {
    if (activeProject && editedProjectName.trim() && editedProjectName !== activeProject.name) {
      await renameProject(activeProject.id, editedProjectName.trim());
    }
    setIsEditingProjectName(false);
  };

  const handleProjectNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleProjectNameSave();
    } else if (e.key === 'Escape') {
      setIsEditingProjectName(false);
    }
  };

  const startChat = useCallback(() => {
    const newNodeId = nanoid();
    const newNode: NoteTreeNode = {
      id: newNodeId,
      type: 'chatNode',
      position: { x: 0, y: 0 },
      data: {
        label: 'Hello! This is the first node.',
        content: '',
        type: 'user',
        createdAt: Date.now(),
      },
      style: { width: 250, height: 120 },
    };
    addNode(newNode);

    // Smoothly center on the first node
    setTimeout(() => {
      setCenter(125, 100, { duration: 800, zoom: 1 });
    }, 50);
  }, [addNode, setCenter]);

  const handleDeleteOnly = useCallback(() => {
    if (deletingNodeId) {
      deleteNodeOnly(deletingNodeId);
      setDeletingNodeId(null);
    }
  }, [deletingNodeId, deleteNodeOnly, setDeletingNodeId]);

  const handleDeleteAll = useCallback(() => {
    if (deletingNodeId) {
      deleteNodeAndDescendants(deletingNodeId);
      setDeletingNodeId(null);
    }
  }, [deletingNodeId, deleteNodeAndDescendants, setDeletingNodeId]);

  const handleSaveSettings = async () => {
    await updateActiveProject({ systemPrompt, model });
    setShowSettings(false);
  };

  const isEditing = !!editingNodeId;
  const isDeleting = !!deletingNodeId;

  if (isLoading) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
          <p className="text-zinc-500 animate-pulse">Loading your tree...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full bg-background relative ${(isEditing || isDeleting) ? 'overflow-hidden' : ''}`}>
      {/* HUD - Top Left */}
      <div className={`absolute top-6 left-6 z-10 flex gap-4 items-center transition-opacity duration-300 ${(isEditing || isDeleting) ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-rose-500 rounded-full" />
          {isEditingProjectName ? (
            <input
              autoFocus
              type="text"
              value={editedProjectName}
              onChange={(e) => setEditedProjectName(e.target.value)}
              onBlur={handleProjectNameSave}
              onKeyDown={handleProjectNameKeyDown}
              className="font-bold text-zinc-100 text-lg tracking-tight bg-zinc-900 border border-rose-500/50 rounded px-2 py-1 outline-none"
            />
          ) : (
            <span
              onClick={handleProjectNameClick}
              className="font-bold text-zinc-100 text-lg tracking-tight select-none cursor-pointer hover:text-rose-400 transition-colors"
            >
              {activeProject?.name || 'Untitled Project'}
            </span>
          )}
        </div>
      </div>

      {/* HUD - Top Right */}
      <div className={`absolute top-6 right-6 z-10 flex items-center gap-2 transition-opacity duration-300 ${(isEditing || isDeleting) ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {/* Text Size Selector */}
        <div className="flex items-center bg-zinc-900/50 backdrop-blur-md rounded-lg p-1 border border-zinc-800 shadow-xl">
          {(['small', 'medium', 'large'] as const).map((size) => (
            <Tooltip key={size} content={`${size.charAt(0).toUpperCase() + size.slice(1)} text`} position="bottom">
              <button
                onClick={() => setFontSize(size)}
                className={clsx(
                  "px-2.5 py-1.5 rounded-md text-xs font-bold uppercase transition-all",
                  fontSize === size
                    ? "bg-rose-500 text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                )}
              >
                {size === 'small' ? 'S' : size === 'medium' ? 'M' : 'L'}
              </button>
            </Tooltip>
          ))}
        </div>

        <Tooltip content="Adjust AI instructions and model" position="left">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`flex items-center gap-2 px-3 py-1.5 backdrop-blur-md border border-zinc-800 rounded-lg transition-colors text-sm font-medium shadow-xl ${showSettings ? 'bg-zinc-800 text-white' : 'bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800'
              }`}
          >
            <Settings className={`w-4 h-4 ${showSettings ? 'animate-spin-slow' : ''}`} />
            Project Settings
          </button>
        </Tooltip>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-20 right-6 z-20 w-80 p-4 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">System Prompt</h3>
            <button onClick={() => setShowSettings(false)} className="text-zinc-500 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[11px] text-zinc-500 mb-3">
            Global instructions for the AI model in this project.
          </p>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                handleSaveSettings();
              }
            }}
            className="w-full h-32 bg-black border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 focus:outline-none focus:border-rose-500/50 transition-colors resize-none mb-4 custom-scrollbar"
            placeholder="e.g. You are a helpful creative writing assistant..."
          />
          <div className="mb-4">
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider mb-2">AI Model</h3>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-rose-500/50 transition-colors"
            >
              <option value="gemini-pro-latest">Gemini Pro (Stable)</option>
              <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
              <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
              <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
              <option value="gemini-exp-1206">Gemini Experimental</option>
              <option value="gemma-3-27b-it">Gemma 3 (27B)</option>
            </select>
          </div>
          <button
            onClick={handleSaveSettings}
            className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-rose-900/20"
          >
            Save Instructions
          </button>
        </div>
      )}


      {/* HUD - Bottom Left */}
      <div className={`absolute bottom-6 left-6 z-10 flex gap-2 transition-opacity duration-300 ${(isEditing || isDeleting) ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <Tooltip content="Recenter and fit all nodes" position="top">
          <button
            onClick={() => fitView({ duration: 800 })}
            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 backdrop-blur-md border border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-lg transition-colors text-sm font-medium shadow-xl"
          >
            <Maximize className="w-4 h-4" />
            Fit View
          </button>
        </Tooltip>

        <Tooltip content="Save all changes" position="top">
          <button
            onClick={() => forceSave()}
            disabled={saveStatus === 'saving'}
            className={clsx(
              "flex items-center gap-2 px-3 py-1.5 backdrop-blur-md border rounded-lg transition-all text-sm font-medium shadow-xl",
              saveStatus === 'saving' ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                saveStatus === 'saved' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                  "bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800 text-zinc-300"
            )}
          >
            {saveStatus === 'saving' ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : saveStatus === 'saved' ? (
              <Check className="w-4 h-4" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : 'Save'}
          </button>
        </Tooltip>

        <div className="h-8 w-px bg-zinc-800 mx-1 self-center" />

        <Tooltip content="Undo (⌘Z)" position="top">
          <button
            onClick={() => undo()}
            disabled={pastStates.length === 0}
            className={clsx(
              "p-2 bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-lg transition-colors shadow-xl",
              pastStates.length === 0 ? "opacity-30 cursor-not-allowed" : "text-zinc-300 hover:bg-zinc-800"
            )}
          >
            <Undo2 className="w-4 h-4" />
          </button>
        </Tooltip>

        <Tooltip content="Redo (⌘⇧Z)" position="top">
          <button
            onClick={() => redo()}
            disabled={futureStates.length === 0}
            className={clsx(
              "p-2 bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-lg transition-colors shadow-xl",
              futureStates.length === 0 ? "opacity-30 cursor-not-allowed" : "text-zinc-300 hover:bg-zinc-800"
            )}
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </Tooltip>
      </div>

      {/* HUD - Bottom Right (Toolbar) */}
      <div className={`absolute bottom-6 right-6 z-10 flex gap-2 transition-opacity duration-300 ${(isEditing || isDeleting) ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <Tooltip content="Remove disconnected nodes" position="top">
          <button
            onClick={removeOrphanedNodes}
            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 backdrop-blur-md border border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-lg transition-colors text-sm font-medium shadow-xl"
          >
            <Unlink className="w-4 h-4" />
            Cleanup
          </button>
        </Tooltip>

        <Tooltip content="Remove nodes with no content" position="top">
          <button
            onClick={removeEmptyNodes}
            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 backdrop-blur-md border border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-lg transition-colors text-sm font-medium shadow-xl"
          >
            <Eraser className="w-4 h-4" />
            Clear Empty
          </button>
        </Tooltip>

        <Tooltip content="Auto-layout the entire tree" position="top">
          <button
            onClick={reLayoutTree}
            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 backdrop-blur-md border border-rose-500/20 hover:bg-rose-500/10 text-rose-400 rounded-lg transition-colors text-sm font-medium shadow-xl"
          >
            <GitGraph className="w-4 h-4" />
            Format Tree
          </button>
        </Tooltip>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={onNodeDoubleClick}
        nodeTypes={nodeTypes}
        fitView
        nodesConnectable={false}
        edgesReconnectable={false}
        elementsSelectable={!isEditing && !isDeleting}
        nodesDraggable={!isEditing && !isDeleting}
        panOnDrag={!isEditing && !isDeleting}
        zoomOnScroll={!isEditing && !isDeleting}
        colorMode="dark"
        paneClickDistance={5}
        deleteKeyCode={null} // Handled by useHotkeys
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#27272a"
        />
      </ReactFlow>

      {/* Empty State Overlay */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <button
            onClick={startChat}
            className="pointer-events-auto flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-full shadow-2xl shadow-rose-900/20 transition-all transform hover:scale-105 font-bold"
          >
            <Plus className="w-5 h-5" />
            Start chat
          </button>
        </div>
      )}

      <ChatOverlay />

      <DeletionModal
        isOpen={isDeleting}
        onClose={() => setDeletingNodeId(null)}
        onDeleteOnly={handleDeleteOnly}
        onDeleteAll={handleDeleteAll}
      />
    </div>
  );
};

const FlowCanvas = () => (
  <ReactFlowProvider>
    <FlowCanvasInternal />
  </ReactFlowProvider>
);

export default FlowCanvas;
