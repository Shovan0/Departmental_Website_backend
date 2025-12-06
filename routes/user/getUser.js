import express from "express";
import { verifyToken } from "../../middlewares/auth.js";

const router = express.Router();

router.get("/me", verifyToken(["student", "faculty", "admin", "superAdmin"]), (req, res) => {
  return res.json({
    success: true,
    user: {
      id: req.user.id,
      type: req.user.type,
    },
  });
});

export default router;
