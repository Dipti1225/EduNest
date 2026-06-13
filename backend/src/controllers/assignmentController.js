import Assignment from "../models/Assignment.js";

// Teacher creates assignment
export const createAssignment = async (req, res) => {
  try {
    const { title, description, subject, dueDate, classNumber, maxMarks } = req.body;
    const assignment = new Assignment({
      title,
      description,
      subject,
      dueDate,
      classNumber,
      maxMarks: maxMarks || 100,
      schoolId: req.user.schoolId,
      createdBy: req.user.id,
    });
    await assignment.save();
    res.status(201).json({ success: true, message: "Assignment created", data: assignment });
  } catch (err) {
    res.status(500).json({ success: false, message: "Creation failed", error: err.message });
  }
};

// Get assignments for a class (student view)
export const getAssignmentsByClass = async (req, res) => {
  try {
    const { classNumber } = req.params;
    const assignments = await Assignment.find({
      classNumber,
      schoolId: req.user.schoolId,
    })
      .populate("createdBy", "name")
      .sort({ dueDate: 1 });
    res.json({ success: true, data: assignments });
  } catch (err) {
    res.status(500).json({ success: false, message: "Fetch failed", error: err.message });
  }
};

// Get assignments created by teacher
export const getTeacherAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({
      createdBy: req.user.id,
      schoolId: req.user.schoolId,
    })
      .populate("submissions.studentId", "name classNumber")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: assignments });
  } catch (err) {
    res.status(500).json({ success: false, message: "Fetch failed", error: err.message });
  }
};

// Student submits assignment
export const submitAssignment = async (req, res) => {
  try {
    const { content } = req.body;
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ success: false, message: "Assignment not found" });

    // Check if already submitted
    const existing = assignment.submissions.find(
      (s) => s.studentId.toString() === req.user.id.toString()
    );
    if (existing) return res.status(400).json({ success: false, message: "Already submitted" });

    assignment.submissions.push({
      studentId: req.user.id,
      content,
      fileUrl: req.file ? req.file.path : null,
    });
    await assignment.save();
    res.status(201).json({ success: true, message: "Assignment submitted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Submission failed", error: err.message });
  }
};

// Teacher grades a submission
export const gradeAssignment = async (req, res) => {
  try {
    const { grade, feedback } = req.body;
    const assignment = await Assignment.findOne({
      "submissions._id": req.params.submissionId,
    });
    if (!assignment) return res.status(404).json({ success: false, message: "Submission not found" });

    const submission = assignment.submissions.id(req.params.submissionId);
    submission.grade = grade;
    submission.feedback = feedback;
    submission.isGraded = true;
    await assignment.save();
    res.json({ success: true, message: "Graded successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Grading failed", error: err.message });
  }
};

// Get submissions for an assignment (teacher)
export const getSubmissions = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate("submissions.studentId", "name email classNumber");
    if (!assignment) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: assignment.submissions });
  } catch (err) {
    res.status(500).json({ success: false, message: "Fetch failed", error: err.message });
  }
};

// Delete assignment
export const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });
    if (!assignment) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Assignment deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Delete failed", error: err.message });
  }
};
