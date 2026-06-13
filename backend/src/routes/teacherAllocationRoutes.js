import express from "express";
import {
  assignTeacher,
  getTeacherAllocations,
  getInstituteAllocations,
  deleteAllocation
} from "../controllers/teacherAllocationController.js";
import { authenticate, isInstitute, isTeacher } from "../middleware/auth.js";

const router = express.Router();

// Assign class/subject to a teacher [Only Institute]
router.post("/assign", authenticate, isInstitute, assignTeacher);

// View own allocations [Teacher]
router.get("/my-allocations", authenticate, isTeacher, getTeacherAllocations);

// View all allocations done by institute [Institute]
router.get("/all", authenticate, isInstitute, getInstituteAllocations);

// Revoke/Delete allocation [Institute]
router.delete("/:id", authenticate, isInstitute, deleteAllocation);

export default router;
