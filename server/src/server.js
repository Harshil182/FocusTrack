import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/db.js";
import { logger } from "./utils/logger.js";

const PORT = process.env.PORT || 5000;

// Connect to MongoDB first, then start listening.
// This prevents the server from accepting requests before the DB is ready.
connectDB().then(() => {
  app.listen(PORT, () => {
    logger.info(`FocusTrack API running on http://localhost:${PORT} [${process.env.NODE_ENV || "development"}]`);
  });
});

process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection:", err.message);
  process.exit(1);
});
