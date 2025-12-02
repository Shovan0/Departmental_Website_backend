import mongoose from "mongoose";

// Previous marks schema
const previousMarksSchema = new mongoose.Schema({
  semester: Number,
  sgpa: Number,
  result: String,
});

// Address schema
const addressSchema = new mongoose.Schema({
  line1: String,
  city: String,
  district: String,
  state: String,
  pin: String,
});

// Guardian schema
const guardianSchema = new mongoose.Schema({
  name: String,
  phone: String,
  occupation: String,
});

const studentSchema = new mongoose.Schema(
  {
    photo: {
      type: String,
      default: "https://i.ibb.co/4pDNDk1/avatar.png",
    },

    basic: {
      name: { type: String, required: true },
      gender: { type: String, required: true },
      dob: { type: String, required: true },
      bloodGroup: { type: String, required: true },
    },

    academic: {
      roll: { type: String, required: true, unique: true },
      registration: { type: String, required: true, unique: true },
      stream: { type: String, required: true },
      department: { type: String, required: true },
      admissionYear: { type: String, required: true },
      currentYear: { type: String, required: true },
      currentSemester: { type: Number, required: true },
      section: { type: String, required: true },
    },

    contact: {
      email: { type: String, required: true },
      phone: { type: String, required: true },
      alternatePhone: { type: String },
    },

    address: {
      present: addressSchema,
      permanent: addressSchema,
    },

    guardian: {
      father: guardianSchema,
      mother: guardianSchema,
    },

    previousMarks: [previousMarksSchema],

    certificates: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true, collection: "StudentProfile" }
);

const Student = mongoose.model("StudentProfile", studentSchema);
export default Student;
