import React, { useState } from 'react';
import { Bookmark, BookmarkCheck, X, Sparkles, Check, FileCode, Tag } from 'lucide-react';

interface SaveSnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  html: string;
  defaultName?: string;
  activeModelName?: string;
  onSave: (name: string, description?: string, tags?: string[]) => void;
}

const SUGGESTED_TAGS = ['Production Ready', 'Mobile Optimized', 'Dark Mode', 'Bento Layout', 'Client V1', 'WIP'];

export const SaveSnapshotModal: React.FC<SaveSnapshotModalProps> = ({
  isOpen,
  onClose,
  html,
  defaultName = '',
  activeModelName,
  onSave,
}) => {
  const [name, setName] = useState<string>(defaultName || `Snapshot ${new Date().toLocaleDateString()}`);
  const [description, setDescription] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Production Ready']);
  const [customTagInput, setCustomTagInput] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const lineCount = html.split('\n').length;
  const sizeKb = (new Blob([html]).size / 1024).toFixed(1);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customTagInput.trim()) {
      e.preventDefault();
      const trimmed = customTagInput.trim();
      if (!selectedTags.includes(trimmed)) {
        setSelectedTags((prev) => [...prev, trimmed]);
      }
      setCustomTagInput('');
    }
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave(name.trim(), description.trim() || undefined, selectedTags);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white border border-neutral-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="save-snapshot-title"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h2 id="save-snapshot-title" className="text-sm font-bold tracking-tight">
                Save Snapshot to Long-Term Storage
              </h2>
              <p className="text-[11px] text-slate-400">
                Permanently stores template state in your browser's persistent collection.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleConfirm} className="p-6 space-y-4">
          {/* Snapshot Name */}
          <div className="space-y-1.5">
            <label htmlFor="snapshot-name" className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Snapshot Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="snapshot-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., PulseOps Dashboard V2 - Clean Navbar"
              className="w-full px-3.5 py-2 text-xs font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label htmlFor="snapshot-desc" className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Notes / Description <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              id="snapshot-desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key layout changes, verified breakpoints, client feedback notes..."
              className="w-full px-3.5 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 resize-none transition-all"
            />
          </div>

          {/* Tag Chips */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Tags & Categorization
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-colors flex items-center gap-1 border ${
                      isSelected
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-2xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-indigo-600" />}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Tag write-in */}
            <div className="flex items-center gap-2 pt-1">
              <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onKeyDown={handleAddCustomTag}
                placeholder="Type custom tag & press Enter..."
                className="flex-1 px-2.5 py-1 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Metadata Card preview */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs text-slate-600 font-mono">
            <div className="flex items-center gap-3">
              <FileCode className="w-4 h-4 text-slate-400" />
              <span>{lineCount} lines</span>
              <span>·</span>
              <span>{sizeKb} KB</span>
            </div>
            {activeModelName && (
              <span className="text-indigo-600 font-sans font-medium text-[11px]">
                {activeModelName}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || savedSuccess}
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Saved to Collection!</span>
                </>
              ) : (
                <>
                  <BookmarkCheck className="w-4 h-4 text-amber-200" />
                  <span>Save Snapshot</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
