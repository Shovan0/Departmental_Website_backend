import express from "express";
import Alumni from "../models/alumniModel.js";

const router = express.Router();

router.get("/alumni", async (req, res) => {
  try {
    const alumniList = await Alumni.find();

    res.status(200).json({
      success: true,
      total: alumniList.length,
      data: alumniList
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching alumni",
      error: error.message
    });
  }
});

export default router;
