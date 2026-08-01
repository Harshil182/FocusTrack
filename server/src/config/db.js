import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

// Connects to MongoDB Atlas using Mongoose. Exits the process on failure
// since the API is useless without a database connection.
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    logger.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};
