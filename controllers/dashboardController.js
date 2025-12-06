import Student from "../models/studentModel.js";
import Faculty from "../models/facultyModel.js";
import Alumni from "../models/alumniModel.js";
import Event from "../models/eventModel.js";
import Gallery from "../models/galleryModel.js";
import Notice from "../models/noticeModel.js";
import Contact from "../models/contactModel.js";

// =============================
// GET DASHBOARD SUMMARY
// GET /api/admin/dashboard
// =============================
export const getDashboardSummary = async (req, res) => {
  try {
    // -----------------------------
    // BASIC COUNTS
    // -----------------------------
    const totalStudents = await Student.countDocuments();
    const totalFaculty = await Faculty.countDocuments();
    const totalAlumni = await Alumni.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalNotices = await Notice.countDocuments();
    const totalGalleries = await Gallery.countDocuments();
    const totalContacts = await Contact.countDocuments();

    const newContacts = await Contact.countDocuments({ status: "new" });

    // -----------------------------
    // LATEST RECORDS
    // -----------------------------
    const latestStudents = await Student.find()
  .sort({ createdAt: -1 })
  .limit(5)
  .select("basic.name contact.email academic.department createdAt");


    const latestEvents = await Event.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title date createdAt");

    const latestNotices = await Notice.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title createdAt");

    const latestContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email subject status createdAt");

    // -----------------------------
    // STUDENT YEAR-WISE DATA
    // -----------------------------
    const studentYearData = await Student.aggregate([
      {
        $group: {
          _id: "$year",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }
    ]);

    // -----------------------------
    // NOTICE COUNT LAST 6 MONTHS
    // -----------------------------
    const noticeMonthly = await Notice.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }
    ]);

    // -----------------------------
    // EVENT COUNT LAST 6 MONTHS
    // -----------------------------
    const eventMonthly = await Event.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }
    ]);

    return res.status(200).json({
      success: true,

      summary: {
        totalStudents,
        totalFaculty,
        totalAlumni,
        totalEvents,
        totalNotices,
        totalGalleries,
        totalContacts,
        newContacts,
      },

      latest: {
        latestStudents,
        latestEvents,
        latestNotices,
        latestContacts,
      },

      charts: {
        studentYearData,
        noticeMonthly,
        eventMonthly
      }
    });

  } catch (err) {
    console.error("Dashboard API error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
    });
  }
};
