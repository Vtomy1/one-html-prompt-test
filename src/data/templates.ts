export interface TemplateItem {
  id: string;
  title: string;
  category: 'SaaS' | 'E-Commerce' | 'Portfolio' | 'Fintech' | 'Docs' | 'Event';
  description: string;
  tags: string[];
  html: string;
  recommendedModel: string;
}

export const TEMPLATES: TemplateItem[] = [
  {
    id: 'saas_analytics',
    title: 'PulseOps - Enterprise Analytics Console',
    category: 'SaaS',
    description: 'Executive KPI telemetry, responsive interactive data table, chart preview, and collapsible navigation drawer.',
    tags: ['KPI Grid', 'Responsive Table', 'Filter Tabs', 'Mobile Drawer'],
    recommendedModel: 'gemini',
    html: `<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PulseOps Analytics Console</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
    .font-mono { font-family: 'JetBrains Mono', monospace; font-variant-numeric: tabular-nums; }
  </style>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen flex flex-col antialiased">
  <!-- Top Navigation Bar -->
  <header class="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
      <!-- Zone 1: Brand -->
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
          <i data-lucide="activity" class="w-4 h-4"></i>
        </div>
        <span class="text-base font-bold tracking-tight text-white whitespace-nowrap">PulseOps</span>
        <span class="hidden sm:inline-block text-xs font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">v2.4</span>
      </div>

      <!-- Zone 2: Navigation Links (Desktop) -->
      <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
        <a href="#overview" class="text-white hover:text-indigo-400 transition-colors">Overview</a>
        <a href="#metrics" class="hover:text-white transition-colors">Performance</a>
        <a href="#activity" class="hover:text-white transition-colors">Audit Logs</a>
        <a href="#settings" class="hover:text-white transition-colors">Settings</a>
      </nav>

      <!-- Zone 3: Actions & Mobile Hamburger -->
      <div class="flex items-center gap-3">
        <button class="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors">
          <i data-lucide="download" class="w-3.5 h-3.5"></i>
          <span>Export CSV</span>
        </button>
        <button class="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors whitespace-nowrap">
          Create Alert
        </button>
        <!-- Mobile Menu Toggle Button -->
        <button id="mobile-toggle" aria-label="Toggle navigation menu" class="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
          <i data-lucide="menu" class="w-5 h-5"></i>
        </button>
      </div>
    </div>

    <!-- Mobile Drawer Menu -->
    <div id="mobile-menu" class="hidden md:hidden border-t border-slate-800 bg-slate-900 px-4 pt-3 pb-5 space-y-2">
      <a href="#overview" class="block px-3 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg">Overview</a>
      <a href="#metrics" class="block px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg">Performance</a>
      <a href="#activity" class="block px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg">Audit Logs</a>
      <a href="#settings" class="block px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg">Settings</a>
    </div>
  </header>

  <!-- Main Viewport -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-white">System Infrastructure Health</h1>
        <p class="text-sm text-slate-400 mt-1">Live telemetry across 14 clusters and API edge nodes.</p>
      </div>
      <!-- Segmented Time Period Filter -->
      <div class="flex items-center gap-1 p-1 bg-slate-800 border border-slate-700 rounded-lg self-start sm:self-auto" id="filter-tabs">
        <button data-period="24h" class="filter-btn active px-3 py-1 text-xs font-medium rounded-md bg-indigo-600 text-white shadow-sm transition-all">24h</button>
        <button data-period="7d" class="filter-btn px-3 py-1 text-xs font-medium rounded-md text-slate-400 hover:text-white transition-all">7d</button>
        <button data-period="30d" class="filter-btn px-3 py-1 text-xs font-medium rounded-md text-slate-400 hover:text-white transition-all">30d</button>
        <button data-period="1y" class="filter-btn px-3 py-1 text-xs font-medium rounded-md text-slate-400 hover:text-white transition-all">1y</button>
      </div>
    </div>

    <!-- Responsive KPI Metric Strip (1 col mobile, 2 col tablet, 4 col desktop) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Metric 1 -->
      <div class="bg-slate-800/60 border border-slate-700/80 rounded-xl p-5 hover:border-slate-600 transition-colors">
        <div class="flex items-center justify-between text-slate-400 text-xs font-medium">
          <span>Global Requests</span>
          <i data-lucide="arrow-up-right" class="w-4 h-4 text-emerald-400"></i>
        </div>
        <div class="mt-3 flex items-baseline gap-2">
          <span class="text-2xl sm:text-3xl font-bold text-white font-mono">148.9M</span>
          <span class="text-xs font-semibold text-emerald-400 font-mono">+12.4%</span>
        </div>
        <p class="text-xs text-slate-400 mt-2">vs. previous period</p>
      </div>

      <!-- Metric 2 -->
      <div class="bg-slate-800/60 border border-slate-700/80 rounded-xl p-5 hover:border-slate-600 transition-colors">
        <div class="flex items-center justify-between text-slate-400 text-xs font-medium">
          <span>P99 Edge Latency</span>
          <i data-lucide="clock" class="w-4 h-4 text-indigo-400"></i>
        </div>
        <div class="mt-3 flex items-baseline gap-2">
          <span class="text-2xl sm:text-3xl font-bold text-white font-mono">24.2ms</span>
          <span class="text-xs font-semibold text-emerald-400 font-mono">-4.1ms</span>
        </div>
        <p class="text-xs text-slate-400 mt-2">Target &lt; 35ms threshold</p>
      </div>

      <!-- Metric 3 -->
      <div class="bg-slate-800/60 border border-slate-700/80 rounded-xl p-5 hover:border-slate-600 transition-colors">
        <div class="flex items-center justify-between text-slate-400 text-xs font-medium">
          <span>Uptime SLA</span>
          <i data-lucide="shield-check" class="w-4 h-4 text-emerald-400"></i>
        </div>
        <div class="mt-3 flex items-baseline gap-2">
          <span class="text-2xl sm:text-3xl font-bold text-white font-mono">99.98%</span>
          <span class="text-xs font-semibold text-emerald-400 font-mono">Nominal</span>
        </div>
        <p class="text-xs text-slate-400 mt-2">Zero unbudgeted downtime</p>
      </div>

      <!-- Metric 4 -->
      <div class="bg-slate-800/60 border border-slate-700/80 rounded-xl p-5 hover:border-slate-600 transition-colors">
        <div class="flex items-center justify-between text-slate-400 text-xs font-medium">
          <span>Active Nodes</span>
          <i data-lucide="server" class="w-4 h-4 text-amber-400"></i>
        </div>
        <div class="mt-3 flex items-baseline gap-2">
          <span class="text-2xl sm:text-3xl font-bold text-white font-mono">842 / 850</span>
          <span class="text-xs font-semibold text-amber-400 font-mono">99.1%</span>
        </div>
        <p class="text-xs text-slate-400 mt-2">8 scaling into US-West</p>
      </div>
    </div>

    <!-- Telemetry Graph Section with Responsive SVG Container -->
    <div class="bg-slate-800/60 border border-slate-700/80 rounded-xl p-5 sm:p-6 space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 class="text-base font-semibold text-white">Throughput & Ingress Volume</h2>
          <p class="text-xs text-slate-400">Aggregated requests per second over time</p>
        </div>
        <div class="flex items-center gap-4 text-xs font-mono text-slate-300">
          <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-sm bg-indigo-500 inline-block"></span> EU Ingress</span>
          <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"></span> US Ingress</span>
        </div>
      </div>

      <!-- Scalable SVG Chart -->
      <div class="w-full h-48 sm:h-64 overflow-hidden rounded-lg bg-slate-900/50 p-2 sm:p-4 relative">
        <svg viewBox="0 0 800 200" class="w-full h-full preserve-3d" preserveAspectRatio="none">
          <defs>
            <linearGradient id="gradIndigo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#6366f1" stop-opacity="0.35"/>
              <stop offset="100%" stop-color="#6366f1" stop-opacity="0.0"/>
            </linearGradient>
            <linearGradient id="gradEmerald" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#10b981" stop-opacity="0.25"/>
              <stop offset="100%" stop-color="#10b981" stop-opacity="0.0"/>
            </linearGradient>
          </defs>
          <!-- Horizontal Grid Lines -->
          <line x1="0" y1="40" x2="800" y2="40" stroke="#334155" stroke-dasharray="4 4" stroke-width="1"/>
          <line x1="0" y1="90" x2="800" y2="90" stroke="#334155" stroke-dasharray="4 4" stroke-width="1"/>
          <line x1="0" y1="140" x2="800" y2="140" stroke="#334155" stroke-dasharray="4 4" stroke-width="1"/>
          <!-- Indigo Area & Line -->
          <polygon fill="url(#gradIndigo)" points="0,170 80,140 160,110 240,130 320,80 400,95 480,60 560,75 640,40 720,55 800,30 800,200 0,200"/>
          <polyline fill="none" stroke="#6366f1" stroke-width="3" points="0,170 80,140 160,110 240,130 320,80 400,95 480,60 560,75 640,40 720,55 800,30"/>
          <!-- Emerald Area & Line -->
          <polygon fill="url(#gradEmerald)" points="0,190 80,165 160,145 240,155 320,120 400,130 480,100 560,115 640,85 720,95 800,70 800,200 0,200"/>
          <polyline fill="none" stroke="#10b981" stroke-width="2.5" points="0,190 80,165 160,145 240,155 320,120 400,130 480,100 560,115 640,85 720,95 800,70"/>
        </svg>
      </div>
    </div>

    <!-- Responsive Data Table -->
    <div class="bg-slate-800/60 border border-slate-700/80 rounded-xl overflow-hidden">
      <div class="p-4 sm:p-5 border-b border-slate-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 class="text-sm font-semibold text-white">Cluster Nodes & Status</h3>
        <input type="text" placeholder="Search clusters..." class="px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 sm:w-64">
      </div>
      <!-- Scroll container for small devices -->
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-300">
          <thead class="bg-slate-900/60 text-slate-400 font-semibold border-b border-slate-700 uppercase tracking-wider text-[11px]">
            <tr>
              <th class="py-3 px-4">Cluster ID</th>
              <th class="py-3 px-4">Region</th>
              <th class="py-3 px-4 text-right">Throughput</th>
              <th class="py-3 px-4 text-right">CPU Load</th>
              <th class="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-700/50 font-mono">
            <tr class="hover:bg-slate-800/40 transition-colors">
              <td class="py-3 px-4 font-semibold text-white">us-east-prod-01</td>
              <td class="py-3 px-4 text-slate-400">N. Virginia (AWS)</td>
              <td class="py-3 px-4 text-right text-slate-200">42,810 req/s</td>
              <td class="py-3 px-4 text-right text-emerald-400">38.4%</td>
              <td class="py-3 px-4 text-center">
                <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-sans font-medium text-emerald-300 bg-emerald-950/80 border border-emerald-800">
                  Healthy
                </span>
              </td>
            </tr>
            <tr class="hover:bg-slate-800/40 transition-colors">
              <td class="py-3 px-4 font-semibold text-white">eu-west-prod-02</td>
              <td class="py-3 px-4 text-slate-400">Frankfurt (GCP)</td>
              <td class="py-3 px-4 text-right text-slate-200">36,120 req/s</td>
              <td class="py-3 px-4 text-right text-emerald-400">44.1%</td>
              <td class="py-3 px-4 text-center">
                <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-sans font-medium text-emerald-300 bg-emerald-950/80 border border-emerald-800">
                  Healthy
                </span>
              </td>
            </tr>
            <tr class="hover:bg-slate-800/40 transition-colors">
              <td class="py-3 px-4 font-semibold text-white">ap-se-edge-03</td>
              <td class="py-3 px-4 text-slate-400">Singapore (Cloudflare)</td>
              <td class="py-3 px-4 text-right text-slate-200">19,400 req/s</td>
              <td class="py-3 px-4 text-right text-amber-400">79.2%</td>
              <td class="py-3 px-4 text-center">
                <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-sans font-medium text-amber-300 bg-amber-950/80 border border-amber-800">
                  Rebalancing
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>

  <!-- Clean Semantic Footer -->
  <footer class="border-t border-slate-800 bg-slate-900 py-6 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
      <p>&copy; 2026 PulseOps Systems Inc. Production Infrastructure Console.</p>
      <div class="flex items-center gap-6">
        <a href="#privacy" class="hover:text-slate-300">Privacy Policy</a>
        <a href="#terms" class="hover:text-slate-300">Service Terms</a>
        <a href="#support" class="hover:text-slate-300">On-Call Escalation</a>
      </div>
    </div>
  </footer>

  <!-- Script for Icons and Interactivity -->
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      // 1. Initialize Lucide Icons
      if (window.lucide) {
        lucide.createIcons();
      }

      // 2. Mobile Drawer Toggle
      const toggle = document.getElementById('mobile-toggle');
      const menu = document.getElementById('mobile-menu');
      if (toggle && menu) {
        toggle.addEventListener('click', () => {
          menu.classList.toggle('hidden');
        });
      }

      // 3. Segmented Filter Tabs
      const buttons = document.querySelectorAll('.filter-btn');
      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          buttons.forEach(b => {
            b.classList.remove('bg-indigo-600', 'text-white', 'shadow-sm');
            b.classList.add('text-slate-400');
          });
          btn.classList.remove('text-slate-400');
          btn.classList.add('bg-indigo-600', 'text-white', 'shadow-sm');
        });
      });
    });
  </script>
</body>
</html>`
  },
  {
    id: 'modern_ecommerce',
    title: 'Nordic Atelier - Minimalist E-Commerce Storefront',
    category: 'E-Commerce',
    description: 'Clean Scandinavian storefront with responsive 4-column product grid, quick-add drawer, and fluid cart badge.',
    tags: ['Product Grid', 'Cart Drawer', 'Fluid Breakpoints', 'Clean Luxury'],
    recommendedModel: 'claude',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nordic Atelier | Architectural Living</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
    .tabular-nums { font-variant-numeric: tabular-nums; }
  </style>
</head>
<body class="bg-[#FAF9F6] text-neutral-900 min-h-screen flex flex-col antialiased">
  <!-- Announcement Banner -->
  <div class="bg-neutral-900 text-white text-xs py-2 px-4 text-center font-medium">
    <span>Spring Release: Complimentary carbon-neutral courier delivery worldwide over €250</span>
  </div>

  <!-- Header -->
  <header class="border-b border-neutral-200/80 bg-[#FAF9F6]/90 backdrop-blur sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
      <!-- Zone 1: Brand -->
      <a href="/" class="text-xl font-bold tracking-tight text-neutral-950 whitespace-nowrap">
        Nordic Atelier
      </a>

      <!-- Zone 2: Navigation Links -->
      <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
        <a href="#furniture" class="hover:text-neutral-950 transition-colors">Furniture</a>
        <a href="#lighting" class="hover:text-neutral-950 transition-colors">Lighting</a>
        <a href="#objects" class="hover:text-neutral-950 transition-colors">Ceramics</a>
        <a href="#editions" class="hover:text-neutral-950 transition-colors">Limited Editions</a>
      </nav>

      <!-- Zone 3: Actions -->
      <div class="flex items-center gap-4">
        <button class="p-2 text-neutral-700 hover:text-neutral-950 rounded-full hover:bg-neutral-200/60 transition-colors" aria-label="Search">
          <i data-lucide="search" class="w-5 h-5"></i>
        </button>
        <button id="cart-toggle" class="relative p-2 text-neutral-700 hover:text-neutral-950 rounded-full hover:bg-neutral-200/60 transition-colors" aria-label="Cart">
          <i data-lucide="shopping-bag" class="w-5 h-5"></i>
          <span id="cart-count" class="absolute top-1 right-1 w-4 h-4 rounded-full bg-neutral-900 text-white text-[10px] font-bold flex items-center justify-center">2</span>
        </button>
        <button id="mobile-toggle" class="md:hidden p-2 text-neutral-700 hover:text-neutral-950 rounded-full">
          <i data-lucide="menu" class="w-5 h-5"></i>
        </button>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <div id="mobile-menu" class="hidden md:hidden border-t border-neutral-200 bg-white px-4 py-4 space-y-3">
      <a href="#furniture" class="block text-sm font-medium text-neutral-900">Furniture</a>
      <a href="#lighting" class="block text-sm font-medium text-neutral-700">Lighting</a>
      <a href="#objects" class="block text-sm font-medium text-neutral-700">Ceramics</a>
      <a href="#editions" class="block text-sm font-medium text-neutral-700">Limited Editions</a>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-12">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <div class="space-y-6 max-w-xl">
        <div class="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Collection 2026 · Series 04
        </div>
        <h1 class="text-3xl sm:text-5xl font-semibold tracking-tight text-neutral-950 leading-[1.15]" style="text-wrap: balance;">
          Forms engineered for mindful living spaces.
        </h1>
        <p class="text-neutral-600 text-sm sm:text-base leading-relaxed">
          Crafted from reclaimed Scandinavian birch, cold-cast travertine, and spun brass. Built to last generations with zero synthetic polymers.
        </p>
        <div class="flex flex-wrap gap-4 pt-2">
          <a href="#catalog" class="px-6 py-3 bg-neutral-950 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors shadow-sm">
            Explore Collection
          </a>
          <a href="#craft" class="px-6 py-3 border border-neutral-300 text-neutral-800 text-sm font-medium rounded-lg hover:bg-neutral-100 transition-colors">
            Our Materials
          </a>
        </div>
      </div>

      <!-- Hero Visual Asset using Clean Responsive SVG Pattern -->
      <div class="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-200 border border-neutral-300 flex items-center justify-center p-8">
        <div class="absolute inset-0 bg-gradient-to-tr from-stone-300 via-stone-200 to-amber-50"></div>
        <!-- Stylized Minimalist Furniture Outline -->
        <svg viewBox="0 0 400 300" class="w-full h-full relative z-10 text-neutral-800" fill="none" stroke="currentColor" stroke-width="2">
          <ellipse cx="200" cy="210" rx="140" ry="24" stroke-dasharray="4 4" class="opacity-30"/>
          <!-- Chair Silhouette -->
          <path d="M120 190 L135 70 Q140 50 160 50 L240 50 Q260 50 265 70 L280 190 Z" fill="#E5E5E1" stroke="#262626" stroke-width="2.5"/>
          <path d="M110 190 Q200 215 290 190 L275 250 L125 250 Z" fill="#D4D4CE" stroke="#262626" stroke-width="2"/>
          <line x1="140" y1="250" x2="135" y2="280" stroke-width="3"/>
          <line x1="260" y1="250" x2="265" y2="280" stroke-width="3"/>
          <!-- Table Lamp Accent -->
          <circle cx="310" cy="110" r="22" fill="#FDE68A" stroke="#262626"/>
          <path d="M310 132 L310 180" stroke-width="2.5"/>
          <path d="M295 180 L325 180" stroke-width="3"/>
        </svg>
        <span class="absolute bottom-4 left-4 z-20 text-xs font-medium text-neutral-600 bg-white/80 backdrop-blur px-2.5 py-1 rounded-md border border-neutral-200">
          Travertine Klint Lounge Chair & Spun Brass Sconce
        </span>
      </div>
    </div>
  </section>

  <!-- Product Catalog Grid -->
  <section id="catalog" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-neutral-200">
    <div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 mb-8">
      <div>
        <h2 class="text-2xl font-bold tracking-tight text-neutral-950">Curated Objects</h2>
        <p class="text-sm text-neutral-500 mt-1">Available for immediate bespoke dispatch.</p>
      </div>
      <div class="flex items-center gap-2 text-xs text-neutral-600">
        <span>Showing 4 pieces</span>
        <span aria-hidden="true">·</span>
        <span>Stock Certified</span>
      </div>
    </div>

    <!-- Responsive Grid: 1 col mobile, 2 col tablet, 4 col desktop -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Item 1 -->
      <article class="group bg-white rounded-xl border border-neutral-200 p-4 flex flex-col justify-between hover:shadow-md transition-all">
        <div class="w-full aspect-square rounded-lg bg-stone-100 flex items-center justify-center p-6 relative overflow-hidden">
          <div class="w-24 h-24 rounded-full bg-amber-200/50 border border-amber-300/80 flex items-center justify-center">
            <i data-lucide="lamp-ceiling" class="w-10 h-10 text-neutral-800"></i>
          </div>
          <span class="absolute top-2.5 left-2.5 text-[11px] font-medium text-neutral-600 bg-white/90 px-2 py-0.5 rounded">Solid Brass</span>
        </div>
        <div class="mt-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 class="text-sm font-semibold text-neutral-900 group-hover:text-amber-800 transition-colors">Aalto Pendant Luminaire</h3>
            <p class="text-xs text-neutral-500 mt-1">Spun brushed brass with diffused warm filament</p>
          </div>
          <div class="mt-4 flex items-center justify-between pt-3 border-t border-neutral-100">
            <span class="text-sm font-bold text-neutral-950 tabular-nums">€340</span>
            <button class="add-to-cart px-3 py-1.5 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-900 hover:text-white rounded-lg transition-colors">
              Add to Cart
            </button>
          </div>
        </div>
      </article>

      <!-- Item 2 -->
      <article class="group bg-white rounded-xl border border-neutral-200 p-4 flex flex-col justify-between hover:shadow-md transition-all">
        <div class="w-full aspect-square rounded-lg bg-stone-100 flex items-center justify-center p-6 relative overflow-hidden">
          <div class="w-24 h-24 rounded-2xl bg-stone-200 border border-stone-300 flex items-center justify-center">
            <i data-lucide="coffee" class="w-10 h-10 text-neutral-800"></i>
          </div>
          <span class="absolute top-2.5 left-2.5 text-[11px] font-medium text-neutral-600 bg-white/90 px-2 py-0.5 rounded">Glazed Stoneware</span>
        </div>
        <div class="mt-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 class="text-sm font-semibold text-neutral-900 group-hover:text-amber-800 transition-colors">Kallio Tea Vessel Pair</h3>
            <p class="text-xs text-neutral-500 mt-1">Wheel-thrown high-fire ceramic in raw bone glaze</p>
          </div>
          <div class="mt-4 flex items-center justify-between pt-3 border-t border-neutral-100">
            <span class="text-sm font-bold text-neutral-950 tabular-nums">€95</span>
            <button class="add-to-cart px-3 py-1.5 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-900 hover:text-white rounded-lg transition-colors">
              Add to Cart
            </button>
          </div>
        </div>
      </article>

      <!-- Item 3 -->
      <article class="group bg-white rounded-xl border border-neutral-200 p-4 flex flex-col justify-between hover:shadow-md transition-all">
        <div class="w-full aspect-square rounded-lg bg-stone-100 flex items-center justify-center p-6 relative overflow-hidden">
          <div class="w-24 h-24 rounded-lg bg-amber-100/60 border border-amber-200 flex items-center justify-center">
            <i data-lucide="layers" class="w-10 h-10 text-neutral-800"></i>
          </div>
          <span class="absolute top-2.5 left-2.5 text-[11px] font-medium text-neutral-600 bg-white/90 px-2 py-0.5 rounded">Organic Linen</span>
        </div>
        <div class="mt-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 class="text-sm font-semibold text-neutral-900 group-hover:text-amber-800 transition-colors">Vasa Woven Throw Blanket</h3>
            <p class="text-xs text-neutral-500 mt-1">Pure Gotland sheep wool, hand-fringed</p>
          </div>
          <div class="mt-4 flex items-center justify-between pt-3 border-t border-neutral-100">
            <span class="text-sm font-bold text-neutral-950 tabular-nums">€180</span>
            <button class="add-to-cart px-3 py-1.5 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-900 hover:text-white rounded-lg transition-colors">
              Add to Cart
            </button>
          </div>
        </div>
      </article>

      <!-- Item 4 -->
      <article class="group bg-white rounded-xl border border-neutral-200 p-4 flex flex-col justify-between hover:shadow-md transition-all">
        <div class="w-full aspect-square rounded-lg bg-stone-100 flex items-center justify-center p-6 relative overflow-hidden">
          <div class="w-24 h-24 rounded-full bg-stone-300/60 border border-stone-400 flex items-center justify-center">
            <i data-lucide="watch" class="w-10 h-10 text-neutral-800"></i>
          </div>
          <span class="absolute top-2.5 left-2.5 text-[11px] font-medium text-neutral-600 bg-white/90 px-2 py-0.5 rounded">Edition 50</span>
        </div>
        <div class="mt-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 class="text-sm font-semibold text-neutral-900 group-hover:text-amber-800 transition-colors">Solna Dial Chronometer</h3>
            <p class="text-xs text-neutral-500 mt-1">Automatic Swiss movement, slate minimal face</p>
          </div>
          <div class="mt-4 flex items-center justify-between pt-3 border-t border-neutral-100">
            <span class="text-sm font-bold text-neutral-950 tabular-nums">€720</span>
            <button class="add-to-cart px-3 py-1.5 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-900 hover:text-white rounded-lg transition-colors">
              Add to Cart
            </button>
          </div>
        </div>
      </article>
    </div>
  </section>

  <!-- Footer -->
  <footer class="border-t border-neutral-200 bg-white py-10 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-neutral-500">
      <p>&copy; 2026 Nordic Atelier Studio. Stockholm · Copenhagen · Oslo.</p>
      <div class="flex items-center gap-6">
        <a href="#shipping" class="hover:text-neutral-900">Courier Shipping</a>
        <a href="#sustainability" class="hover:text-neutral-900">Provenance Registry</a>
        <a href="#contact" class="hover:text-neutral-900">Client Concierge</a>
      </div>
    </div>
  </footer>

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      if (window.lucide) lucide.createIcons();
      const toggle = document.getElementById('mobile-toggle');
      const menu = document.getElementById('mobile-menu');
      if (toggle && menu) {
        toggle.addEventListener('click', () => menu.classList.toggle('hidden'));
      }
      let count = 2;
      const badge = document.getElementById('cart-count');
      document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
          count++;
          if (badge) badge.textContent = count;
          btn.textContent = 'Added ✓';
          setTimeout(() => btn.textContent = 'Add to Cart', 1500);
        });
      });
    });
  </script>
