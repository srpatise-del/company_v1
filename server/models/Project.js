import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    status: { type: String, enum: ["ongoing", "completed"], default: "ongoing" },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    startDate: Date,
    endDate: Date
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
