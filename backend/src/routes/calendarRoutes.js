import express from "express";
import {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
} from "../controllers/calendarController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

const isManager = (req, res, next) => {
  if (req.user && ["teacher", "institute", "admin"].includes(req.user.role)) {
    return next();
  }
  return res.status(403).json({ error: "Access denied. Only teachers, institutes, or admins can manage calendar events." });
};

/**
 * @route   POST /api/eduNest/calendar
 * @desc    Create a new calendar event
 * @access  Private (Teacher/Institute/Admin)
 */
router.post("/", authenticate, isManager, createEvent);

/**
 * @route   GET /api/eduNest/calendar
 * @desc    Get calendar events (filterable by date, class, eventType)
 * @access  Private
 */
router.get("/", authenticate, getEvents);

/**
 * @route   PUT /api/eduNest/calendar/:id
 * @desc    Update a calendar event
 * @access  Private (Creator or Admin)
 */
router.put("/:id", authenticate, isManager, updateEvent);

/**
 * @route   DELETE /api/eduNest/calendar/:id
 * @desc    Delete a calendar event
 * @access  Private (Creator or Admin)
 */
router.delete("/:id", authenticate, isManager, deleteEvent);

export default router;
