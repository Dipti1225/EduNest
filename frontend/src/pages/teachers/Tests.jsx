import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import api from "../../utils/api";
import { Trash2, Eye, ChevronDown, ChevronUp } from "lucide-react";

const STANDARDS = ["1","2","3","4","5","6","7","8","9","10","11","12"];

const TeacherTests = () => {
  const { user } = useUser();

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState(30);
  const [standards, setStandards] = useState([]);
  const [questions, setQuestions] = useState([
    { type: "MCQ", question: "", options: ["", "", "", ""], correctAnswer: "" }
  ]);

  const [selectedSchool, setSelectedSchool] = useState("");
  const [myTests, setMyTests] = useState([]);
  const [message, setMessage] = useState("");
  const [expandedTest, setExpandedTest] = useState(null);
  const [submissions, setSubmissions] = useState({});

  // Set school
  useEffect(() => {
    setSelectedSchool(user?.schoolId || "");
  }, [user]);

  // Fetch teacher's created tests
  useEffect(() => {
    if (selectedSchool) {
      api.get("/tests/teacher", { params: { schoolId: selectedSchool } })
        .then((res) => setMyTests(res.data.data || []))
        .catch(() => setMyTests([]));
    }
  }, [selectedSchool, message]);

  // Handle Question Changes
  const handleQuestionChange = (idx, field, value) => {
    const updated = [...questions];
    if (field === "question") updated[idx].question = value;
    else if (field === "type") {
      updated[idx].type = value;
      if (value === "MCQ") updated[idx].options = ["", "", "", ""];
      else if (value === "True/False") updated[idx].options = [];
      else updated[idx].options = [];
    }
    else if (field === "correctAnswer") updated[idx].correctAnswer = value;
    else updated[idx].options[field] = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { type: "MCQ", question: "", options: ["", "", "", ""], correctAnswer: "" }
    ]);
  };

  const removeQuestion = (idx) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const toggleStandard = (std) => {
    setStandards(prev => prev.includes(std)
      ? prev.filter(s => s !== std)
      : [...prev, std]
    );
  };

  // Submit Test
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSchool) {
      setMessage("❌ No school selected. Please contact admin.");
      return;
    }

    if (!title.trim() || !duration || standards.length === 0) {
      setMessage("❌ Please fill all required fields.");
      return;
    }

    for (let q of questions) {
      if (!q.question.trim() || !q.correctAnswer.trim()) {
        setMessage("❌ Each question must have text and correct answer.");
        return;
      }
      if (q.type === "MCQ" && q.options.some(opt => !opt.trim())) {
        setMessage("❌ All MCQ options must be filled.");
        return;
      }
    }

    const payload = {
      schoolId: selectedSchool,
      standards,
      title,
      subject,
      duration,
      questions
    };

    try {
      await api.post("/tests/create", payload);
      setMessage("✅ Test created successfully!");
      setTitle("");
      setSubject("");
      setDuration(30);
      setStandards([]);
      setQuestions([{ type: "MCQ", question: "", options: ["", "", "", ""], correctAnswer: "" }]);
    } catch (err) {
      setMessage("❌ Failed: " + (err.response?.data?.error || err.response?.data?.message || err.message));
    }
  };

  // View submissions for a test
  const viewSubmissions = async (testId) => {
    if (expandedTest === testId) {
      setExpandedTest(null);
      return;
    }
    try {
      const res = await api.get(`/tests/submissions/${testId}`);
      setSubmissions(prev => ({ ...prev, [testId]: res.data.data || [] }));
      setExpandedTest(testId);
    } catch (err) {
      console.error("Fetch submissions error:", err);
    }
  };

  // Delete test
  const handleDeleteTest = async (testId) => {
    if (!confirm("Delete this test and all submissions?")) return;
    try {
      await api.delete(`/tests/${testId}`);
      setMyTests(myTests.filter(t => t._id !== testId));
    } catch (err) {
      alert("Failed to delete test");
    }
  };

  const isFormInvalid =
    !title.trim() ||
    !duration ||
    standards.length === 0 ||
    questions.some(q => !q.question.trim() || !q.correctAnswer.trim());

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">📝 Create Test</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-base-200 p-4 rounded-xl">

        {/* Title */}
        <div>
          <label className="label"><span className="label-text">Title *</span></label>
          <input className="input input-bordered w-full" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        {/* Subject */}
        <div>
          <label className="label"><span className="label-text">Subject</span></label>
          <input className="input input-bordered w-full" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Mathematics" />
        </div>

        {/* Duration */}
        <div>
          <label className="label"><span className="label-text">Duration (minutes) *</span></label>
          <input type="number" className="input input-bordered w-full" value={duration} min={1} onChange={(e) => setDuration(e.target.value)} required />
        </div>

        {/* Standards */}
        <div>
          <label className="label"><span className="label-text">Standards / Classes *</span></label>
          <div className="flex flex-wrap gap-2">
            {STANDARDS.map((std) => (
              <button
                key={std}
                type="button"
                className={`btn btn-sm ${standards.includes(std) ? "btn-primary" : "btn-outline"}`}
                onClick={() => toggleStandard(std)}
              >
                Class {std}
              </button>
            ))}
          </div>
        </div>

        {/* Questions */}
        <div>
          <label className="label"><span className="label-text">Questions *</span></label>
          {questions.map((q, idx) => (
            <div key={idx} className="mb-4 border border-base-300 p-3 rounded-lg bg-base-100">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-sm">Question {idx + 1}</span>
                {/* Type */}
                <select
                  className="select select-bordered select-sm"
                  value={q.type}
                  onChange={(e) => handleQuestionChange(idx, "type", e.target.value)}
                >
                  <option value="MCQ">MCQ</option>
                  <option value="Short Answer">Short Answer</option>
                  <option value="True/False">True/False</option>
                </select>
              </div>

              {/* Question text */}
              <input
                className="input input-bordered w-full mb-2"
                placeholder={`Question ${idx + 1}`}
                value={q.question}
                onChange={(e) => handleQuestionChange(idx, "question", e.target.value)}
              />

              {/* Options (MCQ only) */}
              {q.type === "MCQ" &&
                q.options.map((opt, oidx) => (
                  <input
                    key={oidx}
                    className="input input-bordered w-full mb-1"
                    placeholder={`Option ${oidx + 1}`}
                    value={opt}
                    onChange={(e) => handleQuestionChange(idx, oidx, e.target.value)}
                  />
                ))}

              {/* Correct Answer */}
              {q.type === "True/False" ? (
                <select
                  className="select select-bordered w-full mb-2"
                  value={q.correctAnswer}
                  onChange={(e) => handleQuestionChange(idx, "correctAnswer", e.target.value)}
                >
                  <option value="">Select correct answer</option>
                  <option value="True">True</option>
                  <option value="False">False</option>
                </select>
              ) : (
                <input
                  className="input input-bordered w-full mb-2"
                  placeholder="Correct Answer"
                  value={q.correctAnswer}
                  onChange={(e) => handleQuestionChange(idx, "correctAnswer", e.target.value)}
                />
              )}

              {questions.length > 1 && (
                <button type="button" className="btn btn-error btn-xs" onClick={() => removeQuestion(idx)}>
                  Remove
                </button>
              )}
            </div>
          ))}

          <button type="button" className="btn btn-secondary btn-sm" onClick={addQuestion}>
            + Add Question
          </button>
        </div>

        <button className="btn btn-primary w-full" type="submit" disabled={isFormInvalid || !selectedSchool}>
          {isFormInvalid || !selectedSchool ? "Fill all fields to enable" : "Create Test"}
        </button>

        {message && (
          <div className={`alert mt-2 ${message.startsWith("✅") ? "alert-success" : "alert-error"}`}>
            {message}
          </div>
        )}
      </form>

      {/* Created Tests */}
      <h2 className="text-xl font-bold mt-8 mb-4">📋 My Created Tests</h2>
      <div className="space-y-3">
        {myTests.length === 0 && <p className="text-base-content/50">No tests created yet.</p>}
        {myTests.map((t) => (
          <div key={t._id} className="card bg-base-100 shadow-sm">
            <div className="card-body p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{t.title}</h3>
                  <p className="text-sm text-base-content/60">
                    {t.subject && `${t.subject} · `}
                    Classes: {t.standards?.join(", ")} · {t.questions?.length} questions · {t.duration} mins
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-info btn-sm btn-outline" onClick={() => viewSubmissions(t._id)}>
                    <Eye size={14} /> {expandedTest === t._id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  <button className="btn btn-error btn-sm btn-outline" onClick={() => handleDeleteTest(t._id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Submissions */}
              {expandedTest === t._id && (
                <div className="mt-3 bg-base-200 p-3 rounded-lg">
                  <h4 className="font-medium mb-2">Student Submissions</h4>
                  {(!submissions[t._id] || submissions[t._id].length === 0) ? (
                    <p className="text-sm text-base-content/50">No submissions yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Student</th>
                            <th>Class</th>
                            <th>Score</th>
                            <th>Percentage</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {submissions[t._id].map((sub) => (
                            <tr key={sub._id}>
                              <td>{sub.studentId?.name || "Unknown"}</td>
                              <td>{sub.studentId?.classNumber || "—"}</td>
                              <td>{sub.score}/{sub.totalQuestions}</td>
                              <td>
                                <span className={`badge ${sub.percentage >= 50 ? "badge-success" : "badge-error"}`}>
                                  {sub.percentage}%
                                </span>
                              </td>
                              <td className="text-sm">{new Date(sub.createdAt).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherTests;
