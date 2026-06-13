import express from "express";
import {teacherRegister, teacherOfSpecificInstitute} from "../controllers/teachersController.js";   

const router = express.Router();

//Route to register a new teacher
router.post("/", teacherRegister);

// Route to get teachers of a specific institute
router.get("/institutes/:id/teachers", teacherOfSpecificInstitute);

export default router;
