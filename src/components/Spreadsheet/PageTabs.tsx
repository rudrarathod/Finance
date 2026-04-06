import React, { useState } from 'react';
import { Plus, X, Edit2, Check } from 'lucide-react';
import { SpreadsheetPage } from '../../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PageTabsProps {
  pages: SpreadsheetPage[];
  activePageId: string;
  onPageSelect: (id: string) => void;
  onAddPage: () => void;
  onDeletePage: (id: string) => void;
  onRenamePage: (id: string, newName: string) => void;
}

export const PageTabs: React.FC<PageTabsProps> = ({
  pages,
  activePageId,
  onPageSelect,
  onAddPage,
  onDeletePage,
  onRenamePage
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEditing = (page: SpreadsheetPage) => {
    setEditingId(page.id);
    setEditValue(page.name);
  };

  const saveRename = () => {
    if (editingId && editValue.trim()) {
      onRenamePage(editingId, editValue.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="flex items-center gap-1 px-4 border-b border-zinc-200 bg-zinc-50 overflow-x-auto no-scrollbar">
      {pages.map((page) => (
        <div
          key={page.id}
          className={cn(
            "group relative flex items-center h-10 px-4 min-w-[120px] max-w-[200px] border-r border-zinc-200 transition-all cursor-pointer",
            activePageId === page.id ? "bg-white border-b-2 border-b-zinc-900" : "hover:bg-zinc-100"
          )}
          onClick={() => onPageSelect(page.id)}
        >
          {editingId === page.id ? (
            <div className="flex items-center gap-1 w-full">
              <input
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={saveRename}
                onKeyDown={(e) => e.key === 'Enter' && saveRename()}
                className="w-full bg-transparent border-none p-0 text-sm font-medium focus:ring-0"
              />
              <Check size={14} className="text-emerald-600" />
            </div>
          ) : (
            <div className="flex items-center justify-between w-full gap-2">
              <span className="text-sm font-medium truncate text-zinc-700">
                {page.name}
              </span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startEditing(page);
                  }}
                  className="p-1 hover:bg-zinc-200 rounded"
                >
                  <Edit2 size={12} />
                </button>
                {pages.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePage(page.id);
                    }}
                    className="p-1 hover:bg-red-100 hover:text-red-600 rounded"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
      <button
        onClick={onAddPage}
        className="flex items-center gap-2 h-10 px-4 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-all"
        title="Add New Page"
      >
        <Plus size={16} />
        <span className="text-xs font-semibold uppercase tracking-wider">New Page</span>
      </button>
    </div>
  );
};
