import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../../controllers/eventController.js";

import { verifyToken } from "../../middlewares/auth.js";

const router = express.Router();

// BASE URL = /api/admin/event

// Create event
router.post("/", verifyToken(["admin", "superAdmin"]), createEvent);

// Get all events
router.get("/", verifyToken(["admin", "superAdmin"]), getAllEvents);

// Get single event
router.get("/:id", verifyToken(["admin", "superAdmin"]), getEventById);

// Update event
router.put("/:id", verifyToken(["admin", "superAdmin"]), updateEvent);

// Delete event
router.delete("/:id", verifyToken(["admin", "superAdmin"]), deleteEvent);

export default router;
