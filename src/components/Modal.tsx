import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle, Info } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  confirmLabel?: string;
  onConfirm?: () => void;
  variant?: 'danger' | 'info' | 'success';
  isLoading?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  confirmLabel = 'Confirm',
  onConfirm,
  variant = 'info',
  isLoading = false
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-[60] overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-xl",
                    variant === 'danger' ? "bg-red-100 text-red-600" : 
                    variant === 'success' ? "bg-emerald-100 text-emerald-600" : 
                    "bg-blue-100 text-blue-600"
                  )}>
                    {variant === 'danger' ? <AlertTriangle size={20} /> : <Info size={20} />}
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900">{title}</h3>
                </div>
                <button 
                  onClick={onClose}
                  className="p-1 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {description && (
                <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
                  {description}
                </p>
              )}

              {children && (
                <div className="mb-6">
                  {children}
                </div>
              )}

              <div className="flex items-center gap-3 justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-bold text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  Cancel
                </button>
                {onConfirm && (
                  <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className={cn(
                      "px-6 py-2 rounded-xl text-sm font-bold text-white transition-all shadow-sm flex items-center gap-2",
                      variant === 'danger' ? "bg-red-600 hover:bg-red-700" : 
                      variant === 'success' ? "bg-emerald-600 hover:bg-emerald-700" : 
                      "bg-zinc-900 hover:bg-zinc-800",
                      isLoading && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {isLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                    {confirmLabel}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
