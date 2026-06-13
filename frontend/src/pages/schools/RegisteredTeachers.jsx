import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "../../context/UserContext";
import api from "../../utils/api";
import { ClipboardList, Plus, Trash2, FolderSync, X, Check } from "lucide-react";

export default function RegisteredTeachers() {
  const { user } = useUser();
  const [teachers, setTeachers] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [schoolInfo, setSchoolInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Allocation modal state
  const [allocatingTeacher, setAllocatingTeacher] = useState(null);
  const [allocForm, setAllocForm] = useState({
    standard: "",
    subject: "",
    classNumber: ""
  });
  const [submittingAlloc, setSubmittingAlloc] = useState(false);

  // Fetch school details, teachers, and allocations
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch school info
      let schoolType = "school";
      if (user?.schoolId) {
        try {
          const sRes = await api.get(`/institutions/${user.schoolId}`);
          setSchoolInfo(sRes.data);
          schoolType = sRes.data.type || "school";
        } catch (err) {
          console.error("Error fetching school profile:", err);
        }
      }

      // 2. Fetch all teachers
      const tResponse = await fetch("http://localhost:5001/api/eduNest/users?role=teacher");
      if (!tResponse.ok) throw new Error("Failed to fetch teachers");
      const tData = await tResponse.json();
      
      // Filter to only this school's teachers
      const schoolIdStr = user?.schoolId?.toString() || "";
      const myTeachers = tData.filter(t => {
        const tSchoolId = t.schoolId?._id || t.schoolId || "";
        return tSchoolId.toString() === schoolIdStr;
      });
      setTeachers(myTeachers);

      // 3. Fetch allocations done by this school
      try {
        const aRes = await api.get("/allocations/all");
        setAllocations(aRes.data.allocations || []);
      } catch (err) {
        console.error("Error fetching allocations:", err);
      }

    } catch (error) {
      toast.error("Error loading staff data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.schoolId) {
      fetchData();
    }
  }, [user]);

  const handleOpenAllocModal = (teacher) => {
    setAllocatingTeacher(teacher);
    // Set default values based on what the teacher teaches if available
    setAllocForm({
      standard: teacher.standards && teacher.standards.length > 0 ? teacher.standards[0] : "",
      subject: teacher.subjects && teacher.subjects.length > 0 ? teacher.subjects[0] : "",
      classNumber: ""
    });
  };

  const handleCloseAllocModal = () => {
    setAllocatingTeacher(null);
  };

  const handleAllocSubmit = async (e) => {
    e.preventDefault();
    if (!allocForm.standard || !allocForm.subject || !allocForm.classNumber) {
      toast.error("Please fill in all classroom allocation fields!");
      return;
    }

    const roomNum = Number(allocForm.classNumber);
    if (isNaN(roomNum) || roomNum <= 0) {
      toast.error("Classroom / Room number must be a valid positive number!");
      return;
    }

    setSubmittingAlloc(true);
    try {
      await api.post("/allocations/assign", {
        teacherId: allocatingTeacher._id,
        standard: allocForm.standard,
        subject: allocForm.subject,
        classNumber: roomNum
      });

      toast.success(`Successfully allocated Classroom to ${allocatingTeacher.name}!`);
      handleCloseAllocModal();
      
      // Refresh allocations
      const aRes = await api.get("/allocations/all");
      setAllocations(aRes.data.allocations || []);
    } catch (err) {
      console.error("Allocation submit error:", err);
      toast.error(err.response?.data?.message || "Failed to assign classroom to teacher.");
    } finally {
      setSubmittingAlloc(false);
    }
  };

  const handleRevokeAllocation = async (allocId, teacherName, standard, subject) => {
    if (!window.confirm(`Are you sure you want to revoke the allocation for ${teacherName} (Class ${standard} - ${subject})?`)) {
      return;
    }

    try {
      await api.delete(`/allocations/${allocId}`);
      toast.success("Classroom allocation revoked successfully.");
      setAllocations(allocations.filter(a => a._id !== allocId));
    } catch (err) {
      console.error("Error revoking allocation:", err);
      toast.error("Failed to revoke classroom allocation.");
    }
  };

  // Helper lists for form fallbacks
  const getAvailableStandards = (teacher) => {
    if (teacher?.standards && teacher.standards.length > 0) {
      return teacher.standards;
    }
    
    // Fallback based on school information sections
    if (schoolInfo && schoolInfo.type === "school") {
      const standards = [];
      const sections = schoolInfo.sections || ["Primary", "Middle", "Secondary", "Higher Secondary"];
      if (sections.includes("Primary")) standards.push("1", "2", "3", "4", "5");
      if (sections.includes("Middle")) standards.push("6", "7", "8");
      if (sections.includes("Secondary")) standards.push("9", "10");
      if (sections.includes("Higher Secondary")) standards.push("11", "12");
      return standards;
    } else if (schoolInfo && schoolInfo.type === "college") {
      return ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8"];
    }
    return ["1","2","3","4","5","6","7","8","9","10","11","12"];
  };

  const getAvailableSubjects = (teacher) => {
    if (teacher?.subjects && teacher.subjects.length > 0) {
      return teacher.subjects;
    }
    return ["Math", "Science", "English", "Social Studies", "Hindi", "Computer Science", "Programming", "Electronics", "Physics", "Chemistry", "Accountancy", "Business Studies", "Economics"];
  };

  const instTypeLabel = schoolInfo?.type === "college" ? "Professor" : schoolInfo?.type === "coachingCenter" ? "Tutor" : "Teacher";

  return (
    <div className="p-6 bg-base-200 min-h-screen space-y-8 max-w-6xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-base-content/40">Staff Management Dashboard</span>
          <h2 className="text-3xl font-black text-primary flex items-center gap-2">
            👨‍🏫 {instTypeLabel}s & Classroom Folders
          </h2>
        </div>
        <div className="badge badge-accent p-3 uppercase font-bold tracking-wider">{schoolInfo?.name || "EduNest Institute"}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Registered Teachers */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card bg-base-100 shadow border border-base-300">
            <div className="card-body p-6">
              <h3 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
                📋 Registered Staff Members ({teachers.length})
              </h3>
              
              {loading ? (
                <div className="flex justify-center py-10">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
              ) : teachers.length === 0 ? (
                <div className="text-center py-10 text-base-content/40">
                  No {instTypeLabel.toLowerCase()}s registered under your school yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full text-sm">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Subjects</th>
                        <th>Standards</th>
                        <th className="text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teachers.map((teacher) => (
                        <tr key={teacher._id}>
                          <td className="font-bold">
                            <div>{teacher.name}</div>
                            <div className="text-xs text-base-content/50 font-normal">{teacher.email}</div>
                          </td>
                          <td>
                            <div className="flex flex-wrap gap-1">
                              {teacher.subjects && teacher.subjects.length > 0 ? (
                                teacher.subjects.map(s => <span key={s} className="badge badge-xs badge-info">{s}</span>)
                              ) : (
                                <span className="text-xs italic text-base-content/45">None chosen</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="flex flex-wrap gap-1">
                              {teacher.standards && teacher.standards.length > 0 ? (
                                teacher.standards.map(s => <span key={s} className="badge badge-xs badge-ghost">{s.includes("Semester") ? s : `Cls ${s}`}</span>)
                              ) : (
                                <span className="text-xs italic text-base-content/45">None chosen</span>
                              )}
                            </div>
                          </td>
                          <td className="text-right">
                            <button
                              className="btn btn-primary btn-xs flex items-center gap-1 ml-auto"
                              onClick={() => handleOpenAllocModal(teacher)}
                            >
                              <Plus size={12} /> Assign Class
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Active Allocations */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card bg-base-100 shadow border border-base-300">
            <div className="card-body p-6">
              <h3 className="text-xl font-bold text-accent mb-4 flex items-center gap-2">
                <FolderSync size={20} /> Active Allocations ({allocations.length})
              </h3>
              <p className="text-xs text-base-content/50 mb-2">
                These represent the active Classroom Folders assigned to your staff, where they upload study materials.
              </p>

              {loading ? (
                <div className="flex justify-center py-6">
                  <span className="loading loading-spinner loading-md text-accent"></span>
                </div>
              ) : allocations.length === 0 ? (
                <div className="alert bg-base-200 text-center p-6 rounded-xl text-base-content/40 flex flex-col justify-center">
                  <ClipboardList size={32} className="mx-auto mb-2 opacity-50" />
                  <span>No classrooms allocated yet.</span>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                  {allocations.map((alloc) => (
                    <div key={alloc._id} className="p-3 bg-base-200 border rounded-xl relative hover:bg-base-300 transition-colors">
                      <button
                        onClick={() => handleRevokeAllocation(alloc._id, alloc.teacherId?.name || "Tutor", alloc.standard, alloc.subject)}
                        className="btn btn-error btn-xs btn-square absolute top-2 right-2"
                        title="Revoke Allocation"
                      >
                        <Trash2 size={12} />
                      </button>
                      <div className="font-bold text-sm text-secondary pr-6 truncate">
                        {alloc.teacherId?.name || "Unknown Teacher"}
                      </div>
                      <div className="text-xs text-base-content/70 mt-1">
                        <strong>Standard:</strong> {alloc.standard.includes("Semester") ? alloc.standard : `Class ${alloc.standard}`}
                      </div>
                      <div className="text-xs text-base-content/70">
                        <strong>Subject:</strong> {alloc.subject}
                      </div>
                      <div className="text-xs text-base-content/70">
                        <strong>Classroom/Room:</strong> {alloc.classNumber || "N/A"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Allocation Modal */}
      {allocatingTeacher && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4 animate-fadeIn">
          <form 
            onSubmit={handleAllocSubmit}
            className="card w-full max-w-md bg-base-100 shadow-2xl border p-6 relative space-y-4"
          >
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute top-3 right-3"
              onClick={handleCloseAllocModal}
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-black text-primary border-b pb-2 flex items-center gap-1.5">
              <FolderSync className="text-secondary" /> Allocate Classroom Folder
            </h3>
            <p className="text-xs text-base-content/60">
              Assign a standard and subject to <strong>{allocatingTeacher.name}</strong> to create an upload directory for them.
            </p>

            <div>
              <label className="label"><span className="label-text font-bold">1. Select Class/Standard *</span></label>
              <select
                className="select select-bordered w-full select-sm"
                value={allocForm.standard}
                onChange={e => setAllocForm({ ...allocForm, standard: e.target.value })}
                required
              >
                <option value="">Choose Class/Standard</option>
                {getAvailableStandards(allocatingTeacher).map(std => (
                  <option key={std} value={std}>{std.includes("Semester") ? std : `Class ${std}`}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label"><span className="label-text font-bold">2. Select Subject *</span></label>
              <select
                className="select select-bordered w-full select-sm"
                value={allocForm.subject}
                onChange={e => setAllocForm({ ...allocForm, subject: e.target.value })}
                required
              >
                <option value="">Choose Subject</option>
                {getAvailableSubjects(allocatingTeacher).map(subj => (
                  <option key={subj} value={subj}>{subj}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">
                <span className="label-text font-bold">3. Classroom / Room Number *</span>
              </label>
              <input
                type="number"
                min="1"
                placeholder="e.g. 101, 102"
                className="input input-bordered w-full input-sm"
                value={allocForm.classNumber}
                onChange={e => setAllocForm({ ...allocForm, classNumber: e.target.value })}
                required
              />
              <span className="text-[10px] text-base-content/40 mt-1 block">A number representing the physical room or batch ID.</span>
            </div>

            <div className="flex gap-2 pt-2">
              <button 
                type="button" 
                className="btn btn-outline btn-sm w-1/2"
                onClick={handleCloseAllocModal}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary btn-sm w-1/2 flex items-center gap-1.5"
                disabled={submittingAlloc}
              >
                {submittingAlloc ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <>
                    <Check size={16} /> Allocate Folder
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
