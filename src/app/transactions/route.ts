// src/app/api/transactions/route.ts
import { connectDB } from "@/lib/db";
import Transaction from "@/models/Transaction";
import { NextResponse } from "next/server";

// GET /api/transactions → fetch all
export async function GET() {
  try {
    await connectDB();
    const transactions = await Transaction.find().sort({ date: -1 });
    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error("GET /transactions error:", error);
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

// POST /api/transactions → create new
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { amount, description, date, type, category } = body;

    if (!amount || !description || !date || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const transaction = await Transaction.create({
      amount,
      description,
      date,
      type,
      category,
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("POST /transactions error:", error);
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}
