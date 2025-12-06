import express from "express";
import { sendMessage } from "../../controllers/public/contactController.js";
import { verifyCaptcha } from "../../middlewares/verifyCaptcha.js";

const router = express.Router();

router.post("/contact", verifyCaptcha, sendMessage);

export default router;
