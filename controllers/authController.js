import User from "../models/loginModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sendEmail from "../config/sendEmail.js";
import Otp from "../models/otpModel.js";
import axios from "axios";
import crypto from "crypto";
import nodemailer from "nodemailer";

dotenv.config();

// Helper for consistent errors
const sendError = (res, status, message) =>
  res.status(status).json({ success: false, message });


// Allowed user types
const ALLOWED_TYPES = ["superAdmin", "admin", "faculty", "student"];


// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { id, password, type } = req.body;

    if (!id || !password || !type)
      return sendError(res, 400, "ID, password and type are required");

    
    if (!ALLOWED_TYPES.includes(type))
      return sendError(res, 400, "Invalid type");

    
    if (type === "superAdmin") {
      const existingSuper = await User.findOne({ type: "superAdmin" });
      if (existingSuper)
        return sendError(res, 403, "SuperAdmin already exists");
    }

    // Strong password validation
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!strongPasswordRegex.test(password))
      return sendError(res, 400, "Password must be strong");

    // Check duplicate ID
    const existingUser = await User.findOne({ id });
    if (existingUser)
      return sendError(res, 409, "User already exists");

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      id,
      password: hashedPassword,
      type,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: `${type} registered successfully`,
      data: { id, type },
    });

  } catch (error) {
    console.error(error);
    sendError(res, 500, "Server error");
  }
};


// LOGIN controller
export const loginUser = async (req, res) => {
  try {
    const { id, password, recaptchaToken } = req.body;

    if (!id || !password)
      return sendError(res, 400, "ID and password are required");

    const user = await User.findOne({ id });
    if (!user) return sendError(res, 401, "Invalid email");

    // Blocking logic
    if (user.isBlocked)
      return sendError(res, 403, "Account permanently blocked");

    if (user.blockExpiresAt && user.blockExpiresAt > Date.now()) {
      const minutesLeft = Math.ceil((user.blockExpiresAt - Date.now()) / 60000);
      return sendError(res, 403, `Account temporarily blocked. Try after ${minutesLeft} minutes`);
    }

    // Match password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      user.failedAttempts += 1;

      if (user.failedAttempts >= 5) {
        user.blockExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
      }

      await user.save();
      return sendError(res, 401, "Invalid password");
    }

    // Reset failed attempts on success
    user.failedAttempts = 0;
    user.blockExpiresAt = null;
    user.lastLoginAt = new Date();
    user.lastLoginIP = req.ip;
    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, type: user.type },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Login successful",
      user: { id: user.id, type: user.type },
    });

  } catch (error) {
    console.error(error);
    sendError(res, 500, "Server error");
  }
};


// LOGOUT
export const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully" });
};


export const handleForgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const student = await User.findOne({ email });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    const newOtp = new Otp({
      email,
      otp,
    });
    await newOtp.save();

    const message = `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`;

    await sendEmail(email, "Password Reset OTP", message);

    return res.status(200).json({ success: true, message: "OTP sent to email" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const handleVerifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const otpRecord = await Otp.findOne({ email : email, otp : otp});

    if(!otpRecord || Date.now() > otpRecord.createdAt.getTime() + 60*60*1000) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    res.status(200).json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message:"Internal server error"});
  }
}

export const handleResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const otpRecord = await Otp.findOne({ email, otp });

    if (
      !otpRecord ||
      Date.now() > otpRecord.createdAt.getTime() + 60 * 60 * 1000
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // SAME strong password validation as register
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!strongPasswordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "Password must be strong",
      });
    }

    // SAME hashing logic as register
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    user.password = hashedPassword;
    await user.save();

    // Remove used OTPs
    await Otp.deleteMany({ email });

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



