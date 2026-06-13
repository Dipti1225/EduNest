// This model defines the structure of a Video document in MongoDB.
 
import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
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
  description: String,
  url: { type: String }, // For YouTube or external links
  file: { type: String }, // For uploaded files (store filename/path)
  standards: [{ type: String }], // e.g., ["10", "12"]
}, { timestamps: true });

const Video = mongoose.model('Video', videoSchema);

export default Video;
