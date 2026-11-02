import React from 'react';
import { cn } from '../../lib/utils';

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const GlowButton: React.FC<GlowButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base font-semibold',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-[#ff6b00] via-[#ff7800] to-[#ffa500] text-white shadow-glow-button hover:brightness-110 active:scale-[0.98] border border-orange-400/30',
    secondary:
      'bg-[#181822] text-[#f4f4f5] hover:bg-[#20202c] border border-white/10 hover:border-orange-500/40 active:scale-[0.98]',
    ghost:
      'bg-transparent text-zinc-400 hover:text-white hover:bg-white/5 active:scale-[0.98]',
  };

  return (
    <button
      className={cn(
        'relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 select-none disabled:opacity-50 disabled:pointer-events-none',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Processing...
        </span>
      ) : (
        children
      )}
    </button>
  );
};
