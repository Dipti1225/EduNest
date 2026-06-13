// controllers/userController.js
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "defaultSecret";

// Register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, contactNumber, classNumber, subjects, standards, schoolId, medium, board, branch, section, stream } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields: name, email, password, role" 
      });
    }

    // Validate role
    if (!["admin", "student", "teacher", "institute"].includes(role)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid role. Must be admin, student, teacher, or institute" 
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      contactNumber: contactNumber || "",
      classNumber: role === "student" ? classNumber : undefined,
      subjects: role === "teacher" ? subjects : [],
      standards: role === "teacher" ? standards : [],
      schoolId: schoolId || undefined,
      medium: medium || undefined,
      board: board || undefined,
      branch: branch || undefined,
      section: section || undefined,
      stream: stream || undefined
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "2d" });

    res.status(201).json({
      success: true,
      message: "Registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        role: newUser.role,
        schoolId: newUser.schoolId,
        medium: newUser.medium,
        board: newUser.board,
        branch: newUser.branch,
        section: newUser.section,
        stream: newUser.stream
      }
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false, message: "Registration failed", error: err.message });
  }
};

// Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: "Incorrect password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "2d" });

    // Return user data without password
    const userData = {
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
      classNumber: user.classNumber,
      contactNumber: user.contactNumber,
      isPremium: user.isPremium || false,
      feesPaid: user.feesPaid || 0,
      medium: user.medium || "",
      board: user.board || "",
      branch: user.branch || "",
      section: user.section || "",
      stream: user.stream || "",
    };

    res.json({ success: true, message: "Login successful", token, user: userData });
  } catch (err) {
    res.status(500).json({ success: false, message: "Login failed", error: err.message });
  }
};

// Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching profile", error: err.message });
  }
};

// Update
export const updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    if (!updated) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User updated", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating user", error: err.message });
  }
};

// Logout
export const logoutUser = (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
};

// Dashboard
export const dashboardController = (req, res) => {
  res.json({ success: true, message: `Welcome ${req.user.role} dashboard` });
};

// Upgrade Premium (Fees Payment simulation)
export const upgradePremium = async (req, res) => {
  try {
    const { feesPaid } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { isPremium: true, feesPaid: feesPaid || 499 },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ 
      success: true, 
      message: "Successfully upgraded to Premium!", 
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        schoolId: user.schoolId,
        classNumber: user.classNumber,
        contactNumber: user.contactNumber,
        isPremium: user.isPremium,
        feesPaid: user.feesPaid,
        medium: user.medium,
        board: user.board,
        branch: user.branch,
        section: user.section,
        stream: user.stream
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
