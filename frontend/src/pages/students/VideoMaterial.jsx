import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { useUser } from "../../context/UserContext";
import { BookOpen, Star, Sparkles, AlertCircle, Video } from "lucide-react";

export default function VideoMaterial() {
  const { user } = useUser();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [institutions, setInstitutions] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(user?.schoolId || "");

  // Fetch all approved institutions of the same type for comparison if student is Premium
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

  // Fetch videos based on standard and selected school
  useEffect(() => {
    if (!user?.schoolId) return;
    setLoading(true);

    const schoolIdToUse = user.isPremium ? (selectedSchool || user.schoolId) : user.schoolId;

    api.get("/videos", {
      params: {
        schoolId: schoolIdToUse,
        standards: user.classNumber, // filter by user's own standard/semester
      },
    })
      .then((res) => {
        const fetchedVideos = Array.isArray(res.data) 
          ? res.data 
          : (res.data.data || []);
        setVideos(fetchedVideos);
      })
      .catch((err) => {
        console.error("Fetch videos error:", err);
        setVideos([]);
      })
      .finally(() => setLoading(false));
  }, [user, selectedSchool]);

  const handleSchoolChange = (e) => {
    setSelectedSchool(e.target.value);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="card bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 shadow-xl rounded-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <h2 className="text-3xl font-extrabold flex items-center gap-2">
            <Video /> Video Study Materials
          </h2>
          <p className="text-white/80">Browse class lecture recordings, tutorials, and benchmark notes.</p>
          <div className="flex gap-2 pt-2">
            <span className="badge badge-ghost text-xs">Standard: {user?.classNumber || "Class 10"}</span>
            <span className="badge badge-accent text-xs">Medium: {user?.medium || "English"}</span>
          </div>
        </div>
        <div className="absolute right-4 bottom-4 opacity-15">
          <BookOpen size={140} />
        </div>
      </div>

      {/* Premium Upgrader Info for Non-Premium Users */}
      {!user?.isPremium && (
        <div className="alert bg-amber-50 border border-amber-200 text-amber-900 rounded-xl shadow p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="text-amber-500 animate-pulse" size={24} />
            <div>
              <span className="font-bold text-base">Benchmarking System Locked</span>
              <p className="text-sm opacity-90">Upgrade to Premium to browse and study video lectures from other top schools of your same standard!</p>
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
              <Star className="fill-amber-400 text-amber-400" size={18} /> 
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

      {/* Videos Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : videos.length === 0 ? (
        <div className="alert bg-base-100 border border-base-200 rounded-xl p-8 flex flex-col items-center text-center space-y-3">
          <AlertCircle size={48} className="text-base-content/30" />
          <h4 className="font-bold text-lg">No Video Materials Found</h4>
          <p className="text-sm text-base-content/50 max-w-sm">
            Tutors at this school haven't uploaded lectures for Standard/Semester {user?.classNumber} yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {videos.map((v, idx) => (
            <div key={idx} className="card bg-base-100 border border-base-200 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
              <div className="card-body p-5 space-y-3">
                <div>
                  <h4 className="font-extrabold text-lg text-secondary line-clamp-1">{v.title}</h4>
                  <span className="text-xs text-base-content/50">Subject: {v.subject || "General"}</span>
                </div>
                
                <p className="text-sm text-base-content/70 h-10 line-clamp-2">{v.description || "No description provided."}</p>

                <div className="flex gap-2">
                  <span className="badge badge-accent badge-outline text-xs">Standard: {v.classNumber || v.standards?.join(", ")}</span>
                  {v.createdBy?.name && (
                    <span className="badge badge-ghost text-xs">Uploaded by: {v.createdBy.name}</span>
                  )}
                </div>

                {/* Video Embeds / Direct MP4 Source */}
                <div className="rounded-lg overflow-hidden bg-black aspect-video w-full mt-2">
                  {v.url ? (
                    <iframe
                      width="100%"
                      height="100%"
                      src={v.url.includes("watch?v=") ? v.url.replace("watch?v=", "embed/") : v.url}
                      title={v.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  ) : v.file ? (
                    <video controls className="w-full h-full">
                      <source src={`http://localhost:5001/uploads/${v.file}`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-xs">
                      No playable video source found.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
