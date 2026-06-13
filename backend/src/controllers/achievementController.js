import Achievement from "../models/Achievement.js";

export const getAchievementsByStudent = async (req, res) => {
  try {
    const achievements = await Achievement.find({ studentId: req.params.id });
    res.json(achievements);
  } catch (err) {
    res.status(500).json({ message: "Error fetching achievements." });
  }
};
