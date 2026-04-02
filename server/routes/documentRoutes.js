import express from "express";
import { createDocument, deleteDocument, getDocuments } from "../controllers/documentControllerFixed.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getDocuments).post(protect, upload.single("file"), createDocument);
router.route("/:id").delete(protect, adminOnly, deleteDocument);

export default router;
