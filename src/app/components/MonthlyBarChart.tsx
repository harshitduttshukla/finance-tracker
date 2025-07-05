"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date: string;
  type: "income" | "expense";
  category?: string;
}

interface ChartEntry {
  month: string;
  income: number;
  expense: number;
}

interface Props {
  transactions: Transaction[];
}

export default function MonthlyBarChart({ transactions }: Props) {
  const grouped: Record<string, { income: number; expense: number }> = {};

  transactions.forEach((tx) => {
    const date = new Date(tx.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    if (!grouped[monthKey]) {
      grouped[monthKey] = { income: 0, expense: 0 };
    }

    if (tx.type === "income") {
      grouped[monthKey].income += tx.amount;
    } else {
      grouped[monthKey].expense += tx.amount;
    }
  });

  const chartData: ChartEntry[] = Object.entries(grouped)
    .map(([month, { income, expense }]) => ({
      month,
      income,
      expense,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return (
    <div className="mt-6 bg-white dark:bg-zinc-900 p-4 rounded shadow w-full max-w-3xl mx-auto border border-gray-200 dark:border-zinc-700">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        📈 Monthly Income vs Expenses
      </h2>
      {chartData.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No data to display.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#34D399" name="Income" />
            <Bar dataKey="expense" fill="#F87171" name="Expense" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
