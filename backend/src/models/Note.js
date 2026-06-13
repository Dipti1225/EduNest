// This model defines the structure of a Note document in MongoDB.
// models/Note.js
import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Institution",
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: { type: String, required: true },
  subject: { type: String },
  classNumber: { type: String },
  pdfUrl: { type: String, required: true },
}, { timestamps: true });

noteSchema.virtual("fileUrl").get(function () {
  return `uploads/${this.pdfUrl}`;
});

const Note = mongoose.model("Note", noteSchema);
export default Note;