</body>
</html>`
  },
  {
    id: 'bento_portfolio',
    title: 'Elena Vance - Senior Design & Engineering Portfolio',
    category: 'Portfolio',
    description: 'Bento grid portfolio layout that gracefully reflows from 3-column asymmetric grid into clean mobile single-column stream.',
    tags: ['Bento Grid', 'Asymmetric Layout', 'Interactive Code', 'Mobile Collapsible'],
    recommendedModel: 'gpt4o',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Elena Vance | Staff Design Systems Engineer</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
    .font-mono { font-family: 'JetBrains Mono', monospace; font-variant-numeric: tabular-nums; }
  </style>
</head>
<body class="bg-neutral-950 text-neutral-100 min-h-screen flex flex-col antialiased">
  <!-- Minimalist Header -->
  <header class="border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
      <a href="/" class="text-base font-bold tracking-tight text-white whitespace-nowrap">
        elena.dev
      </a>
      <nav class="hidden md:flex items-center gap-6 text-sm text-neutral-400">
        <a href="#work" class="hover:text-white transition-colors">Case Studies</a>
        <a href="#stack" class="hover:text-white transition-colors">Technical Stack</a>
        <a href="#experience" class="hover:text-white transition-colors">Experience</a>
      </nav>
      <a href="mailto:elena@example.com" class="px-4 py-2 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg transition-colors whitespace-nowrap">
        Get in Touch
      </a>
    </div>
  </header>

  <!-- Hero Headline -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
    <div class="max-w-2xl space-y-4">
      <div class="text-xs font-mono text-emerald-400">Available for select Advisory & Staff IC Roles</div>
      <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
        Bridging the gap between high-fidelity interaction design and production code.
      </h1>
      <p class="text-neutral-400 text-sm sm:text-base leading-relaxed">
        Staff Design Engineer previously leading UI architecture at Linear and Vercel. Specialized in WebGL micro-interactions, responsive design systems, and fast typography rendering.
      </p>
    </div>

    <!-- Responsive Bento Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <!-- Bento Item 1: Major Case Study (Spans 2 cols on md+) -->
      <div class="md:col-span-2 lg:col-span-2 bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between hover:border-neutral-700 transition-colors group">
        <div>
          <div class="flex items-center justify-between text-xs text-neutral-400 font-mono">
            <span>Case Study · 2025</span>
            <span class="text-emerald-400">Published</span>
          </div>
          <h2 class="text-xl font-bold text-white mt-3 group-hover:text-emerald-300 transition-colors">
            Axiom Design System: 120+ Accessible Components for 2M Users
          </h2>
          <p class="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
            Re-architected cross-platform design token pipeline, cutting bundle size by 44% and achieving 100% WCAG AAA contrast ratio compliance.
          </p>
        </div>
        <!-- Mock UI Canvas Preview -->
        <div class="mt-6 w-full h-36 rounded-xl bg-neutral-950 border border-neutral-800 p-4 flex items-center justify-center">
          <div class="flex items-center gap-3 w-full max-w-md">
            <div class="flex-1 h-3 rounded-full bg-neutral-800 overflow-hidden">
              <div class="h-full bg-emerald-500 rounded-full w-3/4"></div>
            </div>
            <span class="text-xs font-mono text-neutral-400">0.42ms TTFB</span>
          </div>
        </div>
      </div>

      <!-- Bento Item 2: Interactive Code Snippet Card -->
      <div class="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between text-xs text-neutral-400 font-mono">
            <span>Engineering</span>
            <i data-lucide="code" class="w-4 h-4 text-neutral-400"></i>
          </div>
          <h3 class="text-base font-semibold text-white mt-3">Fluid Breakpoint Hook</h3>
          <p class="text-xs text-neutral-400 mt-1">Zero-reflow media query observer in pure TypeScript.</p>
        </div>
        <div class="mt-4 p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] font-mono text-emerald-400 overflow-x-auto">
          <code>const isMobile = useBreakpoint('(max-width: 768px)');</code>
        </div>
      </div>

      <!-- Bento Item 3: Core Stats (Spans 1 col) -->
      <div class="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between">
        <div class="text-xs text-neutral-400 font-mono">Impact Metrics</div>
        <div class="my-4 space-y-2">
          <div class="text-3xl font-bold font-mono text-white">99.8%</div>
          <div class="text-xs text-neutral-400">Accessibility test pass rate across 450 views</div>
        </div>
        <div class="text-xs text-neutral-500">Audited via axe-core & Lighthouse</div>
      </div>

      <!-- Bento Item 4: Experience Timeline (Spans 2 cols on lg) -->
      <div class="md:col-span-3 lg:col-span-2 bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-4">
        <h3 class="text-sm font-semibold text-white">Engineering Leadership</h3>
        <div class="space-y-3 text-xs">
          <div class="flex items-start justify-between border-b border-neutral-800 pb-2.5">
            <div>
              <span class="font-semibold text-neutral-200">Staff Design Engineer</span>
              <p class="text-neutral-500">Vercel · Core Frameworks</p>
            </div>
            <span class="font-mono text-neutral-400">2023 — Present</span>
          </div>
          <div class="flex items-start justify-between border-b border-neutral-800 pb-2.5">
            <div>
              <span class="font-semibold text-neutral-200">Senior UI Architect</span>
              <p class="text-neutral-500">Linear Systems</p>
            </div>
            <span class="font-mono text-neutral-400">2021 — 2023</span>
          </div>
        </div>
      </div>

      <!-- Bento Item 5: Stack & Frameworks -->
      <div class="md:col-span-3 lg:col-span-2 bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between">
        <h3 class="text-sm font-semibold text-white mb-3">Tooling & Foundations</h3>
        <div class="flex flex-wrap gap-2 text-xs font-mono">
          <span class="px-2.5 py-1 rounded bg-neutral-800 text-neutral-300">TypeScript</span>
          <span class="px-2.5 py-1 rounded bg-neutral-800 text-neutral-300">Tailwind CSS</span>
          <span class="px-2.5 py-1 rounded bg-neutral-800 text-neutral-300">React 19</span>
          <span class="px-2.5 py-1 rounded bg-neutral-800 text-neutral-300">WebGL / Three.js</span>
          <span class="px-2.5 py-1 rounded bg-neutral-800 text-neutral-300">Node / Express</span>
          <span class="px-2.5 py-1 rounded bg-neutral-800 text-neutral-300">Radix UI</span>
        </div>
        <p class="text-[11px] text-neutral-500 mt-4">100% committed to zero-runtime-overhead architecture.</p>
      </div>
    </div>
  </main>

  <footer class="border-t border-neutral-800 py-6 text-xs text-neutral-500 text-center">
    <p>&copy; 2026 Elena Vance. All templates responsive across all viewports.</p>
  </footer>

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      if (window.lucide) lucide.createIcons();
    });
  </script>
</body>
</html>`
  },
  {
    id: 'developer_docs',
    title: 'HyperScale - Responsive Developer Documentation & Sandbox',
    category: 'Docs',
    description: 'Documentation portal with responsive sidebar drawer, interactive code switcher, parameter tables, and copy actions.',
    tags: ['Sidebar Drawer', 'Code Switcher', 'API Reference', 'Accessible Tables'],
    recommendedModel: 'v0',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HyperScale API Docs | Inference Gateway</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
    .font-mono { font-family: 'JetBrains Mono', monospace; font-variant-numeric: tabular-nums; }
  </style>
</head>
<body class="bg-white text-slate-900 min-h-screen flex flex-col antialiased">
  <!-- Top Bar -->
  <header class="border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <button id="sidebar-toggle" class="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100" aria-label="Toggle Documentation Sidebar">
          <i data-lucide="menu" class="w-5 h-5"></i>
        </button>
        <span class="text-base font-bold tracking-tight text-slate-900">HyperScale</span>
        <span class="text-xs font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">Docs</span>
      </div>
      <div class="flex items-center gap-4">
        <div class="relative hidden sm:block">
          <input type="text" placeholder="Search API documentation..." class="w-64 pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600">
          <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-2.5 top-2"></i>
        </div>
        <a href="#console" class="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors">
          Developer Console
        </a>
      </div>
    </div>
  </header>

  <div class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex">
    <!-- Collapsible Sidebar (Drawer on mobile, sticky on lg) -->
    <aside id="docs-sidebar" class="hidden lg:block w-64 shrink-0 py-8 border-r border-slate-200 pr-6 space-y-6">
      <div>
        <div class="text-xs font-semibold uppercase text-slate-400 tracking-wider">Getting Started</div>
        <ul class="mt-2 space-y-1 text-xs">
          <li><a href="#quickstart" class="block py-1.5 text-slate-600 hover:text-slate-950">Quickstart Guide</a></li>
          <li><a href="#auth" class="block py-1.5 text-slate-600 hover:text-slate-950">Authentication & Keys</a></li>
          <li><a href="#rate-limits" class="block py-1.5 text-slate-600 hover:text-slate-950">Rate Limits & Quotas</a></li>
        </ul>
      </div>
      <div>
        <div class="text-xs font-semibold uppercase text-slate-400 tracking-wider">Inference Endpoints</div>
        <ul class="mt-2 space-y-1 text-xs">
          <li><a href="#generate" class="block py-1.5 font-semibold text-indigo-600 bg-indigo-50/60 rounded px-2 -mx-2">POST /v1/chat/completions</a></li>
          <li><a href="#embeddings" class="block py-1.5 text-slate-600 hover:text-slate-950">POST /v1/embeddings</a></li>
          <li><a href="#models" class="block py-1.5 text-slate-600 hover:text-slate-950">GET /v1/models</a></li>
        </ul>
      </div>
    </aside>

    <!-- Main Content Stream -->
    <main class="flex-1 py-8 lg:pl-10 space-y-8 max-w-4xl">
      <div>
        <div class="flex items-center gap-2 text-xs font-mono text-slate-500 mb-2">
          <span>Inference</span>
          <span aria-hidden="true">/</span>
          <span class="text-indigo-600">Chat & Completions</span>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <span class="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">POST</span>
          <code class="text-base font-semibold text-slate-900 font-mono">https://api.hyperscale.ai/v1/chat/completions</code>
        </div>
        <p class="text-sm text-slate-600 mt-3 leading-relaxed">
          Creates a model response for the given chat conversation. Supports real-time Server-Sent Events (SSE) streaming and tool-calling execution.
        </p>
      </div>

      <!-- Code Request Playground -->
      <div class="rounded-xl border border-slate-800 bg-slate-950 text-slate-200 overflow-hidden shadow-sm">
        <div class="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
          <div class="flex items-center gap-2 text-xs font-medium" id="code-tabs">
            <button data-lang="curl" class="tab-btn px-2.5 py-1 rounded bg-slate-800 text-white font-mono">cURL</button>
            <button data-lang="python" class="tab-btn px-2.5 py-1 rounded text-slate-400 hover:text-white font-mono">Python</button>
            <button data-lang="ts" class="tab-btn px-2.5 py-1 rounded text-slate-400 hover:text-white font-mono">TypeScript</button>
          </div>
          <button id="copy-code-btn" class="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
            <i data-lucide="copy" class="w-3.5 h-3.5"></i>
            <span>Copy</span>
          </button>
        </div>
        <pre class="p-4 text-xs font-mono overflow-x-auto text-slate-300 leading-relaxed" id="code-display"><code>curl https://api.hyperscale.ai/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $HYPERSCALE_KEY" \\
  -d '{
    "model": "hyperscale-3.8-flash",
    "messages": [
      { "role": "user", "content": "Generate a responsive HTML navigation bar." }
    ],
    "temperature": 0.7
  }'</code></pre>
      </div>

      <!-- Parameters Table (Responsive with overflow wrapper) -->
      <div class="space-y-3">
        <h3 class="text-sm font-bold text-slate-900">Request Parameters</h3>
        <div class="overflow-x-auto rounded-xl border border-slate-200">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th class="py-3 px-4">Field</th>
                <th class="py-3 px-4">Type</th>
                <th class="py-3 px-4">Required</th>
                <th class="py-3 px-4">Description</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 text-slate-700">
              <tr>
                <td class="py-3 px-4 font-mono font-semibold text-indigo-600">model</td>
                <td class="py-3 px-4 font-mono text-slate-500">string</td>
                <td class="py-3 px-4 font-semibold text-rose-600">Required</td>
                <td class="py-3 px-4">Identifier of the target model (e.g. hyperscale-3.8-flash).</td>
              </tr>
              <tr>
                <td class="py-3 px-4 font-mono font-semibold text-indigo-600">messages</td>
                <td class="py-3 px-4 font-mono text-slate-500">array</td>
                <td class="py-3 px-4 font-semibold text-rose-600">Required</td>
                <td class="py-3 px-4">List of conversation turns with role and content.</td>
              </tr>
              <tr>
                <td class="py-3 px-4 font-mono font-semibold text-indigo-600">stream</td>
                <td class="py-3 px-4 font-mono text-slate-500">boolean</td>
                <td class="py-3 px-4 text-slate-400">Optional</td>
                <td class="py-3 px-4">If set, partial message deltas will be sent as SSE.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>

  <footer class="border-t border-slate-200 py-6 text-xs text-slate-500 text-center">
    <p>&copy; 2026 HyperScale Gateway. Built for low-latency web apps.</p>
  </footer>

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      if (window.lucide) lucide.createIcons();
      const sidebarToggle = document.getElementById('sidebar-toggle');
      const sidebar = document.getElementById('docs-sidebar');
      if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
          sidebar.classList.toggle('hidden');
          sidebar.classList.toggle('fixed');
          sidebar.classList.toggle('inset-0');
          sidebar.classList.toggle('bg-white');
          sidebar.classList.toggle('z-50');
          sidebar.classList.toggle('p-6');
        });
      }
      const copyBtn = document.getElementById('copy-code-btn');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          copyBtn.innerHTML = '<span>Copied!</span>';
          setTimeout(() => {
            copyBtn.innerHTML = '<i data-lucide="copy" class="w-3.5 h-3.5"></i><span>Copy</span>';
            if (window.lucide) lucide.createIcons();
          }, 1500);
        });
      }
    });
  </script>
</body>
</html>`
  }
];
