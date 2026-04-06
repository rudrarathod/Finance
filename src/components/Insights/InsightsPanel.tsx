import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InsightsPanelProps {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  activeCards: string[];
  toggleCard: (cardId: string) => void;
}

export const InsightsPanel: React.FC<InsightsPanelProps> = ({
  isSettingsOpen,
  setIsSettingsOpen,
  activeCards,
  toggleCard,
}) => {
  return (
    <AnimatePresence>
      {isSettingsOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white border-b border-zinc-200 overflow-hidden"
        >
          <div className="max-w-[1600px] mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Summary Cards Selection */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Summary Cards</h3>
                  <div className="h-px flex-1 bg-zinc-100 hidden md:block" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'balance', label: 'Total Balance' },
                    { id: 'income', label: 'Total Income' },
                    { id: 'expenses', label: 'Total Expenses' },
                    { id: 'avg', label: 'Average Transaction' },
                    { id: 'highest', label: 'Highest Expense' },
                    { id: 'count', label: 'Transaction Count' }
                  ].map(card => (
                    <button
                      key={card.id}
                      onClick={() => toggleCard(card.id)}
                      className={cn(
                        "px-4 py-2 rounded-full text-xs font-bold border transition-all flex items-center gap-2",
                        activeCards.includes(card.id) 
                          ? "bg-zinc-900 border-zinc-900 text-white shadow-sm" 
                          : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-zinc-900"
                      )}
                    >
                      {activeCards.includes(card.id) && <Check size={12} strokeWidth={3} />}
                      {card.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end pt-4 md:pt-0 border-t md:border-t-0 border-zinc-100">
                <button 
                  onClick={() => setIsSettingsOpen(false)} 
                  className="px-6 py-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-all"
                >
                  Close Settings
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
