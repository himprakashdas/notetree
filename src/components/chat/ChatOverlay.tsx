import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useFlowStore } from '../../store/useFlowStore';

const ChatOverlay = () => {
  const { editingNodeId, setEditingNodeId, nodes, updateNodeContent } = useFlowStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const editingNode = nodes.find((n) => n.id === editingNodeId);

  useEffect(() => {
    if (editingNodeId && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [editingNodeId]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && editingNodeId) {
        setEditingNodeId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editingNodeId, setEditingNodeId]);

  if (!editingNodeId || !editingNode) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 lg:p-24 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl h-full max-h-[800px] bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${editingNode.data.type === 'user' ? 'bg-zinc-400' : 'bg-rose-500'}`} />
            <h2 className="text-zinc-400 text-sm font-medium uppercase tracking-wider">
              Editing {editingNode.data.type === 'user' ? 'User Prompt' : 'AI Response'}
            </h2>
          </div>
          <button
            onClick={() => setEditingNodeId(null)}
            className="p-2 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <textarea
            ref={textareaRef}
            value={editingNode.data.label}
            onChange={(e) => updateNodeContent(editingNodeId, e.target.value)}
            placeholder="Type your content here..."
            className="w-full h-full bg-transparent text-zinc-100 text-lg leading-relaxed resize-none focus:outline-none placeholder:text-zinc-700"
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-900/50 text-zinc-500 text-xs flex justify-between items-center">
          <div>Esc to close • Changes auto-save</div>
        </div>
      </div>
    </div>
  );
};

export default ChatOverlay;
