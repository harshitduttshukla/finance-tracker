"use client";

import { useEffect, useState } from "react";
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
  amount: number;
  date: string;
  type: "income" | "expense";
}

interface ChartEntry {
  month: string;
  income: number;
  expense: number;
}

export default function MonthlyBarChart() {
  const [data, setData] = useState<ChartEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/transactions");
        if (!res.ok) throw new Error("Failed to fetch transactions");

        const txs: Transaction[] = await res.json();

        const grouped: Record<string, { income: number; expense: number }> = {};

        txs.forEach((tx) => {
          const date = new Date(tx.date);
          const monthKey = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}`; // e.g., 2025-07

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

        setData(chartData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Something went wrong.");
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <p className="text-gray-500">Loading chart...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="mt-6 bg-white p-4 rounded shadow w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Monthly Income vs Expenses</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="income" fill="#34D399" name="Income" />
          <Bar dataKey="expense" fill="#F87171" name="Expense" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
