// src/models/Transaction.ts
import  { Schema, model, models, Document } from "mongoose";

export interface ITransaction extends Document {
  amount: number;
  description: string;
  date: Date;
  category?: string;
  type: "income" | "expense";
  createdAt?: Date;
  updatedAt?: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount cannot be negative"],
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      default: "General",
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
      default: "expense",
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = models.Transaction || model<ITransaction>("Transaction", TransactionSchema);
export default Transaction;
