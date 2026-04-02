import mongoose from "mongoose";

export const DOCUMENT_CATEGORIES = [
  "เอกสารข้อมูลกิจการ",
  "เอกสารด้านรายรับ",
  "เอกสารด้านรายจ่าย",
  "เอกสารบัญชีและภาษี",
  "เอกสารฝ่ายบุคคล"
];

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  fileUrl: { type: String, required: true },
  category: { type: String, required: true, trim: true, enum: DOCUMENT_CATEGORIES },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Document", documentSchema);
