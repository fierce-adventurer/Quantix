import React from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  Layers,
  AlertTriangle,
  Coins,
  Plus,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { Product, getCurrencySymbol, getStoredStoreCurrency } from '../../types/product';
import { useAuth } from '../../context/auth-context';
import { useTheme } from '../../context/theme-context';
import { GlowButton } from '../ui/GlowButton';
import { LinearProfitGraph } from './LinearProfitGraph';

interface DashboardViewProps {
  products: Product[];
  isLoading: boolean;
  onRefresh: () => void;
  onAddProduct: () => void;
  onViewProductDetail: (product: Product) => void;
  onNavigateToProducts: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  products,
  isLoading,
  onRefresh,
  onAddProduct,
  onViewProductDetail,
  onNavigateToProducts,
}) => {
  const { tenant } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const currency = getStoredStoreCurrency();
  const symbol = getCurrencySymbol(currency);

  const totalProducts = products.length;
  const totalUnits = products.reduce((acc, p) => acc + (p.quantityOnHand || 0), 0);

  const lowStockProducts = products.filter((p) => {
    const threshold = p.lowStockThreshold !== undefined && p.lowStockThreshold !== null
      ? p.lowStockThreshold
      : 5;
    return p.quantityOnHand <= threshold;
  });

  const outOfStockCount = products.filter((p) => p.quantityOnHand === 0).length;

  const totalValuation = products.reduce((acc, p) => {
    const price = p.sellingPrice || p.costPrice || 0;
    return acc + (p.quantityOnHand || 0) * price;
  }, 0);

  const toTitleCase = (str: string): string => {
    if (!str) return '';
    return str
      .toLowerCase()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formattedStoreName = tenant?.name ? toTitleCase(tenant.name) : '';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isLight ? 'text-zinc-900' : 'text-white'}`}>
            {formattedStoreName ? `${formattedStoreName} Dashboard` : 'Store Dashboard'}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Real-time stock velocity, catalog telemetry, and low-inventory monitors for {formattedStoreName || 'your store'}.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onRefresh}
            className={`p-2.5 rounded-xl border transition-colors ${
              isLight
                ? 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-600 hover:text-zinc-900 shadow-sm'
                : 'bg-[#14141c] hover:bg-[#1a1a24] border-white/10 text-zinc-400 hover:text-white'
            }`}
            title="Refresh metrics"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-orange-400' : ''}`} />
          </button>

          <GlowButton onClick={onAddProduct} size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Add Product</span>
          </GlowButton>
        </div>
      </div>

      <LinearProfitGraph products={products} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`p-5 rounded-3xl border transition-all relative overflow-hidden ${
            isLight
              ? 'bg-white border-zinc-200 shadow-sm'
              : 'bg-[#121219] border-white/10'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Total Products
            </span>
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-3xl font-black tracking-tight ${isLight ? 'text-zinc-900' : 'text-white'}`}>
            {totalProducts}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">
            Active SKUs in store partition
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className={`p-5 rounded-3xl border transition-all relative overflow-hidden ${
            isLight
              ? 'bg-white border-zinc-200 shadow-sm'
              : 'bg-[#121219] border-white/10'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Total Units
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-3xl font-black tracking-tight ${isLight ? 'text-zinc-900' : 'text-white'}`}>
            {totalUnits.toLocaleString()}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">
            Aggregate physical inventory
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className={`p-5 rounded-3xl border transition-all relative overflow-hidden ${
            isLight
              ? 'bg-white border-zinc-200 shadow-sm'
              : 'bg-[#121219] border-white/10'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Asset Valuation
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-3xl font-black tracking-tight font-mono ${isLight ? 'text-zinc-900' : 'text-white'}`}>
            {symbol}{totalValuation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">
            Cumulative stock valuation ({currency})
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className={`p-5 rounded-3xl border transition-all relative overflow-hidden ${
            lowStockProducts.length > 0
              ? 'bg-orange-500/10 border-orange-500/30'
              : isLight
              ? 'bg-white border-zinc-200 shadow-sm'
              : 'bg-[#121219] border-white/10'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-orange-400">
              Low Stock Alerts
            </span>
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black tracking-tight text-orange-400">
            {lowStockProducts.length}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            {outOfStockCount > 0 ? `${outOfStockCount} completely depleted` : 'Needs replenishment'}
          </div>
        </motion.div>
      </div>

      <div className={`rounded-3xl border overflow-hidden ${
        isLight ? 'bg-white border-zinc-200 shadow-sm' : 'bg-[#121218] border-white/10'
      }`}>
        <div className={`p-5 border-b flex items-center justify-between ${
          isLight ? 'border-zinc-200' : 'border-white/10'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div>
              <h2 className={`text-base font-bold tracking-tight ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                Low Stock Items Section (FR-6)
              </h2>
              <p className="text-xs text-zinc-400">
                Products reaching or below their low-stock replenishment threshold.
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateToProducts}
            className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors"
          >
            <span>View All Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {lowStockProducts.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className={`text-base font-bold ${isLight ? 'text-zinc-900' : 'text-white'}`}>
              Healthy Stock Levels
            </div>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1">
              All catalog items have inventory counts strictly exceeding their low-stock thresholds.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className={`text-[11px] uppercase tracking-wider font-semibold border-b ${
                isLight ? 'bg-zinc-50 text-zinc-500 border-zinc-200' : 'bg-[#0f0f15] text-zinc-400 border-white/5'
              }`}>
                <tr>
                  <th className="py-3 px-5">Name</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Quantity on Hand</th>
                  <th className="py-3 px-4">Low Stock Threshold</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isLight ? 'divide-zinc-200' : 'divide-white/5'}`}>
                {lowStockProducts.map((product) => {
                  const threshold = product.lowStockThreshold !== undefined && product.lowStockThreshold !== null
                    ? product.lowStockThreshold
                    : 5;
                  const isDepleted = product.quantityOnHand === 0;

                  return (
                    <tr
                      key={product.id}
                      onClick={() => onViewProductDetail(product)}
                      className={`cursor-pointer transition-colors ${
                        isLight ? 'hover:bg-zinc-50' : 'hover:bg-white/[0.04]'
                      }`}
                    >
                      <td className="py-3.5 px-5">
                        <div className={`font-semibold ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                          {product.name}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-xs text-orange-400">
                        {product.sku}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          isDepleted
                            ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                            : 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isDepleted ? 'bg-red-400' : 'bg-orange-400 animate-pulse'}`} />
                          {product.quantityOnHand} units
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-zinc-400 text-xs">
                        {threshold}
                      </td>

                      <td className="py-3.5 px-5 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewProductDetail(product);
                          }}
                          className="px-3 py-1 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-xs font-semibold border border-orange-500/30 transition-colors"
                        >
                          Quick Restock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
