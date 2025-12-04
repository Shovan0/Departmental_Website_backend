import Student from "../models/studentModel.js";

// @desc    Get all students
// @route   GET /api/students
// @access  Public or Admin
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get a single student by ID
// @route   GET /api/students/:id
// @access  Public or Admin
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findOne({
      "academic.registration": req.params.id
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("Error fetching student:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


// @desc    Create a new student
// @route   POST /api/students
// @access  Admin
export const createStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    const savedStudent = await student.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    console.error("Error creating student:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a student by ID
// @route   PUT /api/students/:id
// @access  Admin
export const updateStudent = async (req, res) => {
  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { "academic.registration": req.params.id }, // Match registration number
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error("Error updating student:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


// @desc    Delete a student by ID
// @route   DELETE /api/students/:id
// @access  Admin
export const deleteStudent = async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete({"academic.registration": req.params.id});
    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
