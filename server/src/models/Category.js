import mongoose from "mongoose";

// Default + user-defined website categories.
const categorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: {
      type: String,
      required: true,
      enum: ["Programming", "Education", "Entertainment", "Social Media", "Shopping", "News", "Work", "Others"],
    },
    domains: [{ type: String, trim: true, lowercase: true }], // e.g. ["github.com", "stackoverflow.com"]
    isProductive: { type: Boolean, default: true }, // used for productivity score calculation
    color: { type: String, default: "#6366f1" }, // used consistently in charts
  },
  { timestamps: true }
);

categorySchema.index({ user: 1, name: 1 }, { unique: true });

export default mongoose.model("Category", categorySchema);
