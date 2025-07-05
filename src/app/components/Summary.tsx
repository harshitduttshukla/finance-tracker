"use client";

interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date: string;
  type: "income" | "expense";
  category?: string;
}

interface SummaryProps {
  transactions: Transaction[];
}


export default function Summary({ transactions }: { transactions: Transaction[] }) {
  const totalExpense = transactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalIncome = transactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const categorySpend: Record<string, number> = {};
  transactions.forEach((tx) => {
    if (tx.type === "expense") {
      const cat = tx.category || "General";
      categorySpend[cat] = (categorySpend[cat] || 0) + tx.amount;
    }
  });

  const mostSpentCategory = Object.entries(categorySpend).reduce(
    (max, entry) => (entry[1] > max[1] ? entry : max),
    ["None", 0]
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {/* Total Spent */}
      <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-gray-200 dark:border-zinc-700">
        <p className="text-gray-500 dark:text-gray-400 text-sm">Total Spent</p>
        <h2 className="text-2xl font-bold text-red-500 dark:text-red-400">₹{totalExpense}</h2>
      </div>

      {/* Total Income */}
      <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-gray-200 dark:border-zinc-700">
        <p className="text-gray-500 dark:text-gray-400 text-sm">Total Income</p>
        <h2 className="text-2xl font-bold text-green-500 dark:text-green-400">₹{totalIncome}</h2>
      </div>

      {/* Most Spent Category */}
      <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-gray-200 dark:border-zinc-700">
        <p className="text-gray-500 dark:text-gray-400 text-sm">Most Spent Category</p>
        <h2 className="text-2xl font-bold text-blue-500 dark:text-blue-400">{mostSpentCategory[0]}</h2>
      </div>

      {/* Total Transactions */}
      <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-gray-200 dark:border-zinc-700">
        <p className="text-gray-500 dark:text-gray-400 text-sm">Total Transactions</p>
        <h2 className="text-2xl font-bold text-gray-700 dark:text-white">{transactions.length}</h2>
      </div>
    </div>
  );
}
