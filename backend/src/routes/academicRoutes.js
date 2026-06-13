import express from "express";
import { getAcademicRecordsByStudent } from "../controllers/academicController.js";
const router = express.Router();

router.get("/:id", getAcademicRecordsByStudent);
export default router;
