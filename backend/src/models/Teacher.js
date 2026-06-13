import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
  name: String,
  classesAssigned: [
    {
      schoolId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "School",
  required: true,
},
      classId: mongoose.Schema.Types.ObjectId,
      subject: String,
    },
  ],
});

const Teacher = mongoose.model("Teacher", teacherSchema);
export default Teacher;
