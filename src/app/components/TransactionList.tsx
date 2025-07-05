"use client";

import { useState } from "react";

interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date: string;
  type: "income" | "expense";
  category?: string;
}

interface Props {
  transactions: Transaction[];
  onUpdate: () => Promise<void>;
}

export default function TransactionList({ transactions, onUpdate }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    amount: "",
    description: "",
    date: "",
    type: "expense",
    category: "General",
  });

  function handleEdit(tx: Transaction) {
    setEditingId(tx._id);
    setEditForm({
      amount: tx.amount.toString(),
      description: tx.description,
      date: tx.date.slice(0, 10),
      type: tx.type,
      category: tx.category || "General",
    });
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;

    await fetch(`/api/transactions/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });

    setEditingId(null);
    await onUpdate();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    await onUpdate();
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-4">
      {transactions.map((tx) =>
        editingId === tx._id ? (
          <form
            key={tx._id}
            onSubmit={handleUpdate}
            className="bg-white dark:bg-zinc-900 border p-4 rounded-xl space-y-2 shadow"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="number"
                value={editForm.amount}
                onChange={(e) =>
                  setEditForm({ ...editForm, amount: e.target.value })
                }
                className="p-2 rounded w-full text-black"
              />
              <input
                type="text"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                className="p-2 rounded w-full text-black"
              />
              <input
                type="date"
                value={editForm.date}
                onChange={(e) =>
                  setEditForm({ ...editForm, date: e.target.value })
                }
                className="p-2 rounded w-full text-black"
              />
              <select
                value={editForm.type}
                onChange={(e) =>
                  setEditForm({ ...editForm, type: e.target.value })
                }
                className="p-2 rounded w-full text-black"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <select
                value={editForm.category}
                onChange={(e) =>
                  setEditForm({ ...editForm, category: e.target.value })
                }
                className="p-2 rounded w-full text-black"
              >
                <option value="Food">🍔 Food</option>
                <option value="Rent">🏠 Rent</option>
                <option value="Shopping">🛍️ Shopping</option>
                <option value="Transport">🚌 Transport</option>
                <option value="Utilities">💡 Utilities</option>
                <option value="Salary">💼 Salary</option>
                <option value="General">📦 General</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                ✅ Save
              </button>
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
              >
                ❌ Cancel
              </button>
            </div>
          </form>
        ) : (
          <div
            key={tx._id}
            className="bg-white dark:bg-zinc-900 border p-4 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-lg">
                ₹ {tx.amount}{" "}
                <span className="text-sm font-normal text-gray-500">
                  ({tx.type})
                </span>
              </p>
              <p className="text-gray-800 dark:text-gray-200">{tx.description}</p>
              <p className="text-sm text-gray-500">
                {new Date(tx.date).toDateString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                🏷️ {tx.category || "General"}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(tx)}
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded"
              >
                ✏️
              </button>
              <button
                onClick={() => handleDelete(tx._id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                🗑️
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
