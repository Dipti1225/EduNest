import express from "express";
import { getAchievementsByStudent } from "../controllers/achievementController.js";
const router = express.Router();

router.get("/:id", getAchievementsByStudent);
export default router;
