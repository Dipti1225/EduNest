// routes/users.js
import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUser,
  dashboardController,
  upgradePremium,
} from "../controllers/userController.js";
import { authenticate } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

/**
 * @route   POST /api/eduNest/users/register
 * @desc    Register a new user (student / teacher / admin)
 * @access  Public
 */
router.post("/register", registerUser);

/**
 * @route   POST /api/eduNest/users/login
 * @desc    Login and return JWT token
 * @access  Public
 */
router.post("/login", loginUser);

/**
 * @route   POST /api/eduNest/users/logout
 * @desc    Logout (client should clear token)
 * @access  Public
 */
router.post("/logout", logoutUser);

/**
 * @route   GET /api/eduNest/users
 * @desc    Get all users (filterable by role via ?role=student)
 * @access  Private (Admin only later, but open now for testing)
 */
router.get("/", async (req, res) => {
  try {
    const role = req.query.role;
    const filter = role ? { role } : {};
    const users = await User.find(filter).populate("schoolId", "name");
    res.json(users);
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

/**
 * @route   GET /api/eduNest/users/dashboard
 * @desc    Protected dashboard route
 * @access  Private
 */
router.get("/dashboard", authenticate, dashboardController);

/**
 * @route   GET /api/eduNest/users/:id
 * @desc    Get user profile by ID
 * @access  Private
 */
router.get("/:id", authenticate, getUserProfile);

/**
 * @route   PUT /api/eduNest/users/:id
 * @desc    Update user by ID
 * @access  Private
 */
router.put("/:id", authenticate, updateUser);

/**
 * @route   POST /api/eduNest/users/upgrade-premium
 * @desc    Simulate payment & upgrade user status to Premium
 * @access  Private (Student)
 */
router.post("/upgrade-premium", authenticate, upgradePremium);

export default router;
