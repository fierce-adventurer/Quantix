import React from 'react';
import {
  LayoutDashboard,
  Package,
  Settings,
  LogOut,
  User,
  Store,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../../context/auth-context';
import { useTheme } from '../../context/theme-context';
import { getStoredStoreCurrency, getCurrencySymbol } from '../../types/product';

export type NavigationTab = 'dashboard' | 'products' | 'settings';

interface SidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  productCount?: number;
  lowStockCount?: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  productCount = 0,
  lowStockCount = 0,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const { user, tenant, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';
  const currency = getStoredStoreCurrency();
  const symbol = getCurrencySymbol(currency);

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: string | number; badgeColor?: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      badge: lowStockCount > 0 ? `${lowStockCount} alert` : undefined,
      badgeColor: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    },
    {
      id: 'products',
      label: 'Products & Catalog',
      icon: <Package className="w-4 h-4" />,
      badge: productCount,
      badgeColor: isLight ? 'bg-zinc-200 text-zinc-700' : 'bg-white/10 text-zinc-300',
    },
    {
      id: 'settings',
      label: 'Store Settings',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  const handleTabClick = (tabId: NavigationTab) => {
    onSelectTab(tabId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen transition-all duration-300 flex flex-col shrink-0 select-none ${
          isLight
            ? 'bg-white/95 border-r border-zinc-200/80 text-zinc-900 shadow-xl shadow-zinc-200/50'
            : 'bg-[#0d0d12]/95 border-r border-white/10 text-white backdrop-blur-md'
        } ${isCollapsed ? 'w-20' : 'w-64'} ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10 min-h-[68px]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff6b00] to-[#ffa500] p-0.5 shadow-glow-sm shrink-0 flex items-center justify-center">
              <div className={`w-full h-full rounded-[10px] flex items-center justify-center ${isLight ? 'bg-white' : 'bg-[#09090b]'}`}>
                <Layers className="w-5 h-5 text-[#ff7300]" />
              </div>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className={`text-lg font-black tracking-tight ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                  Quantix
                </span>
                <span className="text-[10px] font-medium text-zinc-400 truncate">
                  Multi-Store Engine
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className={`hidden lg:flex w-7 h-7 rounded-lg items-center justify-center transition-colors ${
              isLight
                ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900'
                : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white'
            }`}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {!isCollapsed && tenant && (
          <div className="p-3 mx-3 my-3 rounded-2xl bg-orange-500/5 border border-orange-500/15 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 truncate">
              <div className="w-6 h-6 rounded-lg bg-orange-500/15 flex items-center justify-center text-orange-400 shrink-0">
                <Store className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <div className={`text-xs font-bold truncate ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                  {tenant.name}
                </div>
                <div className="text-[10px] text-zinc-400 font-mono">
                  {symbol} {currency}
                </div>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          </div>
        )}

        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#ff6b00] to-[#ffa500] text-white shadow-lg shadow-orange-600/25'
                    : isLight
                    ? 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
                title={item.label}
              >
                <div className={`shrink-0 ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-orange-400'}`}>
                  {item.icon}
                </div>
                {!isCollapsed && (
                  <>
                    <span className="truncate flex-1 text-left">{item.label}</span>
                    {item.badge !== undefined && (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.badgeColor || ''}`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        <div className={`p-3 border-t ${isLight ? 'border-zinc-200' : 'border-white/10'} space-y-2`}>
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              isLight
                ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                : 'bg-white/5 hover:bg-white/10 text-zinc-300'
            } ${isCollapsed ? 'justify-center px-0' : ''}`}
            title={`Switch to ${isLight ? 'Obsidian Dark' : 'Obsidian Light'} theme`}
          >
            {isLight ? (
              <>
                <Moon className="w-4 h-4 text-orange-500 shrink-0" />
                {!isCollapsed && <span className="truncate">Obsidian Dark</span>}
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                {!isCollapsed && <span className="truncate">Obsidian Light</span>}
              </>
            )}
          </button>

          {!isCollapsed && user && (
            <div className={`p-2.5 rounded-xl ${isLight ? 'bg-zinc-100' : 'bg-black/30'} flex items-center gap-2.5`}>
              <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="truncate flex-1">
                <div className={`text-[11px] font-medium truncate ${isLight ? 'text-zinc-800' : 'text-zinc-200'}`}>
                  {user.email}
                </div>
                <div className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">
                  {user.role}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={logout}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
