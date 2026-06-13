import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import api from "../../utils/api";
import { Trash2, PenLine, Plus } from "lucide-react";

const STANDARDS = ["1","2","3","4","5","6","7","8","9","10","11","12"];

const TeacherHomework = () => {
  const { user } = useUser();
  const [myHomework, setMyHomework] = useState([]);
  const [message, setMessage] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [classNumber, setClassNumber] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchHomework();
  }, []);

  const fetchHomework = () => {
    api.get("/homework/teacher")
      .then((res) => setMyHomework(res.data.data || []))
      .catch(() => setMyHomework([]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !subject || !dueDate || !classNumber) {
      setMessage("❌ Please fill all fields");
      return;
    }

    try {
      await api.post("/homework/create", {
        title,
        description,
        subject,
        dueDate,
        classNumber,
      });
      setMessage("✅ Homework created successfully!");
      setTitle("");
      setDescription("");
      setSubject("");
      setDueDate("");
      setClassNumber("");
      setShowForm(false);
      fetchHomework();
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || "Creation failed"));
    }
  };

  const deleteHomework = async (id) => {
    if (!confirm("Delete this homework?")) return;
    try {
      await api.delete(`/homework/${id}`);
      setMyHomework((prev) => prev.filter((h) => h._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 pb-24 lg:pb-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <PenLine className="text-primary" /> Manage Homework
          </h1>
          <p className="text-base-content/60 mt-1">Create and manage homework for your classes</p>
        </div>
        <button
          className="btn btn-primary gap-2"
          onClick={() => setShowForm(!showForm)}
        >
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
              <input className="input input-bordered w-full" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g., Chapter 5 Exercises" />
            </div>
            <div>
              <label className="label"><span className="label-text">Subject *</span></label>
              <input className="input input-bordered w-full" value={subject} onChange={(e) => setSubject(e.target.value)} required placeholder="e.g., Mathematics" />
            </div>
          </div>
          <div>
            <label className="label"><span className="label-text">Description *</span></label>
            <textarea className="textarea textarea-bordered w-full" value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Describe the homework tasks..." rows={3} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="label"><span className="label-text">Due Date *</span></label>
              <input type="date" className="input input-bordered w-full" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
            </div>
            <div>
              <label className="label"><span className="label-text">Class *</span></label>
              <select className="select select-bordered w-full" value={classNumber} onChange={(e) => setClassNumber(e.target.value)} required>
                <option value="">Select Class</option>
                {STANDARDS.map((s) => (
                  <option key={s} value={s}>Class {s}</option>
                ))}
              </select>
            </div>
          </div>
          <button className="btn btn-primary w-full" type="submit">
            Create Homework
          </button>
        </form>
      )}

      {/* Homework List */}
      <h2 className="text-xl font-bold">📋 Created Homework ({myHomework.length})</h2>
      <div className="space-y-3">
        {myHomework.length === 0 && (
          <p className="text-base-content/50">No homework created yet.</p>
        )}
        {myHomework.map((hw) => (
          <div key={hw._id} className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{hw.title}</h3>
                  <p className="text-sm text-base-content/60 mt-1">{hw.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2 text-xs">
                    <span className="badge badge-outline">{hw.subject}</span>
                    <span className="badge badge-ghost">Class {hw.classNumber}</span>
                    <span className="text-base-content/50">
                      Due: {new Date(hw.dueDate).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                </div>
                <button className="btn btn-error btn-sm btn-outline" onClick={() => deleteHomework(hw._id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherHomework;
