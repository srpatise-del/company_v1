export function notFound(req, res) {
  res.status(404).json({ message: "ไม่พบเส้นทางที่ร้องขอ" });
}

export function errorHandler(err, req, res, next) {
  console.error(err);
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message || "เกิดข้อผิดพลาดภายในระบบ",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
}
