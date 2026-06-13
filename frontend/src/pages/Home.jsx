import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LogIn, UserPlus, Building2, Compass } from "lucide-react";
import logo from "../assets/edunest-logo.png";

const Home = () => {
  const [institutions, setInstitutions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/api/eduNest/institutions/approved")
      .then(res => res.json())
      .then(data => setInstitutions(Array.isArray(data) ? data : []))
      .catch(() => setInstitutions([]));
  }, []);

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center py-12 px-4">
      <div className="text-center max-w-4xl w-full">
        {/* Logo */}
        <div className="flex items-center justify-center mb-4 mt-6">
          <img src={logo} alt="EduNest" className="h-24" />
        </div>
        <p className="text-xl text-base-content/70 max-w-2xl mx-auto mb-10">
          Your one-stop solution for all educational needs. Connect schools, colleges, and coaching centers with teachers and students seamlessly.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <Link to="/login">
            <button className="btn btn-primary btn-md gap-2 shadow font-bold">
              <LogIn size={18} /> Login
            </button>
          </Link>
          <Link to="/registerUser">
            <button className="btn btn-secondary btn-md gap-2 shadow font-bold">
              <UserPlus size={18} /> User Registration
            </button>
          </Link>
          <Link to="/registerInstitute">
            <button className="btn btn-accent btn-md gap-2 shadow font-bold">
              <Building2 size={18} /> Institution Registration
            </button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="card bg-base-100 shadow border border-base-200 hover:scale-[1.02] transition-transform duration-300">
            <div className="card-body items-center text-center p-6">
              <span className="text-4xl">🏫</span>
              <h3 className="card-title text-base font-bold">School Management</h3>
              <p className="text-xs text-base-content/60">Configure sections, streams, and manage teacher classroom allocations</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow border border-base-200 hover:scale-[1.02] transition-transform duration-300">
            <div className="card-body items-center text-center p-6">
              <span className="text-4xl">📝</span>
              <h3 className="card-title text-base font-bold">Tests & Materials</h3>
              <p className="text-xs text-base-content/60">Tutors upload PDFs and video lectures directly to classroom folders</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow border border-base-200 hover:scale-[1.02] transition-transform duration-300">
            <div className="card-body items-center text-center p-6">
              <span className="text-4xl">👑</span>
              <h3 className="card-title text-base font-bold">Premium Session</h3>
              <p className="text-xs text-base-content/60">Compare study resources and notes of the same standard across schools</p>
            </div>
          </div>
        </div>

        {/* Discover Directory */}
        <div className="mt-16 text-left max-w-3xl mx-auto">
          <h3 className="text-2xl font-black text-center mb-8 text-secondary flex items-center justify-center gap-2">
            <Compass className="animate-spin-slow text-primary" size={24} /> Discover Active Institutions
          </h3>
          
          {institutions.length === 0 ? (
            <div className="alert bg-base-100 border text-center p-6 rounded-2xl max-w-md mx-auto text-base-content/40">
              No approved institutions registered yet. Be the first to register a school!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {institutions.map(inst => (
                <div key={inst._id} className="card bg-base-100 shadow-md border border-base-200 hover:scale-[1.02] transition-all duration-300">
                  <div className="card-body p-5 space-y-3 justify-between">
                    <div className="space-y-1">
                      <span className="badge badge-primary uppercase font-bold text-[9px] tracking-wider">{inst.type}</span>
                      <h4 className="font-extrabold text-lg line-clamp-1">{inst.name}</h4>
                      <p className="text-xs text-base-content/55 line-clamp-1">📍 {inst.address || "Address not specified"}</p>
                    </div>
                    <div className="card-actions justify-end pt-2 border-t border-base-200">
                      <Link to={`/school/public/${inst._id}`} className="btn btn-outline btn-secondary btn-xs font-bold">
                        Visit Public Portal
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="mt-16 text-sm text-base-content/40">
          © {new Date().getFullYear()} EduNest · Empowering Education
        </p>
      </div>
    </div>
  );
};

export default Home;