// Institution model for MongoDB using Mongoose
import mongoose from "mongoose";

const institutionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["school", "college","coachingCenter"], required: true },
  email: { type: String, required: true, unique: true },
  contactPerson: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
  registrationDocs: [String], // Array of URLs or filenames
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  mediums: [{ type: String, enum: ["english", "gujarati"] }],
  sections: [{ type: String, enum: ["Primary", "Middle", "Secondary", "Higher Secondary"] }],
  streams: [{ type: String, enum: ["Science", "Commerce", "Arts"] }],
  boards: [{ type: String, enum: ["SSC", "HSC"] }],
  branches: [{ type: String, enum: ["IT", "COM", "EC", "CE"] }],
  createdAt: { type: Date, default: Date.now }
});

const Institution = mongoose.model("Institution", institutionSchema);

export default Institution;
