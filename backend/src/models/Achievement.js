import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  schoolId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "School",
  required: true,
},
  title: String,
  description: String,
  date: Date
});

const Achievement = mongoose.model("Achievement", achievementSchema);
export default Achievement;
