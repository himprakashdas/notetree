import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { NoteTreeNode } from '../../types';

const ChatNode = ({ data, selected }: NodeProps<NoteTreeNode>) => {
  const isUser = data.type === 'user';
  
  return (
    <div
      className={twMerge(
        clsx(
          'px-4 py-3 rounded-lg border-2 w-[250px] transition-all',
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
      
      <div className="flex flex-col gap-1">
        <div className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">
          {isUser ? 'User' : 'Assistant'}
        </div>
        <div className="text-sm line-clamp-4 whitespace-pre-wrap">
          {data.label || '...'}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 !bg-zinc-600 border-none"
      />
    </div>
  );
};

export default memo(ChatNode);
