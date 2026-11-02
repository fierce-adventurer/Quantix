import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Mail, Lock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/auth-context';
import { GlowButton } from '../ui/GlowButton';
import { GlassInput } from '../ui/GlassInput';
import { PillBadge } from '../ui/PillBadge';

interface SignupPageProps {
  onGoToLogin: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onGoToLogin }) => {
  const { signup } = useAuth();
  const [organizationName, setOrganizationName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!organizationName.trim()) {
      setError('Store / Organization name is required');
      return;
    }
    if (!email.trim()) {
      setError('Work email is required');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      await signup(organizationName.trim(), email.trim(), password);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Signup failed. Please try a different email or store name.');
      }
    } finally {
      setIsSubmitting(false);
    }
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
        className="relative z-10 w-full max-w-lg my-auto"
      >
        <div className="text-center mb-4 sm:mb-5">
          <PillBadge tag="ZERO-LEAK" text="Dedicated Multi-Tenant Isolation" className="mb-2.5 scale-90 sm:scale-100 origin-center" />
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1">
            Launch Your Store with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b00] to-[#ffa500]">Quantix</span>
          </h1>
          <p className="text-xs text-zinc-400">
            Create your store workspace and start managing inventory in seconds
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

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <GlassInput
                compact
                label="Store Name"
                type="text"
                placeholder="e.g. Apex Electronics"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                icon={<Store className="w-4 h-4" />}
                required
              />

              <GlassInput
                compact
                label="Admin Work Email"
                type="email"
                placeholder="admin@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-4 h-4" />}
                autoComplete="email"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <GlassInput
                compact
                label="Password (min 6 chars)"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                autoComplete="new-password"
                required
              />

              <GlassInput
                compact
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                autoComplete="new-password"
                required
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 py-0.5 text-[11px] text-zinc-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />
                <span>Isolated DB partition per store</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />
                <span>NeonDB compute auto-suspend</span>
              </div>
            </div>

            <GlowButton
              type="submit"
              className="w-full mt-1"
              size="md"
              isLoading={isSubmitting}
            >
              Create Store & Account
              <ArrowRight className="w-4 h-4 ml-2" />
            </GlowButton>
          </form>

          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Full tenant privacy</span>
            </div>
            <button
              onClick={onGoToLogin}
              className="text-zinc-300 hover:text-orange-400 transition-colors"
            >
              Already registered? <span className="text-orange-400 font-semibold">Sign In</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
