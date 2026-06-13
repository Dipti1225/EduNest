// routes/syllabusRoutes.js
import express from "express";
import multer from "multer";
import {
  uploadSyllabus,
  getSyllabusByClass,
  getAllSyllabus,
  deleteSyllabus,
} from "../controllers/syllabusController.js";
import { authenticate } from "../middleware/auth.js";
import { isTeacher, isStudent } from "../middleware/auth.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/syllabus'));  // ✅ force into /uploads/syllabus
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  }
});

/**
 * @route   POST /api/eduNest/syllabus/upload
 * @desc    Teacher uploads syllabus PDF
 * @access  Private (Teacher only)
 */
router.post("/upload", authenticate, isTeacher, uploadSyllabus);

/**
 * @route   GET /api/eduNest/syllabus/class/:classNumber
 * @desc    Student fetches syllabus by class number
 * @access  Private (Student only)
 */
router.get("/class/:classNumber", authenticate, isStudent, getSyllabusByClass);

/**
 * @route   GET /api/eduNest/syllabus
 * @desc    Get all syllabus (admin/teacher for management)
 * @access  Private
 */
router.get("/", authenticate, getAllSyllabus);

/**
 * @route   DELETE /api/eduNest/syllabus/:id
 * @desc    Delete a syllabus by ID
 * @access  Private (Teacher only)
 */
router.delete("/:id", authenticate, isTeacher, deleteSyllabus);

export default router;
