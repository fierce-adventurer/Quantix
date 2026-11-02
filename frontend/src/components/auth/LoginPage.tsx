import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
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

    const isEmailValid = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,64}$/.test(email);
    if (!isEmailValid) {
      setError('Please enter a valid email address');
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

  return (
    <div className="relative w-full max-w-md mx-auto flex flex-col items-center">
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
        className="relative z-10 w-full"
      >
        <div className="text-center mb-6">
          <PillBadge tag="NEW" text="Next-Gen Multi-Store Inventory Control" className="mb-3" />
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            Welcome Back to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b00] to-[#ffa500]">Quantix</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Sign in to access your store's isolated inventory control center
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-panel-glow rounded-3xl p-6 sm:p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-36 h-36 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 overflow-hidden"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <GlassInput
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
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              autoComplete="current-password"
              required
            />

            <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer hover:text-zinc-300">
                <input
                  type="checkbox"
                  className="rounded bg-[#1a1a24] border-white/20 text-[#ff6b00] focus:ring-[#ff6b00]/30"
                  defaultChecked
                />
                <span>Remember this store</span>
              </label>
            </div>

            <GlowButton
              type="submit"
              className="w-full mt-2"
              size="lg"
              isLoading={isSubmitting}
            >
              Sign In to Store
              <ArrowRight className="w-4 h-4 ml-2" />
            </GlowButton>
          </form>

          <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tenant data isolated</span>
            </div>
            <button
              onClick={onGoToSignup}
              className="text-zinc-300 hover:text-orange-400 transition-colors"
            >
              Need a new store? <span className="text-orange-400 font-semibold">Sign Up</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
