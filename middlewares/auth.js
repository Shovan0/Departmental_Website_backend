import jwt from "jsonwebtoken";
import { rolePermissions } from "../config/rolePermission.js";

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

      const userRole = decoded.type;  // "student" | "admin" | "superAdmin"

      // superAdmin always allowed
      if (userRole === "superAdmin") {
        return next();
      }

      // check if user's role is allowed
      const isAllowed = allowedRoles.includes(userRole);

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

