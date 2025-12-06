import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false } // No separate _id for each image (optional)
);

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Album title is required"],
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    department: {
      type: String,
      enum: [
        "CSE",
        "ECE",
        "EE",
        "ME",
        "CE",
        "IT",
        "GENERAL", // open for all departments
      ],
      default: "GENERAL",
    },

    coverImage: {
      fileName: String,
      fileUrl: String,
    },

    images: [imageSchema], // Array of images

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Gallery = mongoose.model("Gallery", gallerySchema);

export default Gallery;
