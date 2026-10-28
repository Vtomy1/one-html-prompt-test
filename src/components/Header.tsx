import React from 'react';
import { Code2, Smartphone, Monitor, Sparkles, ShieldCheck, Library, Layers } from 'lucide-react';
import { HistoryControl } from './HistoryControl';
import { HistoryEntry } from '../hooks/useHtmlHistory';

export type ActiveTab = 'studio' | 'metaprompts' | 'templates' | 'auditor';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenNewPrompt: () => void;
  onExportHtml: () => void;
  viewportWidth: number;
  auditScore?: number;
  // History Tracker Props
  history: HistoryEntry[];
  currentIndex: number;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onRevertToIndex: (index: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewPrompt,
  onExportHtml,
  auditScore = 100,
  history,
  currentIndex,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onRevertToIndex,
}) => {
  return (
    <header className="border-b border-neutral-200 bg-white/95 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
            <Layers className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
              OmniHTML
            </span>
            <span className="text-[11px] text-slate-500 whitespace-nowrap">
              Universal Prompt-to-Responsive Studio
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links / Workspace Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'studio'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Studio & Preview</span>
          </button>

          <button
            onClick={() => setActiveTab('metaprompts')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'metaprompts'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Cross-Model Prompts</span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'templates'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Library className="w-3.5 h-3.5" />
            <span>Templates</span>
          </button>

          <button
            onClick={() => setActiveTab('auditor')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'auditor'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Auditor ({auditScore}%)</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Export HTML + Generate Code) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Mobile view selector */}
          <div className="flex md:hidden items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setActiveTab('studio')}
              className={`p-1.5 rounded text-xs ${activeTab === 'studio' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
              title="Studio"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('metaprompts')}
              className={`p-1.5 rounded text-xs ${activeTab === 'metaprompts' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
              title="Prompts"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`p-1.5 rounded text-xs ${activeTab === 'templates' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
              title="Templates"
            >
              <Library className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('auditor')}
              className={`p-1.5 rounded text-xs ${activeTab === 'auditor' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
              title="Auditor"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </button>
          </div>

          {/* Version History Tracker (Last 5 Versions) */}
          <HistoryControl
            history={history}
            currentIndex={currentIndex}
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={onUndo}
            onRedo={onRedo}
            onRevertToIndex={onRevertToIndex}
          />

          {/* Explicit Export HTML Button */}
          <button
            onClick={onExportHtml}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
            title="Download current formatted HTML file"
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Export HTML</span>
          </button>

          {/* Primary Action Button */}
          <button
            onClick={onOpenNewPrompt}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Generate Code</span>
          </button>
        </div>
      </div>
    </header>
  );
};
