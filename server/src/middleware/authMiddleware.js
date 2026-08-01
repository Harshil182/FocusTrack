import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/User.js";

// Protects routes — verifies the JWT (from Authorization header or cookie)
// and attaches the authenticated user to req.user.
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) throw new ApiError(401, "Not authorized, no token provided");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) throw new ApiError(401, "User no longer exists");
    next();
  } catch (err) {
    throw new ApiError(401, "Not authorized, token invalid or expired");
  }
});
