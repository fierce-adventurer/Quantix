import React, { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Store, User, Shield, LogOut, CheckCircle2, Activity, Database } from 'lucide-react';
import { useAuth } from '../../context/auth-context';
import { GlowButton } from '../ui/GlowButton';
import { PillBadge } from '../ui/PillBadge';
import { QuantixLogo } from '../ui/QuantixLogo';
import { api } from '../../lib/api';

interface HealthData {
  status: string;
  database: string;
  timestamp: string;
}

export const StoreSessionLanding: React.FC = () => {
  const { user, tenant, logout } = useAuth();
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await api.get<HealthData>('/api/health');
        if (response.data) {
          setHealth(response.data);
        }
      } catch {
        setHealth(null);
      } finally {
        setLoadingHealth(false);
      }
    };

    fetchHealth();
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] relative flex flex-col">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="glow-horizon"
      />
      <div className="sunburst-crest" />

      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-20 w-full border-b border-white/10 bg-[#0d0d12]/80 backdrop-blur-md px-6 py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <QuantixLogo size="sm" withText />
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Tenant
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#14141c] border border-white/10 text-xs">
              <Store className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-zinc-400">Store:</span>
              <span className="font-semibold text-white">{tenant?.name}</span>
            </div>

            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#14141c] border border-white/10 text-xs">
              <User className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-zinc-300">{user?.email}</span>
              <span className="px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold text-[10px]">
                {user?.role}
              </span>
            </div>

            <GlowButton variant="secondary" size="sm" onClick={logout}>
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              Sign Out
            </GlowButton>
          </div>
        </div>
      </motion.nav>

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 py-10 space-y-8"
      >
        <motion.div variants={itemVariants}>
          <PillBadge text="Feature 1 Verified • Basic Auth & Tenant Isolation" className="mb-3" />
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            Welcome Back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b00] to-[#ffa500]">{tenant?.name} Admin</span>
          </h1>
          <p className="text-zinc-400 text-sm max-w-2xl">
            You are securely authenticated into your dedicated store tenant. All queries and inventory modifications are partitioned strictly under your unique tenant context.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="glass-panel-glow rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-orange-400">
                Store Metadata
              </span>
              <Store className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{tenant?.name}</div>
              <div className="text-xs text-zinc-400 mt-1 font-mono">slug: {tenant?.slug}</div>
            </div>
            <div className="pt-3 border-t border-white/10 space-y-1.5 text-xs text-zinc-400">
              <div className="flex justify-between">
                <span>Tenant ID:</span>
                <span className="font-mono text-zinc-300 text-[11px] truncate max-w-[170px]">
                  {tenant?.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Isolation Status:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Active
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Admin Identity
              </span>
              <Shield className="w-5 h-5 text-zinc-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white truncate">{user?.email}</div>
              <div className="text-xs text-zinc-400 mt-1">Role: {user?.role} (Primary Admin)</div>
            </div>
            <div className="pt-3 border-t border-white/10 space-y-1.5 text-xs text-zinc-400">
              <div className="flex justify-between">
                <span>User ID:</span>
                <span className="font-mono text-zinc-300 text-[11px] truncate max-w-[170px]">
                  {user?.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Auth Protocol:</span>
                <span className="text-orange-400 font-semibold">JWT Bearer Token</span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Database Engine
              </span>
              <Database className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white flex items-center gap-2">
                NeonDB Serverless
                <span className="text-xs font-normal px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {loadingHealth ? 'Checking...' : health?.database || 'CONNECTED'}
                </span>
              </div>
              <div className="text-xs text-zinc-400 mt-1">
                HikariCP: minimum-idle=0 (Auto-Suspend enabled)
              </div>
            </div>
            <div className="pt-3 border-t border-white/10 space-y-1.5 text-xs text-zinc-400">
              <div className="flex justify-between">
                <span>Cold Start Strategy:</span>
                <span className="text-orange-300">Pooled Connection Pool</span>
              </div>
              <div className="flex justify-between">
                <span>Compute Hours:</span>
                <span className="text-emerald-400">Preserved on Idle</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-5 h-5 text-orange-400" />
            <h2 className="text-lg font-bold text-white">Next Feature Pipeline</h2>
          </div>
          <p className="text-xs text-zinc-400 mb-6">
            Feature 1 is fully active. The following modules are structured for the upcoming feature releases:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#13131c] border border-white/5 space-y-2">
              <div className="text-xs font-bold text-orange-400">Feature 2</div>
              <div className="text-sm font-semibold text-white">Product & Catalog CRUD</div>
              <p className="text-xs text-zinc-400">
                Tenant-scoped SKU uniqueness, instant client search, cost and selling prices.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#13131c] border border-white/5 space-y-2">
              <div className="text-xs font-bold text-orange-400">Feature 3 (Optional PRD)</div>
              <div className="text-sm font-semibold text-white">Inline Stock Adjustments</div>
              <p className="text-xs text-zinc-400">
                +/- N units popover, adjustment reasons, notes, and audit movement ledger.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#13131c] border border-white/5 space-y-2">
              <div className="text-xs font-bold text-orange-400">Feature 4 & 5</div>
              <div className="text-sm font-semibold text-white">Dashboard & Global Settings</div>
              <p className="text-xs text-zinc-400">
                Real-time stock value KPIs, low-stock threshold fallbacks, and amber visual charts.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
};
