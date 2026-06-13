// routes/events.js
import express from "express";
import {
  createEvent,
  getEventsBySchool,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import { authenticate, isTeacher, isInstitute } from "../middleware/auth.js";

const router = express.Router();

/**
 * @route   POST /api/eduNest/events
 * @desc    Create a new event (academic calendar)
 * @access  Private (Institute & Teacher only)
 */
router.post("/", authenticate, (req, res, next) => {
  if (req.user.role === "institute" || req.user.role === "teacher") {
    return next();
  }
  return res.status(403).json({ error: "Access denied. Only institute or teacher can create events." });
}, createEvent);

/**
 * @route   GET /api/eduNest/events
 * @desc    Get all events for a school
 * @access  Private (Students, Teachers, Institute)
 */
router.get("/", authenticate, getEventsBySchool);

/**
 * @route   PUT /api/eduNest/events/:id
 * @desc    Update an event
 * @access  Private (Institute & Teacher only)
 */
router.put("/:id", authenticate, (req, res, next) => {
  if (req.user.role === "institute" || req.user.role === "teacher") {
    return next();
  }
  return res.status(403).json({ error: "Access denied. Only institute or teacher can update events." });
}, updateEvent);

/**
 * @route   DELETE /api/eduNest/events/:id
 * @desc    Delete an event
 * @access  Private (Institute & Teacher only)
 */
router.delete("/:id", authenticate, (req, res, next) => {
  if (req.user.role === "institute" || req.user.role === "teacher") {
    return next();
  }
  return res.status(403).json({ error: "Access denied. Only institute or teacher can delete events." });
}, deleteEvent);

export default router;
