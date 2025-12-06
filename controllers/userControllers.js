import User from "../models/loginModel.js";

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
