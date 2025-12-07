import Student from "../models/studentModel.js";


// Get logged-in student profile
export const getStudentProfile = async (req, res) => {
  try {
    const registrationId = req.user.id; // ID from JWT token

    // Fetch student profile using Mongoose
    const studentProfile = await Student.findOne({ "academic.registration": registrationId });

    if (!studentProfile) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // Return structured response
    res.status(200).json({
      success: true,
      data: studentProfile,
    });

  } catch (error) {
    console.error("Error fetching student profile:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching student profile",
      error: error.message,
    });
  }
};
