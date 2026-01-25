import mongoose from "mongoose";
import Student from "./models/studentModel.js";

const names = [
  "Amit Roy", "Sneha Paul", "Rahul Das", "Ananya Sen", "Rohit Ghosh",
  "Pooja Mitra", "Sourav Banerjee", "Neha Chatterjee", "Arjun Mondal", "Riya Das",
  "Kunal Dutta", "Ishita Roy", "Abhishek Pal", "Moumita Sarkar", "Sayan Paul",
  "Priya Nandi", "Debjit Das", "Tania Bose", "Nilay Chakraborty", "Sohini Ghosh"
];

const generateStudents = async () => {
  // Find the highest existing roll number
  const lastStudent = await Student.findOne({})
    .sort({ "academic.roll": -1 })
    .select("academic.roll");

  let startIndex = 1;

  if (lastStudent) {
    startIndex = parseInt(lastStudent.academic.roll.slice(-3)) + 1;
  }

  return names.map((name, index) => {
    const rollNumber = startIndex + index;

    return {
      photo: `https://example.com/photo${rollNumber}.jpg`,
      basic: {
        name,
        gender: index % 2 === 0 ? "Male" : "Female",
        dob: "2002-03-15",
        bloodGroup: ["A+", "B+", "O+", "AB+"][index % 4]
      },
      academic: {
        roll: `1000${String(rollNumber).padStart(3, "0")}`,
        registration: `10001${String(rollNumber).padStart(2, "0")}`,
        stream: "B.Tech in Information Technology",
        department: "Information Technology",
        admissionYear: "2023",
        currentYear: "1st",
        currentSemester: 1,
        section: "A"
      },
      contact: {
        email: `${name.toLowerCase().replace(" ", "")}${rollNumber}@gmail.com`,
        phone: `9${Math.floor(100000000 + Math.random() * 900000000)}`,
        alternatePhone: ""
      },
      address: {
        present: {
          line1: "College Road",
          city: "Kolkata",
          district: "Kolkata",
          state: "West Bengal",
          pin: `7000${rollNumber}`
        },
        permanent: {
          line1: "Home Street",
          city: "Kolkata",
          district: "Kolkata",
          state: "West Bengal",
          pin: `7001${rollNumber}`
        }
      },
      guardian: {
        father: {
          name: `Mr. ${name.split(" ")[1]} Sr.`,
          phone: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
          occupation: "Service"
        },
        mother: {
          name: `Mrs. ${name.split(" ")[1]}`,
          phone: `97${Math.floor(10000000 + Math.random() * 90000000)}`,
          occupation: "Homemaker"
        }
      },
      previousMarks: [
        { semester: 1, sgpa: 7.5 + Math.random(), result: "Passed" },
        { semester: 2, sgpa: 7.7 + Math.random(), result: "Passed" },
        { semester: 3, sgpa: 8.0 + Math.random(), result: "Passed" },
        { semester: 4, sgpa: 8.2 + Math.random(), result: "Passed" }
      ],
      certificates: []
    };
  });
};

const seedStudents = async () => {
  try {
    await mongoose.connect("mongodb+srv://shovannath4039_db_user:departmentalwebsite2025@cluster0.xhejk24.mongodb.net/Departmental_Website?appName=Cluster0");

    const students = await generateStudents();
    await Student.insertMany(students);

    console.log("✅ 20 new students added without deleting existing data");
    process.exit();
  } catch (error) {
    console.error("❌ Error adding students:", error);
    process.exit(1);
  }
};

seedStudents();
