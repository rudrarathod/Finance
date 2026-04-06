import React from 'react';
import { User, ShieldCheck } from 'lucide-react';
import { Role } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface RoleSwitcherProps {
  role: Role;
  setRole: (role: Role) => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ role, setRole }) => {
  return (
    <div className="flex items-center bg-zinc-100 rounded-lg p-0.5 md:p-1">
      <button 
        onClick={() => setRole('viewer')}
        className={cn(
          "px-2 md:px-3 py-1 text-[10px] md:text-xs font-medium rounded-md transition-all flex items-center gap-1",
          role === 'viewer' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
        )}
      >
        <User size={12} className="md:w-3.5 md:h-3.5" />
        Viewer
      </button>
      <button 
        onClick={() => setRole('admin')}
        className={cn(
          "px-2 md:px-3 py-1 text-[10px] md:text-xs font-medium rounded-md transition-all flex items-center gap-1",
          role === 'admin' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
        )}
      >
        <ShieldCheck size={12} className="md:w-3.5 md:h-3.5" />
        Admin
      </button>
    </div>
  );
};
