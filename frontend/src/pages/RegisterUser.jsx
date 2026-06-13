import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export default function Register() {
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    classNumber: "",
    schoolId: "",
    role: "",
    subjects: [],
    standards: [],
    medium: "",
    board: "",
    branch: ""
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMultiSelect = (e) => {
    const { name, selectedOptions } = e.target;
    const values = Array.from(selectedOptions, option => option.value);
    setForm(prev => ({ ...prev, [name]: values }));
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setRole(newRole);
    setForm(prev => ({
      ...prev,
      role: newRole,
      classNumber: "",
      subjects: [],
      standards: [],
      medium: "",
      board: "",
      branch: ""
    }));
  };

  // Fetch approved institutions
  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/eduNest/institutions/approved");
        const data = await res.json();
        const instList = Array.isArray(data) ? data : [];
        setInstitutions(instList);

        // Pre-fill fields from query params
        const qSchoolId = searchParams.get("schoolId");
        const qRole = searchParams.get("role");

        if (qSchoolId) {
          const matched = instList.find(inst => inst._id === qSchoolId);
          if (matched) {
            setForm(prev => ({ 
              ...prev, 
              schoolId: qSchoolId, 
              role: qRole || prev.role || "" 
            }));
            if (qRole) {
              setRole(qRole);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch institutions:", error);
        setInstitutions([]);
      }
    };
    fetchInstitutions();
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setMessage("❌ Passwords do not match!");
      return;
    }
    setLoading(true);
    setMessage("");

    try {
      // Prepare data
      const formData = { ...form };
      if (!formData.schoolId) delete formData.schoolId;
      if (!formData.contactNumber) delete formData.contactNumber;
      delete formData.confirmPassword;
      
      if (formData.role !== "student") delete formData.classNumber;
      if (formData.role !== "teacher") {
        delete formData.subjects;
        delete formData.standards;
      }

      // Cleanup and auto-assign board for backward compatibility
      if (selectedInstType === "school") {
        delete formData.branch;
        if (formData.section === "Secondary") {
          formData.board = "SSC";
        } else if (formData.section === "Higher Secondary") {
          formData.board = "HSC";
        } else {
          delete formData.board;
        }
        if (formData.section !== "Higher Secondary") {
          delete formData.stream;
        }
      } else if (selectedInstType === "college") {
        delete formData.medium;
        delete formData.board;
        delete formData.section;
        delete formData.stream;
      } else if (selectedInstType === "coachingCenter") {
        delete formData.board;
        delete formData.section;
        delete formData.stream;
      }

      const response = await fetch("http://localhost:5001/api/eduNest/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      let data;
      try {
        data = await response.json();
      } catch (err) {
        data = { message: "Invalid JSON from server." };
      }

      if (!response.ok) {
        setMessage(data.message || data.error || "❌ Registration failed.");
      } else {
        setMessage("✅ Registered successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (error) {
      setMessage("❌ Server error. Please make sure the backend is running.");
      console.error("Register error:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedInst = institutions.find(inst => inst._id === form.schoolId);
  const selectedInstType = selectedInst ? selectedInst.type : "";

  const getTeacherStandardOptions = () => {
    if (selectedInst && selectedInstType === "school") {
      const options = [];
      const sections = selectedInst.sections && selectedInst.sections.length > 0
        ? selectedInst.sections
        : ["Primary", "Middle", "Secondary", "Higher Secondary"];

      if (sections.includes("Primary")) {
        options.push(...["1", "2", "3", "4", "5"]);
      }
      if (sections.includes("Middle")) {
        options.push(...["6", "7", "8"]);
      }
      if (sections.includes("Secondary")) {
        options.push(...["9", "10"]);
      }
      if (sections.includes("Higher Secondary")) {
        options.push(...["11", "12"]);
      }
      return options;
    } else if (selectedInst && selectedInstType === "college") {
      return ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8"];
    } else {
      return ["1","2","3","4","5","6","7","8","9","10","11","12", "Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8"];
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-10">
      <form onSubmit={handleSubmit} className="max-w-xl w-full p-6 bg-base-100 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center mb-2">👤 Register User</h1>
        <p className="text-center text-base-content/60 mb-6">Create your account based on role</p>

        {/* Role Selection */}
        <div className="mb-4">
          <label className="label"><span className="label-text font-semibold">Register As *</span></label>
          <select className="select select-bordered w-full" value={role} onChange={handleRoleChange} required>
            <option value="">Select role</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="institute">Institute Admin (Owner)</option>
            <option value="admin">App Admin</option>
          </select>
        </div>

        {role && (
          <>
            {/* Common Fields */}
            <div className="mb-4">
              <label className="label"><span className="label-text">Full Name *</span></label>
              <input type="text" name="name" className="input input-bordered w-full" placeholder="Enter Full Name" value={form.name} onChange={handleChange} required />
            </div>

            <div className="mb-4">
              <label className="label"><span className="label-text">Email Address *</span></label>
              <input type="email" name="email" className="input input-bordered w-full" placeholder="name@domain.com" value={form.email} onChange={handleChange} required />
            </div>

            <div className="mb-4">
              <label className="label"><span className="label-text">Password *</span></label>
              <input type="password" name="password" className="input input-bordered w-full" placeholder="Password" value={form.password} onChange={handleChange} required />
            </div>

            <div className="mb-4">
              <label className="label"><span className="label-text">Confirm Password *</span></label>
              <input type="password" name="confirmPassword" className="input input-bordered w-full" placeholder="Re-enter Password" value={form.confirmPassword} onChange={handleChange} required />
            </div>

            <div className="mb-4">
              <label className="label"><span className="label-text">Contact Number *</span></label>
              <input type="tel" name="contactNumber" className="input input-bordered w-full" placeholder="Contact number" value={form.contactNumber} onChange={handleChange} required />
            </div>

            {/* Institution Selection for Student, Teacher, and Institute Owners */}
            {role !== "admin" && (
              <div className="mb-4">
                <label className="label"><span className="label-text font-semibold">Select Institution *</span></label>
                <select name="schoolId" className="select select-bordered w-full" value={form.schoolId} onChange={handleChange} required>
                  <option value="">Select School, College or Coaching Center</option>
                  {institutions.map((inst) => (
                    <option key={inst._id} value={inst._id}>{inst.name} ({inst.type})</option>
                  ))}
                </select>
                {institutions.length === 0 && (
                  <p className="text-xs text-warning mt-1">No approved institutions found. Register an institution first.</p>
                )}
              </div>
            )}

            {/* Dynamic Educational Fields based on selected Institution type */}
            {role !== "admin" && selectedInst && (
              <div className="p-4 bg-base-200 rounded-lg mb-4 border border-base-300">
                <h3 className="text-sm font-bold uppercase tracking-wider text-base-content/70 mb-3">
                  🏫 {selectedInst.name} Configuration ({selectedInst.type})
                </h3>

                {/* SCHOOL FIELDS */}
                {selectedInstType === "school" && (
                  <>
                    <div className="mb-3">
                      <label className="label"><span className="label-text">Select Medium *</span></label>
                      <select name="medium" className="select select-bordered w-full" value={form.medium} onChange={handleChange} required>
                        <option value="">Choose Medium</option>
                        {(selectedInst.mediums && selectedInst.mediums.length > 0 ? selectedInst.mediums : ["english", "gujarati"]).map(med => (
                          <option key={med} value={med}>{med === "english" ? "English Medium" : "Gujarati Medium"}</option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="label"><span className="label-text">Select Section *</span></label>
                      <select name="section" className="select select-bordered w-full" value={form.section} onChange={(e) => {
                        handleChange(e);
                        setForm(prev => ({ ...prev, section: e.target.value, stream: "", classNumber: "" }));
                      }} required>
                        <option value="">Choose Section</option>
                        {(selectedInst.sections && selectedInst.sections.length > 0 ? selectedInst.sections : ["Primary", "Middle", "Secondary", "Higher Secondary"]).map(sec => (
                          <option key={sec} value={sec}>{sec} {sec === "Primary" ? "(Class 1-5)" : sec === "Middle" ? "(Class 6-8)" : sec === "Secondary" ? "(Class 9-10)" : "(Class 11-12)"}</option>
                        ))}
                      </select>
                    </div>

                    {form.section === "Higher Secondary" && (
                      <div className="mb-3">
                        <label className="label"><span className="label-text">Select Stream *</span></label>
                        <select name="stream" className="select select-bordered w-full" value={form.stream} onChange={handleChange} required>
                          <option value="">Choose Stream</option>
                          {(selectedInst.streams && selectedInst.streams.length > 0 ? selectedInst.streams : ["Science", "Commerce", "Arts"]).map(strm => (
                            <option key={strm} value={strm}>{strm}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {role === "student" && (
                      <div className="mb-3">
                        <label className="label"><span className="label-text">Select Standard *</span></label>
                        <select name="classNumber" className="select select-bordered w-full" value={form.classNumber} onChange={handleChange} required disabled={!form.section}>
                          <option value="">Choose Class</option>
                          {form.section === "Primary" && ["1", "2", "3", "4", "5"].map(std => <option key={std} value={std}>Class {std}</option>)}
                          {form.section === "Middle" && ["6", "7", "8"].map(std => <option key={std} value={std}>Class {std}</option>)}
                          {form.section === "Secondary" && ["9", "10"].map(std => <option key={std} value={std}>Class {std} (SSC)</option>)}
                          {form.section === "Higher Secondary" && ["11", "12"].map(std => <option key={std} value={std}>Class {std} (HSC)</option>)}
                        </select>
                        {!form.section && <p className="text-xs text-warning mt-1">Please choose a section first</p>}
                      </div>
                    )}
                  </>
                )}

                {/* COLLEGE FIELDS */}
                {selectedInstType === "college" && (
                  <>
                    <div className="mb-3">
                      <label className="label"><span className="label-text">Select Branch/Field *</span></label>
                      <select name="branch" className="select select-bordered w-full" value={form.branch} onChange={handleChange} required>
                        <option value="">Choose Branch</option>
                        {(selectedInst.branches && selectedInst.branches.length > 0 ? selectedInst.branches : ["IT", "COM", "EC", "CE"]).map(br => (
                          <option key={br} value={br}>{br}</option>
                        ))}
                      </select>
                    </div>

                    {role === "student" && (
                      <div className="mb-3">
                        <label className="label"><span className="label-text">Select Semester *</span></label>
                        <select name="classNumber" className="select select-bordered w-full" value={form.classNumber} onChange={handleChange} required>
                          <option value="">Choose Semester</option>
                          {["Semester 1","Semester 2","Semester 3","Semester 4","Semester 5","Semester 6","Semester 7","Semester 8"].map(sem => (
                            <option key={sem} value={sem}>{sem}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </>
                )}

                {/* COACHING FIELDS */}
                {selectedInstType === "coachingCenter" && (
                  <>
                    <div className="mb-3">
                      <label className="label"><span className="label-text">Select Coaching Category/Target *</span></label>
                      <select name="branch" className="select select-bordered w-full" value={form.branch} onChange={handleChange} required>
                        <option value="">Choose Category</option>
                        <option value="School Coaching (SSC/HSC)">School Coaching (SSC/HSC)</option>
                        <option value="College Coaching (Engineering/IT)">College Coaching (Engineering/IT)</option>
                        <option value="Competitive Exam (JEE/NEET)">Competitive Exam (JEE/NEET)</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="label"><span className="label-text">Medium *</span></label>
                      <select name="medium" className="select select-bordered w-full" value={form.medium} onChange={handleChange} required>
                        <option value="">Choose Medium</option>
                        <option value="english">English Medium</option>
                        <option value="gujarati">Gujarati Medium</option>
                      </select>
                    </div>

                    {role === "student" && (
                      <div className="mb-3">
                        <label className="label"><span className="label-text">Target Class/Semester *</span></label>
                        <input type="text" name="classNumber" className="input input-bordered w-full" placeholder="e.g. Class 10, Semester 4" value={form.classNumber} onChange={handleChange} required />
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Teacher Specific Fields */}
            {role === "teacher" && (
              <>
                <div className="mb-4">
                  <label className="label"><span className="label-text font-semibold">Subjects Taught * (hold Ctrl to select multiple)</span></label>
                  <select name="subjects" multiple className="select select-bordered w-full h-32" value={form.subjects} onChange={handleMultiSelect} required>
                    {["Math", "Science", "English", "Social Studies", "Hindi", "Computer Science", "Programming", "Electronics"].map(subj => (
                      <option key={subj} value={subj}>{subj}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="label"><span className="label-text font-semibold">Standards/Semesters Taught * (hold Ctrl to select multiple)</span></label>
                  <select name="standards" multiple className="select select-bordered w-full h-32" value={form.standards} onChange={handleMultiSelect} required>
                    {getTeacherStandardOptions().map(std => (
                      <option key={std} value={std}>{std.includes("Semester") ? std : `Class ${std}`}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </>
        )}

        {/* Message */}
        {message && (
          <div className={`alert mt-4 ${message.startsWith("✅") ? "alert-success" : "alert-error"}`}>
            <span>{message}</span>
          </div>
        )}

        {/* Submit Button */}
        {role && (
          <button type="submit" className="btn btn-primary w-full mt-4" disabled={loading}>
            {loading ? <span className="loading loading-spinner loading-sm"></span> : "Register"}
          </button>
        )}

        <p className="text-center text-sm mt-4">
          Already registered?{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">Login here</Link>
        </p>
      </form>
    </div>
  );
}
