import React, { useState, useRef, useEffect } from 'react';
import {
  Smartphone,
  Tablet,
  Monitor,
  Maximize2,
  RotateCcw,
  Download,
  Copy,
  ExternalLink,
  Columns,
  Check,
  ChevronDown,
  Layers,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface ResponsiveViewportProps {
  html: string;
  onUpdateHtml?: (newHtml: string) => void;
  activeModelName?: string;
}

const VIEWPORT_PRESETS = [
  { id: 'mobile_sm', name: 'Mobile (375px)', width: 375, icon: Smartphone, tag: 'Phone' },
  { id: 'mobile_md', name: 'Mobile (390px)', width: 390, icon: Smartphone, tag: 'iPhone' },
  { id: 'tablet', name: 'Tablet (768px)', width: 768, icon: Tablet, tag: 'iPad' },
  { id: 'laptop', name: 'Laptop (1024px)', width: 1024, icon: Monitor, tag: 'md/lg' },
  { id: 'desktop', name: 'Desktop (1280px)', width: 1280, icon: Monitor, tag: 'xl:' },
  { id: 'wide', name: 'Full Fluid (100%)', width: 0, icon: Maximize2, tag: 'Fluid' },
];

export const ResponsiveViewport: React.FC<ResponsiveViewportProps> = ({
  html,
  activeModelName,
}) => {
  const [currentWidth, setCurrentWidth] = useState<number>(1280);
  const [isFluid, setIsFluid] = useState<boolean>(false);
  const [dualView, setDualView] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [copied, setCopied] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Active Breakpoint descriptor
  const getBreakpointLabel = (w: number) => {
    if (isFluid) return 'Fluid 100% · All Breakpoints active';
    if (w < 640) return `${w}px · Mobile (base styles)`;
    if (w < 768) return `${w}px · sm: active (≥640px)`;
    if (w < 1024) return `${w}px · md: active (≥768px)`;
    if (w < 1280) return `${w}px · lg: active (≥1024px)`;
    return `${w}px · xl: active (≥1280px)`;
  };

  const handleSelectPreset = (w: number) => {
    if (w === 0) {
      setIsFluid(true);
      setCurrentWidth(1280);
    } else {
      setIsFluid(false);
      setCurrentWidth(w);
    }
  };

  // Copy HTML
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  // Download standalone HTML
  const handleDownload = () => {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omni-template-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Open Preview in New Tab
  const handleOpenNewTab = () => {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  // Drag handle for custom viewport width resizing
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = Math.max(320, Math.min(1600, Math.round(e.clientX - rect.left)));
      setIsFluid(false);
      setCurrentWidth(newWidth);
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col">
      {/* Viewport Control Bar */}
      <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Device Viewport Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
          {VIEWPORT_PRESETS.map((preset) => {
            const Icon = preset.icon;
            const active = preset.width === 0 ? isFluid : (!isFluid && currentWidth === preset.width);
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset.width)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  active
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title={preset.name}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{preset.tag}</span>
                {preset.width > 0 && (
                  <span className="text-[10px] opacity-70 font-mono hidden lg:inline">
                    {preset.width}px
                  </span>
                )}
              </button>
            );
          })}

          <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block" />

          {/* Dual View Toggle */}
          <button
            type="button"
            onClick={() => setDualView(!dualView)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              dualView
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Side-by-side Mobile & Desktop view"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Dual View</span>
          </button>
        </div>

        {/* Status Badge & Actions */}
        <div className="flex items-center gap-3">
          {/* Active Resolution indicator */}
          <span className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md hidden sm:inline-block">
            {getBreakpointLabel(currentWidth)}
          </span>

          {/* Zoom controls */}
          <div className="hidden md:flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setZoomLevel(Math.max(50, zoomLevel - 15))}
              className="p-1 text-slate-400 hover:text-white rounded"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-slate-300 px-1.5">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel(Math.min(100, zoomLevel + 15))}
              className="p-1 text-slate-400 hover:text-white rounded"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reload Canvas */}
          <button
            onClick={() => setIframeKey(k => k + 1)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Reload sandbox preview"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Copy HTML */}
          <button
            onClick={handleCopy}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Copy HTML to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Download HTML */}
          <button
            onClick={handleDownload}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Download .html file"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Open in New Window */}
          <button
            onClick={handleOpenNewTab}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Open in new window"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div
        ref={containerRef}
        className="w-full bg-slate-950/60 p-4 sm:p-6 overflow-x-auto min-h-[640px] flex items-start justify-center relative select-none"
      >
        {dualView ? (
          /* Dual Split View: Mobile (390px) + Desktop (100% or 1100px) side-by-side */
          <div className="w-full flex flex-col xl:flex-row gap-6 items-center justify-center">
            {/* Mobile Viewport Card */}
            <div className="flex flex-col items-center">
              <div className="text-xs font-mono text-slate-400 mb-2 flex items-center gap-2">
                <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                <span>Mobile (390px · iPhone 15)</span>
              </div>
              <div
                className="w-[390px] h-[720px] rounded-3xl border-4 border-slate-700 bg-black overflow-hidden shadow-2xl relative"
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'top center',
                }}
              >
                {/* Phone Notch Mock */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-20 pointer-events-none" />
                <iframe
                  key={`dual-mobile-${iframeKey}`}
                  srcDoc={html}
                  title="Mobile Preview"
                  className="w-full h-full border-0 bg-white"
                  sandbox="allow-scripts allow-modals"
                />
              </div>
            </div>

            {/* Desktop Viewport Card */}
            <div className="flex-1 w-full max-w-4xl flex flex-col items-center">
              <div className="text-xs font-mono text-slate-400 mb-2 flex items-center gap-2">
                <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                <span>Desktop (1280px Baseline)</span>
              </div>
              <div
                className="w-full h-[720px] rounded-xl border border-slate-700 bg-slate-900 overflow-hidden shadow-2xl"
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'top center',
                }}
              >
                <iframe
                  key={`dual-desktop-${iframeKey}`}
                  srcDoc={html}
                  title="Desktop Preview"
                  className="w-full h-full border-0 bg-white"
                  sandbox="allow-scripts allow-modals"
                />
              </div>
            </div>
          </div>
        ) : (
          /* Single Viewport with Custom Drag Resize Handle */
          <div
            className="relative flex items-center transition-all duration-75"
            style={{
              width: isFluid ? '100%' : `${currentWidth}px`,
              maxWidth: '100%',
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
            }}
          >
            {/* The Viewport Frame */}
            <div
              className={`w-full h-[740px] bg-white overflow-hidden shadow-2xl relative border ${
                currentWidth <= 428
                  ? 'rounded-3xl border-4 border-slate-700'
                  : 'rounded-xl border-slate-700'
              }`}
            >
              {/* Optional Phone Top Pill on narrow mobile viewports */}
              {currentWidth <= 428 && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-3.5 bg-slate-800 rounded-full z-20 pointer-events-none" />
              )}
              <iframe
                key={`single-${iframeKey}-${currentWidth}`}
                srcDoc={html}
                title="OmniHTML Sandbox"
                className="w-full h-full border-0 bg-white"
                sandbox="allow-scripts allow-modals"
              />
            </div>

            {/* Draggable Width Handle (Right edge) */}
            {!isFluid && (
              <div
                onMouseDown={handleMouseDown}
                className={`absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-20 rounded-full bg-slate-700 hover:bg-indigo-600 cursor-ew-resize flex items-center justify-center transition-colors shadow-md z-30 ${
                  isDragging ? 'bg-indigo-600 ring-2 ring-indigo-400' : ''
                }`}
                title="Drag left/right to test responsive breakpoints"
              >
                <div className="w-1 h-8 rounded bg-slate-300 opacity-60" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Viewport Info Footbar */}
      <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Tailwind CSS CDN Ready</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            <span>Lucide Vector Icons</span>
          </span>
          {activeModelName && (
            <span className="hidden sm:inline-block text-slate-500">
              Generated for: <strong className="text-slate-300 font-semibold">{activeModelName}</strong>
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono">
            {isFluid ? 'Fluid Mode' : `${currentWidth}px`}
          </span>
        </div>
      </div>
    </div>
  );
};
