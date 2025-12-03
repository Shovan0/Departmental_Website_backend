import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import departmentPage from "./routes/departmentPage.js";
import LoginLogout from "./routes/LoginLogout.js";
import profilePage from "./routes/profilePage.js";
import studentPage from "./routes/adminRoutes/studentPage.js";
import cookieParser from "cookie-parser";
import faculty from "./routes/adminRoutes/adminFaculty.js";
import alumni from "./routes/alumni.js";
import getUser from "./routes/getUser.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

connectDB(); 


app.get("/", (req, res) => {
  res.send("Backend server is running... ");
});
app.use("/api/auth", getUser);
app.use("/api/admin", studentPage);
app.use("/api", LoginLogout);
app.use("/api", departmentPage);
app.use("/api", profilePage); 
app.use("/api", faculty);
app.use("/api", alumni);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
