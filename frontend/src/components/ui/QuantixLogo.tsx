import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/theme-context';

export interface QuantixLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
  animated?: boolean;
  className?: string;
}

export const QuantixLogo: React.FC<QuantixLogoProps> = ({
  size = 'md',
  withText = false,
  animated = true,
  className = '',
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const sizeMap = {
    sm: { icon: 32, text: 'text-base', subtext: 'text-[8px]', gap: 'gap-2.5' },
    md: { icon: 40, text: 'text-lg', subtext: 'text-[9px]', gap: 'gap-3' },
    lg: { icon: 52, text: 'text-2xl', subtext: 'text-[10px]', gap: 'gap-3.5' },
    xl: { icon: 68, text: 'text-3xl', subtext: 'text-[11px]', gap: 'gap-4' },
  };

  const currentSize = sizeMap[size];
  const dim = currentSize.icon;

  const IconComponent = (
    <div
      style={{ width: dim, height: dim }}
      className="relative flex items-center justify-center select-none"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#ff4500]/30 via-[#ff6b00]/20 to-transparent blur-md transform -rotate-3" />
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-full h-full drop-shadow-md"
      >
        <defs>
          <linearGradient id="qtxGradientPrimary" x1="15%" y1="10%" x2="85%" y2="90%">
            <stop offset="0%" stopColor="#ff4500" />
            <stop offset="55%" stopColor="#ff6b00" />
            <stop offset="100%" stopColor="#ffa500" />
          </linearGradient>
          <linearGradient id="qtxGradientAccent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#ffa500" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ff4500" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="qtxCoreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffa500" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#ff6b00" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ff4500" stopOpacity="0" />
          </radialGradient>
          <filter id="qtxGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <rect
          x="6"
          y="6"
          width="88"
          height="88"
          rx="24"
          fill={isLight ? '#ffffff' : '#0d0d12'}
          stroke={isLight ? '#fed7aa' : 'rgba(255, 107, 0, 0.35)'}
          strokeWidth="2.5"
          className="transition-colors duration-300"
        />

        <circle cx="50" cy="50" r="28" fill="url(#qtxCoreGlow)" />

        <path
          d="M 50 20
             C 66.57 20, 80 33.43, 80 50
             C 80 59.8, 75.3 68.5, 68 74
             L 78 84
             C 79.5 85.5, 78.5 88, 76.5 88
             L 66 88
             L 58 80
             C 55.4 80.7, 52.7 81, 50 81
             C 33.43 81, 20 67.57, 20 50
             C 20 33.43, 33.43 20, 50 20 Z"
          fill="none"
          stroke="url(#qtxGradientPrimary)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <circle
          cx="50"
          cy="50"
          r="13"
          fill={isLight ? '#fff7ed' : '#14141d'}
          stroke="url(#qtxGradientPrimary)"
          strokeWidth="3.5"
        />

        <path
          d="M 32 30 C 37 24, 43 22, 50 22"
          stroke="url(#qtxGradientAccent)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        <circle cx="50" cy="50" r="5" fill="#ffa500" filter="url(#qtxGlowFilter)" />
      </svg>
    </div>
  );

  return (
    <div className={`inline-flex items-center ${currentSize.gap} ${className}`}>
      {animated ? (
        <motion.div
          whileHover={{ scale: 1.06, rotate: 2 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 450, damping: 22 }}
          className="cursor-pointer"
        >
          {IconComponent}
        </motion.div>
      ) : (
        IconComponent
      )}

      {withText && (
        <div className="flex flex-col justify-center select-none leading-none">
          <div className={`font-black tracking-[0.16em] uppercase flex items-center ${currentSize.text}`}>
            <span className={isLight ? 'text-zinc-900' : 'text-white'}>
              QUANTI
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-tr from-[#ff4500] via-[#ff6b00] to-[#ffa500]">
              X
            </span>
          </div>
          <span className={`font-bold tracking-[0.24em] uppercase text-[#ff6b00]/80 mt-0.5 ${currentSize.subtext}`}>
            INVENTORY OS
          </span>
        </div>
      )}
    </div>
  );
};
