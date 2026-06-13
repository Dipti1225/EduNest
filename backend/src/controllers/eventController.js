// controllers/eventController.js
import Event from "../models/Event.js";

/**
 * @desc    Create a new academic event
 * @route   POST /api/eduNest/events
 * @access  Private (Teacher/Institute)
 */
export const createEvent = async (req, res) => {
  try {
    const { title, description, date } = req.body;

    if (!title || !date) {
      return res.status(400).json({ success: false, message: "Title and date are required" });
    }

    const event = new Event({
      title,
      description,
      date,
      schoolId: req.user.schoolId,
      createdBy: req.user.id
    });

    await event.save();
    res.status(201).json({ success: true, message: "Event created successfully", data: event });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to create event", error: err.message });
  }
};

/**
 * @desc    Get all events for the authenticated user's school
 * @route   GET /api/eduNest/events
 * @access  Private (Student/Teacher/Institute)
 */
export const getEventsBySchool = async (req, res) => {
  try {
    const events = await Event.find({ schoolId: req.user.schoolId }).sort({ date: 1 });

    res.json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch events", error: err.message });
  }
};

/**
 * @desc    Update an academic event
 * @route   PUT /api/eduNest/events/:id
 * @access  Private (Teacher/Institute)
 */
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date } = req.body;

    const event = await Event.findOneAndUpdate(
      { _id: id, schoolId: req.user.schoolId },
      { title, description, date },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found or unauthorized" });
    }

    res.json({ success: true, message: "Event updated successfully", data: event });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update event", error: err.message });
  }
};

/**
 * @desc    Delete an academic event
 * @route   DELETE /api/eduNest/events/:id
 * @access  Private (Teacher/Institute)
 */
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findOneAndDelete({ _id: id, schoolId: req.user.schoolId });

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found or unauthorized" });
    }

    res.json({ success: true, message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete event", error: err.message });
  }
};
