import Tracking from "../models/Tracking.js";
import Category from "../models/Category.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const FALLBACK_CATEGORIES = [
  { name: "Social Media", patterns: [/facebook\.com$/, /twitter\.com$/, /instagram\.com$/, /tiktok\.com$/, /linkedin\.com$/] },
  { name: "Programming", patterns: [/github\.com$/, /gitlab\.com$/, /stackoverflow\.com$/, /notion\.so$/] },
  { name: "News", patterns: [/nytimes\.com$/, /cnn\.com$/, /bbc\.co/, /theguardian\.com/] },
  { name: "Entertainment", patterns: [/youtube\.com$/, /vimeo\.com$/, /twitch\.tv$/] },
  { name: "Shopping", patterns: [/amazon\.com$/, /ebay\.com$/, /etsy\.com$/] },
];

// Given a domain, finds the user's matching category (if any configured).
async function resolveCategory(userId, domain) {
  let category = await Category.findOne({ user: userId, domains: domain });
  if (!category) {
    const fallback = FALLBACK_CATEGORIES.find(({ patterns }) => patterns.some((pattern) => pattern.test(domain)));
    if (fallback) category = await Category.findOne({ user: userId, name: fallback.name });
  }
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
        ...(category ? { $set: { category } } : {}),
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

  const entries = await Tracking.find(query)
    .select("date domain durationSeconds visitCount category")
    .populate("category", "name isProductive color")
    .sort({ date: 1 })
    .lean();
  res.status(200).json({ success: true, count: entries.length, data: entries });
});
