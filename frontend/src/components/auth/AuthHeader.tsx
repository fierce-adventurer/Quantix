import React from 'react';
import { Layers } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AuthHeaderProps {
  onSwitchMode?: () => void;
  isLogin?: boolean;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ onSwitchMode, isLogin }) => {
  return (
    <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2.5 cursor-pointer">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#ff6b00] to-[#ffa500] p-0.5 shadow-glow-sm flex items-center justify-center">
          <div className="w-full h-full bg-[#09090b] rounded-[9px] flex items-center justify-center">
            <Layers className="w-4 h-4 text-[#ff7300]" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-bold tracking-tight text-white">Quantix</span>
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
            SaaS
          </span>
        </div>
      </div>

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
