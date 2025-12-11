import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

// ====== ROUTES ======
import authRoutes from "./routes/auth/authRoutes.js";
import getUser from "./routes/user/getUser.js";

import adminStudentRoutes from "./routes/admin/adminStudent.js"; //okay
import adminFacultyRoutes from "./routes/admin/adminFaculty.js"; //okay
import adminNoticeRoutes from "./routes/admin/adminNotice.js";  //okay
import adminEventRoutes from "./routes/admin/adminEvent.js";  //okay
import adminContactRoutes from "./routes/admin/adminContact.js";//okay
import alumniRoutes from "./routes/admin/adminAlumni.js"; //okay

import dashboardRoutes from "./routes/admin/dashboard.js";// most important for the admin----

import publicFaculty from "./routes/public/publicFaculty.js";//okay
import publicAlumni from "./routes/public/publicAlumni.js";//okay
import profilePageRoutes from "./routes/user/profilePage.js"; // need to verify token for working it
import publicNoticeRoutes from "./routes/public/publicNotice.js";//okay working
import publicEventRoutes from "./routes/public/publicEvent.js"; //okay working
import publicGalleryRoutes from "./routes/public/publicGallery.js"; //okay working
import contactRoutes from "./routes/public/contact.js";

dotenv.config();

const app = express();

// ===== MIDDLEWARES =====
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// ===== DB CONNECTION =====
connectDB();
app.set("trust proxy", 1);

// ===== DEFAULT ROUTE =====
app.get("/", (req, res) => {
  res.send("Backend server is running...");
});

// ===== AUTH ROUTES =====
app.use("/api/auth", authRoutes);  // login, logout, register
app.use("/api/user", getUser); // get logged-in user

// ===== ADMIN ROUTES =====
app.use("/api/admin/student", adminStudentRoutes);
app.use("/api/admin/faculty", adminFacultyRoutes);
app.use("/api/admin/notice", adminNoticeRoutes);
app.use("/api/admin/event", adminEventRoutes); 
app.use("/api/admin/contact", adminContactRoutes);
app.use("/api/admin/alumni", alumniRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);


// ===== GENERAL ROUTES =====
app.use("/api/notice", publicNoticeRoutes);// under development
app.use("/api/event", publicEventRoutes);// under development
app.use("/api/gallery", publicGalleryRoutes);// under development

app.use("/api/faculty", publicFaculty);// working perfectly
app.use("/api/alumni", publicAlumni);// working perfectly

app.use("/api/profile", profilePageRoutes);//need to verify for working it
app.use("/api/contact", contactRoutes);// this is post route 


// ===== GLOBAL ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ===== SERVER START =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
