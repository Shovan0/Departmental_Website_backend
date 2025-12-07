import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Notice title is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Notice description is required"],
    },

    department: {
      type: String,
      enum: [
        "IT",  // for general notices
      ],
      default: "IT",
    },

    // If you want to allow uploading documents like PDFs/JPG
    attachments: [
      {
        fileName: String,
        fileUrl: String, 
      },
    ],

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

const Notice = mongoose.model("Notice", noticeSchema);

export default Notice;
