import Test from "../models/Test.js";
import TestSubmission from "../models/TestSubmission.js";

// Teacher creates a new test
export const createTest = async (req, res) => {
  try {
    const { title, subject, standards, questions, duration, schoolId } = req.body;

    const test = new Test({
      title,
      subject,
      standards,
      questions,
      duration,
      schoolId: schoolId || req.user.schoolId,
      createdBy: req.user.id
    });
    await test.save();

    res.status(201).json({ success: true, message: "Test created", data: test });
  } catch (err) {
    res.status(500).json({ success: false, message: "Creation failed", error: err.message });
  }
};

// Get all tests (filterable by schoolId and standard)
export const getTests = async (req, res) => {
  try {
    const { schoolId, standard } = req.query;
    const filter = {};
    if (schoolId) filter.schoolId = schoolId;
    else if (req.user.schoolId) filter.schoolId = req.user.schoolId;
    if (standard) filter.standards = { $in: [standard] };

    const tests = await Test.find(filter).populate("createdBy", "name").sort({ createdAt: -1 });
    res.json({ success: true, data: tests });
  } catch (err) {
    res.status(500).json({ success: false, message: "Fetch failed", error: err.message });
  }
};

// Get tests created by the logged-in teacher
export const getTestsForTeacher = async (req, res) => {
  try {
    const { schoolId } = req.query;
    const filter = {
      createdBy: req.user.id,
      schoolId: schoolId || req.user.schoolId
    };

    const tests = await Test.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: tests });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch teacher's tests", error: err.message });
  }
};

// Get tests for a student by class number
export const getTestsForStudent = async (req, res) => {
  try {
    const { classNumber } = req.params;
    const filter = {
      standards: { $in: [classNumber] },
      schoolId: req.user.schoolId
    };

    const tests = await Test.find(filter).populate("createdBy", "name").sort({ createdAt: -1 });
    res.json({ success: true, data: tests });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch tests for students", error: err.message });
  }
};

// Student submits a test
export const submitTest = async (req, res) => {
  try {
    const { testId, answers } = req.body;
    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ success: false, message: "Test not found" });

    // Check if student already submitted
    const existing = await TestSubmission.findOne({ testId, studentId: req.user.id });
    if (existing) return res.status(400).json({ success: false, message: "Already submitted this test" });

    // Auto-grade
    let score = 0;
    test.questions.forEach((q, idx) => {
      if (answers[idx] && answers[idx].trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
        score++;
      }
    });

    const totalQuestions = test.questions.length;
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    const submission = new TestSubmission({
      testId,
      studentId: req.user.id,
      schoolId: req.user.schoolId,
      answers,
      score,
      totalQuestions,
      percentage
    });
    await submission.save();

    res.status(201).json({ success: true, message: "Test submitted", data: { score, totalQuestions, percentage } });
  } catch (err) {
    res.status(500).json({ success: false, message: "Submission failed", error: err.message });
  }
};

// Teacher views submissions for a test
export const getTestSubmissions = async (req, res) => {
  try {
    const { testId } = req.params;
    const submissions = await TestSubmission.find({ testId })
      .populate("studentId", "name email classNumber")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: submissions });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch submissions", error: err.message });
  }
};

// Get student's own submissions
export const getMySubmissions = async (req, res) => {
  try {
    const submissions = await TestSubmission.find({ studentId: req.user.id })
      .populate("testId", "title subject standards duration")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: submissions });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch submissions", error: err.message });
  }
};

// Delete a test
export const deleteTest = async (req, res) => {
  try {
    const test = await Test.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
      schoolId: req.user.schoolId
    });

    if (!test) {
      return res.status(404).json({ success: false, message: "Test not found or not authorized" });
    }

    // Also delete related submissions
    await TestSubmission.deleteMany({ testId: req.params.id });

    res.json({ success: true, message: "Test deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete test", error: err.message });
  }
};

// Get all test records for the school (accessible by both teacher & student)
export const getAllTestRecords = async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    if (!schoolId) return res.status(400).json({ success: false, message: "No school associated" });

    const submissions = await TestSubmission.find({ schoolId })
      .populate("testId", "title subject standards duration")
      .populate("studentId", "name email classNumber")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: submissions });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch test records", error: err.message });
  }
};
