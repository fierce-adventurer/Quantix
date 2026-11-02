import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  Plus,
  Search,
  Layers,
  AlertTriangle,
  Coins,
  RefreshCw,
  X,
  ChevronRight,
} from 'lucide-react';
import { Product, getCurrencySymbol, getStoredStoreCurrency } from '../../types/product';
import { useTheme } from '../../context/theme-context';
import { GlowButton } from '../ui/GlowButton';

export interface ProductCatalogViewProps {
  products: Product[];
  isLoading: boolean;
  onRefresh: () => void;
  onOpenCreate: () => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductCatalogView: React.FC<ProductCatalogViewProps> = ({
  products,
  isLoading,
  onRefresh,
  onOpenCreate,
  onSelectProduct,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'in-stock' | 'low-stock' | 'out-of-stock'>('all');
  const storeCurrency = getStoredStoreCurrency();

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        (product.currency && product.currency.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      const threshold = product.lowStockThreshold !== undefined && product.lowStockThreshold !== null
        ? product.lowStockThreshold
        : 5;
      if (filterTab === 'in-stock') {
        return product.quantityOnHand > threshold;
      }
      if (filterTab === 'low-stock') {
        return product.quantityOnHand > 0 && product.quantityOnHand <= threshold;
      }
      if (filterTab === 'out-of-stock') {
        return product.quantityOnHand === 0;
      }
      return true;
    });
  }, [products, searchQuery, filterTab]);

  const metrics = useMemo(() => {
    const totalProducts = products.length;
    const totalUnits = products.reduce((acc, p) => acc + (p.quantityOnHand || 0), 0);
    const lowStockCount = products.filter((p) => {
      const t = p.lowStockThreshold !== undefined && p.lowStockThreshold !== null ? p.lowStockThreshold : 5;
      return p.quantityOnHand <= t;
    }).length;
    const inventoryValuation = products.reduce((acc, p) => {
      const price = p.sellingPrice || p.costPrice || 0;
      return acc + (p.quantityOnHand || 0) * price;
    }, 0);

    const activeCurrency = products.length > 0 ? (products[0].currency || storeCurrency) : storeCurrency;

    return { totalProducts, totalUnits, lowStockCount, inventoryValuation, activeCurrency };
  }, [products, storeCurrency]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isLight ? 'text-zinc-900' : 'text-white'}`}>
            Inventory & Products
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Store-partitioned catalog control center. Manage SKUs, stock levels, thresholds, and pricing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            className={`p-2.5 rounded-xl border transition-colors ${
              isLight
                ? 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-600 hover:text-zinc-900 shadow-sm'
                : 'bg-[#14141c] hover:bg-[#1a1a24] border-white/10 text-zinc-400 hover:text-white'
            }`}
            title="Refresh catalog"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-orange-400' : ''}`} />
          </button>
          <GlowButton onClick={onOpenCreate} size="md">
            <Plus className="w-4 h-4 mr-1.5" />
            Add Product
          </GlowButton>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`rounded-2xl p-4 sm:p-5 space-y-2 border ${
          isLight ? 'bg-white border-zinc-200 shadow-sm' : 'glass-panel'
        }`}>
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="font-medium">Total Products</span>
            <Package className="w-4 h-4 text-orange-400" />
          </div>
          <div className={`text-2xl sm:text-3xl font-extrabold ${isLight ? 'text-zinc-900' : 'text-white'}`}>
            {metrics.totalProducts}
          </div>
          <div className="text-[11px] text-zinc-500">Unique SKUs in catalog</div>
        </div>

        <div className={`rounded-2xl p-4 sm:p-5 space-y-2 border ${
          isLight ? 'bg-white border-zinc-200 shadow-sm' : 'glass-panel'
        }`}>
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="font-medium">Units on Hand</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className={`text-2xl sm:text-3xl font-extrabold ${isLight ? 'text-zinc-900' : 'text-white'}`}>
            {metrics.totalUnits.toLocaleString()}
          </div>
          <div className="text-[11px] text-zinc-500">Total units across all items</div>
        </div>

        <div className={`rounded-2xl p-4 sm:p-5 space-y-2 border ${
          isLight ? 'bg-orange-500/5 border-orange-500/30' : 'glass-panel-glow'
        }`}>
          <div className="flex items-center justify-between text-orange-400 text-xs">
            <span className="font-medium">Low Stock Warnings</span>
            <AlertTriangle className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-orange-400">
            {metrics.lowStockCount}
          </div>
          <div className="text-[11px] text-orange-400/80">Items below alert threshold</div>
        </div>

        <div className={`rounded-2xl p-4 sm:p-5 space-y-2 border ${
          isLight ? 'bg-white border-zinc-200 shadow-sm' : 'glass-panel'
        }`}>
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="font-medium">Catalog Valuation</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className={`text-2xl sm:text-3xl font-extrabold flex items-baseline gap-1 ${isLight ? 'text-zinc-900' : 'text-white'}`}>
            <span className="text-lg text-amber-400 font-mono font-semibold">{getCurrencySymbol(metrics.activeCurrency)}</span>
            <span>{metrics.inventoryValuation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="text-[11px] text-zinc-500">Store total in {metrics.activeCurrency}</div>
        </div>
      </div>

      <div className={`rounded-3xl overflow-hidden border ${
        isLight ? 'bg-white border-zinc-200 shadow-sm' : 'glass-panel border-white/10'
      }`}>
        <div className={`p-4 sm:p-6 border-b flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 ${
          isLight ? 'border-zinc-200' : 'border-white/10'
        }`}>
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Instant search by product name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full rounded-xl border pl-10 pr-9 py-2 text-xs sm:text-sm outline-none transition-all ${
                  isLight
                    ? 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/20'
                    : 'bg-[#14141c] border-white/10 text-zinc-100 placeholder:text-zinc-500 focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/20'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className={`flex items-center gap-1.5 p-1 rounded-xl border overflow-x-auto text-xs ${
            isLight ? 'bg-zinc-100 border-zinc-200' : 'bg-[#14141c] border-white/10'
          }`}>
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
                filterTab === 'all'
                  ? isLight ? 'bg-white text-zinc-900 shadow-sm' : 'bg-[#20202c] text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All ({products.length})
            </button>
            <button
              onClick={() => setFilterTab('in-stock')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
                filterTab === 'in-stock'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              In Stock
            </button>
            <button
              onClick={() => setFilterTab('low-stock')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
                filterTab === 'low-stock'
                  ? 'bg-orange-500/20 text-orange-400'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Low Stock
            </button>
            <button
              onClick={() => setFilterTab('out-of-stock')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
                filterTab === 'out-of-stock'
                  ? 'bg-red-500/20 text-red-400'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Depleted
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className={`text-[11px] uppercase tracking-wider font-semibold border-b ${
              isLight ? 'bg-zinc-50 text-zinc-500 border-zinc-200' : 'bg-[#121217] text-zinc-400 border-white/5'
            }`}>
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Product & SKU</th>
                <th className="py-3.5 px-4">Stock on Hand</th>
                <th className="py-3.5 px-4">Threshold</th>
                <th className="py-3.5 px-4">Cost Price</th>
                <th className="py-3.5 px-4">Selling Price</th>
                <th className="py-3.5 px-4 sm:px-6">Status</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-zinc-200' : 'divide-white/5'}`}>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-400">
                    <RefreshCw className="w-6 h-6 animate-spin text-orange-400 mx-auto mb-2" />
                    Loading inventory records...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-400">
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mx-auto mb-3 ${
                      isLight ? 'bg-zinc-100 border-zinc-200 text-zinc-500' : 'bg-[#14141c] border-white/10 text-zinc-500'
                    }`}>
                      <Package className="w-6 h-6" />
                    </div>
                    <div className={`text-base font-semibold mb-1 ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                      {searchQuery ? 'No matching products found' : 'No products in catalog yet'}
                    </div>
                    <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-4">
                      {searchQuery
                        ? `No items match the filter "${searchQuery}". Clear search or try a different SKU.`
                        : 'Begin by adding your first product to this store workspace.'}
                    </p>
                    {!searchQuery && (
                      <GlowButton size="sm" onClick={onOpenCreate}>
                        <Plus className="w-4 h-4 mr-1.5" />
                        Add Product
                      </GlowButton>
                    )}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const threshold = product.lowStockThreshold !== undefined && product.lowStockThreshold !== null
                    ? product.lowStockThreshold
                    : 5;
                  const isOut = product.quantityOnHand === 0;
                  const isLow = !isOut && product.quantityOnHand <= threshold;
                  const symbol = getCurrencySymbol(product.currency);

                  return (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => onSelectProduct(product)}
                      className={`cursor-pointer transition-all group select-none relative ${
                        isLight ? 'hover:bg-zinc-50 active:bg-zinc-100' : 'hover:bg-white/[0.04] active:bg-white/[0.06]'
                      }`}
                    >
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className={`font-semibold group-hover:text-orange-400 transition-colors ${
                          isLight ? 'text-zinc-900' : 'text-white'
                        }`}>
                          {product.name}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                            {product.sku}
                          </span>
                          {product.description && (
                            <span className="text-xs text-zinc-500 truncate max-w-[200px]">
                              {product.description}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold ${
                              isOut
                                ? 'text-red-400'
                                : isLow
                                ? 'text-orange-400'
                                : 'text-emerald-400'
                            }`}
                          >
                            {product.quantityOnHand}
                          </span>
                          <span className="text-[11px] text-zinc-500">units</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-zinc-400 font-mono text-xs">
                        {threshold}
                      </td>

                      <td className="py-3.5 px-4 text-zinc-400 font-mono text-xs">
                        {product.costPrice !== undefined && product.costPrice !== null ? (
                          <span>
                            <span className="text-zinc-500 mr-0.5">{symbol}</span>
                            {Number(product.costPrice).toFixed(2)}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>

                      <td className={`py-3.5 px-4 font-semibold font-mono text-xs ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                        {product.sellingPrice !== undefined && product.sellingPrice !== null ? (
                          <span>
                            <span className="text-orange-400 mr-0.5">{symbol}</span>
                            {Number(product.sellingPrice).toFixed(2)}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>

                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          {isOut ? (
                            <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 text-[11px] font-semibold">
                              Out of Stock
                            </span>
                          ) : isLow ? (
                            <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30 text-[11px] font-semibold inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                              Low Stock
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold">
                              In Stock
                            </span>
                          )}
                          <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-orange-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
