import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, "ID is required"],
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    type: {
      type: String,
      enum: ["superAdmin", "admin", "faculty", "student"],
      default: "student",
    },

    failedAttempts: { type: Number, default: 0 },
    isBlocked: { type: Boolean, default: false },
    blockExpiresAt: { type: Date, default: null },
    lastLoginAt: { type: Date, default: null },
    lastLoginIP: { type: String, default: null },

    // Optional legacy fields (you can remove later if unused)
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
