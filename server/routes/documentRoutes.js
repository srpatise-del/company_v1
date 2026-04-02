import express from "express";
import { createDocument, getDocuments } from "../controllers/documentControllerFixed.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getDocuments).post(protect, upload.single("file"), createDocument);

export default router;
