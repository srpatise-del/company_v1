import Announcement from "../models/Announcement.js";
import Document from "../models/Document.js";
import Project from "../models/Project.js";
import Notification from "../models/Notification.js";

export async function getSummary(req, res) {
  const [announcements, documents, projects, ongoingProjects, unreadNotifications, pinnedAnnouncements, latestDocuments, latestProjects] =
    await Promise.all([
      Announcement.countDocuments(),
      Document.countDocuments(),
      Project.countDocuments(),
      Project.countDocuments({ status: "ongoing" }),
      Notification.countDocuments({ userId: req.user._id, isRead: false }),
      Announcement.find({ isPinned: true }).populate("createdBy", "name").sort({ createdAt: -1 }).limit(5),
      Document.find().populate("uploadedBy", "name").sort({ createdAt: -1 }).limit(5),
      Project.find().populate("assignedTo", "name").sort({ createdAt: -1 }).limit(5)
    ]);

  res.json({
    summary: { announcements, documents, projects, ongoingProjects, unreadNotifications },
    pinnedAnnouncements,
    latestDocuments,
    latestProjects
  });
}
