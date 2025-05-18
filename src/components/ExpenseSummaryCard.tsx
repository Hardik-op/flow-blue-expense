
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExpense } from "@/context/ExpenseContext";

const ExpenseSummaryCard = () => {
  const { getTotalExpenses, getTotalBudget } = useExpense();
  
  const totalExpenses = getTotalExpenses();
  const totalBudget = getTotalBudget();
  const budgetRemaining = totalBudget - totalExpenses;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="card-hover">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${totalExpenses.toFixed(2)}</p>
        </CardContent>
      </Card>
      
      <Card className="card-hover">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Budget
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${totalBudget.toFixed(2)}</p>
        </CardContent>
      </Card>
      
      <Card className={`card-hover ${budgetRemaining < 0 ? 'border-expense-red-400' : ''}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Budget Remaining
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-2xl font-bold ${budgetRemaining < 0 ? 'text-expense-red-500' : ''}`}>
            ${budgetRemaining.toFixed(2)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseSummaryCard;
