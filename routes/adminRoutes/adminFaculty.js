import express from "express";
import Faculty from "../../models/facultyModel.js";
import {verifyToken} from "../../middlewares/auth.js";

const router = express.Router();

// --------------------------
// GET ALL FACULTY
// --------------------------
router.get("/faculty", verifyToken(), async (req, res) => {
  try {
    const allFaculty = await Faculty.find();
    // console.log(allFaculty)
    res.json({ success: true, data: allFaculty });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// --------------------------
// ADD NEW FACULTY
// --------------------------
router.post("/faculty/admin/add", verifyToken("admin"), async (req, res) => {
  try {
    const { name, email, position, photo, department } = req.body;

    // Validate fields
    if (!name || !email || !position || !photo || !department) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, email, position, photo, department) are required"
      });
    }

    // Check if faculty already exists
    const exists = await Faculty.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Faculty with this email already exists"
      });
    }

    // Create new faculty
    const newFaculty = new Faculty({
      name,
      email,
      position,
      photo,
      department
    });

    await newFaculty.save();

    res.json({
      success: true,
      message: "Faculty added successfully",
      data: newFaculty
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


// --------------------------
// SEARCH FACULTY BY NAME
// --------------------------
router.get("/faculty/search", verifyToken("admin"), async (req, res) => {
  try {
    const { name } = req.query;

    const results = await Faculty.find({
      name: { $regex: name, $options: "i" },
    });

    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// --------------------------
// DELETE FACULTY
// --------------------------
router.delete("/faculty/admin/:id", verifyToken("admin"), async (req, res) => {
  try {
    const facultyId = req.params.id;

    const deleted = await Faculty.findByIdAndDelete(facultyId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Faculty not found" });
    }

    res.json({ success: true, message: "Faculty removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
