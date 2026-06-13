// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "student", "teacher", "institute"], required: true },
  contactNumber: { type: String },

  // For students only
  classNumber: { type: String },

  // Real world educational tags
  medium: { type: String, enum: ["english", "gujarati"] },
  section: { type: String, enum: ["Primary", "Middle", "Secondary", "Higher Secondary"] },
  stream: { type: String, enum: ["Science", "Commerce", "Arts"] },
  board: { type: String, enum: ["SSC", "HSC"] },
  branch: { type: String, enum: ["IT", "COM", "EC", "CE"] },

  // Premium session fields
  isPremium: { type: Boolean, default: false },
  feesPaid: { type: Number, default: 0 },

  // For teachers only
  subjects: [{ type: String }],
  standards: [{ type: String }],

  // Common for students, teachers & institutes
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "Institution" },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
