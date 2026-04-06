import React, { useState } from 'react';
import { SlidersHorizontal, FileDown, FilterX, Plus, FileUp } from 'lucide-react';
import { Role } from '../../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Modal } from '../Modal';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ToolbarProps {
  role: Role;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  exportCSV: () => void;
  resetData: () => void;
  addTransaction: () => void;
  onImport: (data: any[]) => void;
  isMobile?: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({ 
  role, 
  isSettingsOpen, 
  setIsSettingsOpen, 
  exportCSV, 
  resetData, 
  addTransaction,
  onImport,
  isMobile = false
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [importData, setImportData] = useState<any[] | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseCSV = (csvText: string): any[] => {
    const lines = csvText.split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const values = lines[i].split(',').map(v => v.trim());
      const entry: any = {};
      
      headers.forEach((header, index) => {
        if (header === 'date') entry.date = values[index];
        if (header === 'amount') entry.amount = parseFloat(values[index]) || 0;
        if (header === 'category') entry.category = values[index];
        if (header === 'type') entry.type = values[index];
        if (header === 'notes') entry.notes = values[index];
      });

      if (entry.date || entry.amount) {
        data.push(entry);
      }
    }
    return data;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const text = await file.text();
      const parsedData = parseCSV(text);
      
      if (parsedData.length === 0) {
        setError("Could not extract any transactions from this file. Please make sure it's a valid CSV with headers: Date, Amount, Category, Type, Notes.");
      } else {
        setImportData(parsedData);
      }
    } catch (err: any) {
      console.error("Import error:", err);
      setError("Failed to process the file. Please make sure it's a valid CSV.");
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const confirmImport = () => {
    if (importData) {
      onImport(importData);
      setImportData(null);
    }
  };

  const confirmExport = () => {
    exportCSV();
    setShowExportModal(false);
  };

  const importBtn = (
    <button 
      onClick={() => fileInputRef.current?.click()}
      disabled={isProcessing}
      className={cn(
        "text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors flex items-center gap-2",
        isMobile ? "p-1.5" : "p-2",
        isProcessing && "opacity-50 cursor-not-allowed"
      )}
      title="Import CSV"
    >
      {isProcessing ? (
        <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
      ) : (
        <FileUp size={isMobile ? 18 : 20} />
      )}
      {!isMobile && <span className="text-sm font-medium">Import CSV</span>}
    </button>
  );

  const exportBtn = (
    <button 
      onClick={() => setShowExportModal(true)}
      className={cn(
        "text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors",
        isMobile ? "p-1.5" : "p-2"
      )}
      title="Export to CSV"
    >
      <FileDown size={isMobile ? 18 : 20} />
    </button>
  );

  return (
    <div className={cn(isMobile ? "flex lg:hidden items-center gap-1.5" : "hidden lg:flex items-center gap-2")}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        className="hidden"
      />

      <Modal 
        isOpen={!!importData}
        onClose={() => setImportData(null)}
        title="Confirm Import"
        description={`Found ${importData?.length} transactions in your file. Would you like to add them to the current page?`}
        confirmLabel="Import Data"
        onConfirm={confirmImport}
        variant="success"
      />

      <Modal 
        isOpen={!!error}
        onClose={() => setError(null)}
        title="Import Failed"
        description={error || "An unknown error occurred during import."}
        confirmLabel="Try Again"
        onConfirm={() => setError(null)}
        variant="danger"
      />

      <Modal 
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Confirm Export"
        description="Do you want to export the current page to a CSV file?"
        confirmLabel="Export CSV"
        onConfirm={confirmExport}
      />

      <button 
        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        className={cn(
          isMobile ? "p-1.5" : "p-2",
          "rounded-lg transition-colors",
          isSettingsOpen ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-100"
        )}
        title="Dashboard Settings"
      >
        <SlidersHorizontal size={isMobile ? 18 : 20} />
      </button>
      {importBtn}
      {exportBtn}
      <button 
        onClick={resetData}
        className={cn(
          isMobile ? "p-1.5" : "p-2",
          "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
        )}
        title="Reset Filters & Sort"
      >
        <FilterX size={isMobile ? 18 : 20} />
      </button>
      {role === 'admin' && (
        <button 
          onClick={addTransaction}
          className={cn(
            isMobile ? "bg-zinc-900 text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors" : "bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-zinc-800 transition-colors whitespace-nowrap"
          )}
          title="Add Row"
        >
          <Plus size={18} />
          {!isMobile && "Add Row"}
        </button>
      )}
    </div>
  );
};
