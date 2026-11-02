import React from 'react';
import { Layers } from 'lucide-react';

interface AuthHeaderProps {
  onSwitchMode?: () => void;
  isLogin?: boolean;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ onSwitchMode, isLogin }) => {
  return (
    <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
      <div className="flex items-center gap-2.5 cursor-pointer">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff6b00] to-[#ffa500] p-0.5 shadow-glow-sm flex items-center justify-center">
          <div className="w-full h-full bg-[#09090b] rounded-[10px] flex items-center justify-center">
            <Layers className="w-5 h-5 text-[#ff7300]" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold tracking-tight text-white">Quantix</span>
          <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
            SaaS
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs sm:text-sm">
        <span className="text-zinc-400 hidden sm:inline">
          {isLogin ? "Don't have a store account?" : 'Already managing a store?'}
        </span>
        <button
          onClick={onSwitchMode}
          className="text-orange-400 hover:text-orange-300 font-semibold transition-colors underline-offset-4 hover:underline"
        >
          {isLogin ? 'Create Store' : 'Sign In'}
        </button>
      </div>
    </header>
  );
};
