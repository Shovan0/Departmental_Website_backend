import express from "express";
import { getAllAlumni, getAlumniById } from "../../controllers/alumniController.js";

const router = express.Router();

// GET all alumni (public)
router.get("/", getAllAlumni);

// GET single alumni (public)
router.get("/:id", getAlumniById);

export default router;
