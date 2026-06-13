// routes/videos.js
import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import {
  uploadVideo,
  getVideosByClass,
  getAllVideos,
  deleteVideo,
} from "../controllers/videosController.js";
import { authenticate, isTeacher, isStudent } from "../middleware/auth.js";

const router = express.Router();

// Ensure upload directory exists
const uploadDir = "uploads/videos";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/**
 * @route   POST /api/eduNest/videos/upload
 * @desc    Teacher uploads video material
 * @access  Private (Teacher only)
 */
router.post("/upload", authenticate, isTeacher, upload.single("file"), uploadVideo);

/**
 * @route   GET /api/eduNest/videos/class/:classNumber
 * @desc    Student fetches videos by class number
 * @access  Private (Student only)
 */
router.get("/class/:classNumber", authenticate, isStudent, getVideosByClass);

/**
 * @route   GET /api/eduNest/videos
 * @desc    Get all videos (for teacher/admin management)
 * @access  Private
 */
router.get("/", authenticate, getAllVideos);

/**
 * @route   DELETE /api/eduNest/videos/:id
 * @desc    Delete a video by ID
 * @access  Private (Teacher only)
 */
router.delete("/:id", authenticate, isTeacher, deleteVideo);

export default router;
