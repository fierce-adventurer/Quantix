import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Tag,
  MapPin,
  Layers,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Clock,
  Coins,
  ShieldCheck,
  Check,
  ChevronRight,
} from 'lucide-react';
import { Product, getCurrencySymbol, UpdateProductInput } from '../../types/product';
import { api } from '../../lib/api';
import { GlowButton } from '../ui/GlowButton';

interface ProductDetailFloatingWindowProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onProductUpdated: (updated: Product) => void;
}

export const ProductDetailFloatingWindow: React.FC<ProductDetailFloatingWindowProps> = ({
  product,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onProductUpdated,
}) => {
  const [stockInput, setStockInput] = useState<number>(0);
  const [isStockReviewing, setIsStockReviewing] = useState(false);
  const [isUpdatingStock, setIsUpdatingStock] = useState(false);
  const [stockSuccessMessage, setStockSuccessMessage] = useState<string | null>(null);
  const [stockError, setStockError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setStockInput(product.quantityOnHand);
      setIsStockReviewing(false);
      setStockSuccessMessage(null);
      setStockError(null);
    }
  }, [product, isOpen]);

  if (!product) return null;

  const symbol = getCurrencySymbol(product.currency);
  const threshold = product.lowStockThreshold !== undefined ? product.lowStockThreshold : 5;
  const isOutOfStock = product.quantityOnHand === 0;
  const isLowStock = !isOutOfStock && product.quantityOnHand <= threshold;
  const stockDiff = stockInput - product.quantityOnHand;

  const cost = Number(product.costPrice || 0);
  const selling = Number(product.sellingPrice || 0);
  const marginPerUnit = selling - cost;
  const marginPercent = cost > 0 ? ((marginPerUnit / cost) * 100).toFixed(1) : null;
  const totalValuation = (product.quantityOnHand * selling).toFixed(2);

  const handleStep1StockReview = () => {
    if (stockInput < 0) {
      setStockError('Stock quantity cannot be negative');
      return;
    }
    if (stockInput === product.quantityOnHand) {
      setStockError('No stock change detected');
      return;
    }
    setStockError(null);
    setIsStockReviewing(true);
  };

  const handleStep2ApplyStockChange = async () => {
    setIsUpdatingStock(true);
    setStockError(null);

    const payload: UpdateProductInput = {
      name: product.name,
      sku: product.sku,
      description: product.description,
      quantityOnHand: stockInput,
      costPrice: product.costPrice,
      sellingPrice: product.sellingPrice,
      lowStockThreshold: product.lowStockThreshold,
      currency: product.currency,
      locationType: product.locationType,
    };

    try {
      const response = await api.put<Product>(`/api/products/${product.id}`, payload);
      if (response.data) {
        onProductUpdated(response.data);
        setIsStockReviewing(false);
        setStockSuccessMessage(`Stock updated from ${product.quantityOnHand} to ${stockInput} units`);
        setTimeout(() => setStockSuccessMessage(null), 3500);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setStockError(err.message);
      } else {
        setStockError('Failed to update stock');
      }
      setIsStockReviewing(false);
    } finally {
      setIsUpdatingStock(false);
    }
  };

  const cancelStockReview = () => {
    setIsStockReviewing(false);
    setStockInput(product.quantityOnHand);
    setStockError(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', damping: 26, stiffness: 340 }}
            className="relative z-10 w-full max-w-2xl glass-panel-glow rounded-3xl p-6 sm:p-8 overflow-hidden my-6 border border-orange-500/30 shadow-2xl shadow-orange-950/40"
          >
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex items-start justify-between gap-4 pb-5 border-b border-white/10 mb-6">
              <div className="space-y-1.5 flex-1 pr-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-lg bg-orange-500/15 text-orange-300 border border-orange-500/30 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>{product.sku}</span>
                  </span>

                  {product.locationType && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#181824] border border-white/10 text-xs text-zinc-300">
                      <MapPin className="w-3 h-3 text-orange-400" />
                      <span>{product.locationType}</span>
                    </span>
                  )}

                  <span className="text-xs px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-zinc-400 font-mono">
                    {product.currency || 'USD'} ({symbol})
                  </span>

                  {isOutOfStock ? (
                    <span className="px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30 text-xs font-semibold">
                      Out of Stock
                    </span>
                  ) : isLowStock ? (
                    <span className="px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30 text-xs font-semibold inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                      Low Stock Alert
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                      Healthy Stock
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {product.name}
                </h2>

                {product.description ? (
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed pt-1">
                    {product.description}
                  </p>
                ) : (
                  <p className="text-xs text-zinc-500 italic pt-1">
                    No product description provided.
                  </p>
                )}
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {stockSuccessMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{stockSuccessMessage}</span>
              </motion.div>
            )}

            {stockError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{stockError}</span>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-[#13131c] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-300 text-xs font-semibold uppercase tracking-wider">
                    <Layers className="w-4 h-4 text-orange-400" />
                    <span>Quick Stock Management</span>
                  </div>
                  <span className="text-[11px] text-zinc-500">
                    Threshold: {threshold}
                  </span>
                </div>

                {!isStockReviewing ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#0e0e14] border border-white/10">
                      <div>
                        <div className="text-[11px] text-zinc-400">Current Stock</div>
                        <div className="text-2xl font-extrabold text-white">
                          {product.quantityOnHand}{' '}
                          <span className="text-xs font-normal text-zinc-500">units</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setStockInput((prev) => Math.max(0, prev - 1))}
                          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white font-bold flex items-center justify-center transition-colors border border-white/10 active:scale-95"
                          title="Decrease 1"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={stockInput}
                          onChange={(e) => {
                            const val = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                            setStockInput(isNaN(val) ? 0 : Math.max(0, val));
                          }}
                          className="w-16 text-center font-bold font-mono text-base rounded-lg bg-[#181822] border border-orange-500/40 text-orange-300 py-1 outline-none focus:ring-2 focus:ring-orange-500/30"
                        />
                        <button
                          type="button"
                          onClick={() => setStockInput((prev) => prev + 1)}
                          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white font-bold flex items-center justify-center transition-colors border border-white/10 active:scale-95"
                          title="Increase 1"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-400">
                        {stockDiff !== 0 ? (
                          <span className={stockDiff > 0 ? 'text-emerald-400' : 'text-red-400'}>
                            Pending change: {stockDiff > 0 ? `+${stockDiff}` : stockDiff} units
                          </span>
                        ) : (
                          'Adjust units above to update inventory'
                        )}
                      </span>

                      <button
                        type="button"
                        onClick={handleStep1StockReview}
                        disabled={stockDiff === 0}
                        className="px-3 py-1.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/40 text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 active:scale-95"
                      >
                        <span>Review & Apply</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/30 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-orange-300">
                      <ShieldCheck className="w-4 h-4 text-orange-400" />
                      <span>Step 2: Confirm Stock Adjustment</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 text-xs">
                      <span className="text-zinc-400">Inventory change:</span>
                      <span className="font-mono font-bold text-white flex items-center gap-2">
                        <span className="line-through text-zinc-500">{product.quantityOnHand}</span>
                        <ArrowRight className="w-3 h-3 text-orange-400" />
                        <span className={stockDiff > 0 ? 'text-emerald-400' : 'text-red-400'}>
                          {stockInput} units
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={cancelStockReview}
                        disabled={isUpdatingStock}
                        className="px-2.5 py-1 text-xs text-zinc-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleStep2ApplyStockChange}
                        disabled={isUpdatingStock}
                        className="px-3.5 py-1.5 rounded-xl bg-[#ff6b00] hover:bg-[#e05e00] text-white text-xs font-semibold shadow-lg shadow-orange-600/30 transition-all flex items-center gap-1 active:scale-95 disabled:opacity-50"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isUpdatingStock ? 'Saving...' : 'Apply Stock Change'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-[#13131c] border border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-zinc-300 text-xs font-semibold uppercase tracking-wider">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>Financial Metrics & Valuation</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#0e0e14] border border-white/5 space-y-1">
                    <span className="text-zinc-400">Cost Price</span>
                    <div className="font-mono font-semibold text-white text-sm">
                      {product.costPrice !== undefined ? `${symbol}${Number(product.costPrice).toFixed(2)}` : '—'}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#0e0e14] border border-white/5 space-y-1">
                    <span className="text-zinc-400">Selling Price</span>
                    <div className="font-mono font-bold text-orange-400 text-sm">
                      {product.sellingPrice !== undefined ? `${symbol}${Number(product.sellingPrice).toFixed(2)}` : '—'}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#0e0e14] border border-white/5 space-y-1">
                    <span className="text-zinc-400">Unit Margin</span>
                    <div className="font-mono font-semibold text-emerald-400 text-sm flex items-center gap-1">
                      <span>{marginPerUnit >= 0 ? `+${symbol}${marginPerUnit.toFixed(2)}` : `-${symbol}${Math.abs(marginPerUnit).toFixed(2)}`}</span>
                      {marginPercent && <span className="text-[10px] text-zinc-400">({marginPercent}%)</span>}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#0e0e14] border border-white/5 space-y-1">
                    <span className="text-zinc-400">Total Asset Value</span>
                    <div className="font-mono font-bold text-amber-300 text-sm">
                      {symbol}{Number(totalValuation).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Updated: {new Date(product.updatedAt).toLocaleDateString()}</span>
                  </span>
                  <span>ID: {product.id.slice(0, 8)}...</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDelete(product);
                }}
                className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Product</span>
              </button>

              <div className="flex items-center gap-3">
                <GlowButton variant="secondary" size="md" onClick={onClose}>
                  Close
                </GlowButton>
                <GlowButton
                  size="md"
                  onClick={() => {
                    onClose();
                    onEdit(product);
                  }}
                >
                  <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                  <span>Edit Full Details</span>
                </GlowButton>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
