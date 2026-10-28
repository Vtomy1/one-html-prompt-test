import React from 'react';
import { TEMPLATES, TemplateItem } from '../data/templates';
import { Eye, Check, ExternalLink, Sparkles, Layers } from 'lucide-react';

interface TemplateGalleryProps {
  onSelectTemplate: (template: TemplateItem) => void;
  selectedTemplateId: string;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  onSelectTemplate,
  selectedTemplateId,
}) => {
  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Curated Responsive Template Catalog
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Production-grade templates crafted with strict zero-broken-image policies, mobile-first flex/grid architectures, and embedded interactive scripts.
          </p>
        </div>
        <div className="text-xs text-slate-500">
          Showing <span className="font-semibold text-slate-900">{TEMPLATES.length}</span> battle-tested templates
        </div>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TEMPLATES.map((tpl) => {
          const isSelected = selectedTemplateId === tpl.id;
          return (
            <div
              key={tpl.id}
              className={`bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                isSelected ? 'border-indigo-600 ring-2 ring-indigo-600/20' : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              {/* Preview Thumbnail Box using responsive iframe */}
              <div className="relative w-full h-56 bg-slate-100 border-b border-neutral-200 overflow-hidden group">
                <iframe
                  srcDoc={tpl.html}
                  title={tpl.title}
                  className="w-[1280px] h-[720px] origin-top-left pointer-events-none select-none border-0"
                  style={{
                    transform: 'scale(0.35)',
                    width: '1280px',
                    height: '640px',
                  }}
                  tabIndex={-1}
                  aria-hidden="true"
                />
                <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => onSelectTemplate(tpl)}
                    className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-lg flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Load into Live Studio</span>
                  </button>
                </div>
              </div>

              {/* Card Meta & Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-indigo-600 uppercase tracking-wider text-[11px]">
                      {tpl.category}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      Single-file HTML
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {tpl.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {tpl.description}
                  </p>
                </div>

                <div className="space-y-4 pt-3 border-t border-neutral-100">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {tpl.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] font-medium text-slate-600 bg-slate-100 border border-slate-200/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => onSelectTemplate(tpl)}
                      className={`w-full py-2 px-3 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Currently Active</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                          <span>Load & Edit Template</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
