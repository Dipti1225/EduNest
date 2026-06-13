import express from "express";
import { getActivitiesGroupedByStandard, getActivitiesBySchool } from "../controllers/activityController.js";

const router = express.Router();
router.get("/grouped", getActivitiesGroupedByStandard);
router.get("/school/:schoolId", getActivitiesBySchool);

export default router;
