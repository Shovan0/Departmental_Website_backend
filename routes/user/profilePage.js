import express from "express";
import { getStudentProfile } from "../../controllers/profileController.js";
import { verifyToken } from "../../middlewares/auth.js";

const router = express.Router();

// Only student, admin, and superAdmin can access

router.get(
  "/profile",
  verifyToken(["student", "admin", "superAdmin"]),
  getStudentProfile
);

export default router;
