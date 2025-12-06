import Alumni from "../models/alumniModel.js";

// Utility for consistent error responses
const sendError = (res, status, message) => {
  return res.status(status).json({ success: false, message });
};

// ===========================
// GET ALL ALUMNI
// GET /api/admin/alumni
// ===========================
export const getAllAlumni = async (req, res) => {
  try {
    const alumniList = await Alumni.find();
    res.status(200).json({
      success: true,
      total: alumniList.length,
      data: alumniList,
    });
  } catch (error) {
    sendError(res, 500, "Server error while fetching alumni");
  }
};

// ===========================
// GET SINGLE ALUMNI BY ID
// GET /api/admin/alumni/:id
// ===========================
export const getAlumniById = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id);
    if (!alumni) return sendError(res, 404, "Alumni not found");

    res.status(200).json({ success: true, data: alumni });
  } catch (error) {
    sendError(res, 500, "Server error while fetching alumni");
  }
};

// ===========================
// CREATE NEW ALUMNI
// POST /api/admin/alumni
// ===========================
export const createAlumni = async (req, res) => {
  try {
    const { name, email, graduationYear, degree, department } = req.body;

    if (!name || !email || !graduationYear || !degree || !department) {
      return sendError(res, 400, "All fields are required");
    }

    const exists = await Alumni.findOne({ email });
    if (exists) return sendError(res, 400, "Alumni with this email already exists");

    const newAlumni = new Alumni({ name, email, graduationYear, degree, department });
    await newAlumni.save();

    res.status(201).json({
      success: true,
      message: "Alumni added successfully",
      data: newAlumni,
    });
  } catch (error) {
    sendError(res, 500, "Server error while creating alumni");
  }
};

// ===========================
// UPDATE ALUMNI BY ID
// PUT /api/admin/alumni/:id
// ===========================
export const updateAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!alumni) return sendError(res, 404, "Alumni not found");

    res.status(200).json({
      success: true,
      message: "Alumni updated successfully",
      data: alumni,
    });
  } catch (error) {
    sendError(res, 500, "Server error while updating alumni");
  }
};

// ===========================
// DELETE ALUMNI BY ID
// DELETE /api/admin/alumni/:id
// ===========================
export const deleteAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.findByIdAndDelete(req.params.id);
    if (!alumni) return sendError(res, 404, "Alumni not found");

    res.status(200).json({ success: true, message: "Alumni removed successfully" });
  } catch (error) {
    sendError(res, 500, "Server error while deleting alumni");
  }
};
