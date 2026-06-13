import Calendar from "../models/Calendar.js";

export const createEvent = async (req, res) => {
  try {
    const { title, description, eventType, startDate, endDate, classNumber, subject, color } = req.body;

    // Validate required fields
    if (!title || !eventType || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title, eventType, startDate, endDate"
      });
    }

    // Validate dates
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date"
      });
    }

    const event = new Calendar({
      schoolId: req.user.schoolId,
      createdBy: req.user.id,
      title,
      description,
      eventType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      classNumber,
      subject,
      color: color || "#3B82F6"
    });

    await event.save();

    res.status(201).json({
      success: true,
      message: "Calendar event created successfully",
      data: event
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create event",
      error: err.message
    });
  }
};

export const getEvents = async (req, res) => {
  try {
    const { startDate, endDate, classNumber, eventType } = req.query;

    const filter = { schoolId: req.user.schoolId };

    // Filter by date range if provided
    if (startDate && endDate) {
      filter.startDate = { $gte: new Date(startDate) };
      filter.endDate = { $lte: new Date(endDate) };
    }

    // Filter by class if provided
    if (classNumber) {
      filter.classNumber = classNumber;
    }

    // Filter by event type if provided
    if (eventType) {
      filter.eventType = eventType;
    }

    const events = await Calendar.find(filter)
      .populate("createdBy", "name email")
      .sort({ startDate: 1 });

    res.json({
      success: true,
      data: events
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
      error: err.message
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, eventType, startDate, endDate, classNumber, subject, color } = req.body;

    // Verify ownership
    const event = await Calendar.findById(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    if (event.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this event"
      });
    }

    // Validate dates if provided
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date"
      });
    }

    const updated = await Calendar.findByIdAndUpdate(
      id,
      {
        title: title || event.title,
        description: description || event.description,
        eventType: eventType || event.eventType,
        startDate: startDate ? new Date(startDate) : event.startDate,
        endDate: endDate ? new Date(endDate) : event.endDate,
        classNumber: classNumber || event.classNumber,
        subject: subject || event.subject,
        color: color || event.color
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Event updated successfully",
      data: updated
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update event",
      error: err.message
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Calendar.findById(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    // Only creator or admin can delete
    if (event.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this event"
      });
    }

    await Calendar.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Event deleted successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete event",
      error: err.message
    });
  }
};
