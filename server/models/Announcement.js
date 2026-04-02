import mongoose from "mongoose";

export const ANNOUNCEMENT_CATEGORIES = ["ประกาศอย่างเป็นทางการ", "ประกาศอย่างไม่เป็นทางการ"];

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true, enum: ANNOUNCEMENT_CATEGORIES },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  isPinned: { type: Boolean, default: false },
  attachments: [{ type: String }]
});

export default mongoose.model("Announcement", announcementSchema);
