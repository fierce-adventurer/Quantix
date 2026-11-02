import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, ShieldAlert, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Product } from '../../types/product';
import { useTheme } from '../../context/theme-context';
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
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [step, setStep] = useState<1 | 2>(1);
  const [confirmationCode, setConfirmationCode] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setConfirmationCode('');
    }
  }, [isOpen, product]);

  if (!product) return null;

  const isCodeMatching = confirmationCode.trim().toUpperCase() === product.sku.toUpperCase();

  const handleClose = () => {
    setStep(1);
    setConfirmationCode('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`relative z-10 w-full max-w-md rounded-3xl p-6 sm:p-7 overflow-hidden border transition-all ${
              isLight
                ? 'bg-white border-red-500/25 shadow-2xl shadow-red-500/10'
                : 'glass-panel-glow border-white/10'
            }`}
          >
            <div className={`flex items-center justify-between pb-3 mb-4 border-b ${
              isLight ? 'border-zinc-200' : 'border-white/10'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-base font-bold ${isLight ? 'text-zinc-900' : 'text-white'}`}>Delete Product</h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                      Step {step} of 2
                    </span>
                  </div>
                  <p className={`text-xs ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    {step === 1 ? 'Review catalog impact' : 'Security authorization code'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                  isLight
                    ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {step === 1 ? (
              <div className="space-y-4">
                <div className={`p-4 rounded-2xl border space-y-2.5 ${
                  isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#14141d] border-white/5'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>Target Product</span>
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-orange-500/10 text-orange-500 border border-orange-500/20">
                      {product.sku}
                    </span>
                  </div>
                  <div className={`text-base font-bold ${isLight ? 'text-zinc-900' : 'text-white'}`}>{product.name}</div>
                  {product.description && (
                    <p className={`text-xs line-clamp-2 ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>{product.description}</p>
                  )}
                  <div className={`pt-2 border-t flex items-center justify-between text-xs ${
                    isLight ? 'border-zinc-200' : 'border-white/5'
                  }`}>
                    <span className={isLight ? 'text-zinc-500' : 'text-zinc-400'}>Current Stock</span>
                    <span className={`font-semibold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>{product.quantityOnHand} units</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                  <div>
                    This action is <span className="font-bold underline">irreversible</span>. All transaction history and stock records linked to this SKU will be permanently purged.
                  </div>
                </div>

                <div className={`flex items-center justify-end gap-3 pt-3 border-t ${
                  isLight ? 'border-zinc-200' : 'border-white/10'
                }`}>
                  <GlowButton variant="secondary" size="md" onClick={handleClose}>
                    Cancel
                  </GlowButton>
                  <GlowButton size="md" onClick={() => setStep(2)}>
                    <span>Proceed to Verification</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </GlowButton>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className={`text-xs ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                    To confirm permanent deletion of <span className={`font-semibold ${isLight ? 'text-zinc-900' : 'text-white'}`}>{product.name}</span>, type the exact SKU code below:
                  </p>
                  <div className={`p-2.5 rounded-xl border text-center ${
                    isLight ? 'bg-[#f6f6f8] border-zinc-200' : 'bg-[#14141d] border-white/10'
                  }`}>
                    <span className={`text-xs mr-2 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>Confirmation Code:</span>
                    <span className="font-mono font-bold text-sm text-orange-500 tracking-wider select-all">
                      {product.sku}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={`block text-[11px] tracking-wide transition-colors ${
                    isLight ? 'font-semibold text-zinc-700' : 'font-medium text-zinc-300'
                  }`}>
                    Type SKU Code to Confirm *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      autoFocus
                      placeholder={`Type "${product.sku}"`}
                      value={confirmationCode}
                      onChange={(e) => setConfirmationCode(e.target.value)}
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-mono outline-none transition-all ${
                        isLight
                          ? 'bg-[#f6f6f8] text-zinc-900 placeholder:text-zinc-400 focus:bg-white'
                          : 'bg-[#13131a] text-zinc-100 placeholder:text-zinc-600'
                      } ${
                        isCodeMatching
                          ? 'border-emerald-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                          : isLight
                          ? 'border-zinc-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                          : 'border-white/10 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                      }`}
                    />
                    {isCodeMatching && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                  {!isCodeMatching && confirmationCode.length > 0 && (
                    <span className="text-[11px] text-red-500">
                      Code does not match. Expected: {product.sku}
                    </span>
                  )}
                </div>

                <div className={`flex items-center justify-between pt-3 border-t ${
                  isLight ? 'border-zinc-200' : 'border-white/10'
                }`}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={isDeleting}
                    className={`px-3 py-2 text-xs font-medium flex items-center gap-1 transition-colors disabled:opacity-50 ${
                      isLight ? 'text-zinc-600 hover:text-zinc-900' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <GlowButton variant="secondary" size="md" onClick={handleClose} disabled={isDeleting}>
                      Cancel
                    </GlowButton>
                    <button
                      type="button"
                      onClick={onConfirm}
                      disabled={!isCodeMatching || isDeleting}
                      className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-red-600 hover:bg-red-500 text-white transition-all shadow-lg shadow-red-600/30 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
                    >
                      {isDeleting ? 'Deleting...' : 'Authorize Deletion'}
                    </button>
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
