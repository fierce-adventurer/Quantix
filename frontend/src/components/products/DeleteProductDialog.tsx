import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { Product } from '../../types/product';
import { GlowButton } from '../ui/GlowButton';

interface DeleteProductDialogProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export const DeleteProductDialog: React.FC<DeleteProductDialogProps> = ({
  product,
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}) => {
  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
            className="relative z-10 w-full max-w-md glass-panel-glow rounded-3xl p-6 overflow-hidden"
          >
            <div className="flex items-center justify-between pb-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Confirm Deletion</h3>
                  <p className="text-xs text-zinc-400">Permanently delete catalog item</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <p className="text-sm text-zinc-300">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-white">{product.name}</span>{' '}
                (<span className="font-mono text-orange-400">{product.sku}</span>)?
              </p>
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
                This item has <span className="font-bold">{product.quantityOnHand} units</span> recorded in stock. Deleting it will remove all associated inventory records.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <GlowButton variant="secondary" size="md" onClick={onClose} disabled={isDeleting}>
                Cancel
              </GlowButton>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isDeleting}
                className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-red-600 hover:bg-red-500 text-white transition-all shadow-lg shadow-red-600/30 active:scale-95 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Product'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
