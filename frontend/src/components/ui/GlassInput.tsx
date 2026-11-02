import React from 'react';
import { cn } from '../../lib/utils';

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-medium text-zinc-300">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full rounded-xl bg-[#13131a] border border-white/10 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 transition-all duration-200 outline-none',
              'focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/20 focus:bg-[#161622]',
              icon && 'pl-10',
              error && 'border-red-500/70 focus:border-red-500 focus:ring-red-500/20',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

GlassInput.displayName = 'GlassInput';
