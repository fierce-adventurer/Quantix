import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Package,
  Tag,
  Layers,
  AlertCircle,
  Compass,
  MapPin,
  Globe,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Check,
} from 'lucide-react';
import {
  Product,
  CreateProductInput,
  CURRENCY_OPTIONS,
  LOCATION_TYPE_OPTIONS,
  getCurrencySymbol,
  detectLocationCurrency,
} from '../../types/product';
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
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [quantityOnHand, setQuantityOnHand] = useState<number | ''>(0);
  const [costPrice, setCostPrice] = useState<number | ''>('');
  const [sellingPrice, setSellingPrice] = useState<number | ''>('');
  const [lowStockThreshold, setLowStockThreshold] = useState<number | ''>(5);
  const [modalStep, setModalStep] = useState<1 | 2>(1);
  const [currencyMode, setCurrencyMode] = useState<'input' | 'location'>('input');
  const [currency, setCurrency] = useState('USD');
  const [countryLocation, setCountryLocation] = useState('United States');
  const [locationType, setLocationType] = useState('Retail Storefront');
  const [detectedInfo, setDetectedInfo] = useState<string | null>(null);
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
      const curr = initialData.currency || 'USD';
      setCurrency(curr);
      const matched = CURRENCY_OPTIONS.find((c) => c.code === curr);
      setCountryLocation(matched ? matched.country : 'United States');
      setLocationType(initialData.locationType || 'Retail Storefront');
    } else {
      setName('');
      setSku('');
      setDescription('');
      setQuantityOnHand(0);
      setCostPrice('');
      setSellingPrice('');
      setLowStockThreshold(5);
      setCurrency('USD');
      setCountryLocation('United States');
      setLocationType('Retail Storefront');
    }
    setModalStep(1);
    setDetectedInfo(null);
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
    if ((initialData.locationType || '') !== (locationType.trim() || '')) {
      diffs.push({ field: 'Storage Location', from: initialData.locationType || 'None', to: locationType.trim() || 'None' });
    }
    const currentThreshold = typeof lowStockThreshold === 'number' ? lowStockThreshold : 5;
    if ((initialData.lowStockThreshold || 5) !== currentThreshold) {
      diffs.push({ field: 'Low Stock Threshold', from: `${initialData.lowStockThreshold || 5}`, to: `${currentThreshold}` });
    }
    return diffs;
  }, [initialData, name, sku, quantityOnHand, costPrice, sellingPrice, currency, locationType, lowStockThreshold]);

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    const matched = CURRENCY_OPTIONS.find((c) => c.code === newCurrency);
    if (matched) {
      setCountryLocation(matched.country);
    }
  };

  const handleCountryChange = (countryName: string) => {
    setCountryLocation(countryName);
    const matched = CURRENCY_OPTIONS.find((c) => c.country === countryName);
    if (matched) {
      setCurrency(matched.code);
    }
  };

  const handleDetectLocation = () => {
    const detected = detectLocationCurrency();
    setCountryLocation(detected.country);
    setCurrency(detected.currency);
    setDetectedInfo(`Detected: ${detected.country} (${detected.currency})`);
    setTimeout(() => setDetectedInfo(null), 3500);
  };

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
      setError('Quantity on hand cannot be negative');
      return;
    }
    if (typeof costPrice === 'number' && costPrice < 0) {
      setError('Cost price cannot be negative');
      return;
    }
    if (typeof sellingPrice === 'number' && sellingPrice < 0) {
      setError('Selling price cannot be negative');
      return;
    }
    if (typeof lowStockThreshold === 'number' && lowStockThreshold < 0) {
      setError('Low stock threshold cannot be negative');
      return;
    }

    setModalStep(2);
  };

  const handleFinalApply = async () => {
    setError(null);
    const qty = typeof quantityOnHand === 'number' ? quantityOnHand : 0;

    const payload: CreateProductInput = {
      name: name.trim(),
      sku: sku.trim().toUpperCase(),
      description: description.trim() || undefined,
      quantityOnHand: qty,
      costPrice: typeof costPrice === 'number' ? costPrice : undefined,
      sellingPrice: typeof sellingPrice === 'number' ? sellingPrice : undefined,
      lowStockThreshold: typeof lowStockThreshold === 'number' ? lowStockThreshold : 5,
      currency: currency.trim() || 'USD',
      locationType: locationType.trim() || undefined,
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
            className="relative z-10 w-full max-w-xl glass-panel-glow rounded-3xl p-6 sm:p-7 overflow-hidden my-8"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">
                      {isEditMode ? 'Edit Product Details' : 'Add New Product'}
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                      Step {modalStep} of 2
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
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
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
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
                <label className="block text-[11px] font-medium text-zinc-300 tracking-wide">
                  Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide brief product specifications, dimensions, or tags..."
                  className="w-full rounded-xl bg-[#13131a] border border-white/10 px-3.5 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 transition-all duration-200 outline-none focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/20 resize-none"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-[#13131c] border border-white/5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span>Currency & Location Mode</span>
                  </div>
                  <div className="flex items-center p-0.5 rounded-xl bg-black/40 border border-white/5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setCurrencyMode('input')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                        currencyMode === 'input'
                          ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <DollarSign className="w-3 h-3" />
                      <span>Input Currency</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrencyMode('location')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                        currencyMode === 'location'
                          ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Globe className="w-3 h-3" />
                      <span>Set by Location</span>
                    </button>
                  </div>
                </div>

                {currencyMode === 'input' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-medium text-zinc-300 tracking-wide">
                        Currency Type *
                      </label>
                      <div className="relative">
                        <select
                          value={currency}
                          onChange={(e) => handleCurrencyChange(e.target.value)}
                          className="w-full rounded-xl bg-[#13131a] border border-white/10 px-3.5 py-2 text-sm text-zinc-100 outline-none focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/20 appearance-none cursor-pointer"
                        >
                          {CURRENCY_OPTIONS.map((c) => (
                            <option key={c.code} value={c.code} className="bg-[#14141c] text-white">
                              {c.label}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-orange-400 text-xs font-mono font-bold">
                          {getCurrencySymbol(currency)}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-medium text-zinc-300 tracking-wide">
                        Storage / Location Type
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          list="location-options-direct"
                          value={locationType}
                          onChange={(e) => setLocationType(e.target.value)}
                          placeholder="e.g. Retail Storefront, Warehouse"
                          className="w-full rounded-xl bg-[#13131a] border border-white/10 pl-10 pr-3.5 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/20"
                        />
                        <datalist id="location-options-direct">
                          {LOCATION_TYPE_OPTIONS.map((loc) => (
                            <option key={loc} value={loc} />
                          ))}
                        </datalist>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="block text-[11px] font-medium text-zinc-300 tracking-wide">
                            Country / Location *
                          </label>
                          <button
                            type="button"
                            onClick={handleDetectLocation}
                            className="text-[10px] text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/20"
                          >
                            <Compass className="w-3 h-3" />
                            <span>Auto-Detect</span>
                          </button>
                        </div>
                        <div className="relative">
                          <select
                            value={countryLocation}
                            onChange={(e) => handleCountryChange(e.target.value)}
                            className="w-full rounded-xl bg-[#13131a] border border-white/10 px-3.5 py-2 text-sm text-zinc-100 outline-none focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/20 appearance-none cursor-pointer"
                          >
                            {CURRENCY_OPTIONS.map((c) => (
                              <option key={c.country} value={c.country} className="bg-[#14141c] text-white">
                                {c.country} ({c.code} - {c.symbol})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-zinc-300 tracking-wide">
                          Storage Location Type *
                        </label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            list="location-options-loc"
                            value={locationType}
                            onChange={(e) => setLocationType(e.target.value)}
                            placeholder="e.g. Retail Storefront, Warehouse"
                            className="w-full rounded-xl bg-[#13131a] border border-white/10 pl-10 pr-3.5 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/20"
                          />
                          <datalist id="location-options-loc">
                            {LOCATION_TYPE_OPTIONS.map((loc) => (
                              <option key={loc} value={loc} />
                            ))}
                          </datalist>
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-orange-500/5 border border-orange-500/15 flex items-center justify-between text-xs">
                      <span className="text-zinc-400">
                        Mapped Currency for <span className="font-semibold text-white">{countryLocation}</span>:
                      </span>
                      <span className="font-mono font-bold text-orange-400 flex items-center gap-1.5">
                        <span>{currency}</span>
                        <span className="px-1.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-[11px]">
                          {getCurrencySymbol(currency)}
                        </span>
                      </span>
                    </div>
                  </div>
                )}

                {detectedInfo && (
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {detectedInfo}
                  </span>
                )}
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
                  icon={<span className="text-xs font-mono font-bold text-orange-400">{getCurrencySymbol(currency)}</span>}
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
                  icon={<span className="text-xs font-mono font-bold text-orange-400">{getCurrencySymbol(currency)}</span>}
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-[#13131c] border border-white/5 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-zinc-200">Low Stock Alert Threshold</div>
                  <div className="text-[11px] text-zinc-400">
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
                    className="w-full text-center rounded-xl bg-[#181822] border border-white/10 px-2 py-1.5 text-sm text-zinc-100 font-semibold focus:border-[#ff6b00] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
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
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-orange-400" />
                      <span>Proposed Modifications for {initialData?.sku}</span>
                    </span>
                    <span className="text-[11px] text-zinc-500 font-normal">
                      {changes.length} {changes.length === 1 ? 'change' : 'changes'} detected
                    </span>
                  </div>

                  {changes.length > 0 ? (
                    <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                      {changes.map((c, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-[#13131c] border border-white/5 flex items-center justify-between text-xs gap-3"
                        >
                          <span className="text-zinc-400 font-medium shrink-0">{c.field}</span>
                          <div className="flex items-center gap-2 text-right">
                            <span className="line-through text-zinc-500 truncate max-w-[120px]">{c.from}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                            <span className="font-semibold text-emerald-400 truncate max-w-[160px]">{c.to}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-[#13131c] border border-white/5 text-center text-xs text-zinc-400">
                      <CheckCircle2 className="w-5 h-5 text-zinc-500 mx-auto mb-1.5" />
                      <span>No attribute values were modified. Applying will keep current records intact.</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-orange-400" />
                    <span>Confirm Catalog Registration</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#13131c] border border-white/5 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-zinc-500 text-[11px]">Product Name</span>
                      <div className="font-semibold text-white">{name}</div>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[11px]">SKU</span>
                      <div className="font-mono font-semibold text-orange-300">{sku.toUpperCase()}</div>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[11px]">Initial Stock</span>
                      <div className="font-semibold text-emerald-400">{quantityOnHand || 0} units</div>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[11px]">Selling Price</span>
                      <div className="font-mono font-bold text-white">
                        {sellingPrice ? `${getCurrencySymbol(currency)}${Number(sellingPrice).toFixed(2)}` : '—'}
                      </div>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[11px]">Currency</span>
                      <div className="font-medium text-zinc-300">{currency}</div>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[11px]">Location</span>
                      <div className="font-medium text-zinc-300">{locationType || 'Storefront'}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalStep(1)}
                  disabled={isSubmitting}
                  className="px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white flex items-center gap-1 transition-colors disabled:opacity-50"
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
