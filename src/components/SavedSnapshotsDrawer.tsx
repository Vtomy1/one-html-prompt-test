import React, { useState } from 'react';
import { SavedSnapshot } from '../hooks/useSavedSnapshots';
import {
  Bookmark,
  RotateCcw,
  Trash2,
  Download,
  Copy,
  Check,
  Search,
  Calendar,
  FileCode,
  Tag,
  ArrowUpRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { exportHtmlFile } from '../utils/formatHtml';

interface SavedSnapshotsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  snapshots: SavedSnapshot[];
  onLoadSnapshot: (snapshot: SavedSnapshot) => void;
  onDeleteSnapshot: (id: string) => void;
  onClearAll: () => void;
  onOpenSaveModal: () => void;
}

export const SavedSnapshotsDrawer: React.FC<SavedSnapshotsDrawerProps> = ({
  isOpen,
  onClose,
  snapshots,
  onLoadSnapshot,
  onDeleteSnapshot,
  onClearAll,
  onOpenSaveModal,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredSnapshots = snapshots.filter((snap) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      snap.name.toLowerCase().includes(q) ||
      snap.description?.toLowerCase().includes(q) ||
      snap.tags?.some((t) => t.toLowerCase().includes(q)) ||
      snap.modelBadge?.toLowerCase().includes(q)
    );
  });

  const handleCopyCode = async (html: string, id: string) => {
    try {
      await navigator.clipboard.writeText(html);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // ignore
    }
  };

  const handleExportSingle = (snap: SavedSnapshot) => {
    const sanitizedName = snap.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    exportHtmlFile(snap.html, `${sanitizedName || 'saved-snapshot'}.html`);
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-neutral-200 animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="saved-snapshots-heading"
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h2 id="saved-snapshots-heading" className="text-sm font-bold tracking-tight">
                Saved Snapshots Collection
              </h2>
              <p className="text-[11px] text-slate-400">
                Persistent long-term storage ({snapshots.length} saved) · Separate from 5-item undo buffer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSaveModal}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Save Current</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Close drawer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 border-b border-neutral-100 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, tag, description..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          </div>

          {snapshots.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete all saved snapshots from local storage?')) {
                  onClearAll();
                }
              }}
              className="px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors whitespace-nowrap"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Snapshots List View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredSnapshots.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600">
                <Bookmark className="w-6 h-6" />
              </div>
              <div className="max-w-xs space-y-1">
                <h3 className="text-sm font-bold text-slate-900">
                  {searchQuery ? 'No matching snapshots' : 'No saved snapshots yet'}
                </h3>
                <p className="text-xs text-slate-500">
                  {searchQuery
                    ? 'Try searching with different terms or clear your search query.'
                    : 'Click "Save Snapshot" to permanently store your current template state to your browser collection.'}
                </p>
              </div>
              {!searchQuery && (
                <button
                  onClick={onOpenSaveModal}
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                >
                  <Bookmark className="w-3.5 h-3.5 text-amber-300" />
                  <span>Save Current Template</span>
                </button>
              )}
            </div>
          ) : (
            filteredSnapshots.map((snap) => (
              <div
                key={snap.id}
                className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
              >
                {/* Header row */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
                        <Bookmark className="w-3.5 h-3.5" />
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-900 transition-colors">
                        {snap.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1 opacity-90">
                      <button
                        onClick={() => handleCopyCode(snap.html, snap.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Copy HTML to clipboard"
                      >
                        {copiedId === snap.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleExportSingle(snap)}
                        className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Export as .html file"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete snapshot "${snap.name}"?`)) {
                            onDeleteSnapshot(snap.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete snapshot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {snap.description && (
                    <p className="text-xs text-slate-600 leading-relaxed pl-9">
                      {snap.description}
                    </p>
                  )}
                </div>

                {/* Tags row */}
                {snap.tags && snap.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pl-9">
                    {snap.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] font-medium text-slate-600 bg-slate-100 border border-slate-200/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer metadata & Load button */}
                <div className="pt-3 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[11px] text-slate-400 font-mono">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {formatDate(snap.createdAt)}
                    </span>
                    <span>·</span>
                    <span>{snap.lineCount} lines ({snap.sizeKb} KB)</span>
                  </div>

                  <button
                    onClick={() => {
                      onLoadSnapshot(snap);
                      onClose();
                    }}
                    className="self-end sm:self-auto px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-indigo-600 rounded-xl transition-all shadow-2xs flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Load into Studio</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info note */}
        <div className="px-6 py-3 bg-slate-50 border-t border-neutral-200 text-[11px] text-slate-500 flex items-center justify-between shrink-0">
          <span>Persists in browser localStorage across reloads</span>
          <span className="font-mono text-slate-600 font-medium">omnihtml_saved_snapshots_v1</span>
        </div>
      </div>
    </div>
  );
};
