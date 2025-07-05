import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
console.log("Connecting to:", process.env.MONGODB_URI);


if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in the environment variables");
}

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    console.log("MongoDB already connected.");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected.");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}
