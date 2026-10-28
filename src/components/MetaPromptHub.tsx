import React, { useState } from 'react';
import { Copy, Check, Terminal, Sparkles, AlertTriangle, ShieldCheck, Cpu, Code2, ArrowUpRight } from 'lucide-react';
import { AI_MODELS, PROMPT_ENHANCEMENT_TAGS } from '../data/models';

interface MetaPromptHubProps {
  currentPrompt: string;
  onApplyPromptToStudio: (prompt: string, modelId: string) => void;
}

export const MetaPromptHub: React.FC<MetaPromptHubProps> = ({
  currentPrompt,
  onApplyPromptToStudio,
}) => {
  const [selectedModelId, setSelectedModelId] = useState<string>('gemini');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Feature toggle state for universal prompt customizer
  const [includeDrawer, setIncludeDrawer] = useState<boolean>(true);
  const [includeBento, setIncludeBento] = useState<boolean>(true);
  const [includeInteractivity, setIncludeInteractivity] = useState<boolean>(true);
  const [includeAria, setIncludeAria] = useState<boolean>(true);

  const model = AI_MODELS.find(m => m.id === selectedModelId) || AI_MODELS[0];

  const handleCopy = async (text: string, sectionId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(sectionId);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch {
      // fallback
    }
  };

  // Compile universal prompt tailored specifically for this model
  const compiledUserPrompt = `[ROLE & CONTEXT]
You are a senior frontend architect specializing in bulletproof responsive web design.
Target Engine: ${model.name}

[REQUIREMENT]
Generate a complete, standalone, production-ready single-file HTML template for:
"${currentPrompt || 'A modern high-converting SaaS landing page with analytics console and customer proof.'}"

[RESPONSIVE SPECIFICATIONS - MANDATORY]
1. Fluid Layout Hierarchy:
   - Base styles: Mobile (320px–390px) single-column stack. Zero horizontal overflow or clipped text.
   - sm: (≥640px) 2-column flow for compact cards.
   - md: (≥768px) tablet navigation layout.
   - lg: (≥1024px) 3 or 4-column desktop layout.
   - Containers: Use 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' exclusively. Never set fixed pixel widths like w-[1000px].
${includeDrawer ? `2. Mobile Navigation:
   - Header must feature a hamburger button with 'md:hidden'.
   - Include a collapsible mobile menu or slide-over drawer toggled with clean vanilla JavaScript.` : ''}
${includeBento ? `3. Grid Architecture:
   - Use CSS Grid and Flexbox with responsive column spans ('col-span-1 md:col-span-2 lg:col-span-3').
   - Tables must be wrapped in '<div class="overflow-x-auto">'.` : ''}
${includeInteractivity ? `4. Embedded Interactivity:
   - At the bottom of <body>, provide vanilla <script> for:
     a) lucide.createIcons();
     b) Mobile menu drawer click toggle;
     c) Filter/Tab switcher button states.` : ''}
${includeAria ? `5. Accessibility & Touch Targets:
   - Touch targets for all interactive buttons and links must be at least 44x44px on mobile viewports.
   - Include aria-labels and semantic HTML5 tags (<header>, <nav>, <main>, <article>, <aside>, <footer>).` : ''}
6. Self-Contained Assets (Zero-Broken-Image Policy):
   - Include Tailwind CSS CDN: <script src="https://cdn.tailwindcss.com"></script>
   - Include Lucide Icons: <script src="https://unpkg.com/lucide@latest"></script>
   - Do NOT use fragile external image URLs that fail in isolated sandbox environments. Use high-fidelity inline SVGs, CSS gradient cards, or Lucide icons for all visual slots.

[OUTPUT FORMAT]
Return ONLY the executable HTML code starting with <!DOCTYPE html> and ending with </html>. Do not include markdown preamble or conversational explanations.`;

  return (
    <div className="space-y-6">
      {/* Introduction Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-md">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
            <Cpu className="w-4 h-4" />
            <span>Cross-Platform Prompt Engineering Hub</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Universal Meta-Prompts for Every AI Model & Tool
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Different AI models have distinct default failure modes when generating HTML (e.g. fixed container widths, missing mobile drawers, broken external images, or truncated code). OmniHTML compiles precision-tuned instructions so you get 100% responsive, production-ready code whether you use Gemini, Claude Artifacts, ChatGPT Canvas, v0, Bolt, or Cursor.
          </p>
        </div>
      </div>

      {/* Model Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-200">
        {AI_MODELS.map((m) => {
          const isSelected = selectedModelId === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setSelectedModelId(m.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{m.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                isSelected ? 'bg-slate-800 text-indigo-300' : 'bg-slate-100 text-slate-500'
              }`}>
                {m.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Model Deep-Dive Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: The Compiled Prompt & System Prompt */}
        <div className="lg:col-span-2 space-y-6">
          {/* Universal User Prompt Box */}
          <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-600" />
                  <span>Optimized Prompt for {model.name}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Engineered with model-specific constraints and responsive contracts.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onApplyPromptToStudio(currentPrompt, model.id)}
                  className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Load in Studio</span>
                </button>
                <button
                  onClick={() => handleCopy(compiledUserPrompt, 'user_prompt')}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  {copiedSection === 'user_prompt' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Prompt</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Feature Customizer Switches */}
            <div className="px-5 py-3 bg-slate-50 border-b border-neutral-100 flex flex-wrap items-center gap-4 text-xs">
              <span className="font-semibold text-slate-700">Include in prompt:</span>
              <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeDrawer}
                  onChange={(e) => setIncludeDrawer(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span>Mobile Drawer Script</span>
              </label>
              <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeBento}
                  onChange={(e) => setIncludeBento(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span>Fluid Grid Columns</span>
              </label>
              <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeInteractivity}
                  onChange={(e) => setIncludeInteractivity(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span>Embedded Interactivity</span>
              </label>
              <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeAria}
                  onChange={(e) => setIncludeAria(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span>44px Touch Targets</span>
              </label>
            </div>

            <pre className="p-5 text-xs font-mono text-slate-800 bg-slate-50/50 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-96">
              {compiledUserPrompt}
            </pre>
          </div>

          {/* System Prompt / Custom Instructions */}
          <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-emerald-600" />
                  <span>System Prompt & Custom Instructions</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Paste into system prompt, custom instructions, or .cursorrules file.
                </p>
              </div>

              <button
                onClick={() => handleCopy(model.systemPrompt, 'system_prompt')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
              >
                {copiedSection === 'system_prompt' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy System Prompt</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-5 text-xs font-mono text-slate-800 bg-slate-50/50 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {model.systemPrompt}
            </pre>
          </div>
        </div>

        {/* Right Col: Model Analysis, Failure Modes, and Best Practices */}
        <div className="space-y-6">
          {/* Model Profile Card */}
          <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Engine Analysis</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {model.provider}
              </span>
            </div>
            <h4 className="text-base font-bold text-slate-900">{model.name}</h4>
            <div className="text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-800 block mb-1">Key Strengths:</strong>
              {model.strengths}
            </div>
            <div className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-neutral-100">
              <strong className="text-slate-800 block mb-1">Recommended Use Cases:</strong>
              {model.bestFor}
            </div>
          </div>

          {/* Failure Modes & Antidotes */}
          <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-5 space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Common Model Traps & Antidotes</span>
            </h4>
            <div className="space-y-3">
              {model.commonFailureModes.map((trap, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs text-amber-900 space-y-1">
                  <span className="font-semibold text-amber-950 block">Risk #{idx + 1}:</span>
                  <p>{trap}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-neutral-100 space-y-2">
              <span className="text-xs font-bold text-slate-800 block">OmniHTML Safeguard Rules:</span>
              <ul className="space-y-1 text-xs text-slate-600">
                {model.responsiveRules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
