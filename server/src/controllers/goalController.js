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

  const today = new Date().toISOString().slice(0, 10);
  const progress = await Tracking.aggregate([
    { $match: { user: req.user._id, date: today } },
    { $group: { _id: "$category", seconds: { $sum: "$durationSeconds" } } },
  ]);
  const secondsByCategory = new Map(
    progress.map(({ _id, seconds }) => [String(_id), seconds])
  );
  const totalSeconds = progress.reduce((sum, item) => sum + item.seconds, 0);

  const withProgress = goals.map((goal) => {
    const seconds = goal.category
      ? secondsByCategory.get(String(goal.category._id)) || 0
      : totalSeconds;
    const minutesLogged = seconds / 60;
    return {
      ...goal.toObject(),
      progressMinutes: Math.round(minutesLogged),
      isComplete: minutesLogged >= goal.targetMinutes,
    };
  });

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
