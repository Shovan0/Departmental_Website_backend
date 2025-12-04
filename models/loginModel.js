import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, "ID is required"],
    unique: true,          // optional but recommended
    trim: true
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  type: {
    type: String,
    enum: ["admin", "faculty", "student"],
    default: "student"
  }
});

export default mongoose.model("User", UserSchema);
