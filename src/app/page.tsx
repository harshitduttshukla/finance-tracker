"use client";

import { useEffect, useState } from "react";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import MonthlyBarChart from "./components/MonthlyBarChart";
import CategoryPieChart from "./components/CategoryPieChart";
import Summary from "./components/Summary";

interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date: string;
  type: "income" | "expense";
  category?: string;
}


export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Fetch transactions from backend
  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    try {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      setTransactions(data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-8 py-10 space-y-10">
      <h1 className="text-3xl font-bold text-center">💼 Personal Finance Tracker</h1>

      {/* Add Transaction Form */}
      <TransactionForm onAdd={fetchTransactions} />

      {/* Dashboard Summary Cards */}
      <Summary transactions={transactions} />

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CategoryPieChart transactions={transactions} />
        <MonthlyBarChart transactions={transactions} />
      </div>

      {/* Transaction List */}
      <TransactionList transactions={transactions} onUpdate={fetchTransactions} />
    </main>
  );
}
