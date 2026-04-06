import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
      <input 
        type="text" 
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-zinc-100 border-none rounded-lg pl-9 pr-4 py-1.5 text-sm focus:ring-2 focus:ring-zinc-900 transition-all"
      />
    </div>
  );
};
