import mongoose from "mongoose";

// One document per (user, domain, day) — durationSeconds accumulates as
// the extension syncs. Keeping the grain at "per day" keeps analytics
// queries cheap (no need to aggregate thousands of tiny visit events).
const trackingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    domain: { type: String, required: true, trim: true, lowercase: true },
    title: { type: String, default: "" }, // last known page title, for display
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    date: { type: String, required: true, index: true }, // "YYYY-MM-DD" — simplifies daily/weekly/monthly grouping
    durationSeconds: { type: Number, default: 0, min: 0 },
    visitCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

trackingSchema.index({ user: 1, domain: 1, date: 1 }, { unique: true });

export default mongoose.model("Tracking", trackingSchema);
