import express from "express";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.get("/me", verifyToken(), (req, res) => {
  return res.json({
    success: true,
    user: {
      id: req.user.id,
      type: req.user.type,
    },
  });
});

export default router;
