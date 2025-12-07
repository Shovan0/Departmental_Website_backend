import express from "express";
import { unblockUser } from "../../controllers/userControllers.js";
import { verifyToken } from "../../middlewares/auth.js";

const router = express.Router();

// Only admin can unblock
router.put("/unblock/:id", verifyToken(["superAdmin", "admin"]), unblockUser);

export default router;
