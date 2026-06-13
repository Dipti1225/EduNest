import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "Institution" },
  answers: [{ type: String }],
  score: { type: Number },
  totalQuestions: { type: Number },
  percentage: { type: Number },
}, { timestamps: true });

export default mongoose.model("TestSubmission", submissionSchema);