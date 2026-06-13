import mongoose from "mongoose";

const homeworkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  subject: { type: String, required: true },
  dueDate: { type: Date, required: true },
  classNumber: { type: String, required: true },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "Institution", required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  attachments: [{ type: String }], // URLs to uploaded files
  status: { type: String, enum: ["active", "completed", "overdue"], default: "active" },
}, { timestamps: true });

export default mongoose.model("Homework", homeworkSchema);
