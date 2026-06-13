import Syllabus from "../models/Syllabus.js";

export const uploadSyllabus = async (req, res) => {
  try {
    const { title, subject, classNumber } = req.body;
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const syllabus = new Syllabus({
      title,
      subject,
      classNumber,
      schoolId: req.user.schoolId,
      fileUrl: `/uploads/syllabus/${req.file.filename}`
    });
    await syllabus.save();

    res.status(201).json({ success: true, message: "Syllabus uploaded", data: syllabus });
  } catch (err) {
    res.status(500).json({ success: false, message: "Upload failed", error: err.message });
  }
};

export const getSyllabusByClass = async (req, res) => {
  try {
    const { classNumber } = req.params;

    const syllabus = await Syllabus.find({
      schoolId: req.user.schoolId,
      classNumber
    });

    res.json({ success: true, data: syllabus });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch syllabus for class",
      error: err.message
    });
  }
};

export const getAllSyllabus = async (req, res) => {
  try {
    const syllabus = await Syllabus.find({ schoolId: req.user.schoolId });

    res.json({ success: true, data: syllabus });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch all syllabus",
      error: err.message
    });
  }
};

export const deleteSyllabus = async (req, res) => {
  try {
    const deleted = await Syllabus.findOneAndDelete({
      _id: req.params.id,
      schoolId: req.user.schoolId
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Syllabus not found" });
    }

    res.json({ success: true, message: "Syllabus deleted successfully" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete syllabus",
      error: err.message
    });
  }
};
