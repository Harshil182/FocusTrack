import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

// Runs after express-validator's rule chains — turns validation
// failures into a consistent 400 ApiError response.
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, "Validation failed", errors.array());
  }
  next();
};
