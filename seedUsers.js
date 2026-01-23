import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/loginModel.js";

const seedUsers = async () => {
  await mongoose.connect("mongodb+srv://shovannath4039_db_user:departmentalwebsite2025@cluster0.xhejk24.mongodb.net/Departmental_Website?appName=Cluster0");

  const users = [
    {
      id: "221000110028",
      email: "zinat@student.com",
      password: await bcrypt.hash("Zinat@123", 12),
      type: "student",
    },
    {
      id: "221000110057",
      email: "shovan@student.com",
      password: await bcrypt.hash("Shovan@2001", 12),
      type: "student",
    },
    {
      id: "s221000110057",
      email: "shovan@admin.com",
      password: await bcrypt.hash("Shovan@2001", 12),
      type: "superAdmin",
    },
  ];

  await User.insertMany(users);
  console.log("Users inserted successfully");
  process.exit();
};

seedUsers();
