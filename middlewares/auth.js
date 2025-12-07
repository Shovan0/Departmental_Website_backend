import jwt from "jsonwebtoken";
import { rolePermissions } from "../config/rolePermission.js";

export const verifyToken = (requiredPermissions = []) => {
  return (req, res, next) => {
    try {
      const token = req.cookies.token;
      if (!token)
        return res.status(401).json({ success: false, message: "Token not found" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // RBAC: Check permissions
      if (requiredPermissions.length) {
        const userPermissions = rolePermissions[decoded.type] || [];
        const hasPermission =
          userPermissions.includes("all") ||
          requiredPermissions.some((p) => userPermissions.includes(p));

        if (!hasPermission) {
          return res.status(403).json({
            success: false,
            message: `Access denied: You don't have permission to access this resource`,
          });
        }
      }

      next();
    } catch (err) {
      console.error("Token verification error:", err.message);
      if (err.name === "TokenExpiredError")
        return res.status(401).json({ success: false, message: "Token expired" });
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  };
};
