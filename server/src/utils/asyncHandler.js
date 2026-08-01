// Wraps async route handlers so we never need try/catch in controllers.
// Any rejected promise is forwarded to Express's error-handling middleware.
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
