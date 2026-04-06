import React from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { Category } from '../../types';
import { CATEGORIES } from '../../constants';

interface FiltersProps {
  filterCategory: Category | 'All';
  setFilterCategory: (category: Category | 'All') => void;
}

export const Filters: React.FC<FiltersProps> = ({ filterCategory, setFilterCategory }) => {
  return (
    <div className="relative shrink-0">
      <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
      <select 
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value as any)}
        className="bg-zinc-100 border-none rounded-lg pl-9 pr-8 py-1.5 text-sm appearance-none focus:ring-2 focus:ring-zinc-900 cursor-pointer min-w-[120px]"
      >
        <option value="All">All</option>
        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={12} />
    </div>
  );
};
