
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useExpense } from "@/context/ExpenseContext";

const Reports = () => {
  const { getMonthlyReport, getYearlyReport, categories } = useExpense();
  
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [reportType, setReportType] = useState<"monthly" | "yearly">("monthly");
  
  // Get years for dropdown (last 5 years)
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  
  // Month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const report = reportType === "monthly" 
    ? getMonthlyReport(selectedMonth, selectedYear)
    : getYearlyReport(selectedYear);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Reports</h1>
        <p className="text-muted-foreground">
          View your expense reports by month or year
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <span>Expense Report</span>
            <div className="flex flex-wrap gap-2">
              <Select
                value={reportType}
                onValueChange={(value) => setReportType(value as "monthly" | "yearly")}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Report Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              
              {reportType === "monthly" && (
                <Select
                  value={selectedMonth.toString()}
                  onValueChange={(value) => setSelectedMonth(parseInt(value))}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthNames.map((month, index) => (
                      <SelectItem key={month} value={index.toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Summary Card */}
            <Card className="bg-secondary/50">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">
                  {reportType === "monthly" 
                    ? `${report.month} ${report.year}` 
                    : `Year ${selectedYear}`
                  }
                </h3>
                <p className="text-3xl font-bold">
                  ₹{report.totalAmount.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Total expenses for this {reportType === "monthly" ? "month" : "year"}
                </p>
              </CardContent>
            </Card>
            
            {/* Expenses by Category */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Expenses by Category</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map(category => {
                  const amount = report.expensesByCategory[category] || 0;
                  const percentage = report.totalAmount > 0 
                    ? ((amount / report.totalAmount) * 100).toFixed(1) 
                    : "0.0";
                    
                  // Skip categories with no expenses
                  if (amount === 0) return null;
                  
                  return (
                    <Card key={category} className="card-hover">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{category}</span>
                          <span className="text-muted-foreground text-sm">{percentage}%</span>
                        </div>
                        <p className="text-xl font-bold mt-2">₹{amount.toFixed(2)}</p>
                      </CardContent>
                    </Card>
                  );
                })}
                
                {/* Show message if no expenses */}
                {report.totalAmount === 0 && (
                  <div className="col-span-full text-center py-4">
                    <p className="text-muted-foreground">
                      No expenses recorded for this {reportType === "monthly" ? "month" : "year"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
