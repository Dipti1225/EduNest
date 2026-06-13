// src/models/Syllabus.js
import mongoose from "mongoose";

const SyllabusSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    classNumber: { type: Number, required: true },
    pdfUrl: { type: String, required: true },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Syllabus", SyllabusSchema);
