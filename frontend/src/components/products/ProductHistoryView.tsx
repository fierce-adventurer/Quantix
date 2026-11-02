import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  RotateCcw,
  Calendar,
  User,
  SlidersHorizontal,
  Search,
  Package,
} from 'lucide-react';
import { Product, StockMovement, getCurrencySymbol, getStoredStoreCurrency } from '../../types/product';
import { useTheme } from '../../context/theme-context';
import { api } from '../../lib/api';
import { GlowButton } from '../ui/GlowButton';

interface ProductHistoryViewProps {
  products: Product[];
  onOpenProductDetail?: (product: Product) => void;
  onOpenAdjustStock?: (product: Product) => void;
}

export const ProductHistoryView: React.FC<ProductHistoryViewProps> = ({
  products,
  onOpenProductDetail,
  onOpenAdjustStock,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [selectedProductId, setSelectedProductId] = useState<string>('all');
  const [selectedReason, setSelectedReason] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const productMap = useMemo(() => {
    const map = new Map<string, Product>();
    for (const p of products) {
      map.set(p.id, p);
    }
    return map;
  }, [products]);

  const activeProduct = useMemo(() => {
    return selectedProductId !== 'all' ? productMap.get(selectedProductId) : null;
  }, [selectedProductId, productMap]);

  const fetchMovements = async () => {
    setIsLoading(true);
    try {
      const endpoint =
        selectedProductId !== 'all'
          ? `/api/products/movements?productId=${selectedProductId}`
          : '/api/products/movements';
      const response = await api.get<StockMovement[]>(endpoint);
      if (response.data) {
        setMovements(response.data);
      }
    } catch {
      setMovements([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, [selectedProductId]);

  const reasonsList = [
    'all',
    'Supplier Delivery',
    'Store Sale',
    'Damaged / Loss',
    'Physical Inventory Count',
    'Return to Stock',
    'Initial inventory setup',
  ];

  const filteredMovements = useMemo(() => {
    return movements.filter((m) => {
      if (selectedReason !== 'all' && m.reason !== selectedReason) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const prod = productMap.get(m.productId);
        const prodName = prod?.name.toLowerCase() || '';
        const prodSku = prod?.sku.toLowerCase() || '';
        const reason = m.reason?.toLowerCase() || '';
        const user = m.adjustedBy?.toLowerCase() || '';
        if (
          !prodName.includes(query) &&
          !prodSku.includes(query) &&
          !reason.includes(query) &&
          !user.includes(query)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [movements, selectedReason, searchQuery, productMap]);

  const stats = useMemo(() => {
    let inflow = 0;
    let outflow = 0;
    let net = 0;

    for (const m of movements) {
      if (m.quantityDelta > 0) {
        inflow += m.quantityDelta;
      } else {
        outflow += Math.abs(m.quantityDelta);
      }
      net += m.quantityDelta;
    }

    return {
      totalCount: movements.length,
      inflow,
      outflow,
      net,
    };
  }, [movements]);

  const currencySymbol = useMemo(() => {
    if (activeProduct) {
      return getCurrencySymbol(activeProduct.currency);
    }
    const stored = getStoredStoreCurrency();
    return getCurrencySymbol(stored);
  }, [activeProduct]);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#ff6b00]">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                Product Audit & History
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400">
                Immutable audit trail tracking all stock adjustments, supplier batches, and inventory transitions.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <GlowButton
            variant="secondary"
            onClick={fetchMovements}
            disabled={isLoading}
            className="flex items-center gap-2 text-xs py-2 px-3.5"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Audit</span>
          </GlowButton>

          {activeProduct && onOpenAdjustStock && (
            <GlowButton
              variant="primary"
              onClick={() => onOpenAdjustStock(activeProduct)}
              className="flex items-center gap-2 text-xs py-2 px-3.5"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Adjust This Product</span>
            </GlowButton>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`p-4 rounded-2xl border backdrop-blur-xl ${
            isLight ? 'bg-white border-zinc-200 shadow-sm' : 'bg-[#0f0f15]/80 border-white/5 shadow-lg'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Total Audit Logs</span>
            <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center text-[#ff6b00]">
              <History className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className={`text-2xl font-black mt-2 tracking-tight ${isLight ? 'text-zinc-900' : 'text-white'}`}>
            {stats.totalCount}
          </p>
          <p className="text-[11px] text-zinc-500 mt-0.5">Recorded timeline events</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className={`p-4 rounded-2xl border backdrop-blur-xl ${
            isLight ? 'bg-white border-zinc-200 shadow-sm' : 'bg-[#0f0f15]/80 border-white/5 shadow-lg'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Units Inflow</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-black mt-2 tracking-tight text-emerald-500">
            +{stats.inflow.toLocaleString()}
          </p>
          <p className="text-[11px] text-zinc-500 mt-0.5">Added to store inventory</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className={`p-4 rounded-2xl border backdrop-blur-xl ${
            isLight ? 'bg-white border-zinc-200 shadow-sm' : 'bg-[#0f0f15]/80 border-white/5 shadow-lg'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Units Outflow</span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
              <ArrowDownRight className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-black mt-2 tracking-tight text-rose-500">
            -{stats.outflow.toLocaleString()}
          </p>
          <p className="text-[11px] text-zinc-500 mt-0.5">Deducted (sales / loss)</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className={`p-4 rounded-2xl border backdrop-blur-xl ${
            isLight ? 'bg-white border-zinc-200 shadow-sm' : 'bg-[#0f0f15]/80 border-white/5 shadow-lg'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Net Inventory Shift</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <p
            className={`text-2xl font-black mt-2 tracking-tight ${
              stats.net >= 0 ? 'text-emerald-500' : 'text-rose-500'
            }`}
          >
            {stats.net >= 0 ? `+${stats.net.toLocaleString()}` : stats.net.toLocaleString()}
          </p>
          <p className="text-[11px] text-zinc-500 mt-0.5">Net unit variation</p>
        </motion.div>
      </div>

      <div
        className={`p-4 rounded-2xl border backdrop-blur-xl space-y-4 ${
          isLight ? 'bg-white border-zinc-200 shadow-sm' : 'bg-[#0f0f15]/80 border-white/5 shadow-lg'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search history by product, SKU, user, or reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs border outline-none transition-all ${
                  isLight
                    ? 'bg-[#f6f6f8] border-zinc-200 text-zinc-900 focus:bg-white focus:border-[#ff6b00]'
                    : 'bg-white/5 border-white/10 text-white focus:border-[#ff6b00]'
                }`}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                aria-label="Filter by product"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className={`text-xs px-3 py-2 rounded-xl border outline-none cursor-pointer appearance-none pr-8 font-medium ${
                  isLight
                    ? 'bg-[#f6f6f8] border-zinc-200 text-zinc-900'
                    : 'bg-white/5 border-white/10 text-white'
                }`}
              >
                <option value="all" className={isLight ? 'bg-white text-zinc-900' : 'bg-[#14141d] text-white'}>
                  All Catalog Products ({products.length})
                </option>
                {products.map((p) => (
                  <option
                    key={p.id}
                    value={p.id}
                    className={isLight ? 'bg-white text-zinc-900' : 'bg-[#14141d] text-white'}
                  >
                    {p.name} ({p.sku}) • {p.quantityOnHand} units
                  </option>
                ))}
              </select>
              <SlidersHorizontal className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <Filter className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span className="text-[11px] text-zinc-400 shrink-0 font-medium">Reason:</span>
          {reasonsList.map((reason) => {
            const isSelected = selectedReason === reason;
            return (
              <button
                key={reason}
                onClick={() => setSelectedReason(reason)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#ff4500] to-[#ffa500] text-white border-transparent shadow-md shadow-orange-500/20'
                    : isLight
                    ? 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:bg-zinc-200'
                    : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {reason === 'all' ? 'All Reasons' : reason}
              </button>
            );
          })}
        </div>

        {activeProduct && (
          <div
            className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              isLight ? 'bg-orange-50/60 border-orange-200/80' : 'bg-orange-500/10 border-orange-500/20'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-orange-500/20 flex items-center justify-center text-[#ff6b00] font-bold text-sm">
                {activeProduct.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-sm ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                    {activeProduct.name}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">
                    {activeProduct.sku}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Current Stock: <strong className={isLight ? 'text-zinc-900' : 'text-white'}>{activeProduct.quantityOnHand} units</strong> • Cost: {currencySymbol}{activeProduct.costPrice} • Sell: {currencySymbol}{activeProduct.sellingPrice}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onOpenProductDetail && (
                <button
                  onClick={() => onOpenProductDetail(activeProduct)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-zinc-500/10 hover:bg-zinc-500/20 text-zinc-300 transition-colors font-medium"
                >
                  Inspect Telemetry
                </button>
              )}
              <button
                onClick={() => setSelectedProductId('all')}
                className="text-xs text-orange-400 hover:underline font-semibold"
              >
                Clear Filter
              </button>
            </div>
          </div>
        )}
      </div>

      <div
        className={`rounded-2xl border backdrop-blur-xl overflow-hidden ${
          isLight ? 'bg-white border-zinc-200 shadow-sm' : 'bg-[#0f0f15]/80 border-white/5 shadow-lg'
        }`}
      >
        <div className="px-5 py-3.5 border-b border-white/5 flex items-center justify-between">
          <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
            Audit Trail Feed ({filteredMovements.length})
          </span>
          <span className="text-xs text-zinc-500">Chronological • Real-Time</span>
        </div>

        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <RotateCcw className="w-6 h-6 text-[#ff6b00] animate-spin" />
            <span className="text-xs text-zinc-400 font-medium">Loading product movement timeline...</span>
          </div>
        ) : filteredMovements.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-500/10 flex items-center justify-center text-zinc-400">
              <History className="w-6 h-6" />
            </div>
            <div>
              <p className={`text-sm font-bold ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                No movement logs match the criteria
              </p>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm">
                Adjust filters or select a different product. Any stock changes, deliveries, or initial setups will appear here.
              </p>
            </div>
            {selectedReason !== 'all' || searchQuery.trim() || selectedProductId !== 'all' ? (
              <button
                onClick={() => {
                  setSelectedReason('all');
                  setSearchQuery('');
                  setSelectedProductId('all');
                }}
                className="text-xs font-semibold text-[#ff6b00] hover:underline mt-1"
              >
                Reset All Filters
              </button>
            ) : null}
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            <AnimatePresence>
              {filteredMovements.map((movement, idx) => {
                const product = productMap.get(movement.productId);
                const isPositive = movement.quantityDelta > 0;
                const isZero = movement.quantityDelta === 0;
                const deltaColor = isPositive
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                  : isZero
                  ? 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20'
                  : 'text-rose-400 bg-rose-500/10 border-rose-500/20';

                const formattedDate = new Date(movement.createdAt).toLocaleString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <motion.div
                    key={movement.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: Math.min(idx * 0.03, 0.4) }}
                    className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                      isLight ? 'hover:bg-zinc-50' : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${deltaColor}`}
                      >
                        {isPositive ? (
                          <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                        ) : isZero ? (
                          <Layers className="w-5 h-5 text-zinc-400" />
                        ) : (
                          <ArrowDownRight className="w-5 h-5 text-rose-400" />
                        )}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`font-bold text-sm ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                            {product?.name || 'Catalog Item'}
                          </span>
                          {product?.sku && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">
                              {product.sku}
                            </span>
                          )}
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                              movement.reason === 'Initial inventory setup'
                                ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                : movement.reason === 'Supplier Delivery'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : movement.reason === 'Store Sale'
                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                : movement.reason === 'Damaged / Loss'
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                : isLight
                                ? 'bg-zinc-100 text-zinc-700 border-zinc-200'
                                : 'bg-white/5 text-zinc-300 border-white/10'
                            }`}
                          >
                            {movement.reason || 'Stock adjustment'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-zinc-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                            {formattedDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-zinc-400" />
                            {movement.adjustedBy || 'Owner'}
                          </span>
                          {product && (
                            <span className="text-[11px] text-zinc-400">
                              Unit Impact: {currencySymbol}
                              {(Math.abs(movement.quantityDelta) * Number(product.sellingPrice)).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-white/5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-base font-black px-2.5 py-1 rounded-lg border ${deltaColor}`}
                        >
                          {isPositive ? `+${movement.quantityDelta}` : movement.quantityDelta} units
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-400 mt-1 font-mono">
                        {movement.previousQuantity} &rarr; {movement.resultingQuantity} units
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
