import Tracking from "../models/Tracking.js";
import Category from "../models/Category.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Given a domain, finds the user's matching category (if any configured).
async function resolveCategory(userId, domain) {
  const category = await Category.findOne({ user: userId, domains: domain });
  return category?._id || null;
}

// @route POST /api/tracking/sync
// Body: { entries: [{ domain, date, durationSeconds }] }
// Called by the extension every minute with buffered tracking data.
export const syncTracking = asyncHandler(async (req, res) => {
  const { entries = [] } = req.body;
  const userId = req.user._id;

  const results = [];
  for (const entry of entries) {
    const { domain, date, durationSeconds } = entry;
    if (!domain || !date || !durationSeconds) continue;

    const category = await resolveCategory(userId, domain);

    // Upsert: accumulate duration for the same user+domain+date.
    const doc = await Tracking.findOneAndUpdate(
      { user: userId, domain, date },
      {
        $inc: { durationSeconds, visitCount: 1 },
        $setOnInsert: { category },
      },
      { upsert: true, new: true }
    );
    results.push(doc);
  }

  res.status(200).json({ success: true, message: `Synced ${results.length} entries`, data: results });
});

// @route GET /api/tracking/summary/today
export const getTodaySummary = asyncHandler(async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const entries = await Tracking.find({ user: req.user._id, date: today }).populate("category");

  const totalSeconds = entries.reduce((sum, e) => sum + e.durationSeconds, 0);
  const productiveSeconds = entries
    .filter((e) => e.category?.isProductive)
    .reduce((sum, e) => sum + e.durationSeconds, 0);

  res.status(200).json({
    success: true,
    summary: { totalSeconds, productiveSeconds, unproductiveSeconds: totalSeconds - productiveSeconds, entries },
  });
});

// @route GET /api/tracking?range=daily|weekly|monthly&start=YYYY-MM-DD&end=YYYY-MM-DD
export const getTrackingByRange = asyncHandler(async (req, res) => {
  const { start, end } = req.query;
  const query = { user: req.user._id };
  if (start && end) query.date = { $gte: start, $lte: end };

  const entries = await Tracking.find(query).populate("category").sort({ date: 1 });
  res.status(200).json({ success: true, count: entries.length, data: entries });
});
