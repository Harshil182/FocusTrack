import { logger } from "../utils/logger.js";

// 404 handler — runs when no route matched.
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

// Global error handler — must be registered last in app.js.
// Every thrown error (including ApiError instances) lands here.
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode && err.statusCode !== 200 ? err.statusCode : 500;

  logger.error(err.message, process.env.NODE_ENV === "development" ? err.stack : "");

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
