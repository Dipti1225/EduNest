import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  FolderOpen, BookOpen, Video, FileText, Trash, ArrowLeft, Plus, Upload, Link as LinkIcon 
} from "lucide-react";

export default function ClassroomFolder() {
  const { allocationId } = useParams();
  const navigate = useNavigate();

  const [allocation, setAllocation] = useState(null);
  const [notes, setNotes] = useState([]);
  const [videos, setVideos] = useState([]);
  const [activeTab, setActiveTab] = useState("notes");
  const [loading, setLoading] = useState(true);

  // Upload Notes states
  const [noteTitle, setNoteTitle] = useState("");
  const [notePdf, setNotePdf] = useState(null);
  const [noteUploading, setNoteUploading] = useState(false);

  // Upload Videos states
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDesc, setVideoDesc] = useState("");
  const [videoSource, setVideoSource] = useState("url"); // 'url' or 'file'
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoUploading, setVideoUploading] = useState(false);

  // Fetch allocation details, then materials
  useEffect(() => {
    const fetchClassroomData = async () => {
      try {
        setLoading(true);
        // Get all allocations of this teacher
        const resAlloc = await api.get("/allocations/my-allocations");
        const allocs = resAlloc.data.allocations || [];
        const matched = allocs.find(a => a._id === allocationId);

        if (!matched) {
          toast.error("Classroom folder not found!");
          setTimeout(() => navigate("/teachers"), 2000);
          return;
        }

        setAllocation(matched);

        // Fetch notes and videos for this class & subject
        const notesRes = await api.get("/notes", {
          params: {
            standards: matched.standard,
            subject: matched.subject
          }
        });
        setNotes(Array.isArray(notesRes.data) ? notesRes.data : (notesRes.data.data || []));

        const videosRes = await api.get("/videos", {
          params: {
            standards: matched.standard,
            subject: matched.subject
          }
        });
        setVideos(Array.isArray(videosRes.data) ? videosRes.data : (videosRes.data.data || []));

      } catch (err) {
        console.error("Error loading classroom folder:", err);
        toast.error("Failed to load classroom files.");
      } finally {
        setLoading(false);
      }
    };

    fetchClassroomData();
  }, [allocationId, navigate]);

  // Upload PDF Note
  const handleUploadNote = async (e) => {
    e.preventDefault();
    if (!noteTitle || !notePdf) {
      toast.error("Please specify a note title and select a PDF file!");
      return;
    }

    setNoteUploading(true);
    const formData = new FormData();
    formData.append("title", noteTitle);
    formData.append("pdf", notePdf);
    // Automatically pre-fill metadata fields based on folder context!
    formData.append("subject", allocation.subject);
    formData.append("classNumber", allocation.standard);

    try {
      await api.post("/notes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("Note uploaded successfully!");
      setNoteTitle("");
      setNotePdf(null);
      // Reset input element
      const fileInput = document.getElementById("classroom-pdf-input");
      if (fileInput) fileInput.value = "";

      // Refresh notes
      const notesRes = await api.get("/notes", {
        params: {
          standards: allocation.standard,
          subject: allocation.subject
        }
      });
      setNotes(Array.isArray(notesRes.data) ? notesRes.data : (notesRes.data.data || []));
    } catch (err) {
      console.error("Note upload error:", err);
      toast.error("Failed to upload note.");
    } finally {
      setNoteUploading(false);
    }
  };

  // Upload Video Lecture
  const handleUploadVideo = async (e) => {
    e.preventDefault();
    if (!videoTitle) {
      toast.error("Please specify a video title!");
      return;
    }

    if (videoSource === "url" && !videoUrl) {
      toast.error("Please specify a video URL!");
      return;
    }

    if (videoSource === "file" && !videoFile) {
      toast.error("Please select a video file!");
      return;
    }

    setVideoUploading(true);
    const formData = new FormData();
    formData.append("title", videoTitle);
    formData.append("description", videoDesc);
    // Pre-fill metadata fields based on folder context!
    formData.append("subject", allocation.subject);
    formData.append("classNumber", allocation.standard);

    if (videoSource === "url") {
      formData.append("url", videoUrl);
    } else {
      formData.append("file", videoFile);
    }

    try {
      await api.post("/videos/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("Video lecture uploaded successfully!");
      setVideoTitle("");
      setVideoDesc("");
      setVideoUrl("");
      setVideoFile(null);
      
      // Reset input element
      const fileInput = document.getElementById("classroom-video-input");
      if (fileInput) fileInput.value = "";

      // Refresh videos
      const videosRes = await api.get("/videos", {
        params: {
          standards: allocation.standard,
          subject: allocation.subject
        }
      });
      setVideos(Array.isArray(videosRes.data) ? videosRes.data : (videosRes.data.data || []));
    } catch (err) {
      console.error("Video upload error:", err);
      toast.error("Failed to upload video lecture.");
    } finally {
      setVideoUploading(false);
    }
  };

  // Delete Note
  const handleDeleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted successfully.");
      setNotes(notes.filter(n => n._id !== id));
    } catch (err) {
      console.error("Delete note error:", err);
      toast.error("Failed to delete note.");
    }
  };

  // Delete Video
  const handleDeleteVideo = async (id) => {
    if (!window.confirm("Are you sure you want to delete this video material?")) return;
    try {
      await api.delete(`/videos/${id}`);
      toast.success("Video lecture deleted.");
      setVideos(videos.filter(v => v._id !== id));
    } catch (err) {
      console.error("Delete video error:", err);
      toast.error("Failed to delete video.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const isSemester = allocation?.standard?.toLowerCase().includes("semester");
  const folderName = isSemester ? `${allocation.standard} - ${allocation.subject}` : `Class ${allocation.standard} - ${allocation.subject}`;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Back button and title */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/teachers")} className="btn btn-circle btn-ghost btn-sm">
          <ArrowLeft size={20} />
        </button>
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-base-content/40">Allocated Folder / Classroom</span>
          <h2 className="text-3xl font-black text-primary flex items-center gap-2">
            <FolderOpen className="text-secondary" /> {folderName}
          </h2>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="tabs tabs-boxed w-full sm:w-fit">
        <button 
          className={`tab flex items-center gap-1.5 font-bold ${activeTab === "notes" ? "tab-active bg-primary text-white" : ""}`}
          onClick={() => setActiveTab("notes")}
        >
          <BookOpen size={16} /> Notes PDF ({notes.length})
        </button>
        <button 
          className={`tab flex items-center gap-1.5 font-bold ${activeTab === "videos" ? "tab-active bg-primary text-white" : ""}`}
          onClick={() => setActiveTab("videos")}
        >
          <Video size={16} /> Video Lectures ({videos.length})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Form Panel */}
        <div className="lg:col-span-1 card bg-base-100 border border-base-200 shadow-xl p-5 space-y-4 h-fit">
          <h3 className="text-lg font-bold border-b pb-2 flex items-center gap-1.5 text-secondary">
            <Plus size={18} /> Upload to this Classroom Folder
          </h3>
          
          {activeTab === "notes" ? (
            <form onSubmit={handleUploadNote} className="space-y-4">
              <div>
                <label className="label"><span className="label-text">Note Title *</span></label>
                <input 
                  type="text" 
                  placeholder="e.g. Chapter 1: Basic Introduction" 
                  className="input input-bordered w-full input-sm"
                  value={noteTitle}
                  onChange={e => setNoteTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="label"><span className="label-text">Select PDF Note *</span></label>
                <input 
                  id="classroom-pdf-input"
                  type="file" 
                  accept="application/pdf"
                  className="file-input file-input-bordered file-input-sm w-full"
                  onChange={e => setNotePdf(e.target.files[0])}
                  required
                />
              </div>

              <div className="bg-base-200 p-2.5 rounded-lg text-xs space-y-1 text-base-content/60">
                <p><strong>Pre-filled Metadata Context:</strong></p>
                <p>• Subject: <span className="font-semibold text-secondary">{allocation.subject}</span></p>
                <p>• Standard: <span className="font-semibold text-secondary">{allocation.standard}</span></p>
              </div>

              <button type="submit" className="btn btn-primary w-full btn-sm" disabled={noteUploading}>
                {noteUploading ? <span className="loading loading-spinner loading-xs"></span> : "Upload PDF Note"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleUploadVideo} className="space-y-4">
              <div>
                <label className="label"><span className="label-text">Lecture Title *</span></label>
                <input 
                  type="text" 
                  placeholder="e.g. Lecture 1: Core Concepts" 
                  className="input input-bordered w-full input-sm"
                  value={videoTitle}
                  onChange={e => setVideoTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="label"><span className="label-text">Description</span></label>
                <textarea 
                  placeholder="Summarize the video lecture content..." 
                  className="textarea textarea-bordered w-full textarea-sm h-16"
                  value={videoDesc}
                  onChange={e => setVideoDesc(e.target.value)}
                />
              </div>

              <div>
                <label className="label"><span className="label-text">Video Source *</span></label>
                <div className="join w-full">
                  <button 
                    type="button" 
                    className={`btn join-item w-1/2 btn-xs ${videoSource === "url" ? "btn-primary" : "btn-outline"}`}
                    onClick={() => setVideoSource("url")}
                  >
                    <LinkIcon size={12} className="mr-1" /> External URL
                  </button>
                  <button 
                    type="button" 
                    className={`btn join-item w-1/2 btn-xs ${videoSource === "file" ? "btn-primary" : "btn-outline"}`}
                    onClick={() => setVideoSource("file")}
                  >
                    <Upload size={12} className="mr-1" /> MP4 Video
                  </button>
                </div>
              </div>

              {videoSource === "url" ? (
                <div>
                  <label className="label"><span className="label-text">Video URL *</span></label>
                  <input 
                    type="url" 
                    placeholder="https://www.youtube.com/watch?v=..." 
                    className="input input-bordered w-full input-sm"
                    value={videoUrl}
                    onChange={e => setVideoUrl(e.target.value)}
                  />
                </div>
              ) : (
                <div>
                  <label className="label"><span className="label-text">Select MP4 File *</span></label>
                  <input 
                    id="classroom-video-input"
                    type="file" 
                    accept="video/mp4"
                    className="file-input file-input-bordered file-input-sm w-full"
                    onChange={e => setVideoFile(e.target.files[0])}
                  />
                </div>
              )}

              <div className="bg-base-200 p-2.5 rounded-lg text-xs space-y-1 text-base-content/60">
                <p><strong>Pre-filled Metadata Context:</strong></p>
                <p>• Subject: <span className="font-semibold text-secondary">{allocation.subject}</span></p>
                <p>• Standard: <span className="font-semibold text-secondary">{allocation.standard}</span></p>
              </div>

              <button type="submit" className="btn btn-primary w-full btn-sm" disabled={videoUploading}>
                {videoUploading ? <span className="loading loading-spinner loading-xs"></span> : "Publish Lecture"}
              </button>
            </form>
          )}
        </div>

        {/* Right Materials List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold uppercase tracking-wider text-base-content/60">
            📁 Files inside {activeTab === "notes" ? "Notes" : "Video Lectures"} Folder
          </h3>

          {activeTab === "notes" && (
            notes.length === 0 ? (
              <div className="alert bg-base-100 border p-6 flex flex-col items-center justify-center text-center text-base-content/40 rounded-2xl">
                <FileText size={48} className="mb-2 opacity-50" />
                <span>No PDF notes uploaded in this folder yet.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notes.map(note => (
                  <div key={note._id} className="card bg-base-100 border border-base-200 shadow p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-lg text-secondary line-clamp-1">{note.title}</h4>
                        <span className="text-xs text-base-content/50">Uploaded: {new Date(note.createdAt).toLocaleDateString()}</span>
                      </div>
                      <button onClick={() => handleDeleteNote(note._id)} className="btn btn-error btn-xs btn-square">
                        <Trash size={12} />
                      </button>
                    </div>
                    <a 
                      href={`http://localhost:5001/uploads/${note.pdfUrl}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-outline btn-info btn-xs w-full mt-2"
                    >
                      View Note PDF
                    </a>
                  </div>
                ))}
              </div>
            )
          )}

          {activeTab === "videos" && (
            videos.length === 0 ? (
              <div className="alert bg-base-100 border p-6 flex flex-col items-center justify-center text-center text-base-content/40 rounded-2xl">
                <Video size={48} className="mb-2 opacity-50" />
                <span>No video lectures uploaded in this folder yet.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videos.map(vid => (
                  <div key={vid._id} className="card bg-base-100 border border-base-200 shadow p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-lg text-secondary line-clamp-1">{vid.title}</h4>
                        <span className="text-xs text-base-content/50">Uploaded: {new Date(vid.createdAt).toLocaleDateString()}</span>
                      </div>
                      <button onClick={() => handleDeleteVideo(vid._id)} className="btn btn-error btn-xs btn-square">
                        <Trash size={12} />
                      </button>
                    </div>
                    <p className="text-xs text-base-content/60 line-clamp-2">{vid.description || "No description provided."}</p>
                    
                    <div className="rounded overflow-hidden bg-black aspect-video w-full mt-1">
                      {vid.url ? (
                        <iframe
                          width="100%"
                          height="100%"
                          src={vid.url.includes("watch?v=") ? vid.url.replace("watch?v=", "embed/") : vid.url}
                          title={vid.title}
                          frameBorder="0"
                          allowFullScreen
                          className="w-full h-full"
                        ></iframe>
                      ) : vid.file ? (
                        <video controls className="w-full h-full">
                          <source src={`http://localhost:5001/uploads/${vid.file}`} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white text-xs">No Video Preview</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
