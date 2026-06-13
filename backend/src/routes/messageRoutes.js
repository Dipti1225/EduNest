// routes/messageRoutes.js
import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
  sendMessage,
  getConversations,
  getMessages,
  getContacts
} from "../controllers/messageController.js";

const router = express.Router();

// Send a message
router.post("/send", authenticate, sendMessage);

// Get conversation list
router.get("/conversations", authenticate, getConversations);

// Get contacts (same school, opposite role)
router.get("/contacts", authenticate, getContacts);

// Get messages with a specific user
router.get("/:userId", authenticate, getMessages);

export default router;
