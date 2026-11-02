import React from 'react';
import { QuantixLogo } from '../ui/QuantixLogo';
import { cn } from '../../lib/utils';

interface AuthHeaderProps {
  onSwitchMode?: () => void;
  isLogin?: boolean;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ onSwitchMode, isLogin }) => {
  return (
    <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between shrink-0">
      <QuantixLogo size="sm" withText />

      <div className="flex items-center gap-2 p-1 pl-3.5 rounded-full bg-[#121217]/80 border border-white/10 backdrop-blur-md shadow-lg shadow-black/40">
        <span className="text-xs text-zinc-400 font-medium hidden sm:inline">
          {isLogin ? "Need a store workspace?" : "Have a registered store?"}
        </span>
        <button
          onClick={onSwitchMode}
          className={cn(
            'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 select-none',
            isLogin
              ? 'bg-gradient-to-r from-[#ff6b00] via-[#ff7800] to-[#ffa500] text-white shadow-glow-sm hover:brightness-110 active:scale-95'
              : 'bg-[#181822] text-zinc-200 hover:text-white hover:bg-[#20202c] border border-white/10 active:scale-95'
          )}
        >
          {isLogin ? 'Create Store' : 'Sign In'}
        </button>
      </div>
    </header>
  );
};
