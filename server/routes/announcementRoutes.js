import express from "express";
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
  updateAnnouncement
} from "../controllers/announcementController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getAnnouncements).post(protect, adminOnly, createAnnouncement);
router.route("/:id").put(protect, adminOnly, updateAnnouncement).delete(protect, adminOnly, deleteAnnouncement);

export default router;
