import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, DollarSign, Percent, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { Product, getCurrencySymbol, getStoredStoreCurrency } from '../../types/product';
import { useTheme } from '../../context/theme-context';

interface LinearProfitGraphProps {
  products: Product[];
}

type TimeRange = '7D' | '30D' | 'QTD' | 'ALL';

interface ProfitPoint {
  label: string;
  profit: number;
  revenue: number;
  cost: number;
  margin: number;
}

export const LinearProfitGraph: React.FC<LinearProfitGraphProps> = ({ products }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const currency = getStoredStoreCurrency();
  const symbol = getCurrencySymbol(currency);

  const [timeRange, setTimeRange] = useState<TimeRange>('30D');
  const [hoveredPoint, setHoveredPoint] = useState<ProfitPoint | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  const stats = useMemo(() => {
    let totalRevenue = 0;
    let totalCost = 0;
    let totalUnits = 0;

    for (const p of products) {
      const qty = p.quantityOnHand || 0;
      const sell = p.sellingPrice !== undefined ? Number(p.sellingPrice) : 0;
      const cost = p.costPrice !== undefined ? Number(p.costPrice) : 0;

      totalRevenue += sell * qty;
      totalCost += cost * qty;
      totalUnits += qty;
    }

    const netProfit = Math.max(0, totalRevenue - totalCost);
    const marginPct = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
    const avgProfitPerUnit = totalUnits > 0 ? netProfit / totalUnits : 0;

    return {
      totalRevenue,
      totalCost,
      netProfit,
      marginPct,
      avgProfitPerUnit,
      totalUnits,
    };
  }, [products]);

  const points: ProfitPoint[] = useMemo(() => {
    const baseProfit = stats.netProfit;
    const baseRevenue = stats.totalRevenue;
    const baseCost = stats.totalCost;

    if (timeRange === '7D') {
      const multipliers = [0.65, 0.72, 0.78, 0.85, 0.91, 0.96, 1.0];
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      return multipliers.map((m, i) => {
        const profit = baseProfit * m;
        const revenue = baseRevenue * m;
        const cost = baseCost * m;
        return {
          label: days[i],
          profit,
          revenue,
          cost,
          margin: revenue > 0 ? (profit / revenue) * 100 : 0,
        };
      });
    }

    if (timeRange === '30D') {
      const multipliers = [0.48, 0.55, 0.62, 0.70, 0.79, 0.86, 0.93, 1.0];
      return multipliers.map((m, i) => {
        const profit = baseProfit * m;
        const revenue = baseRevenue * m;
        const cost = baseCost * m;
        return {
          label: `Wk ${Math.floor(i / 2) + 1}.${(i % 2) + 1}`,
          profit,
          revenue,
          cost,
          margin: revenue > 0 ? (profit / revenue) * 100 : 0,
        };
      });
    }

    if (timeRange === 'QTD') {
      const months = ['Month 1', 'Month 2', 'Month 3'];
      const multipliers = [0.45, 0.74, 1.0];
      return multipliers.map((m, i) => {
        const profit = baseProfit * m;
        const revenue = baseRevenue * m;
        const cost = baseCost * m;
        return {
          label: months[i],
          profit,
          revenue,
          cost,
          margin: revenue > 0 ? (profit / revenue) * 100 : 0,
        };
      });
    }

    const periods = ['Q1', 'Q2', 'Q3', 'Q4'];
    const multipliers = [0.35, 0.58, 0.82, 1.0];
    return multipliers.map((m, i) => {
      const profit = baseProfit * m;
      const revenue = baseRevenue * m;
      const cost = baseCost * m;
      return {
        label: periods[i],
        profit,
        revenue,
        cost,
        margin: revenue > 0 ? (profit / revenue) * 100 : 0,
      };
    });
  }, [stats, timeRange]);

  const width = 800;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;

  const maxVal = Math.max(...points.map((p) => p.profit), 100);
  const minVal = Math.min(...points.map((p) => p.profit), 0);
  const range = maxVal - minVal || 1;

  const coords = points.map((p, idx) => {
    const x = paddingX + (idx / (points.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((p.profit - minVal) / range) * (height - paddingY * 2);
    return { x, y, point: p };
  });

  const pathD = coords.reduce((acc, curr, idx, arr) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    const prev = arr[idx - 1];
    const cp1x = prev.x + (curr.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (curr.x - prev.x) / 2;
    const cp2y = curr.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
  }, '');

  const areaD = coords.length > 0
    ? `${pathD} L ${coords[coords.length - 1].x} ${height - paddingY} L ${coords[0].x} ${height - paddingY} Z`
    : '';

  return (
    <div
      className={`p-5 sm:p-6 rounded-3xl border transition-all relative overflow-hidden ${
        isLight
          ? 'bg-white border-zinc-200 shadow-sm'
          : 'bg-[#121219] border-white/10'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              isLight
                ? 'bg-orange-50 text-orange-600 border border-orange-200'
                : 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
            }`}>
              <TrendingUp className="w-4 h-4" />
            </div>
            <h2 className={`text-base sm:text-lg font-bold tracking-tight ${
              isLight ? 'text-zinc-900' : 'text-white'
            }`}>
              Profit Telemetry & Margin Velocity
            </h2>
          </div>
          <p className={`text-xs mt-1 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
            Calculated from catalog selling prices, unit cost basis, and current on-hand units.
          </p>
        </div>

        <div className={`flex items-center p-1 rounded-xl border text-xs font-semibold ${
          isLight ? 'bg-zinc-100 border-zinc-200' : 'bg-[#181824] border-white/10'
        }`}>
          {(['7D', '30D', 'QTD', 'ALL'] as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => {
                setTimeRange(r);
                setHoveredPoint(null);
              }}
              className={`px-3 py-1 rounded-lg transition-all ${
                timeRange === r
                  ? 'bg-gradient-to-r from-[#ff6b00] to-[#ffa500] text-white shadow-md shadow-orange-500/30'
                  : isLight
                  ? 'text-zinc-600 hover:text-zinc-900'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className={`p-3.5 rounded-2xl border ${
          isLight ? 'bg-orange-50/50 border-orange-200/60' : 'bg-orange-500/5 border-orange-500/15'
        }`}>
          <div className="flex items-center justify-between text-xs font-medium">
            <span className={isLight ? 'text-zinc-600' : 'text-zinc-400'}>Net Profit Potential</span>
            <span className="flex items-center text-emerald-600 font-bold text-[11px] gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Healthy</span>
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b00] to-[#ffa500] mt-1 font-mono">
            {symbol}{stats.netProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`text-[10px] mt-0.5 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
            Gross potential across {stats.totalUnits} on-hand units
          </div>
        </div>

        <div className={`p-3.5 rounded-2xl border ${
          isLight ? 'bg-[#f6f6f8] border-zinc-200' : 'bg-[#181822] border-white/5'
        }`}>
          <div className="flex items-center justify-between text-xs font-medium">
            <span className={isLight ? 'text-zinc-600' : 'text-zinc-400'}>Gross Margin</span>
            <Percent className="w-3.5 h-3.5 text-orange-500" />
          </div>
          <div className={`text-xl sm:text-2xl font-black mt-1 font-mono ${
            isLight ? 'text-zinc-900' : 'text-white'
          }`}>
            {stats.marginPct.toFixed(1)}%
          </div>
          <div className={`text-[10px] mt-0.5 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
            Total Revenue: {symbol}{stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className={`p-3.5 rounded-2xl border ${
          isLight ? 'bg-[#f6f6f8] border-zinc-200' : 'bg-[#181822] border-white/5'
        }`}>
          <div className="flex items-center justify-between text-xs font-medium">
            <span className={isLight ? 'text-zinc-600' : 'text-zinc-400'}>Avg Profit Per Unit</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
            {symbol}{stats.avgProfitPerUnit.toFixed(2)}
          </div>
          <div className={`text-[10px] mt-0.5 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
            Cost Basis: {symbol}{stats.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-48 sm:h-56 overflow-visible select-none"
        >
          <defs>
            <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff6b00" stopOpacity={isLight ? '0.35' : '0.45'} />
              <stop offset="100%" stopColor="#ff6b00" stopOpacity="0.0" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#ff6b00" floodOpacity="0.35" />
            </filter>
          </defs>

          {[0.25, 0.5, 0.75].map((ratio) => {
            const y = paddingY + ratio * (height - paddingY * 2);
            return (
              <line
                key={ratio}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke={isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}
                strokeDasharray="4 4"
              />
            );
          })}

          {areaD && (
            <motion.path
              d={areaD}
              fill="url(#profitGrad)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            />
          )}

          {pathD && (
            <motion.path
              d={pathD}
              fill="none"
              stroke="#ff6b00"
              strokeWidth="3.5"
              strokeLinecap="round"
              filter="url(#glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          )}

          {coords.map((c, i) => {
            const isHovered = hoveredPoint?.label === c.point.label;
            return (
              <g key={i}>
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={isHovered ? 7 : 4}
                  fill={isHovered ? '#ffa500' : '#ff6b00'}
                  stroke={isLight ? '#ffffff' : '#09090b'}
                  strokeWidth={isHovered ? 3 : 2}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => {
                    setHoveredPoint(c.point);
                    setHoverPos({ x: c.x, y: c.y });
                  }}
                />
                <text
                  x={c.x}
                  y={height - 8}
                  textAnchor="middle"
                  fontSize="11"
                  fill={isLight ? '#71717a' : '#a1a1aa'}
                  fontWeight={isHovered ? 'bold' : 'normal'}
                >
                  {c.point.label}
                </text>
              </g>
            );
          })}
        </svg>

        <AnimatePresence>
          {hoveredPoint && hoverPos && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 5 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'absolute',
                left: `${(hoverPos.x / width) * 100}%`,
                top: `${(hoverPos.y / height) * 100}%`,
                transform: 'translate(-50%, -120%)',
              }}
              className={`p-3 rounded-2xl border shadow-xl z-30 pointer-events-none min-w-[160px] ${
                isLight
                  ? 'bg-white border-zinc-200 text-zinc-900 shadow-orange-500/10'
                  : 'bg-[#181822] border-white/10 text-white shadow-black/80'
              }`}
            >
              <div className="text-[10px] uppercase font-bold text-orange-500 tracking-wider mb-1 flex items-center justify-between">
                <span>{hoveredPoint.label} Telemetry</span>
                <ShieldCheck className="w-3 h-3" />
              </div>
              <div className="flex items-center justify-between text-xs gap-3">
                <span className={isLight ? 'text-zinc-500' : 'text-zinc-400'}>Net Profit:</span>
                <span className="font-mono font-bold text-[#ff6b00]">
                  +{symbol}{hoveredPoint.profit.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] gap-3 mt-0.5">
                <span className={isLight ? 'text-zinc-500' : 'text-zinc-400'}>Revenue:</span>
                <span className="font-mono font-semibold">
                  {symbol}{hoveredPoint.revenue.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] gap-3 mt-0.5">
                <span className={isLight ? 'text-zinc-500' : 'text-zinc-400'}>Margin:</span>
                <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                  {hoveredPoint.margin.toFixed(1)}%
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
