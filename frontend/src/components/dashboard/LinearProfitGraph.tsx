import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, ArrowUpRight, Clock } from 'lucide-react';
import { Product, StockMovement, getCurrencySymbol, getStoredStoreCurrency } from '../../types/product';
import { useTheme } from '../../context/theme-context';
import { api } from '../../lib/api';

interface LinearProfitGraphProps {
  products: Product[];
  movements?: StockMovement[];
}

type TimeRange = '7D' | '30D' | 'QTD' | 'ALL';

interface ProfitPoint {
  label: string;
  dateStr: string;
  profit: number;
  revenue: number;
  cost: number;
  margin: number;
}

export const LinearProfitGraph: React.FC<LinearProfitGraphProps> = ({
  products,
  movements: initialMovements,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const currency = getStoredStoreCurrency();
  const symbol = getCurrencySymbol(currency);

  const [timeRange, setTimeRange] = useState<TimeRange>('7D');
  const [hoveredPoint, setHoveredPoint] = useState<ProfitPoint | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  const [allMovements, setAllMovements] = useState<StockMovement[]>(initialMovements || []);

  useEffect(() => {
    if (initialMovements && initialMovements.length > 0) {
      setAllMovements(initialMovements);
      return;
    }

    let isMounted = true;
    api
      .get<StockMovement[]>('/api/products/movements')
      .then((res) => {
        if (isMounted && res.data) {
          setAllMovements(res.data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [initialMovements, products]);

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
    if (products.length === 0) {
      return [];
    }

    const now = new Date();
    const timestamps: { date: Date; label: string }[] = [];

    if (timeRange === '7D') {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        if (i > 0) {
          d.setHours(23, 59, 59, 999);
        }
        const label =
          i === 0
            ? 'Today'
            : d.toLocaleDateString(undefined, { weekday: 'short', month: 'numeric', day: 'numeric' });
        timestamps.push({ date: d, label });
      }
    } else if (timeRange === '30D') {
      const stepDays = 5;
      for (let i = 30; i >= 0; i -= stepDays) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        if (i > 0) {
          d.setHours(23, 59, 59, 999);
        }
        const label =
          i === 0
            ? 'Today'
            : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        timestamps.push({ date: d, label });
      }
    } else if (timeRange === 'QTD') {
      const currentMonth = now.getMonth();
      const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
      const quarterStartDate = new Date(now.getFullYear(), quarterStartMonth, 1);
      const totalDays = Math.max(
        1,
        Math.round((now.getTime() - quarterStartDate.getTime()) / (1000 * 60 * 60 * 24))
      );
      const count = Math.min(7, totalDays);
      const step = totalDays / (count || 1);

      for (let i = 0; i < count; i++) {
        const d = new Date(quarterStartDate);
        d.setDate(d.getDate() + Math.round(i * step));
        d.setHours(23, 59, 59, 999);
        const label = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        timestamps.push({ date: d, label });
      }
      timestamps.push({
        date: now,
        label: 'Today',
      });
    } else {
      let earliestTime = now.getTime();
      for (const p of products) {
        if (p.createdAt) {
          const t = new Date(p.createdAt).getTime();
          if (t < earliestTime) earliestTime = t;
        }
      }
      for (const m of allMovements) {
        if (m.createdAt) {
          const t = new Date(m.createdAt).getTime();
          if (t < earliestTime) earliestTime = t;
        }
      }

      const totalSpan = now.getTime() - earliestTime;
      const daysSpan = Math.max(1, Math.round(totalSpan / (1000 * 60 * 60 * 24)));
      const steps = Math.min(7, daysSpan);

      for (let i = 0; i <= steps; i++) {
        const t = new Date(earliestTime + (i / steps) * totalSpan);
        const label =
          i === steps
            ? 'Today'
            : t.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        timestamps.push({ date: t, label });
      }
    }

    return timestamps.map(({ date, label }) => {
      const targetTime = date.getTime();
      let pointRevenue = 0;
      let pointCost = 0;

      for (const product of products) {
        const createdAt = product.createdAt ? new Date(product.createdAt).getTime() : 0;
        if (createdAt > targetTime) {
          continue;
        }

        let qtyAtTime = product.quantityOnHand || 0;
        for (const m of allMovements) {
          if (m.productId === product.id && m.createdAt) {
            const moveTime = new Date(m.createdAt).getTime();
            if (moveTime > targetTime) {
              qtyAtTime -= m.quantityDelta;
            }
          }
        }

        const validQty = Math.max(0, qtyAtTime);
        const sell = product.sellingPrice !== undefined ? Number(product.sellingPrice) : 0;
        const cost = product.costPrice !== undefined ? Number(product.costPrice) : 0;

        pointRevenue += sell * validQty;
        pointCost += cost * validQty;
      }

      const profit = Math.max(0, pointRevenue - pointCost);
      const margin = pointRevenue > 0 ? (profit / pointRevenue) * 100 : 0;

      return {
        label,
        dateStr: date.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        profit,
        revenue: pointRevenue,
        cost: pointCost,
        margin,
      };
    });
  }, [products, allMovements, timeRange]);

  const width = 800;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;

  const maxVal = Math.max(...points.map((p) => p.profit), 100);
  const minVal = Math.min(...points.map((p) => p.profit), 0);
  const range = maxVal - minVal || 1;

  const coords = points.map((p, idx) => {
    const x =
      points.length > 1
        ? paddingX + (idx / (points.length - 1)) * (width - paddingX * 2)
        : width / 2;
    const y = height - paddingY - ((p.profit - minVal) / range) * (height - paddingY * 2);
    return { x, y, point: p };
  });

  const pathD = useMemo(() => {
    if (coords.length === 0) return '';
    if (coords.length === 1) {
      return `M ${paddingX} ${coords[0].y} L ${width - paddingX} ${coords[0].y}`;
    }

    let d = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i === 0 ? 0 : i - 1];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = coords[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  }, [coords]);

  const areaD = useMemo(() => {
    if (!pathD || coords.length === 0) return '';
    const bottom = height - paddingY;
    const firstX = coords[0].x;
    const lastX = coords[coords.length - 1].x;
    return `${pathD} L ${lastX} ${bottom} L ${firstX} ${bottom} Z`;
  }, [pathD, coords]);

  if (products.length === 0) {
    return (
      <div
        className={`relative overflow-hidden rounded-3xl border p-8 backdrop-blur-2xl transition-all ${
          isLight
            ? 'bg-gradient-to-br from-white via-orange-50/20 to-white border-orange-200/60 shadow-lg shadow-orange-500/5'
            : 'bg-gradient-to-br from-[#0f0f15]/90 via-[#14141d]/80 to-[#0a0a0f] border-orange-500/15 shadow-2xl shadow-orange-500/5'
        }`}
      >
        <div className="flex flex-col items-center justify-center text-center py-6">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#ff6b00] mb-3">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className={`text-base font-bold ${isLight ? 'text-zinc-900' : 'text-white'}`}>
            Live Profit Curve Awaiting Products
          </h3>
          <p className="text-xs text-zinc-400 max-w-sm mt-1">
            Add your inventory items to activate real-time profit tracking, margins, and linear velocity curves.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border p-6 sm:p-7 backdrop-blur-2xl transition-all ${
        isLight
          ? 'bg-gradient-to-br from-white via-orange-50/30 to-white border-orange-200/80 shadow-xl shadow-orange-500/10'
          : 'bg-gradient-to-br from-[#0e0e14]/95 via-[#13131c]/90 to-[#09090d] border-orange-500/20 shadow-2xl shadow-orange-500/10'
      }`}
    >
      <div className="absolute top-0 right-0 w-96 h-64 bg-gradient-to-bl from-[#ff6b00]/10 via-[#ffa500]/5 to-transparent blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-gradient-to-r from-[#ff4500]/15 to-[#ffa500]/15 border border-orange-500/30 text-[#ff6b00]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b00] animate-pulse" />
              Real Time-Based Profit Telemetry
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400">
              <Clock className="w-3 h-3 text-[#ff6b00]" />
              Historical Audit Calibrated
            </span>
          </div>

          <div className="flex flex-wrap items-baseline gap-3">
            <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isLight ? 'text-zinc-900' : 'text-white'}`}>
              {symbol}
              {stats.netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{stats.marginPct.toFixed(1)}% Gross Margin</span>
            </div>
          </div>

          <p className="text-xs text-zinc-400 mt-1">
            Calculated strictly from store product valuations and stock movement audit records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div
              className={`px-3 py-2 rounded-xl border ${
                isLight ? 'bg-white border-zinc-200' : 'bg-white/5 border-white/10'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
                Gross Revenue
              </span>
              <span className={`text-sm font-black tracking-tight ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                {symbol}
                {stats.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>

            <div
              className={`px-3 py-2 rounded-xl border ${
                isLight ? 'bg-white border-zinc-200' : 'bg-white/5 border-white/10'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
                Inventory Cost
              </span>
              <span className={`text-sm font-black tracking-tight ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                {symbol}
                {stats.totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>

            <div
              className={`col-span-2 sm:col-span-1 px-3 py-2 rounded-xl border ${
                isLight ? 'bg-white border-zinc-200' : 'bg-white/5 border-white/10'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
                Avg Profit/Unit
              </span>
              <span className={`text-sm font-black tracking-tight text-[#ff6b00]`}>
                {symbol}
                {stats.avgProfitPerUnit.toFixed(2)}
              </span>
            </div>
          </div>

          <div
            className={`p-1 rounded-xl border flex items-center gap-1 ${
              isLight ? 'bg-zinc-100 border-zinc-200' : 'bg-white/5 border-white/10'
            }`}
          >
            {(['7D', '30D', 'QTD', 'ALL'] as TimeRange[]).map((rangeKey) => {
              const active = timeRange === rangeKey;
              return (
                <button
                  key={rangeKey}
                  onClick={() => setTimeRange(rangeKey)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    active
                      ? 'bg-gradient-to-r from-[#ff4500] to-[#ffa500] text-white shadow-md shadow-orange-500/30'
                      : isLight
                      ? 'text-zinc-600 hover:text-zinc-900 hover:bg-white'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {rangeKey}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative pt-6">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-44 sm:h-56 overflow-visible select-none"
        >
          <defs>
            <linearGradient id="profitLinearFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff6b00" stopOpacity="0.45" />
              <stop offset="45%" stopColor="#ffa500" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#ff4500" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="profitStrokeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ff4500" />
              <stop offset="50%" stopColor="#ff6b00" />
              <stop offset="100%" stopColor="#ffa500" />
            </linearGradient>

            <filter id="profitGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = paddingY + ratio * (height - paddingY * 2);
            return (
              <line
                key={i}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke={isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)'}
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            );
          })}

          {areaD && (
            <motion.path
              d={areaD}
              fill="url(#profitLinearFill)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            />
          )}

          {pathD && (
            <motion.path
              d={pathD}
              fill="none"
              stroke="url(#profitStrokeGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
              filter="url(#profitGlow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, ease: 'easeInOut' }}
            />
          )}

          {coords.map((c, i) => {
            const isHovered = hoveredPoint === c.point;
            return (
              <g key={i} className="cursor-pointer">
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={isHovered ? 8 : 4.5}
                  fill={isHovered ? '#ffffff' : '#ff6b00'}
                  stroke="#ffa500"
                  strokeWidth={isHovered ? 3.5 : 2}
                  className="transition-all duration-200"
                />
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={22}
                  fill="transparent"
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                    if (rect) {
                      setHoverPos({
                        x: (c.x / width) * rect.width,
                        y: (c.y / height) * rect.height,
                      });
                    }
                    setHoveredPoint(c.point);
                  }}
                  onMouseLeave={() => {
                    setHoveredPoint(null);
                    setHoverPos(null);
                  }}
                />
              </g>
            );
          })}

          {coords.map((c, i) => (
            <text
              key={i}
              x={c.x}
              y={height - 8}
              textAnchor="middle"
              className={`text-[11px] font-bold fill-current ${
                isLight ? 'text-zinc-500' : 'text-zinc-400'
              }`}
            >
              {c.point.label}
            </text>
          ))}
        </svg>

        <AnimatePresence>
          {hoveredPoint && hoverPos && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              style={{
                left: Math.max(12, Math.min(hoverPos.x - 80, 600)),
                top: Math.max(0, hoverPos.y - 100),
              }}
              className={`absolute z-30 pointer-events-none px-3.5 py-2.5 rounded-xl border shadow-xl backdrop-blur-xl ${
                isLight
                  ? 'bg-white/95 border-orange-300 text-zinc-900 shadow-orange-500/15'
                  : 'bg-[#12121a]/95 border-orange-500/30 text-white shadow-black/60'
              }`}
            >
              <div className="flex items-center justify-between gap-3 text-[10px] text-zinc-400 border-b border-white/10 pb-1 mb-1.5 font-bold uppercase tracking-wider">
                <span>{hoveredPoint.dateStr}</span>
                <span className="text-[#ff6b00]">{hoveredPoint.margin.toFixed(1)}% Margin</span>
              </div>
              <div className="space-y-0.5 text-xs">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-zinc-400 font-medium">Net Profit:</span>
                  <span className="font-black text-emerald-500">
                    {symbol}
                    {hoveredPoint.profit.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-zinc-400 font-medium">Revenue:</span>
                  <span className="font-semibold text-zinc-300">
                    {symbol}
                    {hoveredPoint.revenue.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
