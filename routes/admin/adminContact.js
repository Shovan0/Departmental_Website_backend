import express from "express";
import {
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
} from "../../controllers/contactControll.js";

import { verifyToken } from "../../middlewares/auth.js";

const router = express.Router();

// BASE URL = /api/admin/contact
// Accessible only by Admin & SuperAdmin

router.get("/", verifyToken(["admin", "superAdmin"]), getAllContacts);

router.get("/:id", verifyToken(["admin", "superAdmin"]), getContactById);

router.put("/:id", verifyToken(["admin", "superAdmin"]), updateContactStatus);

router.delete("/:id", verifyToken(["admin", "superAdmin"]), deleteContact);

export default router;
