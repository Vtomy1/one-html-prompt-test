import React, { useState } from 'react';
import { Download, Copy, Check, FileCode, X, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { formatHtml, exportHtmlFile } from '../utils/formatHtml';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  html: string;
  defaultFilename?: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  html,
  defaultFilename = 'responsive-template',
}) => {
  const [filename, setFilename] = useState<string>(defaultFilename);
  const [shouldFormat, setShouldFormat] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [downloaded, setDownloaded] = useState<boolean>(false);

  if (!isOpen) return null;

  const processedHtml = shouldFormat ? formatHtml(html) : html;
  const lineCount = processedHtml.split('\n').length;
  const sizeKb = (new Blob([processedHtml]).size / 1024).toFixed(1);

  const handleDownload = () => {
    const res = exportHtmlFile(processedHtml, filename);
    if (res.success) {
      setDownloaded(true);
      setTimeout(() => {
        setDownloaded(false);
        onClose();
      }, 1400);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(processedHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl bg-white border border-neutral-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-modal-title"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Download className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 id="export-modal-title" className="text-sm font-bold tracking-tight">
                Export Formatted HTML
              </h2>
              <p className="text-[11px] text-slate-400">
                Production-grade, standalone single-file template ready for deployment.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {/* Filename Input */}
          <div className="space-y-1.5">
            <label htmlFor="export-filename" className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              File Name
            </label>
            <div className="flex items-center">
              <input
                id="export-filename"
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs font-mono text-slate-900 bg-slate-50 border border-slate-200 rounded-l-xl focus:outline-none focus:border-indigo-600"
                placeholder="my-responsive-page"
              />
              <span className="px-3 py-2 text-xs font-mono text-slate-500 bg-slate-100 border border-l-0 border-slate-200 rounded-r-xl">
                .html
              </span>
            </div>
          </div>

          {/* Configuration Options */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-slate-700 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={shouldFormat}
                  onChange={(e) => setShouldFormat(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-0"
                />
                <span>Format & indent HTML structure (2 spaces)</span>
              </label>
              <span className="text-[11px] text-emerald-600 font-semibold">Recommended</span>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200/60">
              <span>Lines: <strong className="text-slate-800">{lineCount}</strong></span>
              <span>·</span>
              <span>Size: <strong className="text-slate-800">{sizeKb} KB</strong></span>
              <span>·</span>
              <span className="text-emerald-700 flex items-center gap-1 font-sans">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Tailwind & Lucide CDNs Included
              </span>
            </div>
          </div>

          {/* Formatted Code Preview Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Preview Formatted Source:</span>
              <span className="font-mono text-[11px]">First 10 lines</span>
            </div>
            <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-200 text-[11px] font-mono overflow-x-auto max-h-36 border border-slate-800 leading-relaxed">
              {processedHtml.split('\n').slice(0, 10).join('\n')}
              {lineCount > 10 ? '\n  ... (full file continues)' : ''}
            </pre>
          </div>
        </div>

        {/* Modal Footer / Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-bold">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Formatted Code</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="flex-1 sm:flex-none px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              {downloaded ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-indigo-200" />
                  <span>Download .html File</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
