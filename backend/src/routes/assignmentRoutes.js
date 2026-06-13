import express from "express";
import {
  createAssignment,
  getAssignmentsByClass,
  getTeacherAssignments,
  submitAssignment,
  gradeAssignment,
  getSubmissions,
  deleteAssignment,
} from "../controllers/assignmentController.js";
import { authenticate, isTeacher, isStudent } from "../middleware/auth.js";

const router = express.Router();

// Teacher creates assignment
router.post("/create", authenticate, isTeacher, createAssignment);

// Teacher's assignments
router.get("/teacher", authenticate, isTeacher, getTeacherAssignments);

// Student gets assignments for their class
router.get("/class/:classNumber", authenticate, isStudent, getAssignmentsByClass);

// Student submits assignment
router.post("/submit/:id", authenticate, isStudent, submitAssignment);

// Teacher views submissions for an assignment
router.get("/submissions/:id", authenticate, isTeacher, getSubmissions);

// Teacher grades a submission
router.put("/grade/:submissionId", authenticate, isTeacher, gradeAssignment);

// Delete assignment (teacher)
router.delete("/:id", authenticate, isTeacher, deleteAssignment);

export default router;
