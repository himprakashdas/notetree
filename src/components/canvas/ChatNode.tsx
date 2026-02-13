import { memo, useState } from 'react';
import { Handle, Position, NodeProps, useReactFlow, NodeResizer } from '@xyflow/react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Plus, Trash2, Send, Square, Copy, Check } from 'lucide-react';
import { NoteTreeNode } from '../../types';
import { useFlowStore } from '../../store/useFlowStore';
import { useAIStore } from '../../store/useAIStore';
import { useAppStore } from '../../store/useAppStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Tooltip } from '../ui/Tooltip';

const ChatNode = ({ id, data, selected }: NodeProps<NoteTreeNode>) => {
  const [copied, setCopied] = useState(false);
  const isUser = data.type === 'user';
  const addBranch = useFlowStore((state) => state.addBranch);
  const addAIChild = useFlowStore((state) => state.addAIChild);
  const setDeletingNodeId = useFlowStore((state) => state.setDeletingNodeId);
  const stopGeneration = useAIStore((state) => state.stopGeneration);
  const fontSize = useAppStore((state) => state.fontSize);
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

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!data.label) return;

    try {
      await navigator.clipboard.writeText(data.label);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
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

        <div className="flex items-center justify-between mb-1 shrink-0">
          <div className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">
            {isUser ? 'User' : 'Assistant'}
          </div>
          {!isUser && !data.thinking && data.label && (
            <Tooltip content="Copy to clipboard" position="right">
              <button
                onClick={handleCopy}
                className={`p-1 rounded transition-all ${copied
                    ? 'text-emerald-400 bg-emerald-500/20'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
                  }`}
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </button>
            </Tooltip>
          )}
        </div>

        <div className={twMerge(
          "flex-grow whitespace-pre-wrap overflow-y-auto custom-scrollbar pr-1 markdown-content nowheel",
          fontSize === 'small' ? 'text-xs' : fontSize === 'large' ? 'text-base' : 'text-sm'
        )}>
          {data.thinking ? (
            <div className="flex flex-col gap-2">
              <span className="italic text-zinc-500 animate-pulse">Thinking...</span>
              {data.label && (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {data.label}
                </ReactMarkdown>
              )}
            </div>
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {data.label || ''}
            </ReactMarkdown>
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
            <Tooltip content="Stop Generation" position="bottom">
              <button
                onClick={handleStop}
                className="w-8 h-8 rounded-full flex items-center justify-center text-rose-500 hover:text-rose-400 hover:bg-zinc-700 transition-colors"
              >
                <Square className="w-3 h-3 fill-current" />
              </button>
            </Tooltip>
          ) : (
            <>
              <Tooltip content="Delete node" position="bottom">
                <button
                  onClick={handleDelete}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-red-400 hover:bg-zinc-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </Tooltip>

              <Tooltip content={isUser ? "Add User sibling" : "Add User reply"} position="bottom">
                <button
                  onClick={handleAddBranch}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </Tooltip>

              {isUser && (
                <Tooltip content="Add AI child" position="bottom">
                  <button
                    onClick={handleAddAIChild}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-rose-400 hover:bg-zinc-700 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </Tooltip>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default memo(ChatNode);
