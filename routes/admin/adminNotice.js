import express from "express";
import {
  createNotice,
  getAllNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
} from "../../controllers/noticeController.js";

import { verifyToken } from "../../middlewares/auth.js";

const router = express.Router();

// ADMIN → Notice CRUD
router.post("/", verifyToken("admin", "superAdmin"), createNotice);
router.get("/", verifyToken("admin", "superAdmin"), getAllNotices);
router.get("/:id", verifyToken("admin", "superAdmin"), getNoticeById);
router.put("/:id", verifyToken("admin", "superAdmin"), updateNotice);
router.delete("/:id", verifyToken("admin", "superAdmin"), deleteNotice);

export default router;
