import { memo } from 'react';
import { Handle, Position, NodeProps, useReactFlow, NodeResizer } from '@xyflow/react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Plus } from 'lucide-react';
import { NoteTreeNode } from '../../types';
import { useFlowStore } from '../../store/useFlowStore';

const ChatNode = ({ id, data, selected }: NodeProps<NoteTreeNode>) => {
  const isUser = data.type === 'user';
  const addBranch = useFlowStore((state) => state.addBranch);
  const { setCenter } = useReactFlow();
  
  const handleAddBranch = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newNode = addBranch(id);
    if (newNode) {
      // Offset to center the new node (default node width is around 250px)
      setCenter(newNode.position.x + 125, newNode.position.y + 100, { 
        duration: 800,
        zoom: 1 
      });
    }
  };

  return (
    <>
      <NodeResizer 
        color="#f43f5e" 
        isVisible={selected} 
        minWidth={200} 
        minHeight={80} 
      />
      <div
        className={twMerge(
          clsx(
            'group px-4 py-3 rounded-lg border-2 h-full w-full transition-all relative',
            'bg-zinc-900 text-zinc-100 shadow-xl',
            isUser ? 'border-zinc-700' : 'border-rose-500/50',
            selected && (isUser ? 'border-zinc-400' : 'border-rose-500'),
            !isUser && 'bg-rose-950/20'
          )
        )}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="w-2 h-2 !bg-zinc-600 border-none"
        />
        
        <div className="flex flex-col gap-1 h-full">
          <div className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">
            {isUser ? 'User' : 'Assistant'}
          </div>
          <div className="text-sm flex-grow whitespace-pre-wrap overflow-hidden">
            {data.label || '...'}
          </div>
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="w-2 h-2 !bg-zinc-600 border-none"
        />

        {/* Add Button */}
        <button
          onClick={handleAddBranch}
          className={clsx(
            "absolute -bottom-4 left-1/2 -translate-x-1/2",
            "w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700",
            "flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700",
            "opacity-0 group-hover:opacity-100 transition-opacity z-10",
            "shadow-lg"
          )}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </>
  );
};

export default memo(ChatNode);
