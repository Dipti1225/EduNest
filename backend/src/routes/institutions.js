// this  is the router for institution details

import express from "express";
import { getAllInstitutions, getInstitutionProfile, registerInstitution, updateInstitution, deleteInstitution , getApprovedInstitutions, assignClassToTeacher} from "../controllers/institutionController.js";

const router = express.Router();

//Register a school/college
router.post("/register", registerInstitution);

router.post("/assign-class", assignClassToTeacher);

//List all registered institutions
router.get("/", getAllInstitutions);

router.get("/approved", getApprovedInstitutions);

//Get institution profile
router.get("/:id", getInstitutionProfile);


//Update institution details
router.put("/status/:id", updateInstitution);

//Delete institution
router.delete("/:id", deleteInstitution);

export default router