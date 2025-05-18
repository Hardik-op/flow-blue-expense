
export type Category = 
  | 'Food' 
  | 'Housing' 
  | 'Transportation' 
  | 'Entertainment' 
  | 'Utilities' 
  | 'Shopping' 
  | 'Healthcare' 
  | 'Personal' 
  | 'Education' 
  | 'Travel' 
  | 'Other';

export interface Expense {
  id: string;
  amount: number;
  date: Date;
  category: Category;
  description: string;
}

export interface Budget {
  category: Category;
  amount: number;
}

export interface MonthlyReport {
  month: string;
  year: number;
  totalAmount: number;
  expensesByCategory: Record<Category, number>;
}

// Updated DateRange to make properties optional to match react-day-picker's DateRange
export type DateRange = {
  from: Date | undefined;
  to?: Date | undefined; // Made 'to' optional with '?'
};

export type SortDirection = 'asc' | 'desc';
