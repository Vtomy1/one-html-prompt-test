import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini client utility
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Universal Model Prompt Compilers and Engine Guidance
const MODEL_GUIDES: Record<string, {
  name: string;
  badge: string;
  strengths: string;
  rules: string[];
  systemPrompt: string;
}> = {
  gemini: {
    name: 'Google Gemini (3.8 Flash / 4 Argon)',
    badge: 'Gemini Engine',
    strengths: 'Massive context window, multi-lingual precision, clean modern Tailwind v3/v4 semantics, lightning generation speed.',
    rules: [
      'Demand clean HTML5 with Tailwind CSS CDN and Lucide icons.',
      'Explicitly instruct to use mobile-first breakpoints (sm:, md:, lg:, xl:).',
      'Specify self-contained interactivity with vanilla JavaScript embedded in <script>.',
      'Ban external unverified image URLs; instruct to use sleek inline SVGs, CSS meshes, or robust data-backed visual patterns.'
    ],
    systemPrompt: `You are an elite frontend architect generating production-ready responsive single-file HTML templates with Tailwind CSS. Output ONLY executable HTML starting with <!DOCTYPE html>. Every component must gracefully adapt across mobile (375px), tablet (768px), and desktop (1280px+). Include <script src="https://cdn.tailwindcss.com"></script> and <script src="https://unpkg.com/lucide@latest"></script> with lucide.createIcons().`
  },
  claude: {
    name: 'Anthropic Claude (3.7 Sonnet / Artifacts)',
    badge: 'Artifacts Mode',
    strengths: 'Flawless typography, visual nuance, disciplined spacing scales, outstanding script execution in Artifact preview.',
    rules: [
      'Format as a single standalone HTML artifact.',
      'Include mobile drawer state with plain event listeners.',
      'Enforce strict typography pairing (e.g. Plus Jakarta Sans + JetBrains Mono).',
      'Include accessible aria-labels and semantic HTML5 landmarks.'
    ],
    systemPrompt: `You are a world-class UI designer generating a standalone, interactive HTML artifact. Write clean, accessible semantic HTML5 with Tailwind CSS and Lucide icons. Implement full mobile navigation menus, interactive tabs/toggles, and zero dead clicks. Never truncate or summarize.`
  },
  gpt4o: {
    name: 'OpenAI GPT-4o / Canvas',
    badge: 'Canvas Ready',
    strengths: 'Strong semantic layout structuring, clean modular sections, rich sample realistic business copy.',
    rules: [
      'Explicitly forbid markdown explanation outside of the code block.',
      'Require full complete code with no placeholder comments like <!-- add more here -->.',
      'Mandate touch targets of at least 44px on mobile viewports.',
      'Use CSS grid with auto-fit / auto-fill or flex-wrap for fluid responsiveness.'
    ],
    systemPrompt: `Act as a senior full-stack UI engineer. Provide the entire single-file HTML code within a single html code block. Use Tailwind CSS via CDN. Ensure all responsive utilities (hidden md:flex, flex-col sm:flex-row) are thoroughly verified. Do not omit any section.`
  },
  deepseek: {
    name: 'DeepSeek (V3 / R1)',
    badge: 'Reasoning Engine',
    strengths: 'Deep logical breakdown, rigorous CSS architecture, clean mathematically consistent spacing and radius scales.',
    rules: [
      'Instruct the model to mentally plan breakpoints before generating markup.',
      'Emphasize zero horizontal scrollbars on 320px–390px screens.',
      'Specify responsive typography using clamp() or Tailwind text-sm md:text-base lg:text-xl scales.',
      'Ensure interactive states (hover, focus-visible, active) are all specified.'
    ],
    systemPrompt: `Generate an immaculate, fully responsive HTML template using Tailwind CSS and Lucide icons. Design with rigorous mobile-first math: ensure no fixed width exceeds 100vw, table wrappers use overflow-x-auto, and interactive menus work on touch devices.`
  },
  v0: {
    name: 'v0 by Vercel',
    badge: 'Component Generator',
    strengths: 'Tailwind idiomatic styling, Lucide icon harmony, modern shadcn-aesthetic sensibilities.',
    rules: [
      'Use atomic utility classes with crisp border-neutral-200 and dark:border-neutral-800 contrast.',
      'Provide realistic copy and stats rather than lorem ipsum.',
      'Incorporate clean micro-interactions and smooth transitions.',
      'Optimize for component modularity.'
    ],
    systemPrompt: `Generate high-aesthetic, production-grade responsive markup matching modern Vercel/shadcn UI standards. Use semantic tags, Tailwind utility classes, Lucide icons, and zero-compromise responsive behavior.`
  },
  bolt: {
    name: 'Bolt.new / Lovable / Windsurf',
    badge: 'Full-App Builders',
    strengths: 'Seamless single-page and multi-section layouts, immediate runnability in browser containers.',
    rules: [
      'Structure code with clearly delimited semantic sections (<header>, <main>, <section id="...">, <footer>).',
      'Provide turnkey event listeners that can easily port into React or Vite templates.',
      'Avoid npm package dependencies; rely strictly on stable CDNs for HTML prototypes.'
    ],
    systemPrompt: `Generate a production-ready, interactive responsive web page prototype. Structure clean HTML5 with Tailwind CSS CDN. Ensure all mobile touch interactions, hamburger menus, and filters function instantly out of the box.`
  },
  cursor: {
    name: 'Cursor IDE / .cursorrules',
    badge: 'IDE Rules Prompt',
    strengths: 'Strict adherence to project conventions, clean diffs, lint-free semantic output.',
    rules: [
      'Format as .cursorrules or developer instructions for frontend development.',
      'Ban anti-patterns: arbitrary negative margins that break mobile, nested horizontal scrolls without indicators, unconstrained images.'
    ],
    systemPrompt: `You are generating frontend code according to strict responsive rules: 1) Mobile-first CSS, 2) Touch target minimum 44px, 3) Flexible containers with max-w-7xl mx-auto px-4 sm:px-6 lg:px-8, 4) Complete working interactivity.`
  }
};

