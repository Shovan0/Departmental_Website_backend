import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, "ID is required"],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, "Password is required"]
  },
  type: {
    type: String,
    enum: ["superAdmin","admin", "faculty", "student"],
    default: "student"
  },
  failedAttempts: { type: Number, default: 0 },
  isBlocked: { type: Boolean, default: false },
  blockExpiresAt: { type: Date, default: null },
  lastLoginAt: { type: Date, default: null },
  lastLoginIP: { type: String, default: null },

  // For password reset
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
