import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";

import { useExpense } from "@/context/ExpenseContext";
import ExpenseForm from "@/components/ExpenseForm";
import { Expense, Category, DateRange, SortDirection } from "@/types";

const ExpenseList = () => {
  const { expenses, deleteExpense, categories } = useExpense();
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | undefined>(undefined);
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [minAmount, setMinAmount] = useState<string>("");
  const [maxAmount, setMaxAmount] = useState<string>("");
  
  // Sorting
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Apply filters and sorting
  const filteredAndSortedExpenses = expenses
    .filter((expense) => {
      // Category filter
      if (categoryFilter !== "all" && expense.category !== categoryFilter) {
        return false;
      }
      
      // Date range filter
      if (dateRange.from && expense.date < dateRange.from) {
        return false;
      }
      if (dateRange.to) {
        const toDateEnd = new Date(dateRange.to);
        toDateEnd.setHours(23, 59, 59, 999);
        if (expense.date > toDateEnd) {
          return false;
        }
      }
      
      // Amount range filter
      const min = minAmount ? parseFloat(minAmount) : -Infinity;
      const max = maxAmount ? parseFloat(maxAmount) : Infinity;
      if (expense.amount < min || expense.amount > max) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by selected field
      const multiplier = sortDirection === "asc" ? 1 : -1;
      
      if (sortBy === "date") {
        return multiplier * (a.date.getTime() - b.date.getTime());
      } else {
        return multiplier * (a.amount - b.amount);
      }
    });

  const handleEditExpense = (expense: Expense) => {
    setExpenseToEdit(expense);
  };
  
  const clearFilters = () => {
    setCategoryFilter("all");
    setDateRange({ from: undefined, to: undefined });
    setMinAmount("");
    setMaxAmount("");
    setSortBy("date");
    setSortDirection("desc");
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Expenses</h1>
        <p className="text-muted-foreground">
          View and manage all your expenses
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>All Expenses</CardTitle>
              <CardDescription>
                Filter and sort your transactions
              </CardDescription>
            </div>
            <ExpenseForm 
              trigger={<Button>New Expense</Button>}
              expenseToEdit={expenseToEdit}
              onComplete={() => setExpenseToEdit(undefined)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium mb-1 block">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Date Range Filter */}
              <div>
                <label className="text-sm font-medium mb-1 block">Date Range</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "MMM d, yyyy")} -{" "}
                            {format(dateRange.to, "MMM d, yyyy")}
                          </>
                        ) : (
                          format(dateRange.from, "MMM d, yyyy")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              {/* Amount Range Filter */}
              <div>
                <label className="text-sm font-medium mb-1 block">Min Amount</label>
                <Input
                  type="number"
                  placeholder="Min ₹"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Max Amount</label>
                <Input
                  type="number"
                  placeholder="Max ₹"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                />
              </div>
            </div>
            
            {/* Sort Controls */}
            <div className="flex flex-wrap gap-2 items-center justify-between">
              <div className="flex items-center gap-2">
                <Button 
                  onClick={clearFilters} 
                  variant="outline" 
                  size="sm"
                >
                  Clear Filters
                </Button>
                
                <div className="flex items-center gap-2">
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as "date" | "amount")}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="amount">Amount</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    onClick={toggleSortDirection}
                    variant="outline"
                    size="icon"
                  >
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </Button>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {filteredAndSortedExpenses.length} expense{filteredAndSortedExpenses.length !== 1 ? "s" : ""} found
              </p>
            </div>
            
            {/* Expenses Table */}
            {filteredAndSortedExpenses.length > 0 ? (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedExpenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>{format(expense.date, "MMM d, yyyy")}</TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell>{expense.category}</TableCell>
                        <TableCell className="text-right font-medium">
                          ₹{expense.amount.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditExpense(expense)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteExpense(expense.id)}
                              className="text-expense-red-500 hover:text-expense-red-600 hover:bg-expense-red-100"
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No expenses match your filters</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseList;