// API: Generate HTML from Prompt via Gemini 3.8 Flash
app.post('/api/generate', async (req, res) => {
  try {
    const {
      prompt,
      targetModel = 'gemini',
      style = 'modern_minimal',
      themeMode = 'adaptive',
      industry = 'general',
      viewportOptimization = 'mobile_first',
    } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      res.status(400).json({ error: 'Please provide a valid prompt.' });
      return;
    }

    if (!ai) {
      res.status(500).json({
        error: 'Gemini API is not configured. GEMINI_API_KEY environment variable is required.'
      });
      return;
    }

    const modelGuide = MODEL_GUIDES[targetModel] || MODEL_GUIDES.gemini;

    const styleMap: Record<string, string> = {
      modern_minimal: 'Aesthetic: Clean high-end Scandinavian minimalism. White or crisp charcoal background, subtle 1px borders, generous whitespace, refined typography, subtle soft shadows.',
      dark_tech: 'Aesthetic: Sophisticated dark console/developer theme. Deep slate/zinc canvas (#09090b or #0f172a), high legibility, crisp emerald/cyan/indigo accents, subtle glow borders, tabular numbers.',
      corporate_slate: 'Aesthetic: Enterprise SaaS elegance. Professional navy and cool slate, clean card structures, trustworthy tone, crisp badges with typographic separators.',
      vibrant_creative: 'Aesthetic: Bold contemporary digital agency. Expressive typography, energetic accent colors (coral, violet, electric blue), asymmetric balance, dynamic bento grids.',
      editorial_clean: 'Aesthetic: Prestigious editorial/publishing. Rich typography pairings (serif display headers, clean sans body), thoughtful column rhythms, generous reading margins.'
    };
    const styleDirectives = styleMap[String(style)] || 'Aesthetic: Modern clean responsive design.';

    const themeDirectives = themeMode === 'dark'
      ? 'Theme: Strict dark mode styling (bg-slate-950 or bg-zinc-900 text-slate-100).'
      : themeMode === 'light'
      ? 'Theme: Crisp light mode styling (bg-white or bg-slate-50 text-slate-900).'
      : 'Theme: Clean, modern light theme with high-contrast surfaces and dark-mode friendly accents.';

    const systemInstruction = `${modelGuide.systemPrompt}

MANDATORY RESPONSIVE RULES (ZERO TOLERANCE FOR BREAKAGE):
1. The viewport must be 100% fluid. Never use fixed widths like w-[800px] or w-[1200px] on containers. Always use w-full with max-w-6xl or max-w-7xl and mx-auto px-4 sm:px-6 lg:px-8.
2. Grid & Flex: Never rely on single-row layouts without flex-col sm:flex-row or grid-cols-1 md:grid-cols-2 lg:grid-cols-3.
3. Mobile Navigation: MUST include a functional mobile hamburger button with a working JavaScript toggle script that opens/closes the mobile menu gracefully.
4. Images & Media: All imagery must use clean, responsive SVGs or CSS containers with icons. NEVER use external unverified image URLs (no unverified Unsplash or placeholder links that fail in evaluation). Use high-fidelity inline SVGs or styled gradient backdrop cards with Lucide icons.
5. Fonts & Scripts:
   - <script src="https://cdn.tailwindcss.com"></script>
   - <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
   - <script src="https://unpkg.com/lucide@latest"></script>
   - At the bottom of <body>, include <script>lucide.createIcons(); ... mobile menu toggle scripts ...</script>
6. Realistic Content: Generate realistic, domain-specific marketing copy, actual stats, pricing tiers, feature lists, and testimonials. No "Lorem Ipsum" or fake placeholders.
7. Output format: Return the complete single-file HTML code.`;

    const userQuery = `Task: Generate a production-ready, fully responsive HTML template for the following prompt:
"${prompt}"

Configuration:
- Target AI Model optimization: ${modelGuide.name}
- Industry context: ${industry}
- Style direction: ${styleDirectives}
- Color mode: ${themeDirectives}
- Viewport strategy: ${viewportOptimization} (Mobile 375px through Ultrawide 1440px+)

Make sure the code includes:
1. Complete <!DOCTYPE html> with <head> and <body>.
2. Responsive navigation bar with functional mobile menu drawer.
3. Hero section with compelling headline and clear primary action.
4. Core content sections (features, bento grid, showcase, or stats).
5. Interactive elements (e.g. tabs, accordion, or pricing toggle with vanilla JS).
6. Footer with clean navigation links and copyright.
7. lucide.createIcons() call and all interactive JS in <script> tags before </body>.

Return the HTML code directly.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userQuery,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    let rawOutput = response.text || '';
    // Strip markdown wrappers if present
    rawOutput = rawOutput.trim();
    if (rawOutput.startsWith('```html')) {
      rawOutput = rawOutput.replace(/^```html\n?/, '').replace(/\n?```$/, '');
    } else if (rawOutput.startsWith('```')) {
      rawOutput = rawOutput.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }

    res.json({
      success: true,
      html: rawOutput.trim(),
      targetModel,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error generating HTML:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate HTML template with Gemini API.'
    });
  }
});

