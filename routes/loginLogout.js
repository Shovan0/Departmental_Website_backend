import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/loginModel.js";

dotenv.config();
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { id, password, type } = req.body;

    // Validate fields
    if (!id || !password || !type) {
      return res.status(400).json({ message: "ID, Password and Type are required" });
    }

    if (!["student", "faculty", "admin"].includes(type)) {
      return res.status(400).json({ message: "Type must be 'student' or 'admin' or 'faculty'" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ id });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = new User({
      id,
      password,
      type,
    });

    await newUser.save();

    return res.json({
      message: `${type} registered successfully`,
      user: {
        id: newUser.id,
        type: newUser.type,
      },
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { id, password } = req.body;

    if (!id || !password) {
      return res
        .status(400)
        .json({ message: "ID and Password are required" });
    }

    const studentCollection = mongoose.connection.db.collection("StudentLogin");
    const adminCollection = mongoose.connection.db.collection("AdminLogin");

    const student = await studentCollection.findOne({ id, password });

    const admin = await adminCollection.findOne({ id, password });

    let userType = "";

    if (student) userType = "student";
    else if (admin) userType = "admin";
    else
      return res.status(401).json({ message: "Invalid login credentials" });

    const token = jwt.sign(
      { id, type: userType },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      // secure: true, // true only when using HTTPS
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      message: `${userType} login successful`,
      token,
      user: {
        id,
        type: userType
      }
    });


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "Logged out successfully" });
});

export default router;
