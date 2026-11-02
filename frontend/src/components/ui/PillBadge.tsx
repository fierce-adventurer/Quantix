import React from 'react';
import { cn } from '../../lib/utils';

interface PillBadgeProps {
  tag?: string;
  text: string;
  className?: string;
}

export const PillBadge: React.FC<PillBadgeProps> = ({ tag = 'NEW', text, className }) => {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181514] border border-[#ff6b00]/30 shadow-glow-sm',
        className
      )}
    >
      <span className="px-1.5 py-0.5 rounded-full bg-gradient-to-r from-[#ff6b00] to-[#ffa500] text-[10px] font-bold tracking-wider text-black uppercase">
        {tag}
      </span>
      <span className="text-xs font-medium text-orange-200/90">{text}</span>
    </div>
  );
};
