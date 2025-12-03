import express from "express";
import {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
} from "../../controllers/student.controller.js";
import { verifyToken } from "../../middlewares/auth.js";

const router = express.Router();

router.get("/allstudents", verifyToken("admin"), getAllStudents);
router.get("/student/:id", verifyToken("admin"), getStudentById);
router.post("/createstudents", verifyToken("admin"), createStudent);
router.put("/updatestudents/:id", verifyToken("admin"), updateStudent);
router.delete("/deletestudents/:id", verifyToken("admin"), deleteStudent);

export default router;
