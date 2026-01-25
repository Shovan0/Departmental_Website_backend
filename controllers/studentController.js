import Student from "../models/studentModel.js";

// Utility to send consistent error
const sendError = (res, status, message) => {
  return res.status(status).json({ success: false, message });
};

// ===========================
// GET ALL STUDENTS (with pagination + search)
// GET /api/admin/student
// ===========================
export const getAllStudents = async (req, res) => {
  try {
    const search = req.query.search || "";

    const query = search
      ? {
          $or: [
            { "basic.name": { $regex: search, $options: "i" } },
            { "academic.registration": { $regex: search, $options: "i" } },
            { "contact.email": { $regex: search, $options: "i" } }
          ]
        }
      : {};

    const students = await Student.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalStudents: students.length,
      students
    });
  } catch (error) {
    console.error("Error fetching students:", error.message);
    sendError(res, 500, "Server error while fetching students");
  }
};


// ===========================
// GET STUDENT BY REGISTRATION
// GET /api/admin/student/:id
// ===========================
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findOne({
      "academic.registration": req.params.id,
    });

    if (!student) {
      return sendError(res, 404, "Student not found");
    }

    res.status(200).json({ success: true, student });
  } catch (error) {
    console.error("Error fetching student:", error.message);
    sendError(res, 500, "Server error while fetching student");
  }
};

// ===========================
// CREATE NEW STUDENT
// POST /api/admin/student
// ===========================
export const createStudent = async (req, res) => {
  try {
    const studentExists = await Student.findOne({
      "academic.registration": req.body.academic?.registration,
    });

    if (studentExists) {
      return sendError(res, 400, "Student with this registration already exists");
    }

    const student = new Student(req.body);
    const saved = await student.save();

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      student: saved,
    });
  } catch (error) {
    console.error("Error creating student:", error.message);
    sendError(res, 500, "Server error while creating student");
  }
};

// ===========================
// UPDATE STUDENT
// PUT /api/admin/student/:id
// ===========================
export const updateStudent = async (req, res) => {
  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { "academic.registration": req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return sendError(res, 404, "Student not found");
    }

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    console.error("Error updating student:", error.message);
    sendError(res, 500, "Server error while updating student");
  }
};

// ===========================
// DELETE STUDENT
// DELETE /api/admin/student/:id
// ===========================
export const deleteStudent = async (req, res) => {
  try {
    const deleted = await Student.findOneAndDelete({
      "academic.registration": req.params.id,
    });

    if (!deleted) {
      return sendError(res, 404, "Student not found");
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting student:", error.message);
    sendError(res, 500, "Server error while deleting student");
  }
};