// API: Universal Prompt Meta-Compiler (Compile prompt for all models & platforms)
app.post('/api/optimize-prompt', (req, res) => {
  try {
    const {
      prompt,
      targetModel = 'gemini',
      outputFormat = 'html_tailwind',
      responsiveLevel = 'strict_mobile_first',
      features = [],
    } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required.' });
      return;
    }

    const guide = MODEL_GUIDES[targetModel] || MODEL_GUIDES.gemini;

    const featureList = Array.isArray(features) && features.length > 0
      ? features.map(f => `- ${f}`).join('\n')
      : '- Responsive mobile navigation drawer\n- Modern Hero with primary CTA\n- Responsive feature grid (1 col mobile, 3 col desktop)\n- Accessible interactive components (tabs/accordion)\n- Clean semantic footer';

    const compiledPrompt = `[ROLE]
You are an expert frontend developer and UI engineer.

[GOAL]
Create a pristine, self-contained, 100% responsive HTML template for:
"${prompt}"

[TARGET ENVIRONMENT]
Optimized specifically for: ${guide.name}
Output format: ${outputFormat === 'html_tailwind' ? 'Single-file HTML with Tailwind CSS CDN and Lucide icons' : 'Semantic HTML5 + Custom Modern Responsive CSS'}

[RESPONSIVE DESIGN CONTRACT]
1. Mobile-First Architecture (${responsiveLevel}):
   - Base styles target 320px–390px phone viewports with zero horizontal clipping or horizontal scroll.
   - Breakpoints: 'sm:' (640px+), 'md:' (768px+), 'lg:' (1024px+), 'xl:' (1280px+).
   - Use fluid container widths: 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'.
   - Minimum touch target size of 44x44px for buttons, links, and form controls on mobile.
2. Layout Flexibility:
   - Use CSS Grid and Flexbox exclusively ('flex flex-col md:flex-row', 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6').
   - Never set fixed pixel widths on structural containers (no 'w-[1200px]').
3. Navigation & Drawers:
   - Mobile: Hamburger button visible on 'md:hidden' that opens a functional mobile slide-over or collapsible drawer.
   - Desktop: Full navigation bar visible on 'hidden md:flex'.
4. Visual Elements & Reliability:
   - Use high-fidelity inline SVGs, CSS patterns, or Lucide icons (<i data-lucide="..."></i>).
   - Do NOT use fragile external image links that fail or 404 in isolated environments.

[REQUIRED SECTIONS & COMPONENTS]
${featureList}

[SCRIPT REQUIREMENTS]
- Tailwind CDN: <script src="https://cdn.tailwindcss.com"></script>
- Lucide Icons CDN: <script src="https://unpkg.com/lucide@latest"></script>
- Google Font: <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
- At the end of the body, write vanilla JS to initialize icons ('lucide.createIcons()') and bind mobile drawer toggles.

[OUTPUT FORMAT]
Return ONLY the standalone HTML code starting with <!DOCTYPE html> and ending with </html>. Do not truncate or include placeholder omissions.`;

    const systemInstruction = guide.systemPrompt;

    res.json({
      success: true,
      targetModel,
      modelName: guide.name,
      badge: guide.badge,
      compiledPrompt,
      systemInstruction,
      strengths: guide.strengths,
      rules: guide.rules,
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Failed to optimize prompt.' });
  }
});

// API: Responsive HTML Code Auditor
app.post('/api/audit-code', (req, res) => {
  try {
    const { html } = req.body;

    if (!html || typeof html !== 'string') {
      res.status(400).json({ error: 'HTML code is required for audit.' });
      return;
    }

    const checks: Array<{
      id: string;
      title: string;
      passed: boolean;
      severity: 'high' | 'medium' | 'low';
      detail: string;
      recommendation?: string;
    }> = [];

    // 1. Viewport Meta Tag
    const hasViewport = /<meta\s+name=["']viewport["']\s+content=["'][^"']*width=device-width[^"']*["']/i.test(html);
    checks.push({
      id: 'viewport_meta',
      title: 'Responsive Viewport Meta Tag',
      passed: hasViewport,
      severity: 'high',
      detail: hasViewport ? 'Viewport meta tag is properly configured for responsive mobile scaling.' : 'Missing <meta name="viewport" content="width=device-width, initial-scale=1.0">. Pages without this will render at fixed desktop zoom on mobile.',
      recommendation: hasViewport ? undefined : 'Add <meta name="viewport" content="width=device-width, initial-scale=1.0"> inside <head>.'
    });

    // 2. Fixed Pixel Width Traps
    const fixedWidthMatches = html.match(/(?:width:\s*[4-9]\d{2,}px|width:\s*\d{4,}px|w-\[[4-9]\d{2,}px\]|w-\[\d{4,}px\])/gi);
    const hasFixedWidthTrap = Boolean(fixedWidthMatches && fixedWidthMatches.length > 0);
    checks.push({
      id: 'fluid_containers',
      title: 'Fluid Container Widths (No Fixed Pixel Overflows)',
      passed: !hasFixedWidthTrap,
      severity: 'high',
      detail: hasFixedWidthTrap
        ? `Found ${fixedWidthMatches?.length} hardcoded container widths (${fixedWidthMatches?.slice(0, 3).join(', ')}...) which will cause horizontal overflow on mobile screens.`
        : 'All container widths use fluid percentages, max-w scales, or auto-fit grids.',
      recommendation: hasFixedWidthTrap ? 'Replace fixed width utilities with "w-full max-w-7xl mx-auto px-4" to ensure graceful mobile resizing.' : undefined
    });

    // 3. Breakpoint Diversity
    const smCount = (html.match(/\bsm:/g) || []).length;
    const mdCount = (html.match(/\bmd:/g) || []).length;
    const lgCount = (html.match(/\blg:/g) || []).length;
    const hasMultiBreakpoints = (mdCount > 0) && (smCount > 0 || lgCount > 0);
    checks.push({
      id: 'breakpoint_coverage',
      title: 'Multi-Tier Breakpoint Coverage',
      passed: hasMultiBreakpoints,
      severity: 'medium',
      detail: `Found ${smCount} sm: rules, ${mdCount} md: rules, and ${lgCount} lg: rules. ${hasMultiBreakpoints ? 'Healthy responsive adaptation across tablet and desktop.' : 'Few responsive breakpoint modifiers found; layout may look static across viewports.'}`,
      recommendation: hasMultiBreakpoints ? undefined : 'Add md: and lg: modifiers to switch between vertical mobile stacks and multi-column desktop layouts.'
    });

    // 4. Mobile Navigation / Drawer
    const hasMobileNav = /id=["']mobile-(?:menu|drawer|nav)["']|class=["'][^"']*md:hidden[^"']*|data-mobile-menu/i.test(html);
    checks.push({
      id: 'mobile_navigation',
      title: 'Mobile Navigation Pattern',
      passed: hasMobileNav,
      severity: 'medium',
      detail: hasMobileNav ? 'Mobile navigation toggle or responsive hamburger drawer detected.' : 'No mobile navigation drawer or md:hidden toggle found. Header links may clip on phone screens.',
      recommendation: hasMobileNav ? undefined : 'Add a hamburger button (<button class="md:hidden">) with collapsible mobile menu links.'
    });

    // 5. Unsafe External Images
    const fragileImageMatch = html.match(/src=["']https?:\/\/(?:images\.unsplash\.com|source\.unsplash\.com|via\.placeholder\.com|picsum\.photos)[^"']*["']/gi);
    const hasFragileImages = Boolean(fragileImageMatch && fragileImageMatch.length > 0);
    checks.push({
      id: 'image_resilience',
      title: 'Hermetic Image Reliability',
      passed: !hasFragileImages,
      severity: 'medium',
      detail: hasFragileImages
        ? `Found ${fragileImageMatch?.length} fragile external image URLs (e.g. Unsplash/placeholder domains) that can fail or get blocked in restricted evaluation sandboxes.`
        : 'Markup uses reliable inline SVGs, CSS gradient cards, or self-contained assets.',
      recommendation: hasFragileImages ? 'Replace external image links with styled CSS gradient containers, inline SVG illustrations, or data URIs.' : undefined
    });

    // 6. Lucide Icons or Vector Icons
    const hasIcons = /data-lucide|lucide\.createIcons|<svg/i.test(html);
    checks.push({
      id: 'iconography',
      title: 'Scalable Vector Iconography',
      passed: hasIcons,
      severity: 'low',
      detail: hasIcons ? 'Scalable vector icons (Lucide or SVG) detected.' : 'No vector icons detected. Adding iconography enhances visual hierarchy and scannability.',
      recommendation: hasIcons ? undefined : 'Add Lucide icons via CDN to give buttons and metrics polished visual affordances.'
    });

    // Calculate score
    const passedCount = checks.filter(c => c.passed).length;
    const score = Math.round((passedCount / checks.length) * 100);

    res.json({
      success: true,
      score,
      totalChecks: checks.length,
      passedChecks: passedCount,
      checks,
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Failed to audit code.' });
  }
});

// Configure Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`OmniHTML Studio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
