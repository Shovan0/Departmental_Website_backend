import express from "express";
import {
  createStudentUser,
} from "../../controllers/userControllers.js";
import { verifyToken } from "../../middlewares/auth.js";

const router = express.Router();

/**
 * @route   POST /api/admin/user
 * @desc    Create a user (student / faculty / admin)
 * @access  Admin only
 */
router.post(
  "/create-user",
  verifyToken(["admin", "superAdmin"]),
  createStudentUser
);

export default router;
