import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  ShieldCheck,
  History,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  FileText,
  Zap,
  Sun,
  Moon,
  X,
  Lock,
  Sparkles,
} from 'lucide-react';
import { QuantixLogo } from '../ui/QuantixLogo';
import { GlowButton } from '../ui/GlowButton';
import { PillBadge } from '../ui/PillBadge';
import { LoginPage } from '../auth/LoginPage';
import { SignupPage } from '../auth/SignupPage';
import { useTheme } from '../../context/theme-context';

type AuthViewMode = 'landing' | 'login' | 'signup';
type DocTab = 'getting-started' | 'logging' | 'telemetry' | 'security';

export const LandingPageView: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  const [authMode, setAuthMode] = useState<AuthViewMode>('landing');
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [activeDocTab, setActiveDocTab] = useState<DocTab>('getting-started');

  const [demoHoveredPoint, setDemoHoveredPoint] = useState<number | null>(4);

  const demoPoints = [
    { label: 'Oct 28', profit: 4200, revenue: 11400, margin: 36.8 },
    { label: 'Oct 29', profit: 4850, revenue: 12900, margin: 37.6 },
    { label: 'Oct 30', profit: 5400, revenue: 14200, margin: 38.0 },
    { label: 'Oct 31', profit: 6200, revenue: 16100, margin: 38.5 },
    { label: 'Nov 1', profit: 7100, revenue: 18200, margin: 39.0 },
    { label: 'Today', profit: 8450, revenue: 21400, margin: 39.5 },
  ];

  const activeDemo = demoHoveredPoint !== null ? demoPoints[demoHoveredPoint] : demoPoints[demoPoints.length - 1];

  const features = [
    {
      icon: <TrendingUp className="w-5 h-5 text-orange-400" />,
      title: 'Real-Time Linear Profit Spline',
      description:
        'Computes net profit potential, gross margin %, and inventory velocity across real calendar intervals without synthetic estimates.',
      tag: 'FINANCIAL TELEMETRY',
    },
    {
      icon: <History className="w-5 h-5 text-emerald-400" />,
      title: 'Immutable Stock Audit Trail',
      description:
        'Every unit shift is stamped with user identity, previous count, quantity delta, reason note, and exact valuation impact.',
      tag: 'GOVERNANCE & AUDIT',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-blue-400" />,
      title: 'Zero-Leak Multi-Tenant Isolation',
      description:
        'Cryptographically segmented tenant contexts on Neon PostgreSQL ensure your catalog and profit telemetry are permanently isolated.',
      tag: 'SECURITY ARCHITECTURE',
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
      title: 'Velocity Early Warning Radar',
      description:
        'Dynamic thresholds monitor inventory depletion rates to notify you before high-margin products hit critical stockout points.',
      tag: 'MARGIN PRESERVATION',
    },
  ];

  const docsContent: Record<
    DocTab,
    { title: string; subtitle: string; icon: React.ReactNode; sections: { heading: string; text: string }[] }
  > = {
    'getting-started': {
      title: 'Getting Started with Quantix',
      subtitle: 'From registration to live inventory telemetry in under 60 seconds.',
      icon: <Zap className="w-5 h-5 text-orange-400" />,
      sections: [
        {
          heading: '1. Store Workspace Initialization',
          text: 'Sign up to create your dedicated store tenant. Quantix creates an isolated logical cluster with scoped schema constraints.',
        },
        {
          heading: '2. Currency & Regional Configuration',
          text: 'Specify your store currency (USD, EUR, GBP, INR, JPY, CAD, AUD) to power all valuation calculations and default low-stock thresholds.',
        },
        {
          heading: '3. Adding Catalog Products',
          text: 'Enter product details with cost price, selling price, and stock on hand. Quantix immediately logs the initial stock event into the immutable audit trail.',
        },
        {
          heading: '4. Reading Real-Time Telemetry',
          text: 'Navigate to your dashboard to inspect your live spline profit curve, inventory valuation, and depletion monitors.',
        },
      ],
    },
    logging: {
      title: 'Stock Movement Auditing & Logging',
      subtitle: 'Complete accountability for every single unit entering or leaving the store.',
      icon: <FileText className="w-5 h-5 text-emerald-400" />,
      sections: [
        {
          heading: 'Reason Codes & Categories',
          text: 'Quantix categorizes all adjustments with verified presets: "Supplier Delivery", "Store Sale", "Damaged / Loss", "Physical Inventory Count", and "Return to Stock". Custom operational notes are supported.',
        },
        {
          heading: 'Unit Transition Tracing',
          text: 'Every log records previous count -> resulting count alongside positive or negative unit deltas to eliminate discrepancies.',
        },
        {
          heading: 'User Identity & Timestamps',
          text: 'Changes are bound to the authenticated user token and recorded with millisecond-precision UTC timestamps.',
        },
      ],
    },
    telemetry: {
      title: 'Mathematical Profit Telemetry',
      subtitle: 'Accurate profit and valuation calculations driven strictly by real calendar dates.',
      icon: <TrendingUp className="w-5 h-5 text-amber-400" />,
      sections: [
        {
          heading: 'Net Profit Potential Formulation',
          text: 'Calculated dynamically as the sum of (Selling Price - Cost Price) multiplied by active quantity on hand across catalog items.',
        },
        {
          heading: 'Gross Margin Percentage',
          text: 'Computed as (Net Profit / Gross Inventory Valuation) * 100, tracking whether catalog profitability is expanding or contracting.',
        },
        {
          heading: 'Historical Time Intervals',
          text: 'Quantix generates real calendar checkpoints (7D, 30D, QTD, ALL) reflecting real-world inventory states on those exact dates.',
        },
      ],
    },
    security: {
      title: 'Zero-Leak Multi-Tenant Security',
      subtitle: 'Enterprise-grade isolation powered by Neon PostgreSQL serverless architecture.',
      icon: <Lock className="w-5 h-5 text-blue-400" />,
      sections: [
        {
          heading: 'Cryptographic Tenant Context',
          text: 'Every API request carries an authenticated JWT bearing the tenantId. Thread-local contexts and database foreign keys prevent cross-tenant queries.',
        },
        {
          heading: 'Serverless NeonDB Pooling',
          text: 'Integrated with Neon connection poolers and cold-start resilience to ensure zero data co-mingling and optimal resource efficiency.',
        },
        {
          heading: 'Stateless JWT Session Management',
          text: 'Signed HMAC-SHA256 tokens authenticate requests with zero server-side state exposure.',
        },
      ],
    },
  };

  return (
    <div
      className={`min-h-screen flex flex-col relative ambient-grid overflow-y-auto selection:bg-[#ff6b00]/30 selection:text-white ${
        isLight ? 'bg-[#fafafa] text-zinc-900' : 'bg-[#09090b] text-[#f4f4f5]'
      }`}
    >
      <div className="glow-horizon" />
      <div className="sunburst-crest" />

      <header
        className={`sticky top-0 z-40 w-full border-b backdrop-blur-xl transition-colors ${
          isLight ? 'bg-white/85 border-zinc-200/80 shadow-sm' : 'bg-[#09090b]/85 border-white/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <button onClick={() => setAuthMode('landing')} className="flex items-center">
              <QuantixLogo size="sm" withText />
            </button>

            {authMode === 'landing' && (
              <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
                <button
                  onClick={() => {
                    setActiveDocTab('getting-started');
                    setIsDocsOpen(true);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                    isLight
                      ? 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                      : 'text-zinc-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-orange-400" />
                  <span>Getting Started</span>
                </button>

                <button
                  onClick={() => {
                    setActiveDocTab('telemetry');
                    setIsDocsOpen(true);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                    isLight
                      ? 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                      : 'text-zinc-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Telemetry</span>
                </button>

                <button
                  onClick={() => {
                    setActiveDocTab('logging');
                    setIsDocsOpen(true);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                    isLight
                      ? 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                      : 'text-zinc-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span>Logging & Audit</span>
                </button>

                <button
                  onClick={() => {
                    setActiveDocTab('security');
                    setIsDocsOpen(true);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                    isLight
                      ? 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                      : 'text-zinc-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Security</span>
                </button>

                <button
                  onClick={() => setIsDocsOpen(true)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-500/10 text-[#ff6b00] border border-orange-500/25 ml-2 hover:bg-orange-500/20 transition-colors flex items-center gap-1"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>Documentation</span>
                </button>
              </nav>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-colors ${
                isLight
                  ? 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-700'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-amber-400'
              }`}
              title={`Switch to ${isLight ? 'Obsidian Dark' : 'Obsidian Light'}`}
              aria-label="Toggle Theme"
            >
              {isLight ? <Moon className="w-4 h-4 text-orange-500" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {authMode === 'landing' ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAuthMode('login')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    isLight
                      ? 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-800 shadow-sm'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                  }`}
                >
                  Sign In
                </button>

                <GlowButton onClick={() => setAuthMode('signup')} size="sm">
                  <span>Launch Store</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </GlowButton>
              </div>
            ) : (
              <button
                onClick={() => setAuthMode('landing')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  isLight
                    ? 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-700'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-200'
                }`}
              >
                &larr; Overview
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {authMode === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col items-center justify-center p-4 py-8"
            >
              <LoginPage onGoToSignup={() => setAuthMode('signup')} />
            </motion.div>
          )}

          {authMode === 'signup' && (
            <motion.div
              key="signup"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col items-center justify-center p-4 py-8"
            >
              <SignupPage onGoToLogin={() => setAuthMode('login')} />
            </motion.div>
          )}

          {authMode === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-20 w-full"
            >
              <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
                <div className="flex-1 text-center lg:text-left space-y-6">
                  <div className="inline-flex">
                    <PillBadge
                      tag="NEXT-GEN"
                      text="High-Velocity Multi-Tenant Inventory Control"
                      className="mx-auto lg:mx-0"
                    />
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08]">
                    Real-Time{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4500] via-[#ff6b00] to-[#ffa500]">
                      Spline Profit
                    </span>{' '}
                    Telemetry for Modern Stores
                  </h1>

                  <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                    Quantix delivers mathematical inventory valuation, immutable stock movement auditing, and
                    cryptographic multi-tenant isolation on Neon PostgreSQL. Track every unit shift with zero friction.
                  </p>

                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                    <GlowButton onClick={() => setAuthMode('signup')} size="lg">
                      <Sparkles className="w-4 h-4 mr-2 text-white" />
                      <span>Launch Your Store Free</span>
                    </GlowButton>

                    <button
                      onClick={() => setAuthMode('login')}
                      className={`px-5 py-3 rounded-2xl text-xs font-bold border transition-all ${
                        isLight
                          ? 'bg-white hover:bg-zinc-50 border-zinc-300 text-zinc-800 shadow-sm'
                          : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                      }`}
                    >
                      Sign In to Workspace
                    </button>

                    <button
                      onClick={() => setIsDocsOpen(true)}
                      className="px-4 py-3 rounded-2xl text-xs font-semibold text-[#ff6b00] hover:underline flex items-center gap-1.5"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Interactive Docs</span>
                    </button>
                  </div>
                </div>

                <div className="flex-1 max-w-lg w-full">
                  <div
                    className={`rounded-3xl border p-6 sm:p-7 backdrop-blur-2xl shadow-2xl relative overflow-hidden transition-all ${
                      isLight
                        ? 'bg-white/90 border-orange-200/80 shadow-orange-500/10'
                        : 'bg-[#101018]/90 border-orange-500/20 shadow-black/80'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-4 border-b border-white/5">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 block">
                          Interactive Telemetry Preview
                        </span>
                        <h4 className={`text-xl font-black mt-0.5 ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                          ${activeDemo.profit.toLocaleString()} Net Profit
                        </h4>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-zinc-500 block uppercase font-mono">Gross Margin</span>
                        <span className="text-sm font-bold text-emerald-400">+{activeDemo.margin}%</span>
                      </div>
                    </div>

                    <div className="py-6">
                      <svg viewBox="0 0 400 120" className="w-full h-28 overflow-visible">
                        <defs>
                          <linearGradient id="demoSplineGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ff6b00" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#ff4500" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M 20 90 C 80 80, 140 60, 200 45 C 260 30, 320 20, 380 12 L 380 110 L 20 110 Z"
                          fill="url(#demoSplineGrad)"
                        />
                        <path
                          d="M 20 90 C 80 80, 140 60, 200 45 C 260 30, 320 20, 380 12"
                          fill="none"
                          stroke="#ff6b00"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                        {demoPoints.map((_, i) => {
                          const x = 20 + (i / (demoPoints.length - 1)) * 360;
                          const y = 90 - (i / (demoPoints.length - 1)) * 78;
                          const isHov = demoHoveredPoint === i;
                          return (
                            <g key={i} className="cursor-pointer" onMouseEnter={() => setDemoHoveredPoint(i)}>
                              <circle
                                cx={x}
                                cy={y}
                                r={isHov ? 7 : 4}
                                fill={isHov ? '#ffffff' : '#ff6b00'}
                                stroke="#ffa500"
                                strokeWidth={isHov ? 3 : 1.5}
                                className="transition-all"
                              />
                            </g>
                          );
                        })}
                      </svg>

                      <div className="flex justify-between text-[11px] font-mono text-zinc-500 mt-2 px-1">
                        {demoPoints.map((pt, i) => (
                          <span
                            key={i}
                            className={`cursor-pointer transition-colors ${
                              demoHoveredPoint === i ? 'text-[#ff6b00] font-bold' : ''
                            }`}
                            onMouseEnter={() => setDemoHoveredPoint(i)}
                          >
                            {pt.label}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                        isLight ? 'bg-orange-50/50 border-orange-200' : 'bg-white/5 border-white/5'
                      }`}
                    >
                      <span className="text-zinc-400">Checkpoint: {activeDemo.label}</span>
                      <span className="font-bold text-zinc-300">Revenue: ${activeDemo.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="text-center max-w-2xl mx-auto space-y-3">
                  <span className="text-xs font-bold tracking-widest uppercase text-[#ff6b00]">
                    ARCHITECTURAL CAPABILITIES
                  </span>
                  <h2 className={`text-2xl sm:text-3xl font-extrabold ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                    Engineered for Precision, Velocity & Absolute Isolation
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    Explore the four core engines powering Quantix retail and store intelligence.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {features.map((feat, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      className={`rounded-2xl border p-6 backdrop-blur-xl transition-all ${
                        isLight
                          ? 'bg-white border-zinc-200 shadow-sm hover:shadow-md hover:border-orange-300'
                          : 'bg-[#101018]/80 border-white/5 hover:border-orange-500/30 hover:bg-[#141420]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                          {feat.icon}
                        </div>
                        <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-500 font-mono">
                          {feat.tag}
                        </span>
                      </div>
                      <h3 className={`text-base font-bold mb-2 ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                        {feat.title}
                      </h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">{feat.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div
                className={`rounded-3xl border p-8 backdrop-blur-2xl text-center space-y-6 relative overflow-hidden ${
                  isLight
                    ? 'bg-gradient-to-r from-orange-500/10 via-white to-orange-500/10 border-orange-200'
                    : 'bg-gradient-to-r from-orange-500/10 via-[#0e0e14] to-orange-500/10 border-orange-500/20'
                }`}
              >
                <div className="max-w-xl mx-auto space-y-3">
                  <h3 className={`text-2xl font-black ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                    Ready to Accelerate Your Store Velocity?
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    Launch your workspace in seconds with automated multi-tenant database provisioning.
                  </p>
                  <div className="pt-2">
                    <GlowButton onClick={() => setAuthMode('signup')} size="lg">
                      <span>Create Workspace Now</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </GlowButton>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {isDocsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDocsOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className={`relative z-10 w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] ${
                isLight ? 'bg-white border-zinc-200' : 'bg-[#0f0f16] border-white/10'
              }`}
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#ff6b00]">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`text-base font-bold ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                      Quantix Developer & Operations Docs
                    </h3>
                    <p className="text-xs text-zinc-400">Complete architectural guide, stock audit rules, and telemetry formulas.</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsDocsOpen(false)}
                  className={`p-2 rounded-xl border transition-colors ${
                    isLight ? 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-600' : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-400'
                  }`}
                  aria-label="Close Documentation"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex border-b border-white/5 overflow-x-auto p-2 gap-1.5 no-scrollbar">
                {(['getting-started', 'logging', 'telemetry', 'security'] as DocTab[]).map((tab) => {
                  const active = activeDocTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveDocTab(tab)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                        active
                          ? 'bg-gradient-to-r from-[#ff4500] to-[#ffa500] text-white border-transparent shadow-md shadow-orange-500/20'
                          : isLight
                          ? 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:bg-zinc-200'
                          : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {tab === 'getting-started' && '1. Getting Started'}
                      {tab === 'logging' && '2. Logging & Audit'}
                      {tab === 'telemetry' && '3. Profit Telemetry'}
                      {tab === 'security' && '4. NeonDB Security'}
                    </button>
                  );
                })}
              </div>

              <div className="p-6 overflow-y-auto space-y-6">
                <div>
                  <h4 className={`text-lg font-bold flex items-center gap-2 ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                    {docsContent[activeDocTab].icon}
                    <span>{docsContent[activeDocTab].title}</span>
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1">{docsContent[activeDocTab].subtitle}</p>
                </div>

                <div className="space-y-4">
                  {docsContent[activeDocTab].sections.map((sec, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border ${
                        isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-white/5 border-white/5'
                      }`}
                    >
                      <h5 className={`text-xs font-bold mb-1 ${isLight ? 'text-zinc-900' : 'text-orange-400'}`}>
                        {sec.heading}
                      </h5>
                      <p className="text-xs text-zinc-400 leading-relaxed">{sec.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-zinc-500">Press Esc or click outside to close</span>
                <GlowButton
                  size="sm"
                  onClick={() => {
                    setIsDocsOpen(false);
                    setAuthMode('signup');
                  }}
                >
                  <span>Launch Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </GlowButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
