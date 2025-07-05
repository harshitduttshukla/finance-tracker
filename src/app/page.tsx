"use client";

import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import MonthlyBarChart from "./components/MonthlyBarChart";

export default function Home() {
  return (
    <main className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Finance Tracker</h1>
      <TransactionForm onAdd={() => window.location.reload()} />
      <TransactionList />
      <MonthlyBarChart />
    </main>
  );
}
