import Faculty from "../models/facultyModel.js";

// Utility to send consistent errors
const sendError = (res, status, message) => {
  return res.status(status).json({ success: false, message });
};

// ===========================
// GET ALL FACULTY
// GET /api/admin/faculty
// ===========================
export const getAllFaculty = async (req, res) => {
  try {
    const facultyList = await Faculty.find();
    res.status(200).json({
      success: true,
      total: facultyList.length,
      data: facultyList,
    });
  } catch (error) {
    sendError(res, 500, "Server error while fetching faculty");
  }
};

// ===========================
// GET SINGLE FACULTY BY ID
// GET /api/admin/faculty/:id
// ===========================
export const getFacultyById = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) return sendError(res, 404, "Faculty not found");

    res.status(200).json({ success: true, data: faculty });
  } catch (error) {
    sendError(res, 500, "Server error while fetching faculty");
  }
};

// ===========================
// CREATE NEW FACULTY
// POST /api/admin/faculty
// ===========================
export const createFaculty = async (req, res) => {
  try {
    const { name, email, position, photo, department } = req.body;

    if (!name || !email || !position || !photo || !department) {
      return sendError(res, 400, "All fields are required");
    }

    const exists = await Faculty.findOne({ email });
    if (exists) return sendError(res, 400, "Faculty with this email already exists");

    const newFaculty = new Faculty({ name, email, position, photo, department });
    await newFaculty.save();

    res.status(201).json({
      success: true,
      message: "Faculty added successfully",
      data: newFaculty,
    });
  } catch (error) {
    sendError(res, 500, "Server error while creating faculty");
  }
};

// ===========================
// UPDATE FACULTY BY ID
// PUT /api/admin/faculty/:id
// ===========================
export const updateFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!faculty) return sendError(res, 404, "Faculty not found");

    res.status(200).json({
      success: true,
      message: "Faculty updated successfully",
      data: faculty,
    });
  } catch (error) {
    sendError(res, 500, "Server error while updating faculty");
  }
};

// ===========================
// DELETE FACULTY BY ID
// DELETE /api/admin/faculty/:id
// ===========================
export const deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndDelete(req.params.id);
    if (!faculty) return sendError(res, 404, "Faculty not found");

    res.status(200).json({ success: true, message: "Faculty removed successfully" });
  } catch (error) {
    sendError(res, 500, "Server error while deleting faculty");
  }
};
