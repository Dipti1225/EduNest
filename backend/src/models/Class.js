import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Institution",
    required: true,
  },
  name: String, // e.g., "Class 5"
  subjects: [String], // e.g., ["Math", "English"]
});

export default mongoose.model("Class", classSchema);
