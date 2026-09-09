import mongoose from "mongoose";
import dns from "node:dns";
import { logger } from "../utils/logger.js";

// Connects to MongoDB Atlas using Mongoose. Exits the process on failure
// since the API is useless without a database connection.
export const connectDB = async () => {
  try {
    if (process.env.MONGO_DNS_SERVER) {
      dns.setServers([process.env.MONGO_DNS_SERVER]);
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    logger.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};
