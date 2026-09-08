import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/db.js";
import { logger } from "./utils/logger.js";

const PORT = process.env.PORT || 5000;

// Connect to MongoDB first, then start listening.
connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    logger.info(
      `FocusTrack API running on port ${PORT} [${process.env.NODE_ENV || "development"}]`
    );
  });
});

process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection:", err.message);
  process.exit(1);
});
