import React, { useState, useRef, useEffect } from 'react';
import { Undo2, Redo2, History, RotateCcw, Check, Sparkles, Code2, Library, Wrench, Clock, ChevronDown } from 'lucide-react';
import { HistoryEntry } from '../hooks/useHtmlHistory';

interface HistoryControlProps {
  history: HistoryEntry[];
  currentIndex: number;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onRevertToIndex: (index: number) => void;
}

export const HistoryControl: React.FC<HistoryControlProps> = ({
  history,
  currentIndex,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onRevertToIndex,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getSourceIcon = (source: HistoryEntry['source']) => {
    switch (source) {
      case 'ai_generation':
        return <Sparkles className="w-3.5 h-3.5 text-indigo-400" />;
      case 'editor':
        return <Code2 className="w-3.5 h-3.5 text-amber-400" />;
      case 'template':
        return <Library className="w-3.5 h-3.5 text-blue-400" />;
      case 'auto_fix':
        return <Wrench className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <History className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffSec < 15) return 'Just now';
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="relative inline-flex items-center" ref={dropdownRef}>
      {/* Undo & Redo Action Cluster */}
      <div className="inline-flex items-center bg-slate-100 border border-slate-200/90 rounded-xl p-0.5 shadow-xs">
        {/* Undo Button */}
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
            canUndo
              ? 'text-slate-700 hover:text-slate-900 hover:bg-white shadow-xs cursor-pointer'
              : 'text-slate-300 cursor-not-allowed opacity-50'
          }`}
          title="Undo change (Ctrl+Z / Cmd+Z)"
          aria-label="Undo last change"
        >
          <Undo2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">Undo</span>
        </button>

        {/* Redo Button */}
        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
            canRedo
              ? 'text-slate-700 hover:text-slate-900 hover:bg-white shadow-xs cursor-pointer'
              : 'text-slate-300 cursor-not-allowed opacity-50'
          }`}
          title="Redo change (Ctrl+Y / Cmd+Shift+Z)"
          aria-label="Redo change"
        >
          <Redo2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">Redo</span>
        </button>

        <div className="h-3.5 w-px bg-slate-300 mx-1" />

        {/* History Menu Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            isOpen
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white'
          }`}
          title="View last 5 versions history"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <History className="w-3.5 h-3.5 text-indigo-600" />
          <span className="text-[11px] font-mono">
            v{currentIndex + 1}/{history.length}
          </span>
          <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* History Flyout Menu (Stores last 5 versions) */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-neutral-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          {/* Header */}
          <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-400" />
              <div>
                <span className="text-xs font-bold block">Version History Tracker</span>
                <span className="text-[10px] text-slate-400">Stores last 5 snapshots of currentHtml</span>
              </div>
            </div>
            <span className="text-[11px] font-mono bg-slate-800 text-indigo-300 px-2 py-0.5 rounded border border-slate-700">
              {history.length}/5 Saved
            </span>
          </div>

          {/* Versions List */}
          <div className="p-2 space-y-1.5 max-h-80 overflow-y-auto">
            {history.map((entry, idx) => {
              const isActive = idx === currentIndex;
              return (
                <div
                  key={entry.id}
                  className={`p-3 rounded-xl border transition-all ${
                    isActive
                      ? 'bg-indigo-50/70 border-indigo-200 ring-1 ring-indigo-500/20'
                      : 'bg-white border-neutral-100 hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                        {getSourceIcon(entry.source)}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        v{idx + 1} · {entry.label}
                      </span>
                    </div>

                    {isActive ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" /> Active
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          onRevertToIndex(idx);
                          setIsOpen(false);
                        }}
                        className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-900 hover:text-white border border-slate-200 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Revert</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pl-7">
                    <span>{entry.lineCount} lines · {entry.sizeKb} KB</span>
                    <span className="flex items-center gap-1 text-slate-400 font-sans">
                      <Clock className="w-3 h-3" />
                      {formatTimestamp(entry.timestamp)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Shortcuts hint */}
          <div className="px-4 py-2 bg-slate-50 border-t border-neutral-100 text-[10px] text-slate-500 flex items-center justify-between font-mono">
            <span>Undo: ⌘Z / Ctrl+Z</span>
            <span>Redo: ⌘⇧Z / Ctrl+Y</span>
          </div>
        </div>
      )}
    </div>
  );
};
