import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { useUser } from "../../context/UserContext";

const Dashboard = () => {
  const { user } = useUser();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState("Test Scores");

  useEffect(() => {
    if (!user) return;
    api.get("/tests/my-submissions")
      .then(res => setSubmissions(res.data.data || []))
      .catch(() => setSubmissions([]))
      .finally(() => setLoading(false));
  }, [user]);

  const overallProgress = submissions.length
    ? Math.round(submissions.reduce((sum, s) => sum + (s.percentage || 0), 0) / submissions.length)
    : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">📊 Student Dashboard</h1>
      <p className="text-base-content/60">Welcome, {user?.name}! Here's your academic overview.</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card bg-primary text-primary-content shadow-md">
          <div className="card-body">
            <h2 className="text-4xl font-bold">{submissions.length}</h2>
            <p>Tests Completed</p>
          </div>
        </div>
        <div className="card bg-secondary text-secondary-content shadow-md">
          <div className="card-body">
            <h2 className="text-4xl font-bold">{overallProgress}%</h2>
            <p>Average Score</p>
          </div>
        </div>
        <div className="card bg-accent text-accent-content shadow-md">
          <div className="card-body">
            <h2 className="text-4xl font-bold">{user?.classNumber || "—"}</h2>
            <p>Class / Standard</p>
          </div>
        </div>
      </div>

      {/* Section Selector */}
      <div className="flex items-center justify-between">
        <label className="font-medium">Select Section:</label>
        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className="select select-bordered w-60"
        >
          <option>Test Scores</option>
          <option>Progress Report</option>
        </select>
      </div>

      {/* Test Scores */}
      {selectedSection === "Test Scores" && (
        <div className="card bg-base-100 p-4 shadow-md">
          <h2 className="text-xl font-semibold mb-4">📝 Test Scores</h2>
          {submissions.length === 0 ? (
            <p className="text-base-content/50">No test submissions yet. Take a test to see your scores here.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Test</th>
                    <th>Subject</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub, idx) => (
                    <tr key={sub._id || idx}>
                      <td>{idx + 1}</td>
                      <td className="font-medium">{sub.testId?.title || "Untitled"}</td>
                      <td>{sub.testId?.subject || "—"}</td>
                      <td>{sub.score} / {sub.totalQuestions}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <progress className="progress progress-primary w-20" value={sub.percentage} max="100"></progress>
                          <span className="text-sm font-medium">{sub.percentage}%</span>
                        </div>
                      </td>
                      <td className="text-sm">{new Date(sub.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Progress Report */}
      {selectedSection === "Progress Report" && (
        <div className="card bg-base-100 p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">📈 Progress Report</h2>
          <div className="flex flex-col items-center">
            <div className="radial-progress text-primary text-2xl font-bold" style={{ "--value": overallProgress, "--size": "8rem" }} role="progressbar">
              {overallProgress}%
            </div>
            <p className="mt-4 text-base-content/60">Overall Average Score</p>
          </div>
          {submissions.length > 0 && (
            <div className="mt-6 space-y-2">
              {submissions.map((sub, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-base-200 rounded-lg">
                  <span className="font-medium">{sub.testId?.title || "Test"}</span>
                  <div className="flex items-center gap-2">
                    <progress className="progress progress-success w-32" value={sub.percentage} max="100"></progress>
                    <span className="text-sm">{sub.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
