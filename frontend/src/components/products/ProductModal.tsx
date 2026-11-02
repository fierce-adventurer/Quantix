import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Package,
  Tag,
  Layers,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Check,
} from 'lucide-react';
import {
  Product,
  CreateProductInput,
  getCurrencySymbol,
  getStoredStoreCurrency,
} from '../../types/product';
import { useTheme } from '../../context/theme-context';
import { GlassInput } from '../ui/GlassInput';
import { GlowButton } from '../ui/GlowButton';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProductInput) => Promise<void>;
  initialData?: Product | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [quantityOnHand, setQuantityOnHand] = useState<number | ''>(0);
  const [costPrice, setCostPrice] = useState<number | ''>('');
  const [sellingPrice, setSellingPrice] = useState<number | ''>('');
  const [lowStockThreshold, setLowStockThreshold] = useState<number | ''>(5);
  const [modalStep, setModalStep] = useState<1 | 2>(1);
  const [currency, setCurrency] = useState(() => getStoredStoreCurrency());
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!initialData;

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setSku(initialData.sku);
      setDescription(initialData.description || '');
      setQuantityOnHand(initialData.quantityOnHand);
      setCostPrice(initialData.costPrice !== undefined ? initialData.costPrice : '');
      setSellingPrice(initialData.sellingPrice !== undefined ? initialData.sellingPrice : '');
      setLowStockThreshold(initialData.lowStockThreshold !== undefined ? initialData.lowStockThreshold : 5);
      setCurrency(initialData.currency || getStoredStoreCurrency());
    } else {
      setName('');
      setSku('');
      setDescription('');
      setQuantityOnHand(0);
      setCostPrice('');
      setSellingPrice('');
      setLowStockThreshold(5);
      setCurrency(getStoredStoreCurrency());
    }
    setModalStep(1);
    setError(null);
  }, [initialData, isOpen]);

  const changes = useMemo(() => {
    if (!initialData) return [];
    const diffs: { field: string; from: string; to: string }[] = [];
    if (initialData.name.trim() !== name.trim()) {
      diffs.push({ field: 'Product Name', from: initialData.name, to: name.trim() });
    }
    if (initialData.sku.trim().toUpperCase() !== sku.trim().toUpperCase()) {
      diffs.push({ field: 'SKU Code', from: initialData.sku, to: sku.trim().toUpperCase() });
    }
    const currentQty = typeof quantityOnHand === 'number' ? quantityOnHand : 0;
    if (initialData.quantityOnHand !== currentQty) {
      diffs.push({ field: 'Stock on Hand', from: `${initialData.quantityOnHand} units`, to: `${currentQty} units` });
    }
    const currentCost = typeof costPrice === 'number' ? costPrice : undefined;
    if ((initialData.costPrice || undefined) !== currentCost) {
      diffs.push({
        field: 'Cost Price',
        from: initialData.costPrice !== undefined ? `${getCurrencySymbol(initialData.currency)}${Number(initialData.costPrice).toFixed(2)}` : 'None',
        to: currentCost !== undefined ? `${getCurrencySymbol(currency)}${Number(currentCost).toFixed(2)}` : 'None',
      });
    }
    const currentSelling = typeof sellingPrice === 'number' ? sellingPrice : undefined;
    if ((initialData.sellingPrice || undefined) !== currentSelling) {
      diffs.push({
        field: 'Selling Price',
        from: initialData.sellingPrice !== undefined ? `${getCurrencySymbol(initialData.currency)}${Number(initialData.sellingPrice).toFixed(2)}` : 'None',
        to: currentSelling !== undefined ? `${getCurrencySymbol(currency)}${Number(currentSelling).toFixed(2)}` : 'None',
      });
    }
    if ((initialData.currency || 'USD') !== (currency || 'USD')) {
      diffs.push({ field: 'Currency', from: initialData.currency || 'USD', to: currency || 'USD' });
    }
    const currentThreshold = typeof lowStockThreshold === 'number' ? lowStockThreshold : 5;
    if ((initialData.lowStockThreshold || 5) !== currentThreshold) {
      diffs.push({ field: 'Low Stock Threshold', from: `${initialData.lowStockThreshold || 5}`, to: `${currentThreshold}` });
    }
    return diffs;
  }, [initialData, name, sku, quantityOnHand, costPrice, sellingPrice, currency, lowStockThreshold]);

  const handleProceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Product name is required');
      return;
    }
    if (!sku.trim()) {
      setError('SKU is required');
      return;
    }
    const qty = typeof quantityOnHand === 'number' ? quantityOnHand : 0;
    if (qty < 0) {
      setError('Quantity cannot be negative');
      return;
    }

    if (costPrice !== '' && typeof costPrice === 'number' && costPrice < 0) {
      setError('Cost price cannot be negative');
      return;
    }
    if (sellingPrice !== '' && typeof sellingPrice === 'number' && sellingPrice < 0) {
      setError('Selling price cannot be negative');
      return;
    }
    if (lowStockThreshold !== '' && typeof lowStockThreshold === 'number' && lowStockThreshold < 0) {
      setError('Low stock threshold cannot be negative');
      return;
    }

    setModalStep(2);
  };

  const handleFinalApply = async () => {
    const qty = typeof quantityOnHand === 'number' ? quantityOnHand : 0;

    const payload: CreateProductInput = {
      name: name.trim(),
      sku: sku.trim().toUpperCase(),
      description: description.trim() || undefined,
      quantityOnHand: qty,
      costPrice: typeof costPrice === 'number' ? costPrice : undefined,
      sellingPrice: typeof sellingPrice === 'number' ? sellingPrice : undefined,
      lowStockThreshold: typeof lowStockThreshold === 'number' ? lowStockThreshold : 5,
      currency: currency.trim() || getStoredStoreCurrency(),
    };

    setIsSubmitting(true);
    try {
      await onSubmit(payload);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to save product');
      }
      setModalStep(1);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`relative z-10 w-full max-w-xl rounded-3xl p-6 sm:p-7 overflow-hidden my-8 border transition-all ${
              isLight
                ? 'bg-white border-orange-500/25 shadow-2xl shadow-orange-500/10'
                : 'glass-panel-glow border-white/10'
            }`}
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className={`flex items-center justify-between pb-4 border-b mb-5 ${
              isLight ? 'border-zinc-200' : 'border-white/10'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isLight
                    ? 'bg-orange-50 text-orange-600 border border-orange-200'
                    : 'bg-orange-500/10 border border-orange-500/30 text-orange-400'
                }`}>
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-lg font-bold ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                      {isEditMode ? 'Edit Product Details' : 'Add New Product'}
                    </h3>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      isLight
                        ? 'bg-orange-100 text-orange-800 border-orange-200'
                        : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                    }`}>
                      Step {modalStep} of 2
                    </span>
                  </div>
                  <p className={`text-xs ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    {modalStep === 1
                      ? isEditMode
                        ? 'Update item specifications, pricing, and stock metrics'
                        : 'Register a new catalog item under your store partition'
                      : 'Review proposed modifications before applying changes'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                  isLight
                    ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {modalStep === 1 ? (
              <form onSubmit={handleProceedToStep2} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <GlassInput
                    label="Product Name *"
                    type="text"
                    placeholder="e.g. Wireless Ergonomic Mouse"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    icon={<Package className="w-4 h-4" />}
                    required
                  />

                  <GlassInput
                    label="SKU (Unique per Store) *"
                    type="text"
                    placeholder="e.g. MSE-WL-01"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    icon={<Tag className="w-4 h-4" />}
                    required
                  />
                </div>

                <div className="w-full space-y-1">
                  <label className={`block text-[11px] tracking-wide transition-colors ${
                    isLight ? 'font-semibold text-zinc-700' : 'font-medium text-zinc-300'
                  }`}>
                    Description (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide brief product specifications, dimensions, or tags..."
                    className={`w-full rounded-xl px-3.5 py-2 text-sm transition-all duration-200 outline-none resize-none border ${
                      isLight
                        ? 'bg-[#f6f6f8] border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/20 shadow-sm'
                        : 'bg-[#13131a] border-white/10 text-zinc-100 placeholder:text-zinc-500 focus:bg-[#161622] focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/20'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <GlassInput
                    compact
                    label="Quantity on Hand *"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={quantityOnHand}
                    onChange={(e) =>
                      setQuantityOnHand(e.target.value === '' ? '' : parseInt(e.target.value, 10))
                    }
                    icon={<Layers className="w-4 h-4" />}
                    required
                  />

                  <GlassInput
                    compact
                    label={`Cost Price (${getCurrencySymbol(currency)})`}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={costPrice}
                    onChange={(e) =>
                      setCostPrice(e.target.value === '' ? '' : parseFloat(e.target.value))
                    }
                    icon={<span className="text-xs font-mono font-bold text-orange-500">{getCurrencySymbol(currency)}</span>}
                  />

                  <GlassInput
                    compact
                    label={`Selling Price (${getCurrencySymbol(currency)})`}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={sellingPrice}
                    onChange={(e) =>
                      setSellingPrice(e.target.value === '' ? '' : parseFloat(e.target.value))
                    }
                    icon={<span className="text-xs font-mono font-bold text-orange-500">{getCurrencySymbol(currency)}</span>}
                  />
                </div>

                <div className={`p-3.5 rounded-2xl flex items-center justify-between gap-4 border transition-colors ${
                  isLight
                    ? 'bg-orange-50/50 border-orange-200/70 text-zinc-900 shadow-sm'
                    : 'bg-[#13131c] border-white/5 text-white'
                }`}>
                  <div>
                    <div className={`text-xs font-semibold ${isLight ? 'text-zinc-900' : 'text-zinc-200'}`}>
                      Low Stock Alert Threshold
                    </div>
                    <div className={`text-[11px] ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                      Flag product with amber badge when units reach or drop below this count.
                    </div>
                  </div>
                  <div className="w-24 shrink-0">
                    <input
                      type="number"
                      min="0"
                      placeholder="5"
                      value={lowStockThreshold}
                      onChange={(e) =>
                        setLowStockThreshold(e.target.value === '' ? '' : parseInt(e.target.value, 10))
                      }
                      className={`w-full text-center rounded-xl px-2 py-1.5 text-sm font-semibold outline-none border transition-all ${
                        isLight
                          ? 'bg-white border-zinc-300 text-zinc-900 focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/20 shadow-sm'
                          : 'bg-[#181822] border-white/10 text-zinc-100 focus:border-[#ff6b00]'
                      }`}
                    />
                  </div>
                </div>

                <div className={`flex items-center justify-end gap-3 pt-3 border-t ${
                  isLight ? 'border-zinc-200' : 'border-white/10'
                }`}>
                  <GlowButton type="button" variant="secondary" size="md" onClick={onClose}>
                    Cancel
                  </GlowButton>
                  <GlowButton type="submit" size="md">
                    <span>Next: Review & Apply</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </GlowButton>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                {isEditMode ? (
                  <div className="space-y-3">
                    <div className={`flex items-center justify-between text-xs font-semibold ${
                      isLight ? 'text-zinc-800' : 'text-zinc-300'
                    }`}>
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-orange-500" />
                        <span>Proposed Modifications for {initialData?.sku}</span>
                      </span>
                      <span className={`text-[11px] font-normal ${isLight ? 'text-zinc-500' : 'text-zinc-500'}`}>
                        {changes.length} {changes.length === 1 ? 'change' : 'changes'} detected
                      </span>
                    </div>

                    {changes.length > 0 ? (
                      <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                        {changes.map((c, i) => (
                          <div
                            key={i}
                            className={`p-3 rounded-xl border flex items-center justify-between text-xs gap-3 ${
                              isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#13131c] border-white/5'
                            }`}
                          >
                            <span className={`font-medium shrink-0 ${isLight ? 'text-zinc-700' : 'text-zinc-400'}`}>
                              {c.field}
                            </span>
                            <div className="flex items-center gap-2 text-right">
                              <span className={`line-through truncate max-w-[120px] ${
                                isLight ? 'text-zinc-400' : 'text-zinc-500'
                              }`}>
                                {c.from}
                              </span>
                              <ArrowRight className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                              <span className={`font-semibold truncate max-w-[160px] ${
                                isLight ? 'text-emerald-700' : 'text-emerald-400'
                              }`}>
                                {c.to}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`p-4 rounded-2xl border text-center text-xs ${
                        isLight ? 'bg-zinc-50 border-zinc-200 text-zinc-500' : 'bg-[#13131c] border-white/5 text-zinc-400'
                      }`}>
                        <CheckCircle2 className="w-5 h-5 text-zinc-400 mx-auto mb-1.5" />
                        <span>No attribute values were modified. Applying will keep current records intact.</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className={`text-xs font-semibold flex items-center gap-1.5 ${
                      isLight ? 'text-zinc-800' : 'text-zinc-300'
                    }`}>
                      <ShieldCheck className="w-4 h-4 text-orange-500" />
                      <span>Confirm Catalog Registration</span>
                    </div>
                    <div className={`p-4 rounded-2xl border grid grid-cols-2 gap-3 text-xs ${
                      isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#13131c] border-white/5'
                    }`}>
                      <div>
                        <span className={`text-[11px] ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>Product Name</span>
                        <div className={`font-semibold ${isLight ? 'text-zinc-900' : 'text-white'}`}>{name}</div>
                      </div>
                      <div>
                        <span className={`text-[11px] ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>SKU</span>
                        <div className="font-mono font-semibold text-orange-500">{sku.toUpperCase()}</div>
                      </div>
                      <div>
                        <span className={`text-[11px] ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>Initial Stock</span>
                        <div className={`font-semibold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                          {quantityOnHand || 0} units
                        </div>
                      </div>
                      <div>
                        <span className={`text-[11px] ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>Selling Price</span>
                        <div className={`font-mono font-bold ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                          {sellingPrice ? `${getCurrencySymbol(currency)}${Number(sellingPrice).toFixed(2)}` : '—'}
                        </div>
                      </div>
                      <div>
                        <span className={`text-[11px] ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>Currency</span>
                        <div className={`font-medium ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>{currency}</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className={`flex items-center justify-between pt-3 border-t ${
                  isLight ? 'border-zinc-200' : 'border-white/10'
                }`}>
                  <button
                    type="button"
                    onClick={() => setModalStep(1)}
                    disabled={isSubmitting}
                    className={`px-3 py-2 text-xs font-medium flex items-center gap-1 transition-colors disabled:opacity-50 ${
                      isLight ? 'text-zinc-600 hover:text-zinc-900' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Edit</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <GlowButton type="button" variant="secondary" size="md" onClick={onClose} disabled={isSubmitting}>
                      Cancel
                    </GlowButton>
                    <GlowButton type="button" size="md" onClick={handleFinalApply} isLoading={isSubmitting}>
                      <Check className="w-4 h-4 mr-1.5" />
                      <span>{isEditMode ? 'Confirm & Apply Changes' : 'Confirm & Add to Catalog'}</span>
                    </GlowButton>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
