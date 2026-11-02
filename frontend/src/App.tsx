import React, { useState } from 'react';
import { useAuth } from './context/auth-context';
import { AuthHeader } from './components/auth/AuthHeader';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { StoreSessionLanding } from './components/dashboard/StoreSessionLanding';

export const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="glow-horizon" />
        <div className="sunburst-crest" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ff6b00] to-[#ffa500] p-0.5 shadow-glow-md animate-pulse">
            <div className="w-full h-full bg-[#09090b] rounded-[14px] flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-[#ff7300]" />
            </div>
          </div>
          <div className="text-sm font-medium text-zinc-300">Waking Quantix Store Cluster...</div>
          <div className="text-xs text-zinc-500">Connecting via Neon Serverless Pooler</div>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <StoreSessionLanding />;
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col relative selection:bg-[#ff6b00]/30 selection:text-white">
      <AuthHeader
        isLogin={authMode === 'login'}
        onSwitchMode={() => setAuthMode((prev) => (prev === 'login' ? 'signup' : 'login'))}
      />
      <main className="flex-1 flex flex-col justify-center">
        {authMode === 'login' ? (
          <LoginPage onGoToSignup={() => setAuthMode('signup')} />
        ) : (
          <SignupPage onGoToLogin={() => setAuthMode('login')} />
        )}
      </main>
    </div>
  );
};
