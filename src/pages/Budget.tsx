
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useExpense } from "@/context/ExpenseContext";
import { Category, Budget } from "@/types";

const BudgetPage = () => {
  const { 
    categories, 
    budgets, 
    setBudget,
    getExpensesByCategory
  } = useExpense();
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>("Food");
  const [budgetAmount, setBudgetAmount] = useState("0");

  const expensesByCategory = getExpensesByCategory();

  const handleSaveBudget = () => {
    const newBudget: Budget = {
      category: selectedCategory,
      amount: parseFloat(budgetAmount),
    };
    setBudget(newBudget);
    setOpen(false);
  };

  // Calculate the percentage of budget used
  const calculateUsedPercentage = (category: Category) => {
    const budget = budgets.find((b) => b.category === category);
    if (!budget || budget.amount === 0) return 0;
    
    const spent = expensesByCategory[category] || 0;
    return Math.min(100, Math.round((spent / budget.amount) * 100));
  };

  // Determine the status color based on percentage
  const getStatusColor = (percentage: number) => {
    if (percentage >= 100) return "bg-expense-red-500";
    if (percentage >= 75) return "bg-expense-red-400";
    if (percentage >= 50) return "bg-expense-blue-400";
    return "bg-expense-blue-500";
  };

  // Edit a budget
  const handleEditBudget = (category: Category) => {
    const budget = budgets.find((b) => b.category === category);
    setSelectedCategory(category);
    setBudgetAmount(budget ? budget.amount.toString() : "0");
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Budget</h1>
        <p className="text-muted-foreground">
          Set and manage your monthly budgets
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Card className="w-full sm:w-auto">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Total Budget</p>
              <p className="text-3xl font-bold mt-1">
                ${budgets.reduce((sum, b) => sum + b.amount, 0).toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Set New Budget</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Set Budget</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category
                </label>
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => setSelectedCategory(value as Category)}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="amount" className="text-sm font-medium">
                  Budget Amount ($)
                </label>
                <Input
                  id="amount"
                  type="number"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSaveBudget}>Save Budget</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budget Tracking</CardTitle>
          <CardDescription>
            Monitor your spending against your monthly budgets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {categories.map((category) => {
              const budget = budgets.find((b) => b.category === category);
              const budgetAmount = budget ? budget.amount : 0;
              const spent = expensesByCategory[category] || 0;
              const remaining = budgetAmount - spent;
              const percentage = calculateUsedPercentage(category);
              const statusColor = getStatusColor(percentage);

              return (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{category}</h3>
                        <span className="text-sm text-muted-foreground">
                          {percentage}% used
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full mt-1 overflow-hidden">
                        <div
                          className={`h-full ${statusColor}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2"
                      onClick={() => handleEditBudget(category)}
                    >
                      Edit
                    </Button>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div>
                      <span className="text-muted-foreground">Spent: </span>
                      <span className="font-medium">${spent.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Budget: </span>
                      <span className="font-medium">${budgetAmount.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Remaining: </span>
                      <span className={`font-medium ${remaining < 0 ? 'text-expense-red-500' : ''}`}>
                        ${remaining.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetPage;
