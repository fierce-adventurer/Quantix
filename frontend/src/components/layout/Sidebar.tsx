import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Package, History, Settings } from 'lucide-react';
import { useTheme } from '../../context/theme-context';

export type NavigationTab = 'dashboard' | 'products' | 'history' | 'settings';

export interface SidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  productCount?: number;
  lowStockCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  productCount = 0,
  lowStockCount = 0,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [hoveredTab, setHoveredTab] = useState<NavigationTab | null>(null);

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
    },
    {
      id: 'products',
      label: 'Products & Catalog',
      icon: <Package className="w-5 h-5" />,
      badge: productCount > 0 ? productCount : undefined,
    },
    {
      id: 'history',
      label: 'Product History',
      icon: <History className="w-5 h-5" />,
    },
    {
      id: 'settings',
      label: 'Store Settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const indicatorTarget = hoveredTab ?? activeTab;

  return (
    <aside className="fixed bottom-6 left-1/2 -translate-x-1/2 lg:bottom-auto lg:top-1/2 lg:left-6 lg:-translate-y-1/2 lg:translate-x-0 z-50">
      <div
        onMouseLeave={() => setHoveredTab(null)}
        className={`p-2 rounded-full flex flex-row lg:flex-col items-center gap-3 border backdrop-blur-2xl shadow-2xl transition-all ${
          isLight
            ? 'bg-white/85 border-orange-500/20 shadow-xl shadow-orange-500/10'
            : 'bg-[#0f0f15]/85 border-white/10 shadow-2xl shadow-black/80'
        }`}
      >
        {navItems.map((item) => {
          const isTarget = indicatorTarget === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              onMouseEnter={() => setHoveredTab(item.id)}
              className="relative w-12 h-12 rounded-full flex items-center justify-center transition-colors group"
              aria-label={item.label}
            >
              {isTarget && (
                <motion.div
                  layoutId="dock-cursor-glow"
                  className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#ff6b00] to-[#ffa500] shadow-lg shadow-orange-500/40"
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 28,
                    mass: 0.8,
                  }}
                />
              )}

              <div
                className={`relative z-10 transition-transform duration-200 group-hover:scale-110 ${
                  isTarget
                    ? 'text-white'
                    : isLight
                    ? 'text-zinc-600 group-hover:text-zinc-900'
                    : 'text-zinc-400 group-hover:text-white'
                }`}
              >
                {item.icon}
              </div>

              {item.badge !== undefined && (
                <span className="absolute -top-0.5 -right-0.5 z-20 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold bg-[#ff6b00] text-white flex items-center justify-center border-2 border-[#09090b]">
                  {item.badge}
                </span>
              )}

              <AnimatePresence>
                {hoveredTab === item.id && (
                  <motion.div
                    initial={{ opacity: 0, x: 8, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 8, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute left-16 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shadow-xl pointer-events-none z-50 hidden lg:flex items-center gap-2 border ${
                      isLight
                        ? 'bg-white border-zinc-200 text-zinc-900 shadow-orange-500/10'
                        : 'bg-[#181822] border-white/10 text-white shadow-black/80'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
