import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import api from "../../utils/api";

const SchoolHomePage = () => {
  const { user } = useUser();
  const [instDetails, setInstDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.schoolId) {
      api.get(`/institutions/${user.schoolId}`)
        .then(res => {
          setInstDetails(res.data);
        })
        .catch(err => {
          console.error("Error fetching institution details:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // Determine dynamic labels
  const instType = instDetails?.type || "school"; // default fallback
  const instName = instDetails?.name || "EduNest Institute";

  let welcomeTitle = "🏫 Welcome to Your School Dashboard";
  let teacherLabel = "👨‍🏫 Registered Teachers";
  let teacherDesc = "View and manage all teachers registered under your school.";
  let studentLabel = "🧑‍🎓 Class-wise Students";
  let studentDesc = "Track students registered by each class and monitor progress.";
  let activityLabel = "📚 Standard-wise Activities";
  let activityDesc = "Get updates on standard-wise activities and events.";

  if (instType === "college") {
    welcomeTitle = "🎓 Welcome to Your College Dashboard";
    teacherLabel = "👩‍🏫 Appointed Professors";
    teacherDesc = "View and manage all professors appointed in college departments.";
    studentLabel = "🧑‍🎓 Department & Semester Students";
    studentDesc = "Track college students by branch (IT, COM, EC, CE) and semester.";
    activityLabel = "🔬 Branch-wise Activities";
    activityDesc = "Track academic research and extra-curricular departmental activities.";
  } else if (instType === "coachingCenter") {
    welcomeTitle = "🏫 Welcome to Your Coaching Center Dashboard";
    teacherLabel = "👨‍🏫 Coaching Tutors";
    teacherDesc = "Manage tutors and coaching experts in the coaching institute.";
    studentLabel = "🧑‍🎓 Batch-wise Students";
    studentDesc = "Track students by batch times, subjects, and standards.";
    activityLabel = "📝 Coaching Updates & Tests";
    activityDesc = "Manage weekly test updates, revisions, and batch activities.";
  }

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4 sm:px-10">
      <div className="max-w-5xl mx-auto">
        {/* Welcome Header */}
        <div className="text-center mb-10 card bg-base-100 p-6 shadow border border-primary/20">
          <h1 className="text-4xl font-extrabold text-primary flex items-center justify-center gap-2">
            {welcomeTitle}
          </h1>
          <p className="text-xl font-semibold text-secondary mt-2">{instName}</p>
          <p className="text-sm text-base-content/50 mt-1">Address: {instDetails?.address || "Address not specified"}</p>
          <div className="flex gap-2 justify-center mt-3">
            <span className="badge badge-primary uppercase">{instType}</span>
            <span className="badge badge-accent">Owner: {instDetails?.contactPerson || user?.name}</span>
          </div>

          <div className="mt-4 p-2 bg-base-200 rounded-xl max-w-md mx-auto flex items-center justify-between gap-2 border border-base-300 text-xs">
            <span className="truncate font-mono select-all pl-1">
              {`http://localhost:5173/school/public/${user.schoolId}`}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`http://localhost:5173/school/public/${user.schoolId}`);
                alert("📋 Public link copied to clipboard!");
              }}
              className="btn btn-xs btn-primary font-bold whitespace-nowrap"
            >
              Copy Link
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Registered Teachers / Tutors */}
          <div className="card bg-base-100 shadow-xl border border-primary hover:scale-[1.02] transition-transform duration-300">
            <div className="card-body">
              <h2 className="card-title text-primary">{teacherLabel}</h2>
              <p>{teacherDesc}</p>
              <div className="card-actions justify-end mt-4">
                <Link to="/school/teachers" className="btn btn-primary btn-sm">
                  View Staff
                </Link>
              </div>
            </div>
          </div>

          {/* Students */}
          <div className="card bg-base-100 shadow-xl border border-secondary hover:scale-[1.02] transition-transform duration-300">
            <div className="card-body">
              <h2 className="card-title text-secondary">{studentLabel}</h2>
              <p>{studentDesc}</p>
              <div className="card-actions justify-end mt-4">
                <Link to="/school/students" className="btn btn-secondary btn-sm">
                  View Students
                </Link>
              </div>
            </div>
          </div>

          {/* Activities */}
          <div className="card bg-base-100 shadow-xl border border-accent hover:scale-[1.02] transition-transform duration-300">
            <div className="card-body">
              <h2 className="card-title text-accent">{activityLabel}</h2>
              <p>{activityDesc}</p>
              <div className="card-actions justify-end mt-4">
                <Link to="/school/activities" className="btn btn-accent btn-sm">
                  View Activities
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Optional Footer */}
        <div className="mt-12 text-center text-base-content/50 text-sm">
          EduNest Institute Panel · Real-world Educational Management System · © {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
};

export default SchoolHomePage;
