// server.js (ESM)
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Routes
import institutionsRoutes from "./routes/institutions.js";
import syllabusRoutes from "./routes/syllabusRoutes.js";
import usersRoutes from "./routes/users.js";
import studentRoutes from "./routes/studentRoutes.js";
import adminRoutes from "./routes/admin.js";
import testRoutes from "./routes/tests.js";
import videoRoutes from "./routes/videos.js";
import eventRoutes from "./routes/events.js";
import noteRoutes from "./routes/notesRoutes.js";
import achievementRoutes from "./routes/achievementRoutes.js";
import academicRoutes from "./routes/academicRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import homeworkRoutes from "./routes/homeworkRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import calendarRoutes from "./routes/calendarRoutes.js";
import monitoringRoutes from "./routes/monitoringRoutes.js";
import teacherAllocationRoutes from "./routes/teacherAllocationRoutes.js";

dotenv.config({ path: './src/.env' });

// Setup __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize express app
const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(morgan("dev"));

// Static files (serve uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/eduNest/institutions", institutionsRoutes);
app.use("/api/eduNest/syllabus", syllabusRoutes);
app.use("/api/eduNest/users", usersRoutes);
app.use("/api/eduNest/admin", adminRoutes);
app.use("/api/eduNest/tests", testRoutes);
app.use("/api/eduNest/videos", videoRoutes);
app.use("/api/eduNest/events", eventRoutes);
app.use("/api/eduNest/notes", noteRoutes);
app.use("/api/eduNest/messages", messageRoutes);
app.use("/api/eduNest/calendar", calendarRoutes);
app.use("/api/eduNest/monitoring", monitoringRoutes);
app.use("/api/eduNest/allocations", teacherAllocationRoutes);
app.use("/api/eduNest", studentRoutes);

// Extra modules
app.use("/api/eduNest/achievements", achievementRoutes);
app.use("/api/eduNest/academics", academicRoutes);
app.use("/api/eduNest/activities", activityRoutes);
app.use("/api/eduNest/homework", homeworkRoutes);
app.use("/api/eduNest/assignments", assignmentRoutes);
app.use("/api/eduNest/ai", aiRoutes);

// Error Handler (keep last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
