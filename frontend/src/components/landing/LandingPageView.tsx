import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  ShieldCheck,
  History,
  ArrowRight,
  FileText,
  Zap,
  Sun,
  Moon,
  Lock,
  Sparkles,
  Database,
} from 'lucide-react';
import { QuantixLogo } from '../ui/QuantixLogo';
import { GlowButton } from '../ui/GlowButton';
import { PillBadge } from '../ui/PillBadge';
import { LoginPage } from '../auth/LoginPage';
import { SignupPage } from '../auth/SignupPage';
import { useTheme } from '../../context/theme-context';

type AuthViewMode = 'landing' | 'login' | 'signup';

export const LandingPageView: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  const [authMode, setAuthMode] = useState<AuthViewMode>('landing');
  const [demoHoveredPoint, setDemoHoveredPoint] = useState<number | null>(4);

  const demoPoints = [
    { label: 'Oct 28', profit: 4200, revenue: 11400, margin: 36.8 },
    { label: 'Oct 29', profit: 4850, revenue: 12900, margin: 37.6 },
    { label: 'Oct 30', profit: 5400, revenue: 14200, margin: 38.0 },
    { label: 'Oct 31', profit: 6200, revenue: 16100, margin: 38.5 },
    { label: 'Nov 1', profit: 7100, revenue: 18200, margin: 39.0 },
    { label: 'Today', profit: 8450, revenue: 21400, margin: 39.5 },
  ];

  const activeDemo =
    demoHoveredPoint !== null ? demoPoints[demoHoveredPoint] : demoPoints[demoPoints.length - 1];

  const scrollToSection = (id: string) => {
    if (authMode !== 'landing') {
      setAuthMode('landing');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const gettingStartedSteps = [
    {
      step: '01',
      title: 'Store Workspace Initialization',
      desc: 'Create your dedicated store tenant with automated schema provisioning and encrypted isolation on Neon PostgreSQL.',
    },
    {
      step: '02',
      title: 'Regional Currency & Safety Thresholds',
      desc: 'Set your primary currency (USD, EUR, GBP, INR, JPY, CAD, AUD) and global safety threshold to calibrate depletion monitors.',
    },
    {
      step: '03',
      title: 'Catalog Ingestion & Initial Audit Stamp',
      desc: 'Add products with cost price, selling price, and stock on hand. Quantix automatically commits an initial audit movement log.',
    },
    {
      step: '04',
      title: 'Live Spline Profit Telemetry',
      desc: 'Monitor real-time linear profit curves, gross margin expansion, and inventory velocity across real calendar intervals.',
    },
  ];

  const auditReasonCodes = [
    {
      reason: 'Supplier Delivery',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      desc: 'Inflow batches incrementing available stock with supplier order notes and unit cost attribution.',
    },
    {
      reason: 'Store Sale',
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      desc: 'Point-of-sale or online customer order fulfillment decrementing stock and realizing gross margin.',
    },
    {
      reason: 'Damaged / Loss',
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      desc: 'Discrepancy write-offs, shrinkage, or damaged goods logged with authenticated user stamps.',
    },
    {
      reason: 'Physical Inventory Count',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      desc: 'Periodic manual cycle count recalibrations reconciling theoretical stock with shelf reality.',
    },
    {
      reason: 'Return to Stock',
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      desc: 'Customer returns or order cancellations restoring active inventory on hand.',
    },
  ];

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
                  onClick={() => scrollToSection('getting-started')}
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
                  onClick={() => scrollToSection('telemetry')}
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
                  onClick={() => scrollToSection('logging')}
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
                  onClick={() => scrollToSection('security')}
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
                  onClick={() => scrollToSection('about')}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                    isLight
                      ? 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                      : 'text-zinc-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                  <span>About</span>
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
                &larr; Back to Overview
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
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-24 w-full"
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

              <section id="getting-started" className="scroll-mt-24 space-y-8">
                <div className="text-center max-w-2xl mx-auto space-y-3">
                  <span className="text-xs font-bold tracking-widest uppercase text-[#ff6b00]">
                    FAST ONBOARDING
                  </span>
                  <h2 className={`text-2xl sm:text-3xl font-extrabold ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                    Getting Started in Under 60 Seconds
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    Follow four streamlined steps to take your store from initial signup to full inventory velocity telemetry.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {gettingStartedSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className={`rounded-2xl border p-6 backdrop-blur-xl transition-all relative ${
                        isLight
                          ? 'bg-white border-zinc-200 shadow-sm hover:border-orange-300'
                          : 'bg-[#101018]/80 border-white/5 hover:border-orange-500/30'
                      }`}
                    >
                      <span className="text-3xl font-black text-orange-500/30 font-mono block mb-2">
                        {step.step}
                      </span>
                      <h3 className={`text-sm font-bold mb-2 ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                        {step.title}
                      </h3>
                      <p className="text-xs text-zinc-400 leading-relaxed font-normal">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section id="telemetry" className="scroll-mt-24 space-y-8">
                <div className="text-center max-w-2xl mx-auto space-y-3">
                  <span className="text-xs font-bold tracking-widest uppercase text-emerald-400">
                    FINANCIAL TELEMETRY
                  </span>
                  <h2 className={`text-2xl sm:text-3xl font-extrabold ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                    Mathematical Profit Splines & Calendar Intervals
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    Quantix replaces arbitrary estimates with strict mathematical calculations derived directly from product margins and stock movements.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div
                    className={`rounded-2xl border p-6 backdrop-blur-xl ${
                      isLight ? 'bg-white border-zinc-200' : 'bg-[#101018]/80 border-white/5'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#ff6b00] mb-4">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <h3 className={`text-sm font-bold mb-2 ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                      Net Profit Potential Formula
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                      Calculated dynamically as the sum of (Selling Price - Cost Price) multiplied by active units on hand across your catalog.
                    </p>
                    <code className="text-[11px] font-mono px-2.5 py-1 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 block">
                      Profit = &Sigma; (Sell - Cost) &times; Qty
                    </code>
                  </div>

                  <div
                    className={`rounded-2xl border p-6 backdrop-blur-xl ${
                      isLight ? 'bg-white border-zinc-200' : 'bg-[#101018]/80 border-white/5'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className={`text-sm font-bold mb-2 ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                      Gross Margin Percentage
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                      Reveals the overall financial health of your inventory by dividing cumulative profit potential by total gross valuation.
                    </p>
                    <code className="text-[11px] font-mono px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 block">
                      Margin% = (Profit / Revenue) &times; 100
                    </code>
                  </div>

                  <div
                    className={`rounded-2xl border p-6 backdrop-blur-xl ${
                      isLight ? 'bg-white border-zinc-200' : 'bg-[#101018]/80 border-white/5'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                      <History className="w-5 h-5" />
                    </div>
                    <h3 className={`text-sm font-bold mb-2 ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                      Real Calendar Checkpoints
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                      Checkpoints across 7D, 30D, QTD, and ALL are computed from actual creation dates and historical stock adjustments.
                    </p>
                    <span className="text-[11px] font-mono text-zinc-500 block">
                      Strictly 0% synthetic multipliers
                    </span>
                  </div>
                </div>
              </section>

              <section id="logging" className="scroll-mt-24 space-y-8">
                <div className="text-center max-w-2xl mx-auto space-y-3">
                  <span className="text-xs font-bold tracking-widest uppercase text-blue-400">
                    AUDIT & TRACEABILITY
                  </span>
                  <h2 className={`text-2xl sm:text-3xl font-extrabold ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                    Immutable Stock Movement Logging
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    Every unit shift is stamped with user identity, previous count, quantity delta, and unit valuation impact.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {auditReasonCodes.map((item, idx) => (
                    <div
                      key={idx}
                      className={`rounded-2xl border p-5 backdrop-blur-xl ${
                        isLight ? 'bg-white border-zinc-200' : 'bg-[#101018]/80 border-white/5'
                      }`}
                    >
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border inline-block mb-3 ${item.color}`}>
                        {item.reason}
                      </span>
                      <p className="text-xs text-zinc-400 leading-relaxed font-normal">{item.desc}</p>
                    </div>
                  ))}
                  <div
                    className={`rounded-2xl border p-5 backdrop-blur-xl flex flex-col justify-center ${
                      isLight ? 'bg-orange-50/40 border-orange-200' : 'bg-orange-500/5 border-orange-500/20'
                    }`}
                  >
                    <span className="text-xs font-bold text-[#ff6b00] block mb-1">Audit Trail Guarantee</span>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      All events are cryptographically isolated per tenant and queryable via dedicated audit endpoints.
                    </p>
                  </div>
                </div>
              </section>

              <section id="security" className="scroll-mt-24 space-y-8">
                <div className="text-center max-w-2xl mx-auto space-y-3">
                  <span className="text-xs font-bold tracking-widest uppercase text-amber-400">
                    SECURITY ARCHITECTURE
                  </span>
                  <h2 className={`text-2xl sm:text-3xl font-extrabold ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                    Zero-Leak Multi-Tenant Isolation on NeonDB
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    Enterprise-grade logical tenant separation backed by Neon serverless PostgreSQL connection poolers.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div
                    className={`rounded-2xl border p-6 backdrop-blur-xl ${
                      isLight ? 'bg-white border-zinc-200' : 'bg-[#101018]/80 border-white/5'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#ff6b00] mb-4">
                      <Lock className="w-5 h-5" />
                    </div>
                    <h3 className={`text-sm font-bold mb-2 ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                      Thread-Local Context Guard
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Authenticated requests bind tenant identity into thread-local memory. Cross-tenant leakage is prevented at runtime.
                    </p>
                  </div>

                  <div
                    className={`rounded-2xl border p-6 backdrop-blur-xl ${
                      isLight ? 'bg-white border-zinc-200' : 'bg-[#101018]/80 border-white/5'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                      <Database className="w-5 h-5" />
                    </div>
                    <h3 className={`text-sm font-bold mb-2 ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                      Serverless NeonDB Pooling
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Optimized for cold-start performance, pooling maintains scalable PostgreSQL connections across bursty workloads.
                    </p>
                  </div>

                  <div
                    className={`rounded-2xl border p-6 backdrop-blur-xl ${
                      isLight ? 'bg-white border-zinc-200' : 'bg-[#101018]/80 border-white/5'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h3 className={`text-sm font-bold mb-2 ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                      Stateless HMAC JWT Tokens
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Cryptographically signed bearer tokens protect store access with zero risk of session hijacking or server-side leaks.
                    </p>
                  </div>
                </div>
              </section>

              <section id="about" className="scroll-mt-24 space-y-8">
                <div className="text-center max-w-2xl mx-auto space-y-3">
                  <span className="text-xs font-bold tracking-widest uppercase text-[#ff6b00]">
                    ABOUT QUANTIX
                  </span>
                  <h2 className={`text-2xl sm:text-3xl font-extrabold ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                    The High-Velocity Inventory Operating System
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    Quantix was designed from the ground up for retailers, wholesalers, and e-commerce stores requiring millisecond margin transparency and zero inventory drift.
                  </p>
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
                      Ready to Scale Your Store Velocity?
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400">
                      Launch your store workspace in seconds with automated multi-tenant database provisioning.
                    </p>
                    <div className="pt-2">
                      <GlowButton onClick={() => setAuthMode('signup')} size="lg">
                        <span>Launch Your Store Free</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </GlowButton>
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
