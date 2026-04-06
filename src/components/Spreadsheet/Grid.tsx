import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpDown, Trash2, Search } from 'lucide-react';
import { Transaction, Role, Category } from '../../types';
import { CATEGORIES } from '../../constants';
import { EditableCell, SelectCell } from './Cell';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GridProps {
  transactions: Transaction[];
  role: Role;
  sortBy: keyof Transaction;
  sortOrder: 'asc' | 'desc';
  lastAddedId: string | null;
  handleSort: (column: keyof Transaction) => void;
  updateTransaction: (id: string, field: keyof Transaction, value: any) => void;
  deleteTransaction: (id: string) => void;
  setLastAddedId: (id: string | null) => void;
}

export const Grid: React.FC<GridProps> = ({
  transactions,
  role,
  sortBy,
  sortOrder,
  lastAddedId,
  handleSort,
  updateTransaction,
  deleteTransaction,
  setLastAddedId
}) => {
  const totals = transactions.reduce((acc, t) => {
    if (t.type === 'income') acc.income += t.amount;
    else acc.expenses += t.amount;
    return acc;
  }, { income: 0, expenses: 0 });

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1000px]">
        {/* Header Row */}
        <div className="grid grid-cols-12 bg-zinc-100">
          <div className="col-span-2 grid-header-cell flex items-center justify-between cursor-pointer group" onClick={() => handleSort('date')}>
            Date
            <ArrowUpDown size={12} className={cn("lg:opacity-0 lg:group-hover:opacity-100 opacity-100 transition-opacity", sortBy === 'date' && "opacity-100")} />
          </div>
          <div className="col-span-2 grid-header-cell flex items-center justify-between cursor-pointer group" onClick={() => handleSort('amount')}>
            Amount
            <ArrowUpDown size={12} className={cn("lg:opacity-0 lg:group-hover:opacity-100 opacity-100 transition-opacity", sortBy === 'amount' && "opacity-100")} />
          </div>
          <div className="col-span-2 grid-header-cell flex items-center justify-between cursor-pointer group" onClick={() => handleSort('category')}>
            Category
            <ArrowUpDown size={12} className={cn("lg:opacity-0 lg:group-hover:opacity-100 opacity-100 transition-opacity", sortBy === 'category' && "opacity-100")} />
          </div>
          <div className="col-span-2 grid-header-cell flex items-center justify-between cursor-pointer group" onClick={() => handleSort('type')}>
            Type
            <ArrowUpDown size={12} className={cn("lg:opacity-0 lg:group-hover:opacity-100 opacity-100 transition-opacity", sortBy === 'type' && "opacity-100")} />
          </div>
          <div className="col-span-3 grid-header-cell flex items-center justify-between cursor-pointer group" onClick={() => handleSort('notes')}>
            Notes
            <ArrowUpDown size={12} className={cn("lg:opacity-0 lg:group-hover:opacity-100 opacity-100 transition-opacity", sortBy === 'notes' && "opacity-100")} />
          </div>
          <div className="col-span-1 grid-header-cell text-center">
            Actions
          </div>
        </div>

        {/* Data Rows */}
        <div className="divide-y divide-zinc-200">
          <AnimatePresence initial={false}>
            {transactions.length > 0 ? (
              transactions.map((t) => (
                <motion.div 
                  key={t.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="grid grid-cols-12 grid-row group"
                >
                  <EditableCell 
                    id={t.id} 
                    field="date" 
                    value={t.date} 
                    type="date" 
                    className="col-span-2 font-mono text-zinc-500" 
                    role={role}
                    lastAddedId={lastAddedId}
                    onUpdate={updateTransaction}
                    onClearLastAdded={() => setLastAddedId(null)}
                  />
                  <EditableCell 
                    id={t.id} 
                    field="amount" 
                    value={t.amount} 
                    type="number" 
                    className={cn(
                      "col-span-2 font-bold font-mono",
                      t.type === 'income' ? "text-emerald-700 bg-emerald-50/50" : "text-zinc-900",
                      t.type === 'expense' && t.amount > 500 && "bg-zinc-100",
                      t.type === 'expense' && t.amount > 1000 && "bg-zinc-200"
                    )} 
                    role={role}
                    lastAddedId={lastAddedId}
                    onUpdate={updateTransaction}
                    onClearLastAdded={() => setLastAddedId(null)}
                  />
                  <SelectCell 
                    id={t.id} 
                    field="category" 
                    value={t.category} 
                    options={CATEGORIES}
                    className="col-span-2" 
                    role={role}
                    onUpdate={updateTransaction}
                  />
                  <SelectCell 
                    id={t.id} 
                    field="type" 
                    value={t.type} 
                    options={['income', 'expense']}
                    className={cn(
                      "col-span-2 capitalize font-medium",
                      t.type === 'income' ? "text-emerald-700" : "text-zinc-500"
                    )} 
                    role={role}
                    onUpdate={updateTransaction}
                  />
                  <EditableCell 
                    id={t.id} 
                    field="notes" 
                    value={t.notes} 
                    className="col-span-3 text-zinc-600 italic" 
                    role={role}
                    lastAddedId={lastAddedId}
                    onUpdate={updateTransaction}
                    onClearLastAdded={() => setLastAddedId(null)}
                  />
                  <div className="col-span-1 grid-cell flex items-center justify-center">
                    {role === 'admin' ? (
                      <button 
                        onClick={() => deleteTransaction(t.id)}
                        className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded transition-all lg:opacity-0 lg:group-hover:opacity-100 opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-zinc-200" />
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-20 text-center text-zinc-400">
                <div className="mb-2 flex justify-center">
                  <Search size={40} className="opacity-20" />
                </div>
                <p className="text-sm">No transactions found matching your criteria.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer / Insights Row */}
        <div className="grid grid-cols-12 bg-zinc-50 font-semibold border-t-2 border-zinc-200">
          <div className="col-span-2 grid-cell text-zinc-500 uppercase tracking-tighter text-[10px]">
            Totals
          </div>
          <div className="col-span-2 grid-cell font-mono text-emerald-700">
            +${totals.income.toLocaleString()}
          </div>
          <div className="col-span-2 grid-cell font-mono text-zinc-400">
            -${totals.expenses.toLocaleString()}
          </div>
          <div className="col-span-6 grid-cell text-right text-zinc-400 font-normal italic text-xs">
            Net: ${(totals.income - totals.expenses).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};
