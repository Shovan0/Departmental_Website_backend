import mongoose from "mongoose";

const alumniSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    profilePhoto: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    batch: {
      type: String,
      required: true,
    },
    currentPosition: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, collection: "Alumni" }
);

const Alumni = mongoose.model("Alumni", alumniSchema);

export default Alumni;
