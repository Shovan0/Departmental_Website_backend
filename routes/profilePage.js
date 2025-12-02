import express from "express";
import mongoose from "mongoose";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

// Protected route: only logged-in student or admin can access
router.get("/profile", verifyToken(), async (req, res) => {
  try {
    const registrationId = req.user.id;  // ✅ from JWT token

    const data = await mongoose.connection.db
      .collection("StudentProfile")
      .findOne({ "academic.registration": registrationId });

    if (!data) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching data", error });
  }
});

export default router;
