import express from "express";
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../../controllers/studentController.js";
import { verifyToken } from "../../middlewares/auth.js";

const router = express.Router();

// ===========================
// ADMIN STUDENT ROUTES
// Base URL: /api/admin/student
// ===========================

// GET all students with optional pagination & search
router.get("/", verifyToken(["faculty","admin", "superAdmin"]), getAllStudents);

// GET single student by registration number
router.get("/:id", verifyToken(["faculty","admin", "superAdmin"]), getStudentById);

// CREATE new student
router.post("/", verifyToken(["admin", "superAdmin"]), createStudent);

// UPDATE student by registration number
router.put("/:id", verifyToken(["admin", "superAdmin"]), updateStudent);

// DELETE student by registration number
router.delete("/:id", verifyToken(["admin", "superAdmin"]), deleteStudent);

export default router;
