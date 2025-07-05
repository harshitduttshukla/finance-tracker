"use client";

import { useEffect, useState } from "react";

interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date: string;
  type: "income" | "expense";
}

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    amount: "",
    description: "",
    date: "",
    type: "expense",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/transactions");
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      setError("Failed to fetch transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  async function handleDelete(id: string) {
    const confirmed = confirm("Are you sure you want to delete this transaction?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete transaction");
      fetchData();
    } catch (err) {
      alert("Failed to delete transaction.");
    }
  }

  async function handleUpdate(id: string) {
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) throw new Error("Failed to update");

      setEditingId(null);
      fetchData();
    } catch (err) {
      alert("Update failed.");
    }
  }

  const handleEdit = (tx: Transaction) => {
    setEditingId(tx._id);
    setEditForm({
      amount: tx.amount.toString(),
      description: tx.description,
      date: tx.date.slice(0, 10),
      type: tx.type,
    });
  };

  return (
    <div className="mt-6 space-y-4 max-w-2xl">
      <h2 className="text-xl font-bold text-white">Transactions</h2>

      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && transactions.length === 0 && (
        <p className="text-gray-400 italic">No transactions found.</p>
      )}

      {transactions.map((tx) =>
        editingId === tx._id ? (
          <div key={tx._id} className="p-4 bg-gray-800 text-white rounded space-y-2 shadow-md">
            <input
              type="number"
              value={editForm.amount}
              onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
              className="w-full p-2 rounded text-black"
            />
            <input
              type="text"
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              className="w-full p-2 rounded text-black"
            />
            <input
              type="date"
              value={editForm.date}
              onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
              className="w-full p-2 rounded text-black"
            />
            <select
              value={editForm.type}
              onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
              className="w-full p-2 rounded text-black"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <div className="flex space-x-4">
              <button
                onClick={() => handleUpdate(tx._id)}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditingId(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div
            key={tx._id}
            className={`flex justify-between items-center p-3 border rounded shadow-sm ${
              tx.type === "income" ? "bg-green-50" : "bg-red-50"
            }`}
          >
            <div>
              <p className="font-semibold text-lg">
                ₹ {tx.amount}{" "}
                <span className="text-sm font-normal text-gray-500">({tx.type})</span>
              </p>
              <p className="text-gray-800">{tx.description}</p>
              <p className="text-sm text-gray-500">{new Date(tx.date).toDateString()}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => handleEdit(tx)}
                className="text-blue-600 hover:underline text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(tx._id)}
                className="text-red-600 hover:underline text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
