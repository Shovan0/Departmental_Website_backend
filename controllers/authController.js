import User from "../models/loginModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
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

    // if (!recaptchaToken)
    //   return sendError(res, 400, "reCAPTCHA token required");

    // Verify reCAPTCHA

    // const verifyURL = `https://www.google.com/recaptcha/api/siteverify`;
    // const response = await axios.post(
      // verifyURL,
    //   {},
    //   { params: { secret: process.env.RECAPTCHA_SECRET, response: recaptchaToken } }
    // );

    // if (!response.data.success)
    //   return sendError(res, 403, "Failed reCAPTCHA verification");

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
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
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




// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) return sendError(res, 400, "ID is required");

    const user = await User.findOne({ id });
    if (!user) return sendError(res, 404, "User not found");

    const token = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 30 * 60 * 1000;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await transporter.sendMail({
      to: id,
      subject: "Password Reset",
      html: `<p>Click the link to reset your password. Valid for 30 minutes:</p>
             <a href="${resetURL}">${resetURL}</a>`,
    });

    res.json({
      success: true,
      message: "Password reset link sent to your email",
    });

  } catch (error) {
    console.error(error);
    sendError(res, 500, "Server error");
  }
};




// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword)
      return sendError(res, 400, "Token and new password required");

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return sendError(res, 400, "Invalid or expired token");

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!strongPasswordRegex.test(newPassword))
      return sendError(res, 400, "Password must be strong");

    user.password = await bcrypt.hash(newPassword, 12);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.json({
      success: true,
      message: "Password reset successfully",
    });

  } catch (error) {
    console.error(error);
    sendError(res, 500, "Server error");
  }
};
