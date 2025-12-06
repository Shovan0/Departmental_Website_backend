import express from "express";
import { getDashboardSummary } from "../../controllers/dashboardController.js";
import { verifyToken } from "../../middlewares/auth.js";

const router = express.Router();

// BASE URL = /api/admin/dashboard
router.get("/", verifyToken("admin", "superAdmin"), getDashboardSummary);

export default router;
