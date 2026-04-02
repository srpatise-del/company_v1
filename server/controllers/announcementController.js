import Announcement from "../models/Announcement.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

export async function getAnnouncements(req, res) {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.q) {
    filter.$or = [
      { title: { $regex: req.query.q, $options: "i" } },
      { content: { $regex: req.query.q, $options: "i" } },
      { category: { $regex: req.query.q, $options: "i" } }
    ];
  }

  const announcements = await Announcement.find(filter)
    .populate("createdBy", "name email")
    .sort({ isPinned: -1, createdAt: -1 });

  res.json({ announcements });
}

export async function createAnnouncement(req, res) {
  const announcement = await Announcement.create({
    ...req.body,
    createdBy: req.user._id
  });

  const users = await User.find({}, "_id");
  if (users.length) {
    await Notification.insertMany(
      users.map((user) => ({
        userId: user._id,
        message: `มีประกาศใหม่: ${announcement.title}`
      }))
    );
  }

  const populated = await announcement.populate("createdBy", "name email");
  res.status(201).json({ announcement: populated });
}

export async function updateAnnouncement(req, res) {
  const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate("createdBy", "name email");

  if (!announcement) return res.status(404).json({ message: "ไม่พบประกาศ" });
  res.json({ announcement });
}

export async function deleteAnnouncement(req, res) {
  const announcement = await Announcement.findByIdAndDelete(req.params.id);
  if (!announcement) return res.status(404).json({ message: "ไม่พบประกาศ" });
  res.json({ message: "ลบประกาศเรียบร้อยแล้ว" });
}
