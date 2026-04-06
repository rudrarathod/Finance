import React, { useState, useMemo, useEffect } from 'react';
import { Transaction, Category, Role, SpreadsheetPage } from './types';
import { INITIAL_TRANSACTIONS } from './constants';
import { storageService } from './services/storageService';

// Modular Components
import { RoleSwitcher } from './components/RoleSwitcher';
import { SearchBar } from './components/Transactions/SearchBar';
import { Filters } from './components/Transactions/Filters';
import { Toolbar } from './components/Spreadsheet/Toolbar';
import { Grid } from './components/Spreadsheet/Grid';
import { SummaryCards } from './components/Dashboard/SummaryCards';
import { InsightsPanel } from './components/Insights/InsightsPanel';
import { PageTabs } from './components/Spreadsheet/PageTabs';

export default function App() {
  // --- State ---
  const [pages, setPages] = useState<SpreadsheetPage[]>([]);
  const [activePageId, setActivePageId] = useState<string>('default-page');
  const [role, setRole] = useState<Role>('admin');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<Category | 'All'>('All');
  const [sortBy, setSortBy] = useState<keyof Transaction>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const [activeCards, setActiveCards] = useState<string[]>(['balance', 'income', 'expenses']);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [cardsToShow, setCardsToShow] = useState(3);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- Initial Load (IndexedDB) ---
  useEffect(() => {
    const init = async () => {
      const loadedPages = await storageService.loadPages();
      if (loadedPages && loadedPages.length > 0) {
        setPages(loadedPages);
        setActivePageId(loadedPages[0].id);
      } else {
        // Initial default page
        const defaultPage: SpreadsheetPage = {
          id: 'default-page',
          name: 'Main Sheet',
          transactions: INITIAL_TRANSACTIONS,
          createdAt: new Date().toISOString()
        };
        setPages([defaultPage]);
        setActivePageId(defaultPage.id);
      }
      setIsLoaded(true);
    };
    init();
  }, []);

  // --- Active Page Helper ---
  const activePage = useMemo(() => 
    pages.find(p => p.id === activePageId) || pages[0] || { transactions: [] },
  [pages, activePageId]);

  const transactions = activePage.transactions;

  // --- Responsive Logic ---
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsToShow(1);
      } else if (window.innerWidth < 1024) {
        setCardsToShow(2);
      } else {
        setCardsToShow(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Carousel Bounds Logic ---
  useEffect(() => {
    if (carouselIndex > 0 && carouselIndex + cardsToShow > activeCards.length) {
      setCarouselIndex(Math.max(0, activeCards.length - cardsToShow));
    }
  }, [activeCards.length, cardsToShow, carouselIndex]);

  // --- Persistence (IndexedDB) ---
  useEffect(() => {
    if (isLoaded && pages.length > 0) {
      storageService.savePages(pages);
    }
  }, [pages, isLoaded]);

  // --- Derived Data ---
  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    // Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.notes.toLowerCase().includes(query) || 
        t.category.toLowerCase().includes(query) ||
        t.amount.toString().includes(query)
      );
    }

    if (filterCategory !== 'All') {
      result = result.filter(t => t.category === filterCategory);
    }

    // Sort
    result.sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];
      
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      
      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      
      if (strA < strB) return sortOrder === 'asc' ? -1 : 1;
      if (strA > strB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [transactions, searchQuery, filterCategory, sortBy, sortOrder]);

  const totals = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expenses, balance: income - expenses };
  }, [transactions]);

  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        data[t.category] = (data[t.category] || 0) + t.amount;
      });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const trendData = useMemo(() => {
    const data: Record<string, number> = {};
    [...transactions]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .forEach(t => {
        const date = t.date;
        const amount = t.type === 'income' ? t.amount : -t.amount;
        data[date] = (data[date] || 0) + amount;
      });
    
    let runningBalance = 0;
    return Object.entries(data).map(([date, amount]) => {
      runningBalance += amount;
      return { date, balance: runningBalance };
    });
  }, [transactions]);

  const stats = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const avg = transactions.length > 0 
      ? transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length 
      : 0;
    const highest = expenses.length > 0 
      ? [...expenses].sort((a, b) => b.amount - a.amount)[0] 
      : null;
    
    return {
      avg,
      highest,
      count: transactions.length
    };
  }, [transactions]);

  // --- Handlers ---
  const handleSort = (column: keyof Transaction) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const updateTransaction = (id: string, field: keyof Transaction, value: any) => {
    if (role !== 'admin') return;
    setPages(prev => prev.map(p => {
      if (p.id === activePageId) {
        return {
          ...p,
          transactions: p.transactions.map(t => {
            if (t.id === id) {
              let finalValue = value;
              if (field === 'amount') finalValue = parseFloat(value) || 0;
              return { ...t, [field]: finalValue };
            }
            return t;
          })
        };
      }
      return p;
    }));
  };

  const addTransaction = () => {
    if (role !== 'admin') return;
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      category: 'Misc',
      type: 'expense',
      notes: 'New transaction',
    };
    setPages(prev => prev.map(p => {
      if (p.id === activePageId) {
        return { ...p, transactions: [newTransaction, ...p.transactions] };
      }
      return p;
    }));
    setLastAddedId(newTransaction.id);
    setSearchQuery('');
    setFilterCategory('All');
    setSortBy('date');
    setSortOrder('desc');
  };

  const deleteTransaction = (id: string) => {
    if (role !== 'admin') return;
    setPages(prev => prev.map(p => {
      if (p.id === activePageId) {
        return { ...p, transactions: p.transactions.filter(t => t.id !== id) };
      }
      return p;
    }));
  };

  const resetData = () => {
    setSearchQuery('');
    setFilterCategory('All');
    setSortBy('date');
    setSortOrder('desc');
  };

  const exportCSV = () => {
    const headers = ['Date', 'Amount', 'Category', 'Type', 'Notes'];
    const rows = transactions.map(t => [t.date, t.amount, t.category, t.type, t.notes]);
    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${activePage.name}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (importedData: any[]) => {
    if (role !== 'admin') return;
    
    const newTransactions: Transaction[] = importedData.map(item => ({
      id: Math.random().toString(36).substr(2, 9),
      date: item.date || new Date().toISOString().split('T')[0],
      amount: parseFloat(item.amount) || 0,
      category: (item.category as Category) || 'Misc',
      type: (item.type as 'income' | 'expense') || 'expense',
      notes: item.notes || '',
    }));

    setPages(prev => prev.map(p => {
      if (p.id === activePageId) {
        return { ...p, transactions: [...newTransactions, ...p.transactions] };
      }
      return p;
    }));
  };

  // --- Page Handlers ---
  const addPage = () => {
    const newPage: SpreadsheetPage = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Sheet ${pages.length + 1}`,
      transactions: [],
      createdAt: new Date().toISOString()
    };
    setPages([...pages, newPage]);
    setActivePageId(newPage.id);
  };

  const deletePage = (id: string) => {
    if (pages.length <= 1) return;
    const newPages = pages.filter(p => p.id !== id);
    setPages(newPages);
    if (activePageId === id) {
      setActivePageId(newPages[0].id);
    }
  };

  const renamePage = (id: string, newName: string) => {
    setPages(prev => prev.map(p => p.id === id ? { ...p, name: newName } : p));
  };

  const toggleCard = (cardId: string) => {
    setActiveCards(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId) 
        : [...prev, cardId]
    );
  };

  const nextSlide = () => {
    if (carouselIndex + cardsToShow < activeCards.length) {
      setCarouselIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (carouselIndex > 0) {
      setCarouselIndex(prev => prev - 1);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
          <p className="text-sm font-medium text-zinc-500 animate-pulse">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      {/* --- Top Toolbar --- */}
      <header className="border-b border-zinc-200 bg-white sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-4 py-2 lg:py-0 lg:h-14 flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-4">
          <div className="flex items-center justify-between w-full lg:w-auto gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-base md:text-lg font-bold tracking-tight flex items-center gap-2 shrink-0">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-zinc-900 rounded flex items-center justify-center">
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 border-2 border-white"></div>
                </div>
                <span className="hidden sm:inline">Finance</span>
              </h1>
              <div className="hidden sm:block h-5 w-px bg-zinc-200" />
              <RoleSwitcher role={role} setRole={setRole} />
            </div>

            <Toolbar 
              role={role}
              isSettingsOpen={isSettingsOpen}
              setIsSettingsOpen={setIsSettingsOpen}
              exportCSV={exportCSV}
              resetData={resetData}
              addTransaction={addTransaction}
              onImport={handleImport}
              isMobile
            />
          </div>

          <div className="flex items-center gap-2 w-full lg:flex-1 lg:max-w-2xl">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <Filters filterCategory={filterCategory} setFilterCategory={setFilterCategory} />
          </div>

          <Toolbar 
            role={role}
            isSettingsOpen={isSettingsOpen}
            setIsSettingsOpen={setIsSettingsOpen}
            exportCSV={exportCSV}
            resetData={resetData}
            addTransaction={addTransaction}
            onImport={handleImport}
          />
        </div>
      </header>

      <PageTabs 
        pages={pages}
        activePageId={activePageId}
        onPageSelect={setActivePageId}
        onAddPage={addPage}
        onDeletePage={deletePage}
        onRenamePage={renamePage}
      />

      <InsightsPanel 
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        activeCards={activeCards}
        toggleCard={toggleCard}
      />

      <main className="flex-1 overflow-auto">
        <div className="max-w-[1600px] mx-auto p-4">
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
            
            <SummaryCards 
              activeCards={activeCards}
              cardsToShow={cardsToShow}
              carouselIndex={carouselIndex}
              setCarouselIndex={setCarouselIndex}
              totals={totals}
              trendData={trendData}
              categoryData={categoryData}
              stats={stats}
              transactions={transactions}
              prevSlide={prevSlide}
              nextSlide={nextSlide}
            />

            <Grid 
              transactions={filteredAndSortedTransactions}
              role={role}
              sortBy={sortBy}
              sortOrder={sortOrder}
              lastAddedId={lastAddedId}
              handleSort={handleSort}
              updateTransaction={updateTransaction}
              deleteTransaction={deleteTransaction}
              setLastAddedId={setLastAddedId}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
