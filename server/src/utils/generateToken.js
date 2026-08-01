import jwt from "jsonwebtoken";

// Signs a JWT containing the user's id. Expiry is configurable via .env.
export const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
