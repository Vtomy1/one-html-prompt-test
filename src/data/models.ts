export interface ModelEngine {
  id: string;
  name: string;
  shortName: string;
  provider: string;
  badge: string;
  color: string;
  borderColor: string;
  strengths: string;
  commonFailureModes: string[];
  responsiveRules: string[];
  systemPrompt: string;
  examplePrompt: string;
  bestFor: string;
}

export const AI_MODELS: ModelEngine[] = [
  {
    id: 'gemini',
    name: 'Google Gemini 3.8 Flash / 4 Argon',
    shortName: 'Gemini',
    provider: 'Google AI',
    badge: 'Flagship Fast',
    color: 'from-blue-600 to-indigo-600',
    borderColor: 'border-blue-500/30',
    strengths: 'Sub-second generation latency, massive context window (1M+ tokens), modern Tailwind v3/v4 semantics, outstanding full-page completeness without truncation.',
    commonFailureModes: [
      'May occasionally default to modern Tailwind without script CDN if not specified.',
      'Can forget to call lucide.createIcons() inside DOMContentLoaded listener.'
    ],
    responsiveRules: [
      'Always instruct: "Output ONLY single-file executable HTML with CDN scripts for Tailwind and Lucide".',
      'Specify mobile breakpoint hierarchy explicitly (sm:, md:, lg:, xl:).',
      'Demand zero fixed-pixel container widths.'
    ],
    systemPrompt: `You are an elite frontend architect generating production-ready responsive single-file HTML templates with Tailwind CSS. Output ONLY executable HTML starting with <!DOCTYPE html>. Every component must gracefully adapt across mobile (375px), tablet (768px), and desktop (1280px+). Include <script src="https://cdn.tailwindcss.com"></script> and <script src="https://unpkg.com/lucide@latest"></script> with lucide.createIcons().`,
    examplePrompt: 'Create a responsive enterprise SaaS analytics console with live KPI metrics, filter tabs, interactive table, and mobile navigation drawer.',
    bestFor: 'Rapid end-to-end template generation, massive complex dashboards, full single-file websites.'
  },
  {
    id: 'claude',
    name: 'Anthropic Claude 3.7 Sonnet / Artifacts',
    shortName: 'Claude',
    provider: 'Anthropic',
    badge: 'Aesthetic Leader',
    color: 'from-amber-600 to-orange-600',
    borderColor: 'border-amber-500/30',
    strengths: 'Superior typographic restraint, natural editorial hierarchy, exquisite color balance, and clean accessible semantic HTML5.',
    commonFailureModes: [
      'Can over-index on subtle typography at the expense of bold mobile touch buttons.',
      'Occasionally omits hamburger toggle scripts unless explicitly prompted for working JavaScript.'
    ],
    responsiveRules: [
      'Instruct: "Include working JavaScript event listeners for mobile navigation drawer toggle and interactive tabs".',
      'Enforce minimum touch target of 44x44px on all mobile elements.',
      'Instruct Claude to build with full viewport awareness: mobile 375px to 1440px desktop.'
    ],
    systemPrompt: `You are a world-class UI designer generating a standalone, interactive HTML artifact. Write clean, accessible semantic HTML5 with Tailwind CSS and Lucide icons. Implement full mobile navigation menus, interactive tabs/toggles, and zero dead clicks. Never truncate or summarize.`,
    examplePrompt: 'Design a high-end luxury Scandinavian architecture storefront with 4-column product grid, fluid cart count, and responsive navigation.',
    bestFor: 'Luxury e-commerce, editorial broadsheets, bespoke design agency showcases, typography-heavy web pages.'
  },
  {
    id: 'gpt4o',
    name: 'OpenAI GPT-4o / Canvas',
    shortName: 'GPT-4o',
    provider: 'OpenAI',
    badge: 'Universal Logic',
    color: 'from-emerald-600 to-teal-600',
    borderColor: 'border-emerald-500/30',
    strengths: 'Solid structured layouts, excellent realistic sample business copy, clean table definitions, and reliable DOM structures.',
    commonFailureModes: [
      'Prone to writing "cards inside cards" unless forbidden.',
      'Sometimes relies on fixed widths (w-[1200px]) that clip on phones without explicit bans.'
    ],
    responsiveRules: [
      'Strict ban on fixed container widths: "Use w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 exclusively".',
      'Specify: "No markdown explanation outside the code block; deliver 100% complete code".'
    ],
    systemPrompt: `Act as a senior full-stack UI engineer. Provide the entire single-file HTML code within a single html code block. Use Tailwind CSS via CDN. Ensure all responsive utilities (hidden md:flex, flex-col sm:flex-row) are thoroughly verified. Do not omit any section.`,
    examplePrompt: 'Build an engineering portfolio with asymmetric bento grid that collapses into a single-column stream on mobile devices.',
    bestFor: 'Bento portfolios, marketing landing pages, technical landing pages with rich copy.'
  },
  {
    id: 'deepseek',
    name: 'DeepSeek V3 / R1',
    shortName: 'DeepSeek',
    provider: 'DeepSeek',
    badge: 'Reasoning Engine',
    color: 'from-cyan-600 to-blue-600',
    borderColor: 'border-cyan-500/30',
    strengths: 'Deep logical and mathematical spatial reasoning, strict adherence to CSS layout constraints and container queries.',
    commonFailureModes: [
      'Can generate overly long thinking chains before outputting code if not prompted for concise execution.',
      'May use non-standard Tailwind class extensions without base CDN script.'
    ],
    responsiveRules: [
      'Pre-allocate layout math: "Plan grid columns across breakpoints (1 col mobile, 2 col sm, 3 col lg)".',
      'Ensure standard Tailwind CDN compatibility.'
    ],
    systemPrompt: `Generate an immaculate, fully responsive HTML template using Tailwind CSS and Lucide icons. Design with rigorous mobile-first math: ensure no fixed width exceeds 100vw, table wrappers use overflow-x-auto, and interactive menus work on touch devices.`,
    examplePrompt: 'Create a high-density financial trading terminal view with tabular numbers, responsive order book, and mobile drawer.',
    bestFor: 'Dense data grids, spreadsheets, financial terminals, complex grid calculations.'
  },
  {
    id: 'v0',
    name: 'v0 by Vercel',
    shortName: 'v0.dev',
    provider: 'Vercel',
    badge: 'Component Spec',
    color: 'from-neutral-700 to-neutral-900',
    borderColor: 'border-neutral-500/30',
    strengths: 'Modern shadcn/ui aesthetic, subtle borders, high visual elegance, native Tailwind utility mastery.',
    commonFailureModes: [
      'Often generates React JSX instead of vanilla HTML unless single-file HTML is explicitly demanded.'
    ],
    responsiveRules: [
      'Specify: "Generate as a single standalone HTML file with CDN links for previewing without Node build steps".',
      'Use standard Tailwind neutral and slate color palettes.'
    ],
    systemPrompt: `Generate high-aesthetic, production-grade responsive markup matching modern Vercel/shadcn UI standards. Use semantic tags, Tailwind utility classes, Lucide icons, and zero-compromise responsive behavior.`,
    examplePrompt: 'Build a developer documentation page with collapsible mobile sidebar, code snippet switcher, and parameter reference table.',
    bestFor: 'Developer consoles, clean dark-mode interfaces, component libraries.'
  },
  {
    id: 'bolt',
    name: 'Bolt.new & Lovable',
    shortName: 'Bolt / Lovable',
    provider: 'StackBlitz & Lovable',
    badge: 'App Container',
    color: 'from-purple-600 to-pink-600',
    borderColor: 'border-purple-500/30',
    strengths: 'Immediate in-browser container execution, full interactive workflows, complete component suites.',
    commonFailureModes: [
      'Can import npm modules that fail in static HTML files unless strictly instructed to use vanilla CDNs.'
    ],
    responsiveRules: [
      'Strict CDN-only rule: "Do not use npm package imports; use stable unpkg / cdnjs scripts".',
      'Include all inline event handlers for instant interactivity.'
    ],
    systemPrompt: `Generate a production-ready, interactive responsive web page prototype. Structure clean HTML5 with Tailwind CSS CDN. Ensure all mobile touch interactions, hamburger menus, and filters function instantly out of the box.`,
    examplePrompt: 'Create an AI developer summit registration portal with responsive countdown timer, schedule tabs, and ticket tiers.',
    bestFor: 'Turnkey full-page prototypes, interactive sandboxes, hackathon demos.'
  },
  {
    id: 'cursor',
    name: 'Cursor IDE (.cursorrules)',
    shortName: 'Cursor',
    provider: 'Cursor / Anysphere',
    badge: 'Dev Environment',
    color: 'from-slate-700 to-zinc-800',
    borderColor: 'border-slate-500/30',
    strengths: 'Contextual IDE generation, perfect diffs, strict consistency across file structures and styling conventions.',
    commonFailureModes: [
      'Without explicit rules, will create multiple files instead of a self-contained portable template.'
    ],
    responsiveRules: [
      'Provide formatted .cursorrules section that locks in responsive design conventions.',
      'Mandate WCAG AA accessibility and touch target constraints.'
    ],
    systemPrompt: `You are generating frontend code according to strict responsive rules: 1) Mobile-first CSS, 2) Touch target minimum 44px, 3) Flexible containers with max-w-7xl mx-auto px-4 sm:px-6 lg:px-8, 4) Complete working interactivity.`,
    examplePrompt: 'Generate a mobile-first banking portal webview with account overview, quick action buttons, and transaction history.',
    bestFor: 'Professional IDE workflows, .cursorrules generation, project-specific frontend coding.'
  }
];

export const PROMPT_ENHANCEMENT_TAGS = [
  'Mobile hamburger drawer',
  'Fluid Tailwind typography',
  'Interactive tab switcher',
  '44px touch targets',
  'Asymmetric Bento Grid',
  'Tabular-nums financial data',
  'Zero external broken images',
  'Accessible ARIA landmarks',
  'Sticky backdrop-blur header',
  'Responsive pricing matrix'
];
