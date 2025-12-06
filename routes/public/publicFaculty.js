import express from "express";
import { getAllFaculty, getFacultyById } from "../../controllers/facultyController.js";

const router = express.Router();

// GET all faculty (public)
router.get("/", getAllFaculty);

// GET single faculty (public)
router.get("/:id", getFacultyById);

export default router;
