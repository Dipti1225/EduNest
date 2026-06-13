import ClassMonitoring from "../models/ClassMonitoring.js";
import User from "../models/User.js";

export const createMonitoringSession = async (req, res) => {
  try {
    const { classNumber, subject, date } = req.body;

    if (!classNumber) {
      return res.status(400).json({
        success: false,
        message: "Class number is required"
      });
    }

    // Get all students in this class
    const students = await User.find({
      schoolId: req.user.schoolId,
      role: "student",
      classNumber: classNumber
    });

    const session = new ClassMonitoring({
      schoolId: req.user.schoolId,
      classNumber,
      subject,
      teacherId: req.user.id,
      date: date ? new Date(date) : new Date(),
      students: students.map(student => ({
        studentId: student._id,
        studentName: student.name,
        present: false,
        participationStatus: "absent"
      }))
    });

    await session.save();

    res.status(201).json({
      success: true,
      message: "Monitoring session created",
      data: session
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create session",
      error: err.message
    });
  }
};

export const startVideoSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await ClassMonitoring.findByIdAndUpdate(
      sessionId,
      { videoSessionStarted: new Date() },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    res.json({
      success: true,
      message: "Video session started",
      data: session
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to start session",
      error: err.message
    });
  }
};

export const endVideoSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await ClassMonitoring.findByIdAndUpdate(
      sessionId,
      { videoSessionEnded: new Date() },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    res.json({
      success: true,
      message: "Video session ended",
      data: session
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to end session",
      error: err.message
    });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { sessionId, studentId, present, participationStatus, notes } = req.body;

    const session = await ClassMonitoring.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    // Find student in session
    const studentIndex = session.students.findIndex(
      s => s.studentId.toString() === studentId
    );

    if (studentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Student not found in session"
      });
    }

    // Update student attendance
    session.students[studentIndex].present = present;
    session.students[studentIndex].participationStatus = participationStatus;
    if (notes) session.students[studentIndex].notes = notes;
    if (present) session.students[studentIndex].videoSessionJoined = true;

    await session.save();

    res.json({
      success: true,
      message: "Attendance marked",
      data: session
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to mark attendance",
      error: err.message
    });
  }
};

export const getMonitoringSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await ClassMonitoring.findById(sessionId)
      .populate("teacherId", "name email")
      .populate("students.studentId", "name email");

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    res.json({
      success: true,
      data: session
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch session",
      error: err.message
    });
  }
};

export const getClassSessions = async (req, res) => {
  try {
    const { classNumber } = req.query;

    const filter = {
      schoolId: req.user.schoolId,
      teacherId: req.user.id
    };

    if (classNumber) filter.classNumber = classNumber;

    const sessions = await ClassMonitoring.find(filter)
      .sort({ date: -1 })
      .populate("students.studentId", "name email");

    res.json({
      success: true,
      data: sessions
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch sessions",
      error: err.message
    });
  }
};
