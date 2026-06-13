import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { useUser } from "../../context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FileText as FaFilePdf, BookOpen as FaBookOpen, X as FaTimes, Star as FaStar, Sparkles as FaSparkles } from "lucide-react";

export default function Notes() {
  const { user } = useUser();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [institutions, setInstitutions] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(user?.schoolId || "");

  // Fetch approved institutions of the same type if student is premium
  useEffect(() => {
    if (user?.isPremium) {
      api.get("/institutions")
        .then((res) => {
          api.get(`/institutions/${user.schoolId}`)
            .then(myInstRes => {
              const myType = myInstRes.data.type;
              const matches = (res.data || []).filter(inst => inst.type === myType);
              setInstitutions(matches);
            })
            .catch(() => {
              setInstitutions(res.data || []);
            });
        })
        .catch(() => setInstitutions([]));
    }
  }, [user]);

  // Fetch notes
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const schoolIdToUse = user?.isPremium ? (selectedSchool || user?.schoolId) : user?.schoolId;
      
      const res = await api.get("/notes", {
        params: {
          schoolId: schoolIdToUse,
          standards: user?.classNumber
        }
      });

      const fetchedNotes = Array.isArray(res.data) 
        ? res.data 
        : (res.data.data || []);
      setNotes(fetchedNotes);
    } catch (err) {
      console.error("Fetch notes error:", err);
      toast.error("Failed to load notes.");
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.schoolId) {
      fetchNotes();
    }
  }, [user, selectedSchool]);

  const handleSchoolChange = (e) => {
    setSelectedSchool(e.target.value);
  };

  const handleViewPDF = (pdfUrl) => {
    // If it already starts with http, use it directly, otherwise prepend server base
    const fullUrl = pdfUrl.startsWith("http") 
      ? pdfUrl 
      : `http://localhost:5001/uploads/${pdfUrl}`;
    setSelectedPdf(fullUrl);
  };

  const closePdf = () => setSelectedPdf(null);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header Banner */}
      <div className="card bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 shadow-xl rounded-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <h2 className="text-3xl font-extrabold flex items-center gap-2">
            <FaBookOpen /> Class Study Notes
          </h2>
          <p className="text-white/85">View PDFs, reading materials and assignments shared by class instructors.</p>
          <div className="flex gap-2 pt-2">
            <span className="badge badge-ghost text-xs">Standard: {user?.classNumber || "Class 10"}</span>
            <span className="badge badge-accent text-xs">Medium: {user?.medium || "English"}</span>
          </div>
        </div>
      </div>

      {/* Premium Upgrader Info for Non-Premium Users */}
      {!user?.isPremium && (
        <div className="alert bg-amber-50 border border-amber-200 text-amber-900 rounded-xl shadow p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FaSparkles className="text-amber-500 animate-pulse" size={24} />
            <div>
              <span className="font-bold text-base">Benchmarking Notes System Locked</span>
              <p className="text-sm opacity-90 font-medium">Upgrade to Premium to read notes shared by top teachers from other schools!</p>
            </div>
          </div>
          <a href="/students/premium" className="btn btn-warning btn-sm font-bold text-amber-950 px-4">
            👑 Go Premium
          </a>
        </div>
      )}

      {/* Dropdown filters for premium users */}
      {user?.isPremium && (
        <div className="card bg-base-100 border border-base-200 shadow-md p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-secondary flex items-center gap-1.5">
              <FaStar className="text-amber-400" size={18} /> 
              Compare Schools & Colleges (Premium Feature)
            </h3>
            <p className="text-xs text-base-content/50">Viewing material of same standard from different top institutes.</p>
          </div>
          <div className="w-full sm:w-72">
            <select 
              onChange={handleSchoolChange} 
              value={selectedSchool} 
              className="select select-bordered select-secondary w-full"
            >
              <option value={user.schoolId}>My Institution (Default)</option>
              {institutions
                .filter(inst => inst._id !== user.schoolId)
                .map(inst => (
                  <option value={inst._id} key={inst._id}>🏫 {inst.name}</option>
                ))
              }
            </select>
          </div>
        </div>
      )}

      {/* Notes Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : notes.length === 0 ? (
        <div className="alert bg-base-100 border border-base-200 rounded-xl p-8 flex flex-col items-center text-center space-y-3">
          <FaBookOpen size={48} className="text-base-content/30" />
          <h4 className="font-bold text-lg">No Notes Available</h4>
          <p className="text-sm text-base-content/50 max-w-sm">
            Tutors at this school haven't uploaded notes for Standard/Semester {user?.classNumber} yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div key={note._id} className="card bg-base-100 shadow-lg border border-base-200 hover:scale-[1.02] transition-all duration-300">
              <div className="card-body p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="card-title text-secondary text-lg font-extrabold line-clamp-1">{note.title}</h2>
                    <span className="text-xs text-base-content/50">Subject: {note.subject || "General"}</span>
                  </div>
                  <div className="p-2 bg-red-100 text-red-600 rounded-lg"><FaFilePdf size={20} /></div>
                </div>

                <div className="flex justify-between items-center text-xs text-base-content/40">
                  <span>Class/Standard: {note.classNumber}</span>
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>

                <button
                  className="btn btn-outline btn-secondary btn-sm w-full mt-2"
                  onClick={() => handleViewPDF(note.pdfUrl)}
                >
                  View PDF Note
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen PDF Viewer */}
      {selectedPdf && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4">
          <div className="relative w-full max-w-5xl h-[90vh] bg-base-100 rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-base-300">
            <div className="p-4 border-b flex justify-between items-center bg-base-200">
              <span className="font-bold text-primary">PDF Study Note Viewer</span>
              <button
                className="btn btn-sm btn-circle btn-error"
                onClick={closePdf}
              >
                <FaTimes />
              </button>
            </div>
            <div className="flex-grow">
              <iframe
                src={selectedPdf}
                title="PDF Viewer"
                className="w-full h-full"
                frameBorder="0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}