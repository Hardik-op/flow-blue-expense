
import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Category } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExpense } from "@/context/ExpenseContext";

interface PieChartData {
  name: string;
  value: number;
}

// Color palette using only blue and red shades
const BLUE_RED_COLORS = [
  "#2563EB", // blue-500
  "#1D4ED8", // blue-600
  "#1E3A8A", // blue-700
  "#DBEAFE", // blue-100
  "#93C5FD", // blue-200
  "#60A5FA", // blue-300
  "#EF4444", // red-400
  "#DC2626", // red-500
  "#B91C1C", // red-600
  "#7F1D1D", // red-700
  "#FEE2E2", // red-100
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}) => {
  if (percent < 0.05) return null; // Don't show labels for tiny slices
  
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const ExpensePieChart: React.FC = () => {
  const { getExpensesByCategory } = useExpense();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const expensesByCategory = getExpensesByCategory();

  // Filter out categories with zero expenses
  const data: PieChartData[] = Object.entries(expensesByCategory)
    .filter(([_, value]) => value > 0)
    .map(([category, value]) => ({
      name: category as Category,
      value,
    }));

  const handleMouseEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  // Show a message if there are no expenses
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expense Distribution</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-[300px]">
          <p className="text-muted-foreground text-center">
            No expenses recorded yet.<br/>
            Add some expenses to see your distribution.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius="70%"
              innerRadius="30%"
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={BLUE_RED_COLORS[index % BLUE_RED_COLORS.length]}
                  stroke={
                    activeIndex === index
                      ? "#fff"
                      : BLUE_RED_COLORS[index % BLUE_RED_COLORS.length]
                  }
                  strokeWidth={activeIndex === index ? 2 : 1}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Amount"]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ExpensePieChart;
