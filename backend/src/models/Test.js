import mongoose from 'mongoose';

const testSchema = new mongoose.Schema({
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
  title: { type: String, required: true },
  subject: { type: String },
  standards: [{ type: String, required: true }], // class numbers like ["5","6"]
  questions: [
    {
      type: { type: String, enum: ["MCQ", "Short Answer", "True/False"], default: "MCQ" },
      question: { type: String, required: true },
      options: [String],
      correctAnswer: { type: String, required: true }
    }
  ],
  duration: { type: Number, required: true } // in minutes
}, { timestamps: true });

const Test = mongoose.model('Test', testSchema);
export default Test;