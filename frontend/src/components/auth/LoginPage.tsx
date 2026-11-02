import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/auth-context';
import { GlowButton } from '../ui/GlowButton';
import { GlassInput } from '../ui/GlassInput';
import { PillBadge } from '../ui/PillBadge';

interface LoginPageProps {
  onGoToSignup: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onGoToSignup }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please provide both admin email and password');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('owner@apexstore.com');
    setPassword('secret123');
    setError(null);
  };

  return (
    <div className="relative w-full flex-1 min-h-0 flex flex-col items-center justify-center px-4 py-2">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="glow-horizon"
      />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 0.85, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="sunburst-crest"
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md my-auto"
      >
        <div className="text-center mb-4 sm:mb-5">
          <PillBadge text="Store-Independent Multi-Tenant Architecture" className="mb-2.5 scale-90 sm:scale-100 origin-center" />
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1">
            Welcome Back to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b00] to-[#ffa500]">Quantix</span>
          </h1>
          <p className="text-xs text-zinc-400">
            Sign in to access your store's isolated inventory control center
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-panel-glow rounded-2xl p-5 sm:p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 overflow-hidden"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <GlassInput
              compact
              label="Admin Email / Unique ID"
              type="email"
              placeholder="admin@store.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              autoComplete="email"
              required
            />

            <GlassInput
              compact
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              autoComplete="current-password"
              required
            />

            <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer hover:text-zinc-300">
                <input
                  type="checkbox"
                  className="rounded bg-[#1a1a24] border-white/20 text-[#ff6b00] focus:ring-[#ff6b00]/30"
                  defaultChecked
                />
                <span>Remember store</span>
              </label>
              <button
                type="button"
                onClick={handleDemoFill}
                className="text-orange-400 hover:text-orange-300 font-medium inline-flex items-center gap-1 transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                Fill Demo Admin
              </button>
            </div>

            <GlowButton
              type="submit"
              className="w-full mt-1"
              size="md"
              isLoading={isSubmitting}
            >
              Sign In to Store
              <ArrowRight className="w-4 h-4 ml-2" />
            </GlowButton>
          </form>

          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tenant data isolated</span>
            </div>
            <button
              onClick={onGoToSignup}
              className="text-zinc-300 hover:text-orange-400 transition-colors"
            >
              Need a store? <span className="text-orange-400 font-semibold">Sign Up</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
