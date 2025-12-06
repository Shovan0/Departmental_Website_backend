import express from "express";
import {
  getAllEvents,
  getEventById,
} from "../../controllers/eventController.js";

const router = express.Router();

// BASE URL = /api/event

// Get all events (public)
router.get("/", getAllEvents);

// Get single event (public)
router.get("/:id", getEventById);

export default router;
