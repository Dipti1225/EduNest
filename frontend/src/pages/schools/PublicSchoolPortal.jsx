import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { GraduationCap, Award, BookOpen, Users, MapPin, Phone, Mail, User, ShieldAlert, Sparkles, LayoutDashboard } from "lucide-react";
import logo from "../../assets/edunest-logo.png";

export default function PublicSchoolPortal() {
  const { schoolId } = useParams();
  const navigate = useNavigate();

  const [school, setSchool] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPortalData = async () => {
      try {
        setLoading(true);
        setError("");

        // 1. Fetch institution profile
        const profileRes = await fetch(`http://localhost:5001/api/eduNest/institutions/${schoolId}`);
        if (!profileRes.ok) throw new Error("Institution not found or server error");
        const profileData = await profileRes.json();
        setSchool(profileData);

        // 2. Fetch public teachers list
        const teachersRes = await fetch("http://localhost:5001/api/eduNest/users?role=teacher");
        if (teachersRes.ok) {
          const tData = await teachersRes.json();
          const schoolTeachers = tData.filter(t => {
            const tSchoolId = t.schoolId?._id || t.schoolId || "";
            return tSchoolId.toString() === schoolId.toString();
          });
          setTeachers(schoolTeachers);
        }

        // 3. Fetch school activities
        const activitiesRes = await fetch(`http://localhost:5001/api/eduNest/activities/school/${schoolId}`);
        if (activitiesRes.ok) {
          const aData = await activitiesRes.json();
          setActivities(aData.data || []);
        }

      } catch (err) {
        console.error("Error loading public school portal:", err);
        setError("Failed to load school portal details. Please make sure the ID is correct.");
      } finally {
        setLoading(false);
      }
    };

    if (schoolId) {
      fetchPortalData();
    }
  }, [schoolId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-4">
        <div className="card max-w-md bg-base-100 shadow-xl border border-error/20 p-6 text-center space-y-4">
          <ShieldAlert size={48} className="text-error mx-auto" />
          <h2 className="text-xl font-bold text-error">School Portal Error</h2>
          <p className="text-sm text-base-content/75">{error || "Could not find institution details."}</p>
          <button onClick={() => navigate("/")} className="btn btn-primary btn-sm w-full">
            Back to Homepage
          </button>
        </div>
      </div>
    );
  }

  // Visual Theme mapping based on Institution Type
  const isCollege = school.type === "college";
  const isCoaching = school.type === "coachingCenter";

  const themeClass = isCollege 
    ? "from-emerald-500 to-teal-600 bg-emerald-500" 
    : isCoaching 
      ? "from-amber-500 to-orange-600 bg-amber-500" 
      : "from-blue-600 to-indigo-700 bg-blue-600";

  const badgeClass = isCollege 
    ? "badge-success" 
    : isCoaching 
      ? "badge-warning" 
      : "badge-primary";

  const textThemeClass = isCollege 
    ? "text-emerald-500" 
    : isCoaching 
      ? "text-amber-500" 
      : "text-blue-600";

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      {/* Header Navigation */}
      <header className="navbar bg-base-100 shadow-md px-6 justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="EduNest" className="h-9" />
          <span className="font-bold text-sm tracking-wider uppercase text-base-content/65">Public Portal</span>
        </Link>
        <div className="flex gap-2">
          <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
          <Link to={`/registerUser?schoolId=${school._id}`} className="btn btn-primary btn-sm">Join Institution</Link>
        </div>
      </header>

      {/* Main Cover Banner */}
      <div className={`w-full py-12 px-6 md:px-16 text-white bg-gradient-to-r ${themeClass} shadow-inner`}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <span className={`badge ${badgeClass} uppercase font-bold text-xs p-2.5`}>{school.type}</span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">{school.name}</h1>
            <p className="opacity-90 font-medium max-w-xl">Welcome to our public institute portal. Explore our branches, meet our qualified tutors, and view recent activities.</p>
          </div>
          <div className="card bg-base-100/10 backdrop-blur-md p-4 text-white rounded-2xl border border-white/20 text-sm space-y-2.5 w-full md:w-80">
            <div className="flex items-center gap-2"><MapPin size={16} /> <span>{school.address || "Address not specified"}</span></div>
            <div className="flex items-center gap-2"><Phone size={16} /> <span>{school.phone}</span></div>
            <div className="flex items-center gap-2"><Mail size={16} /> <span>{school.email}</span></div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl w-full mx-auto p-6 flex-grow grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Details, Activities, Teachers */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* About / Configuration Card */}
          <div className="card bg-base-100 shadow-md border border-base-300">
            <div className="card-body p-6 space-y-4">
              <h3 className="text-xl font-bold text-secondary border-b pb-2">🏫 Academic Foundation</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* School Specific */}
                {school.type === "school" && (
                  <>
                    <div className="space-y-1">
                      <span className="text-xs text-base-content/40 font-bold uppercase tracking-wider block">Mediums Offered</span>
                      <div className="flex gap-1.5">
                        {school.mediums?.map(m => <span key={m} className="badge badge-sm badge-outline uppercase">{m}</span>) || <span className="text-sm italic">None</span>}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-base-content/40 font-bold uppercase tracking-wider block">Sections</span>
                      <div className="flex flex-wrap gap-1.5">
                        {school.sections?.map(s => <span key={s} className="badge badge-sm badge-secondary">{s}</span>) || <span className="text-sm italic">None</span>}
                      </div>
                    </div>
                    {school.sections?.includes("Higher Secondary") && (
                      <div className="space-y-1 col-span-1 md:col-span-2">
                        <span className="text-xs text-base-content/40 font-bold uppercase tracking-wider block">HSC Streams</span>
                        <div className="flex gap-1.5">
                          {school.streams?.map(s => <span key={s} className="badge badge-sm badge-accent">{s}</span>) || <span className="text-sm italic">None</span>}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* College Specific */}
                {isCollege && (
                  <div className="space-y-1 col-span-1 md:col-span-2">
                    <span className="text-xs text-base-content/40 font-bold uppercase tracking-wider block">Departments / Branches</span>
                    <div className="flex flex-wrap gap-1.5">
                      {school.branches?.map(b => (
                        <span key={b} className="badge badge-sm badge-success uppercase">
                          {b === "COM" ? "Computer Science (COM)" : b === "CE" ? "Computer Engineering (CE)" : b === "EC" ? "Electronics & Comm (EC)" : "Information Tech (IT)"}
                        </span>
                      )) || <span className="text-sm italic">None</span>}
                    </div>
                  </div>
                )}

                {/* Coaching Specific */}
                {isCoaching && (
                  <>
                    <div className="space-y-1">
                      <span className="text-xs text-base-content/40 font-bold uppercase tracking-wider block">Mediums Supported</span>
                      <div className="flex gap-1.5">
                        {school.mediums?.map(m => <span key={m} className="badge badge-sm badge-outline uppercase">{m}</span>) || <span className="text-sm italic">None</span>}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-base-content/40 font-bold uppercase tracking-wider block">Target / Coaching Streams</span>
                      <div className="flex flex-wrap gap-1.5">
                        {school.branches?.map(b => <span key={b} className="badge badge-sm badge-warning">{b}</span>) || <span className="text-sm italic">None Specified</span>}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Registered Teachers */}
          <div className="card bg-base-100 shadow-md border border-base-300">
            <div className="card-body p-6">
              <h3 className="text-xl font-bold text-secondary border-b pb-2 flex items-center gap-1.5">
                <Users size={20} /> Appointed Faculty & Tutors ({teachers.length})
              </h3>
              {teachers.length === 0 ? (
                <p className="text-xs italic text-base-content/50 py-4 text-center">No registered faculty members listed under this institution.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {teachers.map(t => (
                    <div key={t._id} className="p-3 bg-base-200 border rounded-xl flex gap-3 items-center">
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-10">
                          <span className="text-sm">{t.name[0]}</span>
                        </div>
                      </div>
                      <div className="truncate text-xs">
                        <div className="font-bold text-sm truncate">{t.name}</div>
                        <div className="text-base-content/55 truncate">Subjects: {t.subjects?.join(", ") || "General"}</div>
                        <div className="text-base-content/55 truncate">Classes: {t.standards?.join(", ") || "All"}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="card bg-base-100 shadow-md border border-base-300">
            <div className="card-body p-6">
              <h3 className="text-xl font-bold text-secondary border-b pb-2 flex items-center gap-1.5">
                <BookOpen size={20} /> Latest Updates & Campus Activities ({activities.length})
              </h3>
              {activities.length === 0 ? (
                <p className="text-xs italic text-base-content/50 py-6 text-center">No campus activity updates published yet.</p>
              ) : (
                <div className="space-y-4 pt-2 max-h-[400px] overflow-y-auto pr-1">
                  {activities.map(act => (
                    <div key={act._id} className="p-4 bg-base-200 border rounded-xl space-y-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-secondary text-sm">{act.title}</h4>
                        <span className="badge badge-sm badge-ghost">{act.standard}</span>
                      </div>
                      <p className="text-xs text-base-content/70">{act.description}</p>
                      <span className="block text-[10px] text-base-content/40 mt-1">Date: {act.date ? new Date(act.date).toLocaleDateString() : "Regular"}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right 1 Col: CTA & Register */}
        <div className="lg:col-span-1 space-y-6">
          {/* Join Call to Action */}
          <div className="card bg-base-100 shadow-xl border border-primary/20 overflow-hidden relative">
            <div className={`h-2.5 w-full ${themeClass}`}></div>
            <div className="card-body p-6 space-y-4">
              <h3 className="text-xl font-black text-primary flex items-center gap-1.5">
                <Sparkles size={20} className="text-yellow-500" /> Join Our Community
              </h3>
              <p className="text-xs text-base-content/65">
                Are you a student or teacher at {school.name}? Register now to access study materials, calendars, assignments, and online test engines.
              </p>
              
              <div className="space-y-3 pt-2">
                <Link to={`/registerUser?schoolId=${school._id}&role=student`} className="btn btn-primary w-full btn-sm font-bold flex items-center justify-center gap-1.5">
                  🧑‍🎓 Join as a Student
                </Link>
                <Link to={`/registerUser?schoolId=${school._id}&role=teacher`} className="btn btn-outline btn-secondary w-full btn-sm font-bold flex items-center justify-center gap-1.5">
                  👨‍🏫 Join as a Teacher
                </Link>
              </div>

              <div className="border-t pt-4 text-center">
                <span className="text-[11px] text-base-content/40">Already registered?</span>
                <Link to="/login" className="block text-xs font-bold text-primary hover:underline mt-1">
                  Log in to your Account
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card bg-base-100 shadow-md border border-base-300">
            <div className="card-body p-5 space-y-3 text-xs text-base-content/75">
              <h4 className="font-bold uppercase tracking-wider text-base-content/40 text-[10px]">Institute Stats</h4>
              <div className="flex justify-between items-center py-1.5 border-b">
                <span>Mediums Supported</span>
                <span className="font-bold">{school.mediums?.length || 2}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b">
                <span>Faculty Members</span>
                <span className="font-bold">{teachers.length}</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span>Campus Activities</span>
                <span className="font-bold">{activities.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer footer-center p-4 bg-base-300 text-base-content text-xs">
        <div>
          <p>© {new Date().getFullYear()} EduNest Public Portal System · Powered by EduNest</p>
        </div>
      </footer>
    </div>
  );
}
