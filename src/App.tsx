import React, { useState } from 'react';
import { Header, ActiveTab } from './components/Header';
import { PromptStudio } from './components/PromptStudio';
import { ResponsiveViewport } from './components/ResponsiveViewport';
import { CodeEditor } from './components/CodeEditor';
import { MetaPromptHub } from './components/MetaPromptHub';
import { TemplateGallery } from './components/TemplateGallery';
import { ResponsiveAuditor } from './components/ResponsiveAuditor';
import { ExportModal } from './components/ExportModal';
import { TEMPLATES, TemplateItem } from './data/templates';
import { AI_MODELS } from './data/models';
import { useHtmlHistory } from './hooks/useHtmlHistory';
import { Eye, Code2, Columns, Sparkles, CheckCircle2, ChevronRight, Download } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('studio');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem>(TEMPLATES[0]);

  // History State Tracker (Stores last 5 versions with undo/redo/revert)
  const {
    currentHtml,
    history,
    currentIndex,
    canUndo,
    canRedo,
    undo,
    redo,
    pushHistory,
    updateHtml,
    revertToIndex,
  } = useHtmlHistory(TEMPLATES[0].html, `Template: ${TEMPLATES[0].title}`);

  const [originalHtml, setOriginalHtml] = useState<string>(TEMPLATES[0].html);
  const [activeModelId, setActiveModelId] = useState<string>('gemini');
  const [currentPrompt, setCurrentPrompt] = useState<string>(
    'Create an enterprise telemetry console for infrastructure monitoring with live KPI cards, interactive time period selector, responsive SVG throughput chart, and data table with cluster health status.'
  );

  // Export Modal state
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // View Mode inside Studio: 'preview' (visual canvas), 'code' (interactive editor), or 'split' (side-by-side)
  const [studioViewMode, setStudioViewMode] = useState<'preview' | 'code' | 'split'>('preview');

  // Generation state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Calculate audit score for header badge
  const hasViewport = /<meta\s+name=["']viewport["']/i.test(currentHtml);
  const hasNoFixedTraps = !/(?:width:\s*[5-9]\d{2,}px|w-\[[5-9]\d{2,}px\]|w-\[\d{4,}px\])/gi.test(currentHtml);
  const hasBreakpoints = (currentHtml.match(/\bmd:/g) || []).length > 2;
  const hasMobileNav = /md:hidden|mobile-menu|mobile-toggle/i.test(currentHtml);
  const hasNoFragileImages = !/src=["']https?:\/\/(?:images\.unsplash\.com|via\.placeholder\.com)/i.test(currentHtml);
  const hasIcons = /lucide/i.test(currentHtml) || /<svg/i.test(currentHtml);
  const passedCount = [hasViewport, hasNoFixedTraps, hasBreakpoints, hasMobileNav, hasNoFragileImages, hasIcons].filter(Boolean).length;
  const auditScore = Math.round((passedCount / 6) * 100);

  // Handle generation via Gemini 3.8 Flash API
  const handleGenerateCode = async ({
    prompt,
    targetModel,
    style,
    themeMode,
    viewportOptimization,
  }: {
    prompt: string;
    targetModel: string;
    style: string;
    themeMode: string;
    viewportOptimization: string;
  }) => {
    setIsGenerating(true);
    setGenerationError(null);
    setCurrentPrompt(prompt);
    setActiveModelId(targetModel);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          targetModel,
          style,
          themeMode,
          viewportOptimization,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate responsive HTML template.');
      }

      pushHistory(data.html, 'ai_generation', `AI Generated (${activeModel.shortName})`);
      setOriginalHtml(data.html);
      setActiveTab('studio');
      setStudioViewMode('preview');
    } catch (err: any) {
      console.error('Generation error:', err);
      setGenerationError(err?.message || 'Server error occurred during code generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Switch to Meta-Prompt Hub with user's prompt
  const handleCompilePrompt = ({
    prompt,
    targetModel,
  }: {
    prompt: string;
    targetModel: string;
  }) => {
    setCurrentPrompt(prompt);
    setActiveModelId(targetModel);
    setActiveTab('metaprompts');
  };

  // Load a curated template
  const handleSelectTemplate = (template: TemplateItem) => {
    setSelectedTemplate(template);
    pushHistory(template.html, 'template', `Template: ${template.title}`);
    setOriginalHtml(template.html);
    setActiveModelId(template.recommendedModel);
    setActiveTab('studio');
  };

  // Apply auto-fix from the auditor
  const handleApplyFix = (fixedHtml: string) => {
    pushHistory(fixedHtml, 'auto_fix', 'Responsive Auto-Fix Applied');
  };

  const activeModel = AI_MODELS.find(m => m.id === activeModelId) || AI_MODELS[0];

  return (
    <div className="min-h-screen bg-neutral-100/70 text-slate-900 flex flex-col font-sans">
      {/* Universal Top Header adhering strictly to Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewPrompt={() => {
          setActiveTab('studio');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onExportHtml={() => setIsExportModalOpen(true)}
        viewportWidth={1280}
        auditScore={auditScore}
        history={history}
        currentIndex={currentIndex}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onRevertToIndex={revertToIndex}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* TAB 1: STUDIO & LIVE SIMULATOR */}
        {activeTab === 'studio' && (
          <div className="space-y-8">
            {/* Prompt Generator Input Box */}
            <PromptStudio
              onGenerateCode={handleGenerateCode}
              onCompilePrompt={handleCompilePrompt}
              isGenerating={isGenerating}
              error={generationError}
            />

            {/* Studio Workspace Header & View Mode Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">
                  Live Responsive Canvas & Code Inspector
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  · Tested across {activeModel.name}
                </span>
              </div>

              {/* View Switcher: Preview / Split / Code */}
              <div className="flex items-center gap-1 p-1 bg-white border border-neutral-200 rounded-xl shadow-xs self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setStudioViewMode('preview')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                    studioViewMode === 'preview'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Interactive Preview</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStudioViewMode('split')}
                  className={`hidden lg:flex px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors items-center gap-1.5 ${
                    studioViewMode === 'split'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>Split Canvas & Code</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStudioViewMode('code')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                    studioViewMode === 'code'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>HTML Source</span>
                </button>
              </div>
            </div>

            {/* Viewports Container */}
            {studioViewMode === 'preview' && (
              <ResponsiveViewport
                html={currentHtml}
                onUpdateHtml={(newHtml) => updateHtml(newHtml, 'Viewport Live Update')}
                onOpenExportModal={() => setIsExportModalOpen(true)}
                activeModelName={activeModel.name}
              />
            )}

            {studioViewMode === 'code' && (
              <CodeEditor
                html={currentHtml}
                onChangeHtml={(updated) => updateHtml(updated, 'Manual Code Edit')}
                onOpenExportModal={() => setIsExportModalOpen(true)}
                onResetOriginal={() => pushHistory(originalHtml, 'editor', 'Reset to Original')}
                canUndo={canUndo}
                canRedo={canRedo}
                onUndo={undo}
                onRedo={redo}
              />
            )}

            {studioViewMode === 'split' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <div className="w-full">
                  <ResponsiveViewport
                    html={currentHtml}
                    onUpdateHtml={(newHtml) => updateHtml(newHtml, 'Viewport Live Update')}
                    onOpenExportModal={() => setIsExportModalOpen(true)}
                    activeModelName={activeModel.name}
                  />
                </div>
                <div className="w-full">
                  <CodeEditor
                    html={currentHtml}
                    onChangeHtml={(updated) => updateHtml(updated, 'Manual Code Edit')}
                    onOpenExportModal={() => setIsExportModalOpen(true)}
                    onResetOriginal={() => pushHistory(originalHtml, 'editor', 'Reset to Original')}
                    canUndo={canUndo}
                    canRedo={canRedo}
                    onUndo={undo}
                    onRedo={redo}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CROSS-MODEL META-PROMPT HUB */}
        {activeTab === 'metaprompts' && (
          <MetaPromptHub
            currentPrompt={currentPrompt}
            onApplyPromptToStudio={(prompt, modelId) => {
              setCurrentPrompt(prompt);
              setActiveModelId(modelId);
              setActiveTab('studio');
            }}
          />
        )}

        {/* TAB 3: CURATED TEMPLATE CATALOG */}
        {activeTab === 'templates' && (
          <TemplateGallery
            onSelectTemplate={handleSelectTemplate}
            selectedTemplateId={selectedTemplate.id}
          />
        )}

        {/* TAB 4: RESPONSIVE DESIGN AUDITOR */}
        {activeTab === 'auditor' && (
          <ResponsiveAuditor
            html={currentHtml}
            onApplyFix={handleApplyFix}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">OmniHTML</span>
            <span>·</span>
            <span>Universal Prompt-to-Responsive HTML Studio for All AI Models</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('studio')}
              className="hover:text-slate-900 transition-colors"
            >
              Live Studio
            </button>
            <button
              onClick={() => setActiveTab('metaprompts')}
              className="hover:text-slate-900 transition-colors"
            >
              Cross-Model Hub
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className="hover:text-slate-900 transition-colors"
            >
              Templates
            </button>
            <button
              onClick={() => setActiveTab('auditor')}
              className="hover:text-slate-900 transition-colors"
            >
              Auditor
            </button>
          </div>
        </div>
      </footer>

      {/* Export HTML Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        html={currentHtml}
        defaultFilename={selectedTemplate.id || 'responsive-template'}
      />
    </div>
  );
}
