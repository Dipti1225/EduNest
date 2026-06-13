import express from "express";
import {
  createHomework,
  getHomeworkByClass,
  getTeacherHomework,
  deleteHomework,
  markCompleted,
} from "../controllers/homeworkController.js";
import { authenticate, isTeacher, isStudent } from "../middleware/auth.js";

const router = express.Router();

// Teacher creates homework
router.post("/create", authenticate, isTeacher, createHomework);

// Teacher's own homework
router.get("/teacher", authenticate, isTeacher, getTeacherHomework);

// Student gets homework for their class
router.get("/class/:classNumber", authenticate, isStudent, getHomeworkByClass);

// Mark homework completed (student)
router.put("/complete/:id", authenticate, isStudent, markCompleted);

// Delete homework (teacher)
router.delete("/:id", authenticate, isTeacher, deleteHomework);

export default router;
