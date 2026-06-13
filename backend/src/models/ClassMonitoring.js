import mongoose from "mongoose";

const classMonitoringSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Institution",
    required: true,
  },
  classNumber: {
    type: String,
    required: true,
  },
  subject: String,
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  students: [
    {
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      studentName: String,
      present: { type: Boolean, default: false },
      videoSessionJoined: { type: Boolean, default: false },
      participationStatus: {
        type: String,
        enum: ["active", "inactive", "absent"],
        default: "absent",
      },
      notes: String,
    },
  ],
  videoSessionStarted: { type: Date },
  videoSessionEnded: Date,
  sessionNotes: String,
}, { timestamps: true });

export default mongoose.model("ClassMonitoring", classMonitoringSchema);
