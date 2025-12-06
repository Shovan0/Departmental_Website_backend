import express from "express";
import {
  getAllFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
} from "../../controllers/facultyController.js";
import { verifyToken } from "../../middlewares/auth.js";

const router = express.Router();

// ===========================
// ADMIN FACULTY ROUTES
// Base URL: /api/admin/faculty
// ===========================

router.get("/", verifyToken(["admin", "superAdmin"]), getAllFaculty);
router.get("/:id", verifyToken(["admin", "superAdmin"]), getFacultyById);
router.post("/", verifyToken(["admin", "superAdmin"]), createFaculty);
router.put("/:id", verifyToken(["admin", "superAdmin"]), updateFaculty);
router.delete("/:id", verifyToken(["admin", "superAdmin"]), deleteFaculty);


export default router;
