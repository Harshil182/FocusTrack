import Category from "../models/Category.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const DEFAULT_CATEGORIES = [
  { name: "Programming", isProductive: true, color: "#4f46e5" },
  { name: "Education", isProductive: true, color: "#059669" },
  { name: "Work", isProductive: true, color: "#0891b2" },
  { name: "Entertainment", isProductive: false, color: "#dc2626" },
  { name: "Social Media", isProductive: false, color: "#db2777" },
  { name: "Shopping", isProductive: false, color: "#d97706" },
  { name: "News", isProductive: false, color: "#7c3aed" },
  { name: "Others", isProductive: false, color: "#6b7280" },
];

// Called once after registration (or lazily) to seed a user's categories.
export const seedDefaultCategories = async (userId) => {
  const existing = await Category.countDocuments({ user: userId });
  if (existing > 0) return;
  await Category.insertMany(DEFAULT_CATEGORIES.map((c) => ({ ...c, user: userId })));
};

// @route GET /api/categories
export const getCategories = asyncHandler(async (req, res) => {
  await seedDefaultCategories(req.user._id);
  const categories = await Category.find({ user: req.user._id }).sort({ name: 1 });
  res.status(200).json({ success: true, data: categories });
});

// @route PUT /api/categories/:id
export const updateCategory = asyncHandler(async (req, res) => {
  const { domains, isProductive, color } = req.body;
  const category = await Category.findOne({ _id: req.params.id, user: req.user._id });
  if (!category) throw new ApiError(404, "Category not found");

  if (domains) category.domains = domains;
  if (isProductive !== undefined) category.isProductive = isProductive;
  if (color) category.color = color;

  await category.save();
  res.status(200).json({ success: true, message: "Category updated", data: category });
});
