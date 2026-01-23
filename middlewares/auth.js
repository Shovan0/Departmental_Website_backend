import jwt from "jsonwebtoken";
import { rolePermissions } from "../config/rolePermission.js";
import Student from "../models/studentModel.js";
import sendEmail from "../config/sendEmail.js";
import Otp from "../models/otpModel.js";

export const verifyToken = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "No token provided",
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      const StudentRole = decoded.type;  // "student" | "admin" | "superAdmin"

      // superAdmin always allowed
      if (StudentRole === "superAdmin") {
        return next();
      }

      // check if Student's role is allowed
      const isAllowed = allowedRoles.includes(StudentRole);

      if (!isAllowed) {
        return res.status(403).json({
          success: false,
          message: "Access denied: insufficient role",
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  };
};
