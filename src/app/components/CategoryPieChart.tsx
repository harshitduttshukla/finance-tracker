"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieLabelRenderProps,
} from "recharts";

interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date: string;
  type: "income" | "expense";
  category?: string;
}

export default function CategoryPieChart({
  transactions,
}: {
  transactions: Transaction[];
}) {
  // 1. Filter for expenses only
  const expenseData = transactions.filter((tx) => tx.type === "expense");

  // 2. Group and sum by category
  const categoryTotals = expenseData.reduce(
    (acc: Record<string, number>, tx) => {
      const cat = tx.category || "General";
      acc[cat] = (acc[cat] || 0) + tx.amount;
      return acc;
    },
    {}
  );

  // 3. Format for Recharts
  const chartData = Object.entries(categoryTotals).map(
    ([category, total]) => ({
      name: category,
      value: total,
    })
  );

  // 4. Slice colors
  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7f50",
    "#a28cf0",
    "#ff6f61",
    "#00bcd4",
    "#f06292",
    "#4caf50",
    "#e91e63",
  ];

  // 5. Label function with types
  const renderLabel = ({ name, percent }: PieLabelRenderProps) =>
    `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-md w-full max-w-2xl mx-auto mt-10 border border-gray-200 dark:border-zinc-700">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white text-center">
        📊 Expenses by Category
      </h2>

      {chartData.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No expense data available.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              labelLine={false}
              label={renderLabel}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend layout="horizontal" align="center" verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
