
import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { 
  Expense, 
  Category, 
  Budget,
  MonthlyReport 
} from "@/types";

interface ExpenseContextType {
  expenses: Expense[];
  budgets: Budget[];
  addExpense: (expense: Omit<Expense, "id">) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  setBudget: (budget: Budget) => void;
  getMonthlyReport: (month: number, year: number) => MonthlyReport;
  getYearlyReport: (year: number) => { totalAmount: number; expensesByCategory: Record<Category, number> };
  categories: Category[];
  getTotalExpenses: () => number;
  getExpensesByCategory: () => Record<Category, number>;
  getBudgetByCategory: (category: Category) => number;
  getTotalBudget: () => number;
}

const defaultCategories: Category[] = [
  'Food',
  'Housing',
  'Transportation',
  'Entertainment',
  'Utilities',
  'Shopping',
  'Healthcare',
  'Personal',
  'Education',
  'Travel',
  'Other'
];

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

// Sample data for initial state
const sampleExpenses: Expense[] = [
  {
    id: uuidv4(),
    amount: 150,
    date: new Date(2024, 4, 1),
    category: 'Food',
    description: 'Grocery shopping'
  },
  {
    id: uuidv4(),
    amount: 800,
    date: new Date(2024, 4, 1),
    category: 'Housing',
    description: 'Monthly rent'
  },
  {
    id: uuidv4(),
    amount: 50,
    date: new Date(2024, 4, 2),
    category: 'Transportation',
    description: 'Gas'
  },
  {
    id: uuidv4(),
    amount: 200,
    date: new Date(2024, 4, 3),
    category: 'Entertainment',
    description: 'Concert tickets'
  },
  {
    id: uuidv4(),
    amount: 120,
    date: new Date(2024, 4, 5),
    category: 'Utilities',
    description: 'Electricity bill'
  },
  {
    id: uuidv4(),
    amount: 75,
    date: new Date(2024, 3, 28),
    category: 'Food',
    description: 'Restaurant dinner'
  }
];

const sampleBudgets: Budget[] = [
  { category: 'Food', amount: 500 },
  { category: 'Housing', amount: 1000 },
  { category: 'Transportation', amount: 300 },
  { category: 'Entertainment', amount: 200 },
  { category: 'Utilities', amount: 250 },
  { category: 'Shopping', amount: 150 },
  { category: 'Healthcare', amount: 100 },
  { category: 'Personal', amount: 100 },
  { category: 'Education', amount: 50 },
  { category: 'Travel', amount: 200 },
  { category: 'Other', amount: 100 }
];

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>(sampleExpenses);
  const [budgets, setBudgets] = useState<Budget[]>(sampleBudgets);
  
  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense = { ...expense, id: uuidv4() };
    setExpenses(prev => [...prev, newExpense]);
    toast.success("Expense added successfully");
  };

  const updateExpense = (expense: Expense) => {
    setExpenses(prev => prev.map(e => e.id === expense.id ? expense : e));
    toast.success("Expense updated successfully");
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    toast.success("Expense deleted successfully");
  };

  const setBudget = (budget: Budget) => {
    setBudgets(prev => {
      const exists = prev.find(b => b.category === budget.category);
      if (exists) {
        return prev.map(b => b.category === budget.category ? budget : b);
      }
      return [...prev, budget];
    });
    toast.success(`Budget for ${budget.category} set to $${budget.amount}`);
  };

  const getMonthlyReport = (month: number, year: number): MonthlyReport => {
    const monthlyExpenses = expenses.filter(
      expense => 
        expense.date.getMonth() === month && 
        expense.date.getFullYear() === year
    );
    
    const totalAmount = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const expensesByCategory = defaultCategories.reduce((acc, category) => {
      acc[category] = monthlyExpenses
        .filter(expense => expense.category === category)
        .reduce((sum, expense) => sum + expense.amount, 0);
      return acc;
    }, {} as Record<Category, number>);
    
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    return {
      month: monthNames[month],
      year,
      totalAmount,
      expensesByCategory
    };
  };

  const getYearlyReport = (year: number) => {
    const yearlyExpenses = expenses.filter(
      expense => expense.date.getFullYear() === year
    );
    
    const totalAmount = yearlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const expensesByCategory = defaultCategories.reduce((acc, category) => {
      acc[category] = yearlyExpenses
        .filter(expense => expense.category === category)
        .reduce((sum, expense) => sum + expense.amount, 0);
      return acc;
    }, {} as Record<Category, number>);
    
    return {
      totalAmount,
      expensesByCategory
    };
  };

  const getTotalExpenses = () => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getExpensesByCategory = (): Record<Category, number> => {
    return defaultCategories.reduce((acc, category) => {
      acc[category] = expenses
        .filter(expense => expense.category === category)
        .reduce((sum, expense) => sum + expense.amount, 0);
      return acc;
    }, {} as Record<Category, number>);
  };

  const getBudgetByCategory = (category: Category): number => {
    const budget = budgets.find(b => b.category === category);
    return budget ? budget.amount : 0;
  };

  const getTotalBudget = (): number => {
    return budgets.reduce((sum, budget) => sum + budget.amount, 0);
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        budgets,
        addExpense,
        updateExpense,
        deleteExpense,
        setBudget,
        getMonthlyReport,
        getYearlyReport,
        categories: defaultCategories,
        getTotalExpenses,
        getExpensesByCategory,
        getBudgetByCategory,
        getTotalBudget
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error("useExpense must be used within an ExpenseProvider");
  }
  return context;
};
