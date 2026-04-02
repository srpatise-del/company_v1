import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "ไม่ได้รับอนุญาตให้เข้าถึง" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(401).json({ message: "ไม่พบบัญชีผู้ใช้งาน" });
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

export function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "เฉพาะผู้ดูแลระบบเท่านั้น" });
  }
  next();
}
