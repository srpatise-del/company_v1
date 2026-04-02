import Notification from "../models/Notification.js";

export async function getNotifications(req, res) {
  const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ notifications });
}

export async function markAsRead(req, res) {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { isRead: true },
    { new: true }
  );

  if (!notification) return res.status(404).json({ message: "ไม่พบการแจ้งเตือน" });
  res.json({ notification });
}
