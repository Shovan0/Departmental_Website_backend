import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get("/department", async (req, res) => {
    try {
    const data = await mongoose.connection.db
      .collection("DepartmentPage")
      .find({})
      .toArray();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error });
  }
});   

export default router;