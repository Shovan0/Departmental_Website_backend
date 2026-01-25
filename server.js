import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";

// ===== ROUTES =====
import authRoutes from "./routes/auth/authRoutes.js";
import getUser from "./routes/user/getUser.js";

import adminStudentRoutes from "./routes/admin/adminStudent.js";
import adminFacultyRoutes from "./routes/admin/adminFaculty.js";
import adminNoticeRoutes from "./routes/admin/adminNotice.js";
import adminEventRoutes from "./routes/admin/adminEvent.js";
import adminContactRoutes from "./routes/admin/adminContact.js";
import alumniRoutes from "./routes/admin/adminAlumni.js";
import dashboardRoutes from "./routes/admin/dashboard.js";

import publicFaculty from "./routes/public/publicFaculty.js";
import publicAlumni from "./routes/public/publicAlumni.js";
import publicNoticeRoutes from "./routes/public/publicNotice.js";
import publicEventRoutes from "./routes/public/publicEvent.js";
import publicGalleryRoutes from "./routes/public/publicGallery.js";
import contactRoutes from "./routes/public/contact.js";

import profilePageRoutes from "./routes/user/profilePage.js";

dotenv.config();
connectDB();

const app = express();
app.set("trust proxy", 1);

// Fix for ES modules (__dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// ================= MIDDLEWARE =================
app.use(
  cors({
    origin: "https://departmental-website.onrender.com",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());


// ================= API ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/user", getUser);

app.use("/api/admin/student", adminStudentRoutes);
app.use("/api/admin/faculty", adminFacultyRoutes);
app.use("/api/admin/notice", adminNoticeRoutes);
app.use("/api/admin/event", adminEventRoutes);
app.use("/api/admin/contact", adminContactRoutes);
app.use("/api/admin/alumni", alumniRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);

app.use("/api/notice", publicNoticeRoutes);
app.use("/api/event", publicEventRoutes);
app.use("/api/gallery", publicGalleryRoutes);
app.use("/api/faculty", publicFaculty);
app.use("/api/alumni", publicAlumni);
app.use("/api/profile", profilePageRoutes);
app.use("/api/contact", contactRoutes);


// ================= FRONTEND (REACT) =================

// Serve React build files
app.use(express.static(path.join(__dirname, "dist")));

// SPA fallback — fixes refresh "Page Not Found"
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});


// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});


// ================= SERVER START =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
