import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { FaTrash, FaFilePdf, FaBookOpen } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const STANDARDS = ["1","2","3","4","5","6","7","8","9","10","11","12", "Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8"];

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [classNumber, setClassNumber] = useState("");
  const [pdf, setPdf] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fetch notes uploaded by teacher
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await api.get("/notes");
      // api returns { success: true, data: notes }
      setNotes(response.data.data || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast.error("Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !subject || !classNumber || !pdf) {
      toast.error("Please provide a title, subject, class/standard and select a PDF.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("subject", subject);
    formData.append("classNumber", classNumber);
    formData.append("pdf", pdf); // field matches multer 'pdf' in noteRoutes

    try {
      await api.post("/notes/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      toast.success("Note uploaded successfully!");
      setTitle("");
      setSubject("");
      setClassNumber("");
      setPdf(null);
      
      // Reset file input element
      const fileInput = document.getElementById("pdf-file-input");
      if (fileInput) fileInput.value = "";

      fetchNotes();
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error(err.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted successfully!");
      fetchNotes();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Delete failed.");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div>
        <h2 className="text-3xl font-extrabold text-primary flex items-center gap-2">
          <FaBookOpen className="text-secondary" /> Study Notes Panel
        </h2>
        <p className="text-base-content/60 mt-1">Publish lecture notes, PDFs and homework solutions for your classes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Column (Left 1 col) */}
        <div className="lg:col-span-1 card bg-base-100 border border-base-200 shadow-xl p-5 space-y-4">
          <h3 className="text-lg font-bold border-b pb-2">Upload PDF Notes</h3>
          <form onSubmit={handleUpload} className="space-y-3" encType="multipart/form-data">
            <div>
              <label className="label"><span className="label-text">Note Title *</span></label>
              <input
                type="text"
                placeholder="e.g. Chapter 3: Differentiation"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label className="label"><span className="label-text">Subject *</span></label>
              <input
                type="text"
                placeholder="e.g. Calculus"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label className="label"><span className="label-text">Target Standard / Semester *</span></label>
              <select 
                className="select select-bordered w-full" 
                value={classNumber} 
                onChange={e => setClassNumber(e.target.value)} 
                required
              >
                <option value="">Select standard</option>
                {STANDARDS.map(std => <option key={std} value={std}>{std.includes("Semester") ? std : `Class ${std}`}</option>)}
              </select>
            </div>

            <div>
              <label className="label"><span className="label-text">Select PDF Document *</span></label>
              <input
                id="pdf-file-input"
                type="file"
                accept="application/pdf"
                onChange={(e) => setPdf(e.target.files[0])}
                className="file-input file-input-bordered w-full"
                required
              />
            </div>

            <button type="submit" className="btn btn-secondary w-full mt-4" disabled={uploading}>
              {uploading ? <span className="loading loading-spinner loading-sm"></span> : "Upload PDF"}
            </button>
          </form>
        </div>

        {/* Uploaded Notes List (Right 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold">📂 Your Published PDF Notes</h3>

          {loading ? (
            <div className="flex justify-center items-center h-48 bg-base-100 rounded-xl border">
              <span className="loading loading-spinner loading-md text-primary"></span>
            </div>
          ) : notes.length === 0 ? (
            <div className="alert alert-info shadow">
              <span>You have not uploaded any PDF notes yet. Use the form on the left to publish.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className="card bg-base-100 shadow-md border border-base-200 hover:shadow-lg transition-shadow"
                >
                  <div className="card-body p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="card-title text-secondary text-lg line-clamp-1">{note.title}</h4>
                        <span className="text-xs text-base-content/50">Subject: {note.subject || "General"}</span>
                      </div>
                      <button
                        className="btn btn-error btn-xs btn-square"
                        onClick={() => handleDelete(note._id)}
                        title="Delete note"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="badge badge-accent">Class: {note.classNumber}</span>
                      <span className="text-base-content/40">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="card-actions justify-end pt-2 border-t border-base-200">
                      <a
                        href={`http://localhost:5001/uploads/${note.pdfUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-info btn-xs flex items-center gap-1 w-full"
                      >
                        <FaFilePdf size={12} /> View Note PDF
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}