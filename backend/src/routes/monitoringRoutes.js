import express from "express";
import {
  createMonitoringSession,
  startVideoSession,
  endVideoSession,
  markAttendance,
  getMonitoringSession,
  getClassSessions,
} from "../controllers/classMonitoringController.js";
import { authenticate, isTeacher } from "../middleware/auth.js";

const router = express.Router();

/**
 * @route   POST /api/eduNest/monitoring/session
 * @desc    Create a new class monitoring session
 * @access  Private (Teacher)
 */
router.post("/session", authenticate, isTeacher, createMonitoringSession);

/**
 * @route   GET /api/eduNest/monitoring/sessions
 * @desc    Get all monitoring sessions for a teacher
 * @access  Private (Teacher)
 */
router.get("/sessions", authenticate, isTeacher, getClassSessions);

/**
 * @route   GET /api/eduNest/monitoring/session/:sessionId
 * @desc    Get a specific monitoring session
 * @access  Private (Teacher)
 */
router.get("/session/:sessionId", authenticate, isTeacher, getMonitoringSession);

/**
 * @route   PUT /api/eduNest/monitoring/session/:sessionId/start
 * @desc    Start video session
 * @access  Private (Teacher)
 */
router.put("/session/:sessionId/start", authenticate, isTeacher, startVideoSession);

/**
 * @route   PUT /api/eduNest/monitoring/session/:sessionId/end
 * @desc    End video session
 * @access  Private (Teacher)
 */
router.put("/session/:sessionId/end", authenticate, isTeacher, endVideoSession);

/**
 * @route   PUT /api/eduNest/monitoring/attendance
 * @desc    Mark student attendance in session
 * @access  Private (Teacher)
 */
router.put("/attendance", authenticate, isTeacher, markAttendance);

export default router;
