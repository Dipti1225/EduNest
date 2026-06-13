import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import api from "../../utils/api";
import { Trash2, ClipboardList, Plus, Eye, ChevronDown, ChevronUp, Star } from "lucide-react";

const STANDARDS = ["1","2","3","4","5","6","7","8","9","10","11","12"];

const TeacherAssignments = () => {
  const { user } = useUser();
  const [assignments, setAssignments] = useState([]);
  const [message, setMessage] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [classNumber, setClassNumber] = useState("");
  const [maxMarks, setMaxMarks] = useState(100);
  const [showForm, setShowForm] = useState(false);

  // Grading state
  const [gradeInput, setGradeInput] = useState({});
  const [feedbackInput, setFeedbackInput] = useState({});

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = () => {
    api.get("/assignments/teacher")
      .then((res) => setAssignments(res.data.data || []))
      .catch(() => setAssignments([]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !subject || !dueDate || !classNumber) {
      setMessage("❌ Please fill all fields");
      return;
    }
    try {
      await api.post("/assignments/create", {
        title, description, subject, dueDate, classNumber, maxMarks,
      });
      setMessage("✅ Assignment created!");
      setTitle(""); setDescription(""); setSubject(""); setDueDate(""); setClassNumber(""); setMaxMarks(100);
      setShowForm(false);
      fetchAssignments();
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || "Failed"));
    }
  };

  const deleteAssignment = async (id) => {
    if (!confirm("Delete this assignment and all submissions?")) return;
    try {
      await api.delete(`/assignments/${id}`);
      setAssignments((prev) => prev.filter((a) => a._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  const gradeSubmission = async (subId) => {
    try {
      await api.put(`/assignments/grade/${subId}`, {
        grade: gradeInput[subId] || "",
        feedback: feedbackInput[subId] || "",
      });
      fetchAssignments();
      setMessage("✅ Graded successfully!");
    } catch {
      alert("Grading failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 pb-24 lg:pb-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ClipboardList className="text-secondary" /> Manage Assignments
          </h1>
          <p className="text-base-content/60 mt-1">Create, grade, and track student submissions</p>
        </div>
        <button className="btn btn-secondary gap-2" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> {showForm ? "Cancel" : "New"}
        </button>
      </div>

      {message && (
        <div className={`alert ${message.startsWith("✅") ? "alert-success" : "alert-error"}`}>
          {message}
        </div>
      )}

      {/* Create Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card bg-base-200 p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="label"><span className="label-text">Title *</span></label>
              <input className="input input-bordered w-full" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
              <label className="label"><span className="label-text">Subject *</span></label>
              <input className="input input-bordered w-full" value={subject} onChange={(e) => setSubject(e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="label"><span className="label-text">Description *</span></label>
            <textarea className="textarea textarea-bordered w-full" value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="label"><span className="label-text">Due Date *</span></label>
              <input type="date" className="input input-bordered w-full" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
            </div>
            <div>
              <label className="label"><span className="label-text">Class *</span></label>
              <select className="select select-bordered w-full" value={classNumber} onChange={(e) => setClassNumber(e.target.value)} required>
                <option value="">Select</option>
                {STANDARDS.map((s) => <option key={s} value={s}>Class {s}</option>)}
              </select>
            </div>
            <div>
              <label className="label"><span className="label-text">Max Marks</span></label>
              <input type="number" className="input input-bordered w-full" value={maxMarks} onChange={(e) => setMaxMarks(e.target.value)} />
            </div>
          </div>
          <button className="btn btn-secondary w-full" type="submit">Create Assignment</button>
        </form>
      )}

      {/* Assignments List */}
      <h2 className="text-xl font-bold">📋 My Assignments ({assignments.length})</h2>
      <div className="space-y-3">
        {assignments.length === 0 && <p className="text-base-content/50">No assignments created yet.</p>}
        {assignments.map((a) => (
          <div key={a._id} className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{a.title}</h3>
                  <p className="text-sm text-base-content/60">{a.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2 text-xs">
                    <span className="badge badge-outline">{a.subject}</span>
                    <span className="badge badge-ghost">Class {a.classNumber}</span>
                    <span className="text-base-content/50">Max: {a.maxMarks}</span>
                    <span className="badge badge-info badge-sm">{a.submissions?.length || 0} submissions</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-info btn-sm btn-outline"
                    onClick={() => setExpandedId(expandedId === a._id ? null : a._id)}>
                    <Eye size={14} /> {expandedId === a._id ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                  </button>
                  <button className="btn btn-error btn-sm btn-outline" onClick={() => deleteAssignment(a._id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Submissions */}
              {expandedId === a._id && (
                <div className="mt-3 bg-base-200 p-3 rounded-lg">
                  <h4 className="font-medium mb-2">Student Submissions</h4>
                  {(!a.submissions || a.submissions.length === 0) ? (
                    <p className="text-sm text-base-content/50">No submissions yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {a.submissions.map((sub) => (
                        <div key={sub._id} className="bg-base-100 p-3 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{sub.studentId?.name || "Unknown"}</p>
                              <p className="text-xs text-base-content/50">
                                Class {sub.studentId?.classNumber || "—"} · {new Date(sub.submittedAt).toLocaleString()}
                              </p>
                              <p className="text-sm mt-1 p-2 bg-base-200 rounded">{sub.content}</p>
                            </div>
                            {sub.isGraded && (
                              <span className="badge badge-success gap-1"><Star size={12}/> {sub.grade}</span>
                            )}
                          </div>
                          {!sub.isGraded && (
                            <div className="flex items-center gap-2 mt-2">
                              <input
                                className="input input-bordered input-sm w-24"
                                placeholder="Grade"
                                value={gradeInput[sub._id] || ""}
                                onChange={(e) => setGradeInput({...gradeInput, [sub._id]: e.target.value})}
                              />
                              <input
                                className="input input-bordered input-sm flex-1"
                                placeholder="Feedback (optional)"
                                value={feedbackInput[sub._id] || ""}
                                onChange={(e) => setFeedbackInput({...feedbackInput, [sub._id]: e.target.value})}
                              />
                              <button className="btn btn-success btn-sm" onClick={() => gradeSubmission(sub._id)}>
                                Grade
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
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

export default TeacherAssignments;
