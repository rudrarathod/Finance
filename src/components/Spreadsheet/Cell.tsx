import React from 'react';
import { Transaction, Role } from '../../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const EditableCell = ({ 
  id, 
  field, 
  value, 
  type = 'text',
  className,
  role,
  lastAddedId,
  onUpdate,
  onClearLastAdded
}: { 
  id: string; 
  field: keyof Transaction; 
  value: any; 
  type?: string;
  className?: string;
  role: Role;
  lastAddedId: string | null;
  onUpdate: (id: string, field: keyof Transaction, value: any) => void;
  onClearLastAdded: () => void;
}) => {
  const isEditable = role === 'admin';
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isEditable && lastAddedId === id && field === 'amount' && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
        onClearLastAdded();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isEditable, lastAddedId, id, field, onClearLastAdded]);
  
  if (!isEditable) {
    return (
      <div className={cn("grid-cell", className)}>
        {field === 'amount' ? `$${value.toLocaleString()}` : value}
      </div>
    );
  }

  return (
    <div className={cn("grid-cell p-0", className)}>
      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={(e) => onUpdate(id, field, e.target.value)}
        className="w-full h-full bg-transparent px-3 py-2 grid-cell-editable focus:bg-white"
      />
    </div>
  );
};

export const SelectCell = ({ 
  id, 
  field, 
  value, 
  options,
  className,
  role,
  onUpdate
}: { 
  id: string; 
  field: keyof Transaction; 
  value: any; 
  options: string[];
  className?: string;
  role: Role;
  onUpdate: (id: string, field: keyof Transaction, value: any) => void;
}) => {
  const isEditable = role === 'admin';
  
  if (!isEditable) {
    return (
      <div className={cn("grid-cell", className)}>
        {value}
      </div>
    );
  }

  return (
    <div className={cn("grid-cell p-0", className)}>
      <select
        value={value}
        onChange={(e) => onUpdate(id, field, e.target.value)}
        className="w-full h-full bg-transparent px-3 py-2 grid-cell-editable appearance-none cursor-pointer"
      >
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
};
