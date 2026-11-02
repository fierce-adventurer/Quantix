import React, { useState } from 'react';
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
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 py-12">
      <div className="glow-horizon" />
      <div className="sunburst-crest" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <PillBadge tag="ZERO-LEAK" text="Dedicated Multi-Tenant Isolation" className="mb-4" />
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            Launch Your Store with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b00] to-[#ffa500]">Quantix</span>
          </h1>
          <p className="text-sm text-zinc-400">
            Create your store workspace and start managing inventory in seconds
          </p>
        </div>

        <div className="glass-panel-glow rounded-2xl p-7 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <GlassInput
              label="Store / Organization Name"
              type="text"
              placeholder="e.g. Apex Electronics, Nordic Apparel"
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
              required
            />

            <GlassInput
              label="Password (min 6 characters)"
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
              required
            />

            <div className="space-y-2 py-1">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />
                <span>Isolated database partition per store</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />
                <span>Serverless NeonDB with cold-start compute preservation</span>
              </div>
            </div>

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

          <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500">
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
        </div>
      </div>
    </div>
  );
};
