import express from 'express';
import User from '../models/User.js'; // adjust path as per your folder structure

const router = express.Router();

// Get all registered students
router.get('/students', async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }); // assuming role field defines user type
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

export default router;
