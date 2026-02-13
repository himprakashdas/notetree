import React from 'react';

interface DeletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteOnly: () => void;
  onDeleteAll: () => void;
}

export const DeletionModal: React.FC<DeletionModalProps> = ({
  isOpen,
  onClose,
  onDeleteOnly,
  onDeleteAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-lg bg-zinc-900 p-6 shadow-2xl border border-zinc-800 animate-in fade-in zoom-in duration-200">
        <h2 className="text-xl font-bold text-white">Delete Node</h2>
        <p className="mt-2 text-zinc-400">
          How would you like to delete this node?
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={onDeleteAll}
            className="w-full rounded-md bg-rose-600 py-2 px-4 text-white hover:bg-rose-500 transition-colors font-semibold"
          >
            Node and all descendants
          </button>
          <button
            onClick={onDeleteOnly}
            className="w-full rounded-md border border-zinc-700 bg-zinc-800 py-2 px-4 text-zinc-300 hover:bg-zinc-700 transition-colors"
          >
            Only this node
          </button>
          <button
            onClick={onClose}
            className="w-full rounded-md border border-transparent py-2 px-4 text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
