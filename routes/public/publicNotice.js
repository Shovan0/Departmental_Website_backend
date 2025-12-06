import express from "express";
import {
  getLatestNotices,
  filterPublicNotices,
  getPublicNoticeById,
} from "../../controllers/noticeController.js";

const router = express.Router();

// PUBLIC
router.get("/latest", getLatestNotices);      // homepage
router.get("/", filterPublicNotices);         // filter list
router.get("/:id", getPublicNoticeById);      // single notice

export default router;
