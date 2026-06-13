import Homework from "../models/Homework.js";

// Teacher creates homework
export const createHomework = async (req, res) => {
  try {
    const { title, description, subject, dueDate, classNumber } = req.body;
    const homework = new Homework({
      title,
      description,
      subject,
      dueDate,
      classNumber,
      schoolId: req.user.schoolId,
      createdBy: req.user.id,
    });
    await homework.save();
    res.status(201).json({ success: true, message: "Homework created", data: homework });
  } catch (err) {
    res.status(500).json({ success: false, message: "Creation failed", error: err.message });
  }
};

// Get homework for a class (student view)
export const getHomeworkByClass = async (req, res) => {
  try {
    const { classNumber } = req.params;
    const homework = await Homework.find({
      classNumber,
      schoolId: req.user.schoolId,
    })
      .populate("createdBy", "name")
      .sort({ dueDate: 1 });

    // Auto-mark overdue
    const now = new Date();
    const updated = homework.map((hw) => {
      const obj = hw.toObject();
      if (obj.status === "active" && new Date(obj.dueDate) < now) {
        obj.status = "overdue";
      }
      return obj;
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Fetch failed", error: err.message });
  }
};

// Get homework created by the teacher
export const getTeacherHomework = async (req, res) => {
  try {
    const homework = await Homework.find({
      createdBy: req.user.id,
      schoolId: req.user.schoolId,
    }).sort({ createdAt: -1 });
    res.json({ success: true, data: homework });
  } catch (err) {
    res.status(500).json({ success: false, message: "Fetch failed", error: err.message });
  }
};

// Delete homework
export const deleteHomework = async (req, res) => {
  try {
    const homework = await Homework.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });
    if (!homework) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Homework deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Delete failed", error: err.message });
  }
};

// Mark homework as completed
export const markCompleted = async (req, res) => {
  try {
    const homework = await Homework.findByIdAndUpdate(
      req.params.id,
      { status: "completed" },
      { new: true }
    );
    if (!homework) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: homework });
  } catch (err) {
    res.status(500).json({ success: false, message: "Update failed", error: err.message });
  }
};
