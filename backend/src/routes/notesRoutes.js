// routes/notesRoutes.js
import express from "express";
import multer from "multer"; 
import {
  uploadNote,
  getNotesByClass,
  getAllNotes,
  deleteNote,
} from "../controllers/notesController.js";
import { authenticate, isTeacher, isStudent } from "../middleware/auth.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/notes/"); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/**
 * @route   POST /api/eduNest/notes/upload
 * @desc    Teacher uploads notes (PDF)
 * @access  Private (Teacher only)
 */
router.post("/upload", authenticate, isTeacher, uploadNote);

/**
 * @route   GET /api/eduNest/notes/class/:classNumber
 * @desc    Student fetches notes by class number
 * @access  Private (Student only)
 */
router.get("/class/:classNumber", authenticate, isStudent, getNotesByClass);

/**
 * @route   GET /api/eduNest/notes
 * @desc    Get all notes (for teacher/admin management)
 * @access  Private
 */
router.get("/", authenticate, getAllNotes);

/**
 * @route   DELETE /api/eduNest/notes/:id
 * @desc    Delete a note by ID
 * @access  Private (Teacher only)
 */
router.delete("/:id", authenticate, isTeacher, deleteNote);

export default router;
