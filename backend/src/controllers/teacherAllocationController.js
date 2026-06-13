import TeacherAllocation from "../models/TeacherAllocation.js";
import User from "../models/User.js";

export const assignTeacher = async (req, res) => {
  try {
    const { teacherId, standard, subject, classNumber } = req.body;

    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({ message: "Invalid teacher ID" });
    }

    const allocation = new TeacherAllocation({
      teacherId,
      schoolId: req.user.schoolId,
      standard,
      subject,
      classNumber,
    });

    await allocation.save();
    res.status(201).json({ message: "Teacher allocated successfully", allocation });
  } catch (err) {
    console.error("Allocation Error:", err);
    res.status(500).json({ message: "Error allocating teacher" });
  }
};

export const getTeacherAllocations = async (req, res) => {
  try {
    const allocations = await TeacherAllocation.find({ teacherId: req.user.id });
    res.status(200).json({ allocations });
  } catch (err) {
    res.status(500).json({ message: "Error fetching allocations" });
  }
};

export const getInstituteAllocations = async (req, res) => {
  try {
    const allocations = await TeacherAllocation.find({ schoolId: req.user.schoolId }).populate("teacherId", "name email");
    res.status(200).json({ allocations });
  } catch (err) {
    res.status(500).json({ message: "Error fetching institute allocations" });
  }
};

export const deleteAllocation = async (req, res) => {
  try {
    const allocation = await TeacherAllocation.findOneAndDelete({
      _id: req.params.id,
      schoolId: req.user.schoolId
    });

    if (!allocation) {
      return res.status(404).json({ message: "Allocation not found or unauthorized" });
    }

    res.status(200).json({ message: "Allocation revoked successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting allocation", error: err.message });
  }
};

