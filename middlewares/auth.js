import jwt from "jsonwebtoken";

export const verifyToken = (requiredType = null) => {
  return (req, res, next) => {
    try {
      const token = req.cookies.token;
      // console.log("Verifying token:", token);

      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded;

      if (requiredType && decoded.type !== requiredType) {
        return res.status(403).json({
          message: `Access denied: Only ${requiredType} allowed`,
        });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};
