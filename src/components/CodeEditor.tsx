import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, CheckCircle2, RotateCcw, Undo2, Redo2 } from 'lucide-react';
import { exportHtmlFile } from '../utils/formatHtml';

interface CodeEditorProps {
  html: string;
  onChangeHtml: (updated: string) => void;
  onOpenExportModal?: () => void;
  onResetOriginal?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  html,
  onChangeHtml,
  onOpenExportModal,
  onResetOriginal,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownload = () => {
    if (onOpenExportModal) {
      onOpenExportModal();
    } else {
      exportHtmlFile(html, 'responsive-template');
    }
  };

  const lineCount = html.split('\n').length;
  const sizeKb = (new Blob([html]).size / 1024).toFixed(1);
  const smMatches = (html.match(/\bsm:/g) || []).length;
  const mdMatches = (html.match(/\bmd:/g) || []).length;
  const lgMatches = (html.match(/\blg:/g) || []).length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col">
      {/* Code Header Bar */}
      <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <FileCode className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-slate-200">
            Executable Single-File HTML
          </span>
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span>{lineCount} lines</span>
            <span>·</span>
            <span>{sizeKb} KB</span>
          </div>
        </div>

        {/* Responsive breakpoint stats */}
        <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono">
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            sm: {smMatches}
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            md: {mdMatches}
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            lg: {lgMatches}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Editor Undo / Redo */}
          {onUndo && (
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              <button
                type="button"
                onClick={onUndo}
                disabled={!canUndo}
                className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                  canUndo
                    ? 'text-slate-200 hover:text-white hover:bg-slate-700'
                    : 'text-slate-500 cursor-not-allowed opacity-40'
                }`}
                title="Undo code edit (Ctrl+Z)"
              >
                <Undo2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onRedo}
                disabled={!canRedo}
                className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                  canRedo
                    ? 'text-slate-200 hover:text-white hover:bg-slate-700'
                    : 'text-slate-500 cursor-not-allowed opacity-40'
                }`}
                title="Redo code edit (Ctrl+Y)"
              >
                <Redo2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {onResetOriginal && (
            <button
              onClick={onResetOriginal}
              className="px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
              title="Reset code"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            title="Download formatted .html file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export HTML</span>
          </button>
        </div>
      </div>

      {/* Code Textarea with Live Synced Editing */}
      <div className="relative">
        <textarea
          value={html}
          onChange={(e) => onChangeHtml(e.target.value)}
          spellCheck={false}
          className="w-full h-[580px] p-4 text-xs font-mono text-slate-200 bg-slate-900 border-0 focus:outline-none focus:ring-0 leading-relaxed resize-none selection:bg-indigo-600/40"
        />
      </div>

      {/* Editor Footnote */}
      <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Edits in this editor immediately re-render in the live responsive simulator above.</span>
        <span className="font-mono text-emerald-400 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> Live Synced
        </span>
      </div>
    </div>
  );
};
