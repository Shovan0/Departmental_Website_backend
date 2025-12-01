import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// GET student profile by registration ID
router.get('/profile/:id', async (req, res) => {
  try {
    // For now, ignore req.params.id and use fixed ID
    // const registrationId = "2023/IT/1299";
    const registrationId = req.params.id;

    const data = await mongoose.connection.db
      .collection('StudentProfile')
      .findOne({ "academic.registration": registrationId });

    if (!data) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error });
  }
});

export default router;
