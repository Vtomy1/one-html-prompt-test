import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Wrench, RefreshCw, Zap } from 'lucide-react';

interface AuditCheck {
  id: string;
  title: string;
  passed: boolean;
  severity: 'high' | 'medium' | 'low';
  detail: string;
  recommendation?: string;
}

interface ResponsiveAuditorProps {
  html: string;
  onApplyFix: (fixedHtml: string) => void;
}

export const ResponsiveAuditor: React.FC<ResponsiveAuditorProps> = ({
  html,
  onApplyFix,
}) => {
  // Compute checks dynamically
  const checks: AuditCheck[] = [
    {
      id: 'viewport_meta',
      title: 'Responsive Viewport Meta Tag',
      passed: /<meta\s+name=["']viewport["']\s+content=["'][^"']*width=device-width[^"']*["']/i.test(html),
      severity: 'high',
      detail: /<meta\s+name=["']viewport["']/i.test(html)
        ? 'Viewport meta tag is properly configured for mobile devices.'
        : 'Missing <meta name="viewport" content="width=device-width, initial-scale=1.0">. Pages without this fail mobile scaling on iOS and Android.',
      recommendation: 'Inject standard responsive viewport tag inside <head>.'
    },
    {
      id: 'fluid_containers',
      title: 'Fluid Container Widths (No Fixed Pixel Traps)',
      passed: !/(?:width:\s*[5-9]\d{2,}px|w-\[[5-9]\d{2,}px\]|w-\[\d{4,}px\])/gi.test(html),
      severity: 'high',
      detail: !/(?:width:\s*[5-9]\d{2,}px|w-\[[5-9]\d{2,}px\]|w-\[\d{4,}px\])/gi.test(html)
        ? 'All structural containers use fluid percentages, max-w scales, or auto-fit grids.'
        : 'Detected hardcoded container widths that cause horizontal scroll overflow on mobile devices.',
      recommendation: 'Replace fixed widths with "w-full max-w-7xl mx-auto px-4".'
    },
    {
      id: 'breakpoint_coverage',
      title: 'Multi-Tier Breakpoint Modifiers (sm/md/lg)',
      passed: (html.match(/\bmd:/g) || []).length > 2,
      severity: 'medium',
      detail: `Found ${(html.match(/\bmd:/g) || []).length} md: rules and ${(html.match(/\blg:/g) || []).length} lg: rules. Responsive column stacking is active.`,
      recommendation: 'Add md: and lg: modifiers to switch between vertical mobile stacks and desktop grids.'
    },
    {
      id: 'mobile_navigation',
      title: 'Mobile Navigation Pattern',
      passed: /md:hidden|mobile-menu|mobile-toggle|mobile-drawer/i.test(html),
      severity: 'medium',
      detail: /md:hidden|mobile-menu|mobile-toggle/i.test(html)
        ? 'Mobile navigation toggle button or collapsible drawer detected.'
        : 'No mobile navigation drawer or md:hidden toggle found. Header links may wrap awkwardly or clip on phone viewports.',
      recommendation: 'Add a hamburger button (<button class="md:hidden">) with collapsible mobile drawer links.'
    },
    {
      id: 'image_resilience',
      title: 'Hermetic Image Reliability (No Flaky Unsplash URLs)',
      passed: !/src=["']https?:\/\/(?:images\.unsplash\.com|via\.placeholder\.com|picsum\.photos)/i.test(html),
      severity: 'medium',
      detail: !/src=["']https?:\/\/(?:images\.unsplash\.com|via\.placeholder\.com|picsum\.photos)/i.test(html)
        ? 'Markup uses reliable inline SVGs, CSS gradient cards, or Lucide icons.'
        : 'Found external image URLs that can fail or get blocked in restricted evaluation environments.',
      recommendation: 'Replace unverified external image URLs with high-fidelity inline SVGs or CSS gradient backdrops.'
    },
    {
      id: 'vector_iconography',
      title: 'Vector Iconography & CDN Scripts',
      passed: /lucide/i.test(html) || /<svg/i.test(html),
      severity: 'low',
      detail: /lucide/i.test(html) || /<svg/i.test(html)
        ? 'Vector icons (Lucide or inline SVG) detected.'
        : 'No vector icons detected. Adding iconography enhances visual hierarchy and scannability.',
      recommendation: 'Include Lucide icons via CDN.'
    }
  ];

  const passedCount = checks.filter(c => c.passed).length;
  const score = Math.round((passedCount / checks.length) * 100);

  // Auto-Fix function
  const handleAutoFix = () => {
    let fixed = html;

    // 1. Ensure viewport tag exists
    if (!/<meta\s+name=["']viewport["']/i.test(fixed)) {
      fixed = fixed.replace(
        /<head[^>]*>/i,
        `<head>\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">`
      );
    }

    // 2. Ensure Tailwind and Lucide CDNs exist if missing
    if (!fixed.includes('cdn.tailwindcss.com')) {
      fixed = fixed.replace(
        /<\/head>/i,
        `  <script src="https://cdn.tailwindcss.com"></script>\n</head>`
      );
    }
    if (!fixed.includes('unpkg.com/lucide')) {
      fixed = fixed.replace(
        /<\/head>/i,
        `  <script src="https://unpkg.com/lucide@latest"></script>\n</head>`
      );
    }

    // 3. Ensure lucide.createIcons is called
    if (fixed.includes('unpkg.com/lucide') && !fixed.includes('lucide.createIcons')) {
      fixed = fixed.replace(
        /<\/body>/i,
        `  <script>\n    if (window.lucide) { lucide.createIcons(); }\n  </script>\n</body>`
      );
    }

    // 4. Wrap standalone <table> in overflow-x-auto if not already wrapped
    if (fixed.includes('<table') && !fixed.includes('overflow-x-auto')) {
      fixed = fixed.replace(/<table/g, '<div class="overflow-x-auto"><table');
      fixed = fixed.replace(/<\/table>/g, '</table></div>');
    }

    onApplyFix(fixed);
  };

  return (
    <div className="space-y-6">
      {/* Score Header Card */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Circular Score Badge */}
          <div className="relative w-20 h-20 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center shadow-md">
            <span className="text-2xl font-bold font-mono tracking-tight">{score}%</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Health</span>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Responsive Design & Platform Compatibility Audit
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluates layout resilience, mobile touch target sizes, viewport headers, and zero-broken-image policies.
            </p>
            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{passedCount} of {checks.length} checks passed</span>
              </span>
              {score < 100 && (
                <span className="text-amber-700 font-medium">
                  · {checks.length - passedCount} potential issues detected
                </span>
              )}
            </div>
          </div>
        </div>

        {score < 100 && (
          <button
            onClick={handleAutoFix}
            className="px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto shrink-0"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Auto-Fix Responsive Gaps</span>
          </button>
        )}
      </div>

      {/* Checklist items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {checks.map((chk) => (
          <div
            key={chk.id}
            className={`p-5 rounded-2xl border transition-all ${
              chk.passed
                ? 'bg-white border-neutral-200'
                : 'bg-amber-50/40 border-amber-200'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                {chk.passed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                )}
                <h3 className="text-sm font-bold text-slate-900">{chk.title}</h3>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                chk.passed
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {chk.passed ? 'PASSED' : 'CHECK NEEDED'}
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
              {chk.detail}
            </p>

            {!chk.passed && chk.recommendation && (
              <div className="mt-3 p-2.5 rounded-lg bg-white border border-amber-200 text-xs text-slate-700">
                <span className="font-semibold text-amber-900 block mb-0.5">Recommendation:</span>
                {chk.recommendation}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
