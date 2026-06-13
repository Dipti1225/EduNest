import mongoose from "mongoose";

const academicRecordSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  schoolId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "School",
  required: true,
},
  subject: String,
  score: Number,
  term: String,
  remarks: String
});

const AcademicRecord = mongoose.model("AcademicRecord", academicRecordSchema);
export default AcademicRecord;
