import express from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  forgotPassword,
  resetPassword
} from "../../controllers/authController.js";
import { verifyToken } from "../../middlewares/auth.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

// Rate limiter for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many login attempts. Try again later."
});

// Routes
router.post("/register", registerUser);
router.post("/login", loginLimiter, loginUser);
router.post("/logout", verifyToken(["admin", "faculty", "student", "superAdmin"]), logoutUser);

// Forgot / Reset password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
