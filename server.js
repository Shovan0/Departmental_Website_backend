import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import departmentPage from "./routes/departmentPage.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

connectDB(); 

app.get("/", (req, res) => {
  res.send("Backend server is running...");
});
app.use("/api", departmentPage);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
