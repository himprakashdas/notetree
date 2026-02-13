import { memo } from 'react';
import { Handle, Position, NodeProps, useReactFlow, NodeResizer } from '@xyflow/react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Plus, Trash2, Send, Square } from 'lucide-react';
import { NoteTreeNode } from '../../types';
import { useFlowStore } from '../../store/useFlowStore';
import { useAIStore } from '../../store/useAIStore';

const ChatNode = ({ id, data, selected }: NodeProps<NoteTreeNode>) => {
  const isUser = data.type === 'user';
  const addBranch = useFlowStore((state) => state.addBranch);
  const addAIChild = useFlowStore((state) => state.addAIChild);
  const setDeletingNodeId = useFlowStore((state) => state.setDeletingNodeId);
  const stopGeneration = useAIStore((state) => state.stopGeneration);
  const { setCenter } = useReactFlow();
  
  const handleAddBranch = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newNode = addBranch(id);
    if (newNode) {
      setCenter(newNode.position.x + 125, newNode.position.y + 100, { 
        duration: 800,
        zoom: 1 
      });
    }
  };

  const handleAddAIChild = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newNode = addAIChild(id);
    if (newNode) {
      setCenter(newNode.position.x + 125, newNode.position.y + 100, { 
        duration: 800,
        zoom: 1 
      });
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingNodeId(id);
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    stopGeneration(id);
  };

  return (
    <>
      <NodeResizer 
        color="#f43f5e" 
        isVisible={selected} 
        minWidth={200} 
        minHeight={80} 
        maxWidth={600}
        maxHeight={400}
      />
      <div
        className={twMerge(
          clsx(
            'group px-4 py-3 rounded-lg border-2 h-full w-full transition-all relative flex flex-col',
            'bg-zinc-900 text-zinc-100 shadow-xl',
            isUser ? 'border-zinc-700' : 'border-rose-500/50',
            selected && (isUser ? 'border-zinc-400' : 'border-rose-500'),
            !isUser && 'bg-rose-950/20',
            data.thinking && 'opacity-80'
          )
        )}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="w-2 h-2 !bg-zinc-600 border-none"
        />
        
        <div className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 mb-1 shrink-0">
          {isUser ? 'User' : 'Assistant'}
        </div>
        
        <div className="text-sm flex-grow whitespace-pre-wrap overflow-y-auto custom-scrollbar pr-1">
          {data.thinking ? (
            <div className="flex flex-col gap-2">
              <span className="italic text-zinc-500 animate-pulse">Thinking...</span>
              {data.label && <div className="text-zinc-300">{data.label}</div>}
            </div>
          ) : (
            data.label || (isUser ? '' : '')
          )}
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="w-2 h-2 !bg-zinc-600 border-none"
        />

        {/* Triple-Action Hover Bar */}
        <div
          className={clsx(
            "absolute -bottom-5 left-1/2 -translate-x-1/2",
            "flex items-center gap-1 p-1 rounded-full bg-zinc-800 border border-zinc-700",
            "opacity-0 group-hover:opacity-100 transition-opacity z-10",
            "shadow-lg"
          )}
        >
          {data.thinking ? (
            <>
              <button
                onClick={handleStop}
                className="w-8 h-8 rounded-full flex items-center justify-center text-rose-500 hover:text-rose-400 hover:bg-zinc-700 transition-colors"
                title="Stop Generation"
              >
                <Square className="w-3 h-3 fill-current" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleDelete}
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-red-400 hover:bg-zinc-700 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <button
                onClick={handleAddBranch}
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                title={isUser ? "Add User sibling" : "Add User reply"}
              >
                <Plus className="w-4 h-4" />
              </button>

              {isUser && (
                <button
                  onClick={handleAddAIChild}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-rose-400 hover:bg-zinc-700 transition-colors"
                  title="Add AI child"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default memo(ChatNode);
