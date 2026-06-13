import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  schoolId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "School",
  required: true,
},
  title: { type: String, required: true },
  description: String,
  standard: { type: String, required: true }, // Example: "Std 5"
  date: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Activity = mongoose.model("Activity", activitySchema);
export default Activity;
