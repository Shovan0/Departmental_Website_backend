import mongoose from "mongoose";

const itDepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Information Technology",
    required: true,
  },
  hod: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "The Information Technology (IT) department focuses on software development, networking, and IT infrastructure.",
  },
  contactEmail: {
    type: String,
    required: true,
  },
  contactPhone: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Since it's only IT, we don't expect multiple departments
const ITDepartment = mongoose.model("ITDepartment", itDepartmentSchema);

export default ITDepartment;
