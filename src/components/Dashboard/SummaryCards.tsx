import React, { useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart as PieChartIcon, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';
import { TrendChart } from './TrendChart';
import { CategoryChart } from './CategoryChart';
import { Transaction } from '../../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SummaryCardsProps {
  activeCards: string[];
  cardsToShow: number;
  carouselIndex: number;
  setCarouselIndex: (index: number) => void;
  totals: { income: number; expenses: number; balance: number };
  trendData: { date: string; balance: number }[];
  categoryData: { name: string; value: number }[];
  stats: { avg: number; highest: Transaction | null; count: number };
  transactions: Transaction[];
  prevSlide: () => void;
  nextSlide: () => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  activeCards,
  cardsToShow,
  carouselIndex,
  setCarouselIndex,
  totals,
  trendData,
  categoryData,
  stats,
  transactions,
  prevSlide,
  nextSlide
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInternalScroll = useRef(false);

  // Sync scroll position when carouselIndex changes (from arrows)
  useEffect(() => {
    if (scrollRef.current && !isInternalScroll.current) {
      const container = scrollRef.current;
      const cardWidth = container.offsetWidth / cardsToShow;
      container.scrollTo({
        left: carouselIndex * cardWidth,
        behavior: 'smooth'
      });
    }
    isInternalScroll.current = false;
  }, [carouselIndex, cardsToShow]);

  // Sync carouselIndex when scrolling (from touch)
  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const cardWidth = container.offsetWidth / cardsToShow;
      const index = Math.round(container.scrollLeft / cardWidth);
      
      if (index !== carouselIndex && index >= 0 && index <= activeCards.length - cardsToShow) {
        isInternalScroll.current = true;
        setCarouselIndex(index);
      }
    }
  }, [carouselIndex, cardsToShow, activeCards.length, setCarouselIndex]);

  return (
    <div className="relative group/carousel">
      {activeCards.length > cardsToShow && (
        <div className="flex items-center justify-between px-6 py-2 border-b border-zinc-100 bg-white">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Dashboard Overview
            </span>
            <div className="flex gap-1">
              {activeCards.map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "w-1 h-1 rounded-full transition-all",
                    i >= carouselIndex && i < carouselIndex + cardsToShow 
                      ? "bg-zinc-900 w-3" 
                      : "bg-zinc-200"
                  )} 
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={prevSlide}
              disabled={carouselIndex === 0}
              className="p-1 hover:bg-zinc-100 rounded-md transition-all disabled:opacity-20 disabled:cursor-not-allowed text-zinc-600"
              title="Previous"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={nextSlide}
              disabled={carouselIndex + cardsToShow >= activeCards.length}
              className="p-1 hover:bg-zinc-100 rounded-md transition-all disabled:opacity-20 disabled:cursor-not-allowed text-zinc-600"
              title="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className={cn(
          "flex overflow-x-auto snap-x snap-mandatory no-scrollbar border-b-2 border-zinc-200 bg-white",
        )}
      >
        {activeCards.map((cardId, i) => (
          <motion.div
            key={cardId}
            layout
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: i * 0.05 }}
            className={cn(
              "flex-shrink-0 snap-start border-r border-zinc-200 p-6 bg-zinc-50/10 min-h-[180px] last:border-r-0",
              cardsToShow === 1 ? "w-full" : cardsToShow === 2 ? "w-1/2" : "w-1/3"
            )}
          >
            {cardId === 'balance' && (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Total Balance</p>
                    <h2 className="text-3xl font-bold font-mono">${totals.balance.toLocaleString()}</h2>
                  </div>
                  <div className="p-2 bg-zinc-900 text-white rounded-lg">
                    <TrendingUp size={20} />
                  </div>
                </div>
                <TrendChart data={trendData} />
              </>
            )}

            {cardId === 'income' && (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Total Income</p>
                    <h2 className="text-3xl font-bold font-mono text-zinc-900">${totals.income.toLocaleString()}</h2>
                  </div>
                  <div className="p-2 bg-zinc-100 text-zinc-600 rounded-lg">
                    <BarChart3 size={20} />
                  </div>
                </div>
                <div className="h-24 w-full">
                  <div className="h-full w-full flex items-end gap-1">
                    {transactions.filter(t => t.type === 'income').slice(-7).map((t, i) => {
                      const maxAmount = Math.max(...transactions.map(tx => tx.amount), 1);
                      return (
                        <div 
                          key={i} 
                          className="flex-1 bg-zinc-900 rounded-t-sm" 
                          style={{ height: `${Math.min(100, (t.amount / maxAmount) * 100)}%` }}
                        />
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {cardId === 'expenses' && (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Total Expenses</p>
                    <h2 className="text-3xl font-bold font-mono text-zinc-900">${totals.expenses.toLocaleString()}</h2>
                  </div>
                  <div className="p-2 bg-zinc-100 text-zinc-600 rounded-lg">
                    <PieChartIcon size={20} />
                  </div>
                </div>
                <CategoryChart data={categoryData} />
              </>
            )}

            {cardId === 'avg' && (
              <div className="flex flex-col h-full justify-center">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Avg Transaction</p>
                <h2 className="text-3xl font-bold font-mono mb-2">${stats.avg.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h2>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-zinc-400 h-full" style={{ width: '65%' }} />
                  </div>
                  <span>65%</span>
                </div>
              </div>
            )}

            {cardId === 'highest' && (
              <div className="flex flex-col h-full justify-center">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Highest Expense</p>
                <h2 className="text-3xl font-bold font-mono mb-1">${stats.highest?.amount.toLocaleString() || 0}</h2>
                <p className="text-xs text-zinc-400 font-medium">{stats.highest?.category || 'None'} • {stats.highest?.date || '-'}</p>
              </div>
            )}

            {cardId === 'count' && (
              <div className="flex flex-col h-full justify-center">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Total Records</p>
                <h2 className="text-4xl font-bold font-mono">{stats.count}</h2>
                <p className="text-xs text-zinc-400 mt-1">Active transactions in grid</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
