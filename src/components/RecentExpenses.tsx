
import { useState } from "react";
import { format } from "date-fns";
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

import { useExpense } from "@/context/ExpenseContext";
import ExpenseForm from "./ExpenseForm";
import { Expense } from "@/types";

const RecentExpenses = () => {
  const { expenses, deleteExpense } = useExpense();
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | undefined>(
    undefined
  );

  // Sort expenses by date, most recent first, and take only the most recent 5
  const recentExpenses = [...expenses]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  const handleEditExpense = (expense: Expense) => {
    setExpenseToEdit(expense);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Expenses</CardTitle>
          <CardDescription>
            Your most recent transactions
          </CardDescription>
        </div>
        <ExpenseForm trigger={<Button>Add</Button>} />
      </CardHeader>
      <CardContent>
        {recentExpenses.length > 0 ? (
          <>
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
                {recentExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{format(expense.date, "MMM d, yyyy")}</TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell className="text-right">
                      ${expense.amount.toFixed(2)}
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
            {expenseToEdit && (
              <ExpenseForm
                expenseToEdit={expenseToEdit}
                onComplete={() => setExpenseToEdit(undefined)}
                trigger={<div className="hidden" />}
              />
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-4">
            <p className="text-muted-foreground mb-4">
              No recent expenses found.
            </p>
            <ExpenseForm />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentExpenses;
