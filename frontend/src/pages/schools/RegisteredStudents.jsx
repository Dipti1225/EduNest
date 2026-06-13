import React, { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import api from "../../utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GraduationCap, Award, BookOpen, User as UserIcon } from "lucide-react";

export default function RegisteredStudents() {
  const { user } = useUser();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudentData, setSelectedStudentData] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await api.get("/users?role=student");
        
        // Filter students belonging to this school
        const schoolIdStr = user?.schoolId?.toString() || "";
        const myStudents = (res.data || []).filter(s => {
          const sSchoolId = s.schoolId?._id || s.schoolId || "";
          return sSchoolId.toString() === schoolIdStr;
        });

        setStudents(myStudents);
      } catch (err) {
        console.error("Failed to fetch students:", err);
        toast.error("Failed to load students.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.schoolId) {
      fetchStudents();
    }
  }, [user]);

  const viewDetails = async (student) => {
    setSelectedStudent(student._id);
    setSelectedStudentData(student);

    try {
      const achieveRes = await fetch(`http://localhost:5001/api/eduNest/achievements/${student._id}`);
      const recordRes = await fetch(`http://localhost:5001/api/eduNest/records/${student._id}`);

      const achievementsData = await achieveRes.json();
      const recordsData = await recordRes.json();

      setAchievements(Array.isArray(achievementsData) ? achievementsData : []);
      setRecords(Array.isArray(recordsData) ? recordsData : []);
    } catch (error) {
      console.error("Error fetching student details:", error);
      toast.error("Error fetching student details.");
    }
  };

  return (
    <div className="p-6 bg-base-200 min-h-screen space-y-8 max-w-6xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-base-content/40">Student Management Dashboard</span>
          <h2 className="text-3xl font-black text-primary flex items-center gap-2">
            🧑‍🎓 Registered Students
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left List of Students */}
        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow border border-base-300">
            <div className="card-body p-6">
              <h3 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
                📋 School Students Roll ({students.length})
              </h3>

              {loading ? (
                <div className="flex justify-center py-10">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-10 text-base-content/40">
                  No students registered under your school yet.
                </div>
              ) : (
                <div className="overflow-x-auto text-sm">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Class / Standard</th>
                        <th>Educational Details</th>
                        <th className="text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s) => (
                        <tr key={s._id}>
                          <td className="font-bold">
                            <div>{s.name}</div>
                            <div className="text-xs text-base-content/50 font-normal">{s.email}</div>
                          </td>
                          <td>
                            {s.classNumber ? `Class ${s.classNumber}` : "N/A"}
                          </td>
                          <td>
                            <div className="space-y-1">
                              {s.section && (
                                <div className="text-xs">
                                  <strong>Section:</strong> <span className="badge badge-xs badge-ghost">{s.section}</span>
                                </div>
                              )}
                              {s.stream && (
                                <div className="text-xs">
                                  <strong>Stream:</strong> <span className="badge badge-xs badge-accent">{s.stream}</span>
                                </div>
                              )}
                              {s.medium && (
                                <div className="text-xs">
                                  <strong>Medium:</strong> <span className="capitalize">{s.medium}</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="text-right">
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => viewDetails(s)}
                            >
                              View Profile
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

        {/* Right Details Panel */}
        <div className="lg:col-span-1">
          {selectedStudentData ? (
            <div className="card bg-base-100 shadow border border-base-300">
              <div className="card-body p-6 space-y-6">
                <div className="text-center border-b pb-4">
                  <div className="avatar placeholder mb-3">
                    <div className="bg-primary text-primary-content rounded-full w-16">
                      <span className="text-xl font-bold">{selectedStudentData.name[0]}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-secondary">{selectedStudentData.name}</h3>
                  <p className="text-xs text-base-content/65">{selectedStudentData.email}</p>
                </div>

                {/* Educational Details */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-base-content/40 flex items-center gap-1.5">
                    <GraduationCap size={16} /> Education Details
                  </h4>
                  <div className="p-3 bg-base-200 rounded-xl space-y-1 text-xs">
                    <p><strong>Section:</strong> {selectedStudentData.section || "N/A"}</p>
                    {selectedStudentData.stream && <p><strong>Stream:</strong> {selectedStudentData.stream}</p>}
                    <p><strong>Class:</strong> {selectedStudentData.classNumber ? `Class ${selectedStudentData.classNumber}` : "N/A"}</p>
                    <p><strong>Medium:</strong> {selectedStudentData.medium ? selectedStudentData.medium.toUpperCase() : "N/A"}</p>
                    <p><strong>Account Level:</strong> {selectedStudentData.isPremium ? "👑 Premium" : "Standard"}</p>
                  </div>
                </div>

                {/* Achievements */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-base-content/40 flex items-center gap-1.5">
                    <Award size={16} /> Achievements
                  </h4>
                  {achievements.length > 0 ? (
                    <div className="space-y-2 max-h-28 overflow-y-auto pr-1">
                      {achievements.map((a) => (
                        <div key={a._id} className="p-2 bg-amber-50 border border-amber-200 text-amber-950 rounded-lg text-xs">
                          <strong>{a.title}</strong>
                          <span className="block text-[10px] opacity-60">{a.date ? new Date(a.date).toLocaleDateString() : ""}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-base-content/40 italic pl-1">No achievements registered yet.</p>
                  )}
                </div>

                {/* Academic Records */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-base-content/40 flex items-center gap-1.5">
                    <BookOpen size={16} /> Term Academic Records
                  </h4>
                  {records.length > 0 ? (
                    <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                      {records.map((r) => (
                        <div key={r._id} className="p-2 bg-blue-50 border border-blue-200 text-blue-950 rounded-lg text-xs">
                          <div className="flex justify-between">
                            <strong>{r.subject}</strong>
                            <span className="badge badge-sm badge-info font-bold">{r.score} Marks</span>
                          </div>
                          <span className="block text-[10px] opacity-65">Term: {r.term || "Regular"}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-base-content/40 italic pl-1">No academic records available.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="card bg-base-100 shadow border border-base-300 p-8 text-center text-base-content/40 flex flex-col justify-center items-center h-48">
              <UserIcon size={36} className="opacity-50 mb-2" />
              <span>Select a student to view complete academic profile & records.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
