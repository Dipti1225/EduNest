// routes/tests.js
import express from "express";
import {
  createTest,
  getTests,
  getTestsForTeacher,
  getTestsForStudent,
  submitTest,
  getTestSubmissions,
  getMySubmissions,
  deleteTest,
  getAllTestRecords,
} from "../controllers/testsController.js";
import { authenticate, isTeacher, isStudent } from "../middleware/auth.js";

const router = express.Router();

// Teacher creates a new test
router.post("/create", authenticate, isTeacher, createTest);

// Get all tests (query: schoolId, standard)
router.get("/", authenticate, getTests);

// Fetch tests created by a teacher
router.get("/teacher", authenticate, isTeacher, getTestsForTeacher);

// Fetch tests for students by class
router.get("/student/:classNumber", authenticate, isStudent, getTestsForStudent);

// Student submits a test
router.post("/submit", authenticate, isStudent, submitTest);

// Get submissions for a test (teacher)
router.get("/submissions/:testId", authenticate, isTeacher, getTestSubmissions);

// Get student's own submissions
router.get("/my-submissions", authenticate, isStudent, getMySubmissions);

// Delete a test
router.delete("/:id", authenticate, isTeacher, deleteTest);

// All test records for the school (both teacher & student)
router.get("/all-records", authenticate, getAllTestRecords);

export default router;
