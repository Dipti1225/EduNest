import mongoose from "mongoose";

const calendarSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Institution",
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  eventType: {
    type: String,
    enum: ["class", "examination", "assignment", "holiday", "event", "meeting"],
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  classNumber: String, // If specific to a class
  subject: String, // If specific to a subject
  color: { type: String, default: "#3B82F6" }, // For UI display
  notifyStudents: { type: Boolean, default: true },
}, { timestamps: true });

calendarSchema.virtual("start").get(function () {
  return this.startDate;
});

calendarSchema.virtual("end").get(function () {
  return this.endDate;
});

calendarSchema.set("toJSON", { virtuals: true });
calendarSchema.set("toObject", { virtuals: true });

export default mongoose.model("Calendar", calendarSchema);
