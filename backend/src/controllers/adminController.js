import User from "../models/User.js";
import Institution from "../models/Institution.js";
import Test from "../models/Test.js";
import TestSubmission from "../models/TestSubmission.js";

// Get dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalTeachers = await User.countDocuments({ role: "teacher" });
    const totalInstitutions = await Institution.countDocuments();
    const pendingInstitutions = await Institution.countDocuments({ status: "pending" });
    const approvedInstitutions = await Institution.countDocuments({ status: "approved" });
    const totalTests = await Test.countDocuments();
    const totalSubmissions = await TestSubmission.countDocuments();

    res.json({
      success: true,
      data: {
        totalStudents,
        totalTeachers,
        totalInstitutions,
        pendingInstitutions,
        approvedInstitutions,
        totalTests,
        totalSubmissions
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all users with optional role filter
export const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter).select("-password").populate("schoolId", "name").sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all institutions
export const getAllInstitutionsAdmin = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const institutions = await Institution.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: institutions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update institution status (approve/reject)
export const updateInstitutionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }
    const institution = await Institution.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!institution) return res.status(404).json({ success: false, message: "Institution not found" });
    res.json({ success: true, message: `Institution ${status}`, data: institution });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete an institution
export const deleteInstitution = async (req, res) => {
  try {
    const institution = await Institution.findByIdAndDelete(req.params.id);
    if (!institution) return res.status(404).json({ success: false, message: "Institution not found" });
    res.json({ success: true, message: "Institution deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
