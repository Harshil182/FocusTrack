import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// @route POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, "An account with this email already exists");

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  res.cookie("token", token, COOKIE_OPTIONS);
  res.status(201).json({ success: true, message: "Account created", user, token });
});

// @route POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(user._id);
  res.cookie("token", token, COOKIE_OPTIONS);
  res.status(200).json({ success: true, message: "Login successful", user, token });
});

// @route POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out" });
});

// @route GET /api/auth/profile
export const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

// @route PUT /api/auth/profile
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, avatar, theme, notificationSettings } = req.body;

  const user = await User.findById(req.user._id);
  if (name) user.name = name;
  if (avatar !== undefined) user.avatar = avatar;
  if (theme) user.theme = theme;
  if (notificationSettings) user.notificationSettings = { ...user.notificationSettings, ...notificationSettings };

  await user.save();
  res.status(200).json({ success: true, message: "Profile updated", user });
});
