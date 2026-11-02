import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Store,
  Moon,
  Sun,
  ShieldCheck,
  Check,
  AlertCircle,
  Copy,
  CheckCircle2,
  Palette,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/auth-context';
import { useTheme, Theme } from '../../context/theme-context';
import { api } from '../../lib/api';
import { getStoredStoreCurrency, CURRENCY_OPTIONS, getCurrencySymbol } from '../../types/product';
import { GlowButton } from '../ui/GlowButton';

interface SettingsViewProps {
  onSettingsUpdated?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onSettingsUpdated }) => {
  const { tenant, user } = useAuth();
  const { theme, setTheme } = useTheme();
  const isLight = theme === 'light';

  const [storeName, setStoreName] = useState(tenant?.name || '');
  const [defaultThreshold, setDefaultThreshold] = useState<number>(
    tenant?.defaultLowStockThreshold !== undefined ? tenant.defaultLowStockThreshold : 5
  );
  const [currency, setCurrency] = useState(tenant?.currency || getStoredStoreCurrency());
  const [copiedTenantId, setCopiedTenantId] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (tenant) {
      setStoreName(tenant.name);
      if (tenant.defaultLowStockThreshold !== undefined) {
        setDefaultThreshold(tenant.defaultLowStockThreshold);
      }
      if (tenant.currency) {
        setCurrency(tenant.currency);
      }
    }
  }, [tenant]);

  const handleCopyTenantId = () => {
    if (tenant?.id) {
      navigator.clipboard.writeText(tenant.id);
      setCopiedTenantId(true);
      setTimeout(() => setCopiedTenantId(false), 2000);
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!storeName.trim()) {
      setErrorMessage('Store name cannot be blank');
      return;
    }

    if (defaultThreshold < 0) {
      setErrorMessage('Default low stock threshold cannot be negative');
      return;
    }

    setIsSaving(true);
    try {
      await api.put('/api/settings', {
        name: storeName.trim(),
        defaultLowStockThreshold: defaultThreshold,
        currency: currency.trim() || 'USD',
        theme: theme,
      });

      localStorage.setItem('quantix_store_currency', currency);
      localStorage.setItem('quantix_theme', theme);

      setSuccessMessage('Store settings and theme preferences updated successfully');
      setTimeout(() => setSuccessMessage(null), 3500);

      if (onSettingsUpdated) {
        onSettingsUpdated();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to update store settings');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isLight ? 'text-zinc-900' : 'text-white'}`}>
          Store Settings
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Configure store partition identity, global low stock triggers, theme appearance, and currency.
        </p>
      </div>

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </motion.div>
      )}

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </motion.div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className={`p-6 rounded-3xl border ${
          isLight ? 'bg-white border-zinc-200 shadow-sm' : 'bg-[#121218] border-white/10'
        } space-y-5`}>
          <div className="flex items-center gap-2.5 pb-4 border-b border-white/10">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h2 className={`text-base font-bold ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                Theme Appearance
              </h2>
              <p className="text-xs text-zinc-400">
                Choose between Obsidian Dark and Obsidian Light (White & Orange) workspace theme.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => handleThemeChange('dark')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                theme === 'dark'
                  ? 'border-[#ff6b00] bg-orange-500/10 shadow-lg shadow-orange-950/30'
                  : isLight
                  ? 'border-zinc-200 hover:border-zinc-300 bg-zinc-50'
                  : 'border-white/10 hover:border-white/20 bg-[#09090b]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-bold text-white">Obsidian Dark</span>
                </div>
                {theme === 'dark' && (
                  <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px]">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mb-3">
                Deep obsidian (#09090b) glass panels with vibrant glowing amber highlights.
              </p>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#09090b] border border-white/10">
                <div className="w-3 h-3 rounded-full bg-[#ff6b00]" />
                <div className="w-3 h-3 rounded-full bg-[#ffa500]" />
                <div className="w-3 h-3 rounded-full bg-[#14141c]" />
                <div className="w-3 h-3 rounded-full bg-[#09090b]" />
              </div>
            </div>

            <div
              onClick={() => handleThemeChange('light')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                theme === 'light'
                  ? 'border-[#ff6b00] bg-orange-500/10 shadow-lg shadow-orange-500/10'
                  : isLight
                  ? 'border-zinc-200 hover:border-zinc-300 bg-white'
                  : 'border-white/10 hover:border-white/20 bg-[#161620]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-orange-500" />
                  <span className={`text-sm font-bold ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                    Obsidian Light
                  </span>
                </div>
                {theme === 'light' && (
                  <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px]">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mb-3">
                Crisp white panels with energetic orange accents and high-contrast typography.
              </p>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-zinc-200">
                <div className="w-3 h-3 rounded-full bg-[#ff6b00]" />
                <div className="w-3 h-3 rounded-full bg-[#ffa500]" />
                <div className="w-3 h-3 rounded-full bg-zinc-200" />
                <div className="w-3 h-3 rounded-full bg-white border border-zinc-300" />
              </div>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-3xl border ${
          isLight ? 'bg-white border-zinc-200 shadow-sm' : 'bg-[#121218] border-white/10'
        } space-y-5`}>
          <div className="flex items-center gap-2.5 pb-4 border-b border-white/10">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h2 className={`text-base font-bold ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                Store Profile & Identity
              </h2>
              <p className="text-xs text-zinc-400">
                Multi-tenant partition information and store administrative credentials.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={`block text-xs font-semibold ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                Store Name *
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-all ${
                  isLight
                    ? 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/20'
                    : 'bg-[#14141c] border-white/10 text-white focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/20'
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label className={`block text-xs font-semibold ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                Admin Owner Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm opacity-70 cursor-not-allowed ${
                  isLight
                    ? 'bg-zinc-100 border-zinc-200 text-zinc-600'
                    : 'bg-[#0f0f15] border-white/5 text-zinc-400'
                }`}
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-zinc-400">Tenant Partition UUID:</span>
              <div className="font-mono text-xs font-bold text-orange-400 mt-0.5">
                {tenant?.id || '—'}
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyTenantId}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto ${
                copiedTenantId
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20'
              }`}
            >
              {copiedTenantId ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy ID</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className={`p-6 rounded-3xl border ${
          isLight ? 'bg-white border-zinc-200 shadow-sm' : 'bg-[#121218] border-white/10'
        } space-y-5`}>
          <div className="flex items-center gap-2.5 pb-4 border-b border-white/10">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className={`text-base font-bold ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                Inventory & Threshold Rules (FR-7)
              </h2>
              <p className="text-xs text-zinc-400">
                Default settings applied globally across all catalog items in this store.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={`block text-xs font-semibold ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                Global Default Low Stock Threshold *
              </label>
              <input
                type="number"
                min="0"
                value={defaultThreshold}
                onChange={(e) => setDefaultThreshold(e.target.value === '' ? 0 : parseInt(e.target.value, 10))}
                required
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-all ${
                  isLight
                    ? 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/20'
                    : 'bg-[#14141c] border-white/10 text-white focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/20'
                }`}
              />
              <span className="block text-[11px] text-zinc-500">
                If a product's Low Stock Threshold is empty, this default is used for low-stock logic.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className={`block text-xs font-semibold ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                Store Currency
              </label>
              <div className="relative">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none appearance-none cursor-pointer ${
                    isLight
                      ? 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-[#ff6b00]'
                      : 'bg-[#14141c] border-white/10 text-white focus:border-[#ff6b00]'
                  }`}
                >
                  {CURRENCY_OPTIONS.map((c) => (
                    <option key={c.code} value={c.code} className="bg-[#14141c] text-white">
                      {c.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-orange-400 font-mono font-bold text-xs">
                  {getCurrencySymbol(currency)}
                </div>
              </div>
              <span className="block text-[11px] text-zinc-500">
                Powers dashboard valuation and default pricing across the store.
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <GlowButton type="submit" size="md" isLoading={isSaving}>
            <ShieldCheck className="w-4 h-4 mr-1.5" />
            <span>Save Settings & Preferences</span>
          </GlowButton>
        </div>
      </form>
    </div>
  );
};
