import mongoose from "mongoose";

const teacherAllocationSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  standard: { type: String, required: true },
  subject: { type: String, required: true },
  classNumber: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model("TeacherAllocation", teacherAllocationSchema);
