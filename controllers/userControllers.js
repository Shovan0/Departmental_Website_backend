import User from "../models/loginModel.js";
import bcrypt from "bcryptjs";

export const unblockUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ id });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = false;
    user.blockUntil = null;
    user.failedAttempts = 0;

    await user.save();

    res.json({
      success: true,
      message: `User ${id} has been unblocked`
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};


export const createStudentUser = async (studentData) => {
  try {
    const registration = studentData.academic.registration;
    const email = studentData.contact.email;

    // 1. Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ id: registration }, { email }],
    });

    if (existingUser) {
      return {
        success: false,
        message: "User login already exists for this student",
      };
    }

    // 2. Generate default password (registration-based)
    const rawPassword = registration + "@123";

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // 4. Create user
    await User.create({
      id: registration,
      email,
      password: hashedPassword,
      type: "student",
    });

    return {
      success: true,
      message: "Student login created successfully",
      defaultPassword: rawPassword, // return only if needed
    };
  } catch (error) {
    console.error("Create student user error:", error.message);
    return {
      success: false,
      message: "Failed to create student login",
    };
  }
};
