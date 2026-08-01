import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: {
      type: String,
      enum: ["study", "coding", "reading", "custom"],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    targetMinutes: { type: Number, required: true, min: 1 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    frequency: { type: String, enum: ["daily", "weekly"], default: "daily" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Goal", goalSchema);
