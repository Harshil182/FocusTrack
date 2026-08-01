import Goal from "../models/Goal.js";
import Tracking from "../models/Tracking.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

// @route POST /api/goals
export const createGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.create({ ...req.body, user: req.user._id });
  res.status(201).json({ success: true, message: "Goal created", data: goal });
});

// @route GET /api/goals
export const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user._id, isActive: true }).populate("category");

  // Attach today's progress toward each goal.
  const today = new Date().toISOString().slice(0, 10);
  const withProgress = await Promise.all(
    goals.map(async (goal) => {
      const query = { user: req.user._id, date: today };
      if (goal.category) query.category = goal.category._id;
      const entries = await Tracking.find(query);
      const minutesLogged = entries.reduce((sum, e) => sum + e.durationSeconds, 0) / 60;
      return { ...goal.toObject(), progressMinutes: Math.round(minutesLogged), isComplete: minutesLogged >= goal.targetMinutes };
    })
  );

  res.status(200).json({ success: true, data: withProgress });
});

// @route PUT /api/goals/:id
export const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
  if (!goal) throw new ApiError(404, "Goal not found");
  res.status(200).json({ success: true, message: "Goal updated", data: goal });
});

// @route DELETE /api/goals/:id
export const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { isActive: false });
  if (!goal) throw new ApiError(404, "Goal not found");
  res.status(200).json({ success: true, message: "Goal removed" });
});
