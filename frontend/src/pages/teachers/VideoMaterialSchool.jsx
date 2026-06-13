import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { useUser } from "../../context/UserContext";
import { FaTrash, FaVideo, FaLink, FaUpload } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const STANDARDS = ["1","2","3","4","5","6","7","8","9","10","11","12", "Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8"];

export default function VideoMaterialSchool() {
  const { user } = useUser();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [classNumber, setClassNumber] = useState("");
  const [description, setDescription] = useState("");
  const [uploadType, setUploadType] = useState("url"); // 'url' or 'file'
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fetch teacher's own uploaded videos
  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await api.get("/videos");
      // api returns { success: true, data: videos }
      setVideos(res.data.data || []);
    } catch (err) {
      console.error("Fetch videos error:", err);
      toast.error("Failed to load video materials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !subject || !classNumber) {
      toast.error("Please fill in title, subject, and standard!");
      return;
    }

    if (uploadType === "url" && !videoUrl) {
      toast.error("Please provide a video URL!");
      return;
    }

    if (uploadType === "file" && !videoFile) {
      toast.error("Please select a video file!");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("subject", subject);
    formData.append("classNumber", classNumber);
    formData.append("description", description);
    
    if (uploadType === "url") {
      formData.append("url", videoUrl);
    } else {
      formData.append("file", videoFile);
    }

    try {
      await api.post("/videos/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      toast.success("Video material uploaded successfully!");
      // Reset form
      setTitle("");
      setSubject("");
      setClassNumber("");
      setDescription("");
      setVideoUrl("");
      setVideoFile(null);
      
      // Refresh list
      fetchVideos();
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.response?.data?.message || "Failed to upload video.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this video material?")) return;

    try {
      await api.delete(`/videos/${id}`);
      toast.success("Video material deleted!");
      fetchVideos();
    } catch (err) {
      console.error("Delete video error:", err);
      toast.error("Failed to delete video material.");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div>
        <h2 className="text-3xl font-extrabold text-primary flex items-center gap-2">
          <FaVideo className="text-secondary" /> Video Study Material Panel
        </h2>
        <p className="text-base-content/60 mt-1">Publish lecture recordings or external resources for your students.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upload Form (Left 1 col on large screen) */}
        <div className="lg:col-span-1 card bg-base-100 border border-base-200 shadow-xl p-5 space-y-4">
          <h3 className="text-lg font-bold border-b pb-2">Upload Lecture Video</h3>
          <form onSubmit={handleUpload} className="space-y-3">
            <div>
              <label className="label"><span className="label-text">Video Title *</span></label>
              <input 
                type="text" 
                placeholder="e.g. Introduction to Calculus" 
                className="input input-bordered w-full" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                required 
              />
            </div>

            <div>
              <label className="label"><span className="label-text">Subject *</span></label>
              <input 
                type="text" 
                placeholder="e.g. Mathematics" 
                className="input input-bordered w-full" 
                value={subject} 
                onChange={e => setSubject(e.target.value)} 
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
              <label className="label"><span className="label-text">Short Description</span></label>
              <textarea 
                placeholder="Brief summary of lecture content..." 
                className="textarea textarea-bordered w-full"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="label"><span className="label-text">Video Source *</span></label>
              <div className="join w-full">
                <button 
                  type="button" 
                  className={`btn join-item w-1/2 btn-sm ${uploadType === "url" ? "btn-primary" : "btn-outline"}`}
                  onClick={() => setUploadType("url")}
                >
                  <FaLink className="mr-1" /> External Link
                </button>
                <button 
                  type="button" 
                  className={`btn join-item w-1/2 btn-sm ${uploadType === "file" ? "btn-primary" : "btn-outline"}`}
                  onClick={() => setUploadType("file")}
                >
                  <FaUpload className="mr-1" /> MP4 Upload
                </button>
              </div>
            </div>

            {uploadType === "url" ? (
              <div>
                <label className="label"><span className="label-text">YouTube or Video URL *</span></label>
                <input 
                  type="url" 
                  placeholder="https://www.youtube.com/watch?v=..." 
                  className="input input-bordered w-full"
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                />
              </div>
            ) : (
              <div>
                <label className="label"><span className="label-text">Select MP4 Video File *</span></label>
                <input 
                  type="file" 
                  accept="video/mp4,video/mkv" 
                  className="file-input file-input-bordered w-full"
                  onChange={e => setVideoFile(e.target.files[0])}
                />
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-secondary w-full mt-4" 
              disabled={uploading}
            >
              {uploading ? <span className="loading loading-spinner loading-sm"></span> : "Upload Material"}
            </button>
          </form>
        </div>

        {/* Uploaded Videos List (Right 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold">📂 Your Published Video Lectures</h3>

          {loading ? (
            <div className="flex justify-center items-center h-48 bg-base-100 rounded-xl border">
              <span className="loading loading-spinner loading-md text-primary"></span>
            </div>
          ) : videos.length === 0 ? (
            <div className="alert alert-info shadow">
              <span>You have not uploaded any video materials yet. Use the form on the left to publish.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videos.map((vid) => (
                <div key={vid._id} className="card bg-base-100 border border-base-200 shadow-md hover:shadow-lg transition-shadow">
                  <div className="card-body p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-lg text-secondary line-clamp-1">{vid.title}</h4>
                        <span className="text-xs text-base-content/50">Subject: {vid.subject}</span>
                      </div>
                      <button 
                        onClick={() => handleDelete(vid._id)} 
                        className="btn btn-error btn-xs btn-square"
                        title="Delete video"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>

                    <p className="text-sm text-base-content/70 line-clamp-2 h-10">{vid.description || "No description provided."}</p>

                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="badge badge-accent">Standard: {vid.classNumber || vid.standards?.join(", ")}</span>
                      <span className="text-base-content/40">{new Date(vid.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Preview video player or link */}
                    <div className="rounded overflow-hidden bg-black aspect-video w-full flex items-center justify-center text-white text-xs">
                      {vid.url ? (
                        <iframe
                          width="100%"
                          height="100%"
                          src={vid.url.includes("watch?v=") ? vid.url.replace("watch?v=", "embed/") : vid.url}
                          title={vid.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        ></iframe>
                      ) : vid.file ? (
                        <video controls className="w-full h-full">
                          <source src={`http://localhost:5001/uploads/${vid.file}`} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <span>No Video Preview Available</span>
                      )}
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
