import mongoose from "mongoose";

const assignmentSubmissionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String }, // text answer
  fileUrl: { type: String }, // uploaded file
  submittedAt: { type: Date, default: Date.now },
  grade: { type: String }, // e.g., "A+", "85/100"
  feedback: { type: String },
  isGraded: { type: Boolean, default: false },
});

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  subject: { type: String, required: true },
  dueDate: { type: Date, required: true },
  classNumber: { type: String, required: true },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "Institution", required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  maxMarks: { type: Number, default: 100 },
  submissions: [assignmentSubmissionSchema],
}, { timestamps: true });

export default mongoose.model("Assignment", assignmentSchema);
