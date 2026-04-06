export type Category = 'Food' | 'Rent' | 'Salary' | 'Entertainment' | 'Transport' | 'Utilities' | 'Misc';
export type TransactionType = 'income' | 'expense';
export type Role = 'admin' | 'viewer';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: Category;
  type: TransactionType;
  notes: string;
}

export interface SpreadsheetPage {
  id: string;
  name: string;
  transactions: Transaction[];
  createdAt: string;
}

export interface GridState {
  transactions: Transaction[];
  role: Role;
  searchQuery: string;
  filterCategory: Category | 'All';
  sortBy: keyof Transaction;
  sortOrder: 'asc' | 'desc';
}
