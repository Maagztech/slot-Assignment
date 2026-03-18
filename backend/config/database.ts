import dotenv from "dotenv";
// Load environment variables from .env file
dotenv.config();
import mongoose from "mongoose";

const URI = process.env.MONGODB_URL;

export const connectDB = async () => {
  if (!URI) {
    throw new Error("MONGODB_URL is not defined in .env");
  }

  try {
    await mongoose.connect(URI);
    console.log("Mongodb connection successful");
  } catch (err) {
    console.error("Mongodb connection error:", err);
    process.exit(1);
  }
};
