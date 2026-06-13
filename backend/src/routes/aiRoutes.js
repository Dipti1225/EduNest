import express from "express";
import { chatWithAI } from "../controllers/aiController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// AI chat endpoint — authenticated users only
router.post("/chat", authenticate, chatWithAI);

export default router;
