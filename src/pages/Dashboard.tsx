
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ExpensePieChart from "@/components/ExpensePieChart";
import ExpenseSummaryCard from "@/components/ExpenseSummaryCard";
import RecentExpenses from "@/components/RecentExpenses";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to ExpenseFlow - track your expenses with ease
        </p>
      </div>

      <ExpenseSummaryCard />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpensePieChart />

        <Card>
          <CardHeader>
            <CardTitle>Budget Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground mb-2">
                Track your budget progress in the Budget section
              </p>
              <a
                href="/budget"
                className="text-primary hover:underline font-medium"
              >
                Visit Budget Section →
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      <RecentExpenses />
    </div>
  );
};

export default Dashboard;
