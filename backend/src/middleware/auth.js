// middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "defaultSecret";

/**
 * Middleware: Verify JWT and attach user info
 */
export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1]; // Bearer <token>
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Fetch user from DB
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    req.user = {
      id: user._id,
      role: user.role,
      schoolId: user.schoolId || null,
      classNumber: user.classNumber || null,
      name: user.name,
      isPremium: user.isPremium || false
    };

    next();
  } catch (err) {
    console.error("JWT error:", err);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

/**
 * Role-based middlewares
 */
export const isTeacher = (req, res, next) => {
  if (req.user?.role === "teacher") return next();
  return res.status(403).json({ error: "Access denied: Teacher role required" });
};

export const isStudent = (req, res, next) => {
  if (req.user?.role === "student") return next();
  return res.status(403).json({ error: "Access denied: Student role required" });
};

export const isAdmin = (req, res, next) => {
  if (req.user?.role === "admin") return next();
  return res.status(403).json({ error: "Access denied: Admin role required" });
};

export const isInstitute = (req, res, next) => {
  if (req.user?.role === "institute" || req.user?.role === "admin") return next();
  return res.status(403).json({ error: "Access denied: Institute/Admin role required" });
};
