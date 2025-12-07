import express from "express";
import {
  getAllAlumni,
  getAlumniById,
  createAlumni,
  updateAlumni,
  deleteAlumni,
} from "../../controllers/alumniController.js";
import { verifyToken } from "../../middlewares/auth.js";

const router = express.Router();

// ===========================
// ADMIN ALUMNI ROUTES
// Base URL: /api/admin/alumni
// ===========================

// Only roles with "alumni" permission can access these routes
router.get("/", verifyToken(["admin", "superAdmin"]), getAllAlumni);
router.get("/:id", verifyToken(["admin", "superAdmin"]), getAlumniById);
router.post("/", verifyToken(["admin", "superAdmin"]), createAlumni);
router.put("/:id", verifyToken(["admin", "superAdmin"]), updateAlumni);
router.delete("/:id", verifyToken(["admin", "superAdmin"]), deleteAlumni);

export default router;
