
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  Expense, 
  Category, 
  Budget,
  MonthlyReport 
} from "@/types";
import { supabase } from "@/integrations/supabase/client";

interface ExpenseContextType {
  expenses: Expense[];
  budgets: Budget[];
  addExpense: (expense: Omit<Expense, "id">) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  setBudget: (budget: Budget) => void;
  getMonthlyReport: (month: number, year: number) => MonthlyReport;
  getYearlyReport: (year: number) => { 
    totalAmount: number; 
    expensesByCategory: Record<Category, number>;
    month: string;
    year: number;
  };
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
    id: crypto.randomUUID(),
    amount: 150,
    date: new Date(2024, 4, 1),
    category: 'Food',
    description: 'Grocery shopping'
  },
  {
    id: crypto.randomUUID(),
    amount: 800,
    date: new Date(2024, 4, 1),
    category: 'Housing',
    description: 'Monthly rent'
  },
  {
    id: crypto.randomUUID(),
    amount: 50,
    date: new Date(2024, 4, 2),
    category: 'Transportation',
    description: 'Gas'
  },
  {
    id: crypto.randomUUID(),
    amount: 200,
    date: new Date(2024, 4, 3),
    category: 'Entertainment',
    description: 'Concert tickets'
  },
  {
    id: crypto.randomUUID(),
    amount: 120,
    date: new Date(2024, 4, 5),
    category: 'Utilities',
    description: 'Electricity bill'
  },
  {
    id: crypto.randomUUID(),
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
  
  // Fetch expenses from Supabase
  useEffect(() => {
    fetchExpenses();
    fetchBudgets();
  }, []);

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*');
      
      if (error) throw error;
      
      // Convert the data to match our Expense type
      const formattedData: Expense[] = data.map(item => ({
        id: item.id,
        amount: Number(item.amount),
        date: new Date(item.date),
        category: item.category as Category,
        description: item.description
      }));
      
      if (formattedData.length > 0) {
        setExpenses(formattedData);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };
  
  const fetchBudgets = async () => {
    try {
      const { data, error } = await supabase
        .from('budget')
        .select('*');
      
      if (error) throw error;
      
      // Convert the data to match our Budget type
      const formattedData: Budget[] = data.map(item => ({
        category: item.category as Category,
        amount: Number(item.amount)
      }));
      
      if (formattedData.length > 0) {
        setBudgets(formattedData);
      }
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const addExpense = async (expense: Omit<Expense, "id">) => {
    try {
      // First, insert into Supabase
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          amount: expense.amount,
          date: expense.date.toISOString(),
          category: expense.category,
          description: expense.description
        })
        .select();
      
      if (error) throw error;
      
      if (data && data[0]) {
        // Create a new expense object with the ID from Supabase
        const newExpense: Expense = {
          id: data[0].id,
          amount: expense.amount,
          date: expense.date,
          category: expense.category,
          description: expense.description
        };
        
        // Then update local state
        setExpenses(prev => [...prev, newExpense]);
        toast.success("Expense added successfully");
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error("Failed to add expense");
    }
  };

  const updateExpense = async (expense: Expense) => {
    try {
      // First, update in Supabase
      const { error } = await supabase
        .from('expenses')
        .update({
          amount: expense.amount,
          date: expense.date.toISOString(),
          category: expense.category,
          description: expense.description
        })
        .eq('id', expense.id);
      
      if (error) throw error;
      
      // Then update local state
      setExpenses(prev => prev.map(e => e.id === expense.id ? expense : e));
      toast.success("Expense updated successfully");
    } catch (error) {
      console.error('Error updating expense:', error);
      toast.error("Failed to update expense");
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      // First, delete from Supabase
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Then update local state
      setExpenses(prev => prev.filter(e => e.id !== id));
      toast.success("Expense deleted successfully");
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error("Failed to delete expense");
    }
  };

  const setBudget = async (budget: Budget) => {
    try {
      // Check if this budget category already exists
      const existingBudget = budgets.find(b => b.category === budget.category);
      
      if (existingBudget) {
        // Update existing budget in Supabase
        const { error } = await supabase
          .from('budget')
          .update({
            amount: budget.amount
          })
          .eq('category', budget.category);
          
        if (error) throw error;
      } else {
        // Insert new budget in Supabase
        const { error } = await supabase
          .from('budget')
          .insert({
            category: budget.category,
            amount: budget.amount,
            period: 'monthly' // Default period
          });
          
        if (error) throw error;
      }
      
      // Update local state
      setBudgets(prev => {
        const exists = prev.find(b => b.category === budget.category);
        if (exists) {
          return prev.map(b => b.category === budget.category ? budget : b);
        }
        return [...prev, budget];
      });
      
      toast.success(`Budget for ${budget.category} set to ₹${budget.amount}`);
    } catch (error) {
      console.error('Error setting budget:', error);
      toast.error("Failed to set budget");
    }
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
      expensesByCategory,
      month: 'Total',
      year
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
