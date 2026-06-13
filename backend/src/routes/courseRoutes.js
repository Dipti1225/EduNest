import express from "express";
import multer from "multer";
import { uploadCourseMaterial, getCourseMaterials } from "../controllers/courseController.js";
import { authenticate, isTeacher, isStudent } from "../middleware/auth.js";

const router = express.Router();

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/courses"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Teacher uploads course material
router.post(
  "/upload",
  authenticate,
  isTeacher,
  upload.single("file"),
  uploadCourseMaterial
);

// Student/Teacher gets course materials
router.get("/materials", authenticate, getCourseMaterials);

export default router;
