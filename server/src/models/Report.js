import mongoose from "mongoose";

// Stores metadata about generated exports (not the file itself) so users
// can see a history of past reports. Actual files are generated on demand
// or stored in cloud storage (path/url kept here for reference).
const reportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    format: { type: String, enum: ["pdf", "csv", "excel"], required: true },
    range: { type: String, enum: ["daily", "weekly", "monthly", "custom"], required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    fileUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
