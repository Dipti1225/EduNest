import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterInstitute() {
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    contactPerson: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    mediums: [],
    sections: [],
    streams: [],
    branches: []
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (field, value) => {
    setForm(prev => {
      const current = prev[field] || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setMessage("❌ Passwords do not match!");
      return;
    }
    setLoading(true);
    setMessage("");

    try {
      // Filter out fields based on type
      const payload = { ...form, type };
      delete payload.confirmPassword;
      if (type === "school") {
        delete payload.branches;
        // if Higher Secondary is not chosen, streams are irrelevant
        if (!payload.sections.includes("Higher Secondary")) {
          payload.streams = [];
        }
      } else if (type === "college") {
        delete payload.mediums;
        delete payload.sections;
        delete payload.streams;
      }

      const response = await fetch("http://localhost:5001/api/eduNest/institutions/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
        setMessage("✅ Registered successfully! Your institution is approved and ready.");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      setMessage("❌ Server error. Please make sure the backend is running.");
      console.error("Register error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-10">
      <form onSubmit={handleSubmit} className="max-w-xl w-full p-6 bg-base-100 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center mb-2">🏫 Register Institution</h1>
        <p className="text-center text-base-content/60 mb-6">Register your school, college, or coaching center</p>

        {/* Institution Type */}
        <div className="mb-4">
          <label className="label"><span className="label-text">Institution Type *</span></label>
          <select
            className="select select-bordered w-full"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="">Select Type</option>
            <option value="school">School</option>
            <option value="college">College</option>
            <option value="coachingCenter">Coaching Center</option>
          </select>
        </div>

        {/* Fields shown after type is selected */}
        {type && (
          <>
            <div className="mb-4">
              <label className="label"><span className="label-text">Institution Name *</span></label>
              <input type="text" name="name" className="input input-bordered w-full" placeholder="Enter Institution Name" value={form.name} onChange={handleChange} required />
            </div>

            <div className="mb-4">
              <label className="label"><span className="label-text">Email *</span></label>
              <input type="email" name="email" className="input input-bordered w-full" placeholder="Enter Email" value={form.email} onChange={handleChange} required />
            </div>

            <div className="mb-4">
              <label className="label"><span className="label-text">Contact Person *</span></label>
              <input type="text" name="contactPerson" className="input input-bordered w-full" placeholder="Contact Person Name" value={form.contactPerson} onChange={handleChange} required />
            </div>

            <div className="mb-4">
              <label className="label"><span className="label-text">Phone Number *</span></label>
              <input type="tel" name="phone" className="input input-bordered w-full" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />
            </div>

            <div className="mb-4">
              <label className="label"><span className="label-text">Address</span></label>
              <input type="text" name="address" className="input input-bordered w-full" placeholder="Address" value={form.address} onChange={handleChange} />
            </div>

            <div className="mb-4">
              <label className="label"><span className="label-text">Password * (For School Owner/Admin Account)</span></label>
              <input type="password" name="password" className="input input-bordered w-full" placeholder="Enter Password" value={form.password} onChange={handleChange} required />
            </div>

            <div className="mb-4">
              <label className="label"><span className="label-text">Confirm Password *</span></label>
              <input type="password" name="confirmPassword" className="input input-bordered w-full" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required />
            </div>

            {/* School / Coaching - Medium & Section selection */}
            {(type === "school" || type === "coachingCenter") && (
              <>
                <div className="mb-4">
                  <label className="label font-semibold"><span className="label-text text-base">Select Mediums Offered *</span></label>
                  <div className="flex gap-4">
                    <label className="label cursor-pointer flex gap-2">
                      <input type="checkbox" className="checkbox checkbox-primary" checked={form.mediums.includes("english")} onChange={() => handleCheckboxChange("mediums", "english")} />
                      <span>English Medium</span>
                    </label>
                    <label className="label cursor-pointer flex gap-2">
                      <input type="checkbox" className="checkbox checkbox-primary" checked={form.mediums.includes("gujarati")} onChange={() => handleCheckboxChange("mediums", "gujarati")} />
                      <span>Gujarati Medium</span>
                    </label>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="label font-semibold"><span className="label-text text-base">Select School Sections *</span></label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="label cursor-pointer flex gap-2 justify-start">
                      <input type="checkbox" className="checkbox checkbox-secondary" checked={form.sections.includes("Primary")} onChange={() => handleCheckboxChange("sections", "Primary")} />
                      <span>Primary (Class 1-5)</span>
                    </label>
                    <label className="label cursor-pointer flex gap-2 justify-start">
                      <input type="checkbox" className="checkbox checkbox-secondary" checked={form.sections.includes("Middle")} onChange={() => handleCheckboxChange("sections", "Middle")} />
                      <span>Middle (Class 6-8)</span>
                    </label>
                    <label className="label cursor-pointer flex gap-2 justify-start">
                      <input type="checkbox" className="checkbox checkbox-secondary" checked={form.sections.includes("Secondary")} onChange={() => handleCheckboxChange("sections", "Secondary")} />
                      <span>Secondary (Class 9-10)</span>
                    </label>
                    <label className="label cursor-pointer flex gap-2 justify-start">
                      <input type="checkbox" className="checkbox checkbox-secondary" checked={form.sections.includes("Higher Secondary")} onChange={() => handleCheckboxChange("sections", "Higher Secondary")} />
                      <span>Higher Secondary (Class 11-12)</span>
                    </label>
                  </div>
                </div>

                {/* Streams - only if Higher Secondary is checked */}
                {form.sections.includes("Higher Secondary") && (
                  <div className="mb-4 p-3 bg-base-200 rounded-lg">
                    <label className="label font-semibold"><span className="label-text text-base">Select Streams Offered *</span></label>
                    <div className="flex gap-4">
                      {["Science", "Commerce", "Arts"].map(stream => (
                        <label key={stream} className="label cursor-pointer flex gap-2">
                          <input type="checkbox" className="checkbox checkbox-accent" checked={form.streams.includes(stream)} onChange={() => handleCheckboxChange("streams", stream)} />
                          <span>{stream}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* College / Coaching - Branches selection */}
            {(type === "college" || type === "coachingCenter") && (
              <div className="mb-4">
                <label className="label font-semibold"><span className="label-text text-base">Select Branches/Departments Offered *</span></label>
                <div className="grid grid-cols-2 gap-2">
                  {["IT", "COM", "EC", "CE"].map((branch) => (
                    <label key={branch} className="label cursor-pointer flex justify-start gap-2">
                      <input type="checkbox" className="checkbox checkbox-accent" checked={form.branches.includes(branch)} onChange={() => handleCheckboxChange("branches", branch)} />
                      <span>{branch === "COM" ? "Computer Science (COM)" : branch === "CE" ? "Computer Engineering (CE)" : branch === "EC" ? "Electronics & Comm. (EC)" : "Information Tech (IT)"}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {message && (
          <div className={`alert mt-4 ${message.startsWith("✅") ? "alert-success" : "alert-error"}`}>
            <span>{message}</span>
          </div>
        )}

        <button type="submit" className="btn btn-primary w-full mt-4" disabled={loading || !type}>
          {loading ? <span className="loading loading-spinner loading-sm"></span> : "Register Institution"}
        </button>

        <p className="text-center text-sm mt-4">
          Already registered?{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">Login here</Link>
        </p>
      </form>
    </div>
  );
}
