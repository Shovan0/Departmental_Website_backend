import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Event description is required"],
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
        "GENERAL", // events open for all
      ],
      default: "GENERAL",
    },

    // Event date & time (important)
    eventDate: {
      type: Date,
      required: [true, "Event date is required"],
    },

    // Event venue
    venue: {
      type: String,
      required: [true, "Event venue is required"],
    },

    // Images or banners for the event
    images: [
      {
        fileName: String,
        fileUrl: String, // stored locally or via Cloudinary
      },
    ],

    // Organizer (admin or faculty)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Active or cancelled event
    status: {
      type: String,
      enum: ["active", "inactive", "cancelled"],
      default: "active",
    },

    // Optional registration system
    registrationRequired: {
      type: Boolean,
      default: false,
    },

    registrationLink: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
