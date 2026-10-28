import React, { useState } from 'react';
import { Sparkles, Terminal, Wand2, ArrowRight, Check, AlertCircle, Copy, SlidersHorizontal } from 'lucide-react';
import { AI_MODELS, PROMPT_ENHANCEMENT_TAGS } from '../data/models';

interface PromptStudioProps {
  onGenerateCode: (params: {
    prompt: string;
    targetModel: string;
    style: string;
    themeMode: string;
    viewportOptimization: string;
  }) => Promise<void>;
  onCompilePrompt: (params: {
    prompt: string;
    targetModel: string;
  }) => void;
  isGenerating: boolean;
  error?: string | null;
}

const SAMPLE_PROMPTS = [
  {
    title: 'SaaS Metric Telemetry',
    prompt: 'Create an enterprise telemetry console for infrastructure monitoring with live KPI cards, interactive time period selector, responsive SVG throughput chart, and data table with cluster health status.',
    model: 'gemini',
    style: 'dark_tech'
  },
  {
    title: 'Minimalist Storefront',
    prompt: 'Design a high-end Scandinavian interior architecture shop with clean typography, 4-column responsive product showcase, instant add-to-cart badges, and cart count drawer.',
    model: 'claude',
    style: 'modern_minimal'
  },
  {
    title: 'Engineer Bento Portfolio',
    prompt: 'Build an engineering leadership portfolio with an asymmetric Bento Grid that reflows gracefully on mobile devices, showcasing case studies, live code snippet viewer, and stats.',
    model: 'gpt4o',
    style: 'dark_tech'
  },
  {
    title: 'Developer Documentation',
    prompt: 'Create an API documentation explorer with responsive collapsible sidebar, API endpoint test playground, language switcher tabs (cURL, Python, TS), and request parameters table.',
    model: 'v0',
    style: 'corporate_slate'
  }
];

export const PromptStudio: React.FC<PromptStudioProps> = ({
  onGenerateCode,
  onCompilePrompt,
  isGenerating,
  error,
}) => {
  const [prompt, setPrompt] = useState(
    'Create a modern responsive SaaS landing page with sticky navigation, hero section, interactive pricing tier switcher, bento feature grid, and mobile hamburger drawer.'
  );
  const [selectedModel, setSelectedModel] = useState<string>('gemini');
  const [selectedStyle, setSelectedStyle] = useState<string>('modern_minimal');
  const [themeMode, setThemeMode] = useState<string>('adaptive');
  const [viewportOptimization, setViewportOptimization] = useState<string>('mobile_first');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const activeModel = AI_MODELS.find(m => m.id === selectedModel) || AI_MODELS[0];

  const handleAddTag = (tag: string) => {
    if (!prompt.includes(tag)) {
      setPrompt(prev => prev.trim() + (prev.trim().endsWith('.') ? ' ' : '. ') + `Include ${tag.toLowerCase()}.`);
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_PROMPTS[0]) => {
    setPrompt(sample.prompt);
    setSelectedModel(sample.model);
    setSelectedStyle(sample.style);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    await onGenerateCode({
      prompt,
      targetModel: selectedModel,
      style: selectedStyle,
      themeMode,
      viewportOptimization,
    });
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-5 sm:p-6 space-y-6">
      {/* Top Banner & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-neutral-100 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-indigo-600" />
            <span>Prompt to Responsive HTML Generator</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Engineered to generate responsive code that renders consistently across Gemini, Claude, GPT-4o, DeepSeek, and modern AI IDEs.
          </p>
        </div>

        {/* Quick Sample Selector */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto max-w-full pb-1 sm:pb-0">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Presets:
          </span>
          {SAMPLE_PROMPTS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectSample(sample)}
              className="px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg whitespace-nowrap transition-colors"
            >
              {sample.title}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Prompt Input Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="prompt-input" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Template Prompt
            </label>
            <span className="text-xs text-slate-400 font-mono">
              {prompt.length} chars
            </span>
          </div>

          <div className="relative">
            <textarea
              id="prompt-input"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the website, app, or UI template you want to generate..."
              className="w-full px-4 py-3 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 resize-y transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Prompt Enhancer Tag Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-medium text-slate-400 shrink-0">
              Enhance with:
            </span>
            {PROMPT_ENHANCEMENT_TAGS.slice(0, 6).map((tag, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleAddTag(tag)}
                className="px-2 py-0.5 text-[11px] text-slate-600 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 rounded-md transition-colors border border-slate-200/60"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Target AI Model Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Target AI Model & Tool
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {AI_MODELS.map((model) => {
              const isSelected = selectedModel === model.id;
              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => setSelectedModel(model.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-600'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-xs font-bold ${isSelected ? 'text-indigo-950' : 'text-slate-800'}`}>
                      {model.shortName}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 truncate">
                    {model.badge}
                  </span>
                </button>
              );
            })}
          </div>
          {/* Active Model Strengths summary */}
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
            <span className="font-semibold text-slate-700 shrink-0">{activeModel.name}:</span>
            <span className="truncate">{activeModel.strengths}</span>
          </div>
        </div>

        {/* Style & Configuration Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">
              Visual Direction
            </label>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-indigo-600"
            >
              <option value="modern_minimal">Modern Minimalist (High Whitespace)</option>
              <option value="dark_tech">Dark Tech / OLED (Sleek Slate)</option>
              <option value="corporate_slate">Corporate Enterprise (Structured)</option>
              <option value="vibrant_creative">Vibrant Creative (Agency Tone)</option>
              <option value="editorial_clean">Editorial & Typography (Serif Luxury)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">
              Color Palette
            </label>
            <select
              value={themeMode}
              onChange={(e) => setThemeMode(e.target.value)}
              className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-indigo-600"
            >
              <option value="adaptive">Adaptive / High-Contrast</option>
              <option value="dark">Strict Dark Mode Canvas</option>
              <option value="light">Crisp Light Mode Canvas</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">
              Breakpoint Strategy
            </label>
            <select
              value={viewportOptimization}
              onChange={(e) => setViewportOptimization(e.target.value)}
              className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-indigo-600"
            >
              <option value="mobile_first">Mobile-First (375px → 1280px)</option>
              <option value="universal_fluid">Universal Fluid (Auto-Fit Grids)</option>
              <option value="desktop_first">Desktop Baseline (1440px Focus)</option>
            </select>
          </div>
        </div>

        {/* Error message banner */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-500">
            Generates single-file standalone HTML + Tailwind CSS + Lucide icons.
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => onCompilePrompt({ prompt, targetModel: selectedModel })}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors flex items-center gap-2"
            >
              <Terminal className="w-3.5 h-3.5 text-slate-500" />
              <span>Compile Prompt for {activeModel.shortName}</span>
            </button>

            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Synthesizing Code...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                  <span>Generate Live HTML</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
