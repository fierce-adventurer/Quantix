import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, Tag, DollarSign, Layers, AlertCircle } from 'lucide-react';
import { Product, CreateProductInput } from '../../types/product';
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
    } else {
      setName('');
      setSku('');
      setDescription('');
      setQuantityOnHand(0);
      setCostPrice('');
      setSellingPrice('');
      setLowStockThreshold(5);
    }
    setError(null);
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
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

    const payload: CreateProductInput = {
      name: name.trim(),
      sku: sku.trim().toUpperCase(),
      description: description.trim() || undefined,
      quantityOnHand: qty,
      costPrice: typeof costPrice === 'number' ? costPrice : undefined,
      sellingPrice: typeof sellingPrice === 'number' ? sellingPrice : undefined,
      lowStockThreshold: typeof lowStockThreshold === 'number' ? lowStockThreshold : 5,
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
                  <h3 className="text-lg font-bold text-white">
                    {isEditMode ? 'Edit Product Details' : 'Add New Product'}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {isEditMode
                      ? 'Update item specifications, pricing, and stock metrics'
                      : 'Register a new catalog item under your store partition'}
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

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  label="Cost Price ($)"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={costPrice}
                  onChange={(e) =>
                    setCostPrice(e.target.value === '' ? '' : parseFloat(e.target.value))
                  }
                  icon={<DollarSign className="w-4 h-4" />}
                />

                <GlassInput
                  compact
                  label="Selling Price ($)"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={sellingPrice}
                  onChange={(e) =>
                    setSellingPrice(e.target.value === '' ? '' : parseFloat(e.target.value))
                  }
                  icon={<DollarSign className="w-4 h-4" />}
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
                <GlowButton type="submit" size="md" isLoading={isSubmitting}>
                  {isEditMode ? 'Update Product' : 'Add to Catalog'}
                </GlowButton>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
