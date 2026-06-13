// routes/admin.js
import express from "express";
import { authenticate, isAdmin } from "../middleware/auth.js";
import {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllInstitutionsAdmin,
  updateInstitutionStatus,
  deleteInstitution
} from "../controllers/adminController.js";

const router = express.Router();

// Dashboard stats
router.get("/stats", authenticate, isAdmin, getDashboardStats);

// User management
router.get("/users", authenticate, isAdmin, getAllUsers);
router.delete("/users/:id", authenticate, isAdmin, deleteUser);

// Institution management
router.get("/institutions", authenticate, isAdmin, getAllInstitutionsAdmin);
router.put("/institutions/:id/status", authenticate, isAdmin, updateInstitutionStatus);
router.delete("/institutions/:id", authenticate, isAdmin, deleteInstitution);

export default router;
