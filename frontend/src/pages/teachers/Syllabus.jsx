import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import toast, { Toaster } from "react-hot-toast";

const TeacherSideSyllabus = () => {
  const [syllabusList, setSyllabusList] = useState([]);
  const [form, setForm] = useState({ title: "", subject: "", classNumber: "", pdf: null });

const fetchSyllabus = async () => {
  try {
    const res = await api.get("/syllabus");
    setSyllabusList(res.data.data || []); // pick the array inside response
  } catch {
    toast.error("Failed to fetch syllabus");
  }
};

  useEffect(() => { fetchSyllabus(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    const { title, subject, classNumber, pdf } = form;
    if (!title || !subject || !classNumber || !pdf) return toast.error("⚠️ Fill all fields");

    const fd = new FormData();
    fd.append("title", title);
    fd.append("subject", subject);
    fd.append("classNumber", classNumber);
    fd.append("pdf", pdf);

    try {
      await api.post("/syllabus/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("✅ Uploaded successfully");
      setForm({ title: "", subject: "", classNumber: "", pdf: null });
      fetchSyllabus();
    } catch {
      toast.error("❌ Upload failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this syllabus?")) return;
    try {
      await api.delete(`/syllabus/${id}`);
      toast.success("🗑️ Deleted");
      fetchSyllabus();
    } catch {
      toast.error("❌ Delete failed");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Toaster />
      <h2 className="text-3xl font-bold mb-6 text-primary">📘 Teacher Syllabus Manager</h2>

      {/* Upload Form */}
      <form
        onSubmit={handleUpload}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-base-200 p-6 rounded-2xl shadow-md mb-8"
      >
        <input
          name="title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Syllabus Title"
          className="input input-bordered w-full"
        />
        <input
          name="subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          placeholder="Subject"
          className="input input-bordered w-full"
        />
        <select
          name="classNumber"
          value={form.classNumber}
          onChange={(e) => setForm({ ...form, classNumber: e.target.value })}
          className="select select-bordered w-full"
        >
          <option value="">Select Class</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={`${i + 1}`}>Class {i + 1}</option>
          ))}
        </select>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setForm({ ...form, pdf: e.target.files[0] })}
          className="file-input file-input-bordered w-full"
        />
        <button type="submit" className="btn btn-primary col-span-1 md:col-span-2">
          ⬆️ Upload Syllabus
        </button>
      </form>

      {/* Uploaded List */}
      <h3 className="text-2xl font-semibold mb-4">📄 Uploaded Syllabus</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {syllabusList.map((s) => (
          <div key={s._id} className="card bg-base-100 shadow-md border p-4">
            <h4 className="font-bold text-lg">{s.title}</h4>
            <p className="text-sm">📖 Subject: {s.subject}</p>
            <p className="text-sm">🏫 Class: {s.classNumber}</p>
            <div className="mt-3 flex gap-2">
              <a
                href={`http://localhost:5001${s.pdfUrl}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-sm"
              >
                🔎 View
              </a>
              <button
                onClick={() => handleDelete(s._id)}
                className="btn btn-error btn-sm"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherSideSyllabus;
