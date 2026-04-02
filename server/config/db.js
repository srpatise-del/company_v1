import mongoose from "mongoose";

export default async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("กรุณาตั้งค่า MONGO_URI ในไฟล์ .env");
  await mongoose.connect(uri);
  console.log("MongoDB connected");
}
