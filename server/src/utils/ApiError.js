// Custom error class so controllers can throw a typed error with a
// specific HTTP status code, caught by the global error handler.
export class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;
  }
}
