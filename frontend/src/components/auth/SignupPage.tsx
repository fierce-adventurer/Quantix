import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Mail, Lock, ArrowRight, ShieldCheck, Check, AlertCircle } from 'lucide-react';
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

  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const isPasswordValid = hasLength && hasUpper && hasLower && hasNumber && hasSpecial;

  const isEmailValid = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,64}$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!organizationName.trim()) {
      setError('Store / Organization name is required');
      return;
    }
    if (!isEmailValid) {
      setError('Please provide a valid work email address');
      return;
    }
    if (!isPasswordValid) {
      setError('Password does not meet all security criteria');
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
    <div className="relative w-full max-w-xl mx-auto flex flex-col items-center">
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
          <PillBadge tag="ZERO-LEAK" text="Dedicated Multi-Tenant Isolation" className="mb-3" />
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            Launch Your Store with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b00] to-[#ffa500]">Quantix</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Create your store workspace and start managing inventory in seconds
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
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <GlassInput
                label="Store / Organization Name"
                type="text"
                placeholder="e.g. Apex Electronics"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                icon={<Store className="w-4 h-4" />}
                required
              />

              <GlassInput
                label="Admin Work Email"
                type="email"
                placeholder="admin@yourcompany.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-4 h-4" />}
                autoComplete="email"
                error={email && !isEmailValid ? 'Invalid email format' : undefined}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <GlassInput
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                autoComplete="new-password"
                required
              />

              <GlassInput
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                autoComplete="new-password"
                error={confirmPassword && password !== confirmPassword ? 'Passwords do not match' : undefined}
                required
              />
            </div>

            {password && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 rounded-xl bg-[#14141d]/70 border border-white/5 space-y-1.5"
              >
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                  Password Security Requirements
                </span>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                  <div className={`flex items-center gap-1.5 ${hasLength ? 'text-emerald-400' : 'text-zinc-500'}`}>
                    <Check className={`w-3 h-3 ${hasLength ? 'opacity-100' : 'opacity-30'}`} />
                    <span>8+ characters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-400' : 'text-zinc-500'}`}>
                    <Check className={`w-3 h-3 ${hasNumber ? 'opacity-100' : 'opacity-30'}`} />
                    <span>Includes number</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-400' : 'text-zinc-500'}`}>
                    <Check className={`w-3 h-3 ${hasSpecial ? 'opacity-100' : 'opacity-30'}`} />
                    <span>Special character</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasUpper && hasLower ? 'text-emerald-400' : 'text-zinc-500'}`}>
                    <Check className={`w-3 h-3 ${hasUpper && hasLower ? 'opacity-100' : 'opacity-30'}`} />
                    <span>Upper & lower case</span>
                  </div>
                </div>
              </motion.div>
            )}

            <GlowButton
              type="submit"
              className="w-full mt-2"
              size="lg"
              isLoading={isSubmitting}
            >
              Create Store & Account
              <ArrowRight className="w-4 h-4 ml-2" />
            </GlowButton>
          </form>

          <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500">
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
