import AcademicRecord from "../models/AcademicRecord.js";

export const getAcademicRecordsByStudent = async (req, res) => {
  try {
    const records = await AcademicRecord.find({ studentId: req.params.id });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Error fetching academic records." });
  }
};
