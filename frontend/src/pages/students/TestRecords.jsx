import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { useUser } from "../../context/UserContext";
import { Trophy, TrendingUp, Medal } from "lucide-react";

const StudentTestRecords = () => {
  const { user } = useUser();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("my"); // "my" or "class"

  useEffect(() => {
    if (!user) return;
    api.get("/tests/all-records")
      .then((res) => setRecords(res.data.data || []))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  }, [user]);

  const myRecords = records.filter(
    (r) => r.studentId?._id === user?._id || r.studentId === user?._id
  );

  const classRecords = records.filter(
    (r) => r.studentId?.classNumber === user?.classNumber
  );

  const displayRecords = view === "my" ? myRecords : classRecords;

  // Class leaderboard
  const leaderboard = {};
  classRecords.forEach((r) => {
    const name = r.studentId?.name || "Unknown";
    const id = r.studentId?._id || r.studentId;
    if (!leaderboard[id]) {
      leaderboard[id] = { name, totalScore: 0, totalTests: 0, totalPercentage: 0 };
    }
    leaderboard[id].totalScore += r.score || 0;
    leaderboard[id].totalTests += 1;
    leaderboard[id].totalPercentage += r.percentage || 0;
  });
  const sortedLeaderboard = Object.values(leaderboard)
    .map((l) => ({ ...l, avgPercentage: Math.round(l.totalPercentage / l.totalTests) }))
    .sort((a, b) => b.avgPercentage - a.avgPercentage)
    .slice(0, 10);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24 lg:pb-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Trophy className="text-warning" size={28} /> Test Records
        </h1>
        <p className="text-base-content/60 mt-1">
          Track your performance and compare with classmates
        </p>
      </div>

      {/* Tab Selector */}
      <div className="tabs tabs-boxed bg-base-200 inline-flex">
        <button
          className={`tab ${view === "my" ? "tab-active" : ""}`}
          onClick={() => setView("my")}
        >
          📊 My Records
        </button>
        <button
          className={`tab ${view === "class" ? "tab-active" : ""}`}
          onClick={() => setView("class")}
        >
          🏆 Class Records
        </button>
        <button
          className={`tab ${view === "leaderboard" ? "tab-active" : ""}`}
          onClick={() => setView("leaderboard")}
        >
          🥇 Leaderboard
        </button>
      </div>

      {/* Leaderboard */}
      {view === "leaderboard" && (
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Medal className="text-warning" /> Class Leaderboard
            </h2>
            {sortedLeaderboard.length === 0 ? (
              <p className="text-base-content/50">No records yet.</p>
            ) : (
              <div className="space-y-2 mt-2">
                {sortedLeaderboard.map((s, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-xl transition ${
                      idx === 0
                        ? "bg-warning/10 border border-warning/30"
                        : idx === 1
                        ? "bg-base-200"
                        : idx === 2
                        ? "bg-accent/5"
                        : "bg-base-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold w-8 text-center">
                        {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                      </span>
                      <div>
                        <p className="font-medium">{s.name}</p>
                        <p className="text-xs text-base-content/50">
                          {s.totalTests} tests taken
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <progress
                        className={`progress w-20 ${
                          s.avgPercentage >= 75
                            ? "progress-success"
                            : s.avgPercentage >= 50
                            ? "progress-warning"
                            : "progress-error"
                        }`}
                        value={s.avgPercentage}
                        max="100"
                      ></progress>
                      <span className="font-semibold text-sm">{s.avgPercentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Records Table */}
      {(view === "my" || view === "class") && (
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <TrendingUp className="text-primary" />{" "}
              {view === "my" ? "My Test Scores" : "Class Test Scores"}
            </h2>
            {displayRecords.length === 0 ? (
              <p className="text-base-content/50 py-4">No test records found.</p>
            ) : (
              <div className="overflow-x-auto mt-2">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>#</th>
                      {view === "class" && <th>Student</th>}
                      <th>Test</th>
                      <th>Subject</th>
                      <th>Score</th>
                      <th>Percentage</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayRecords.map((r, idx) => (
                      <tr key={r._id || idx}>
                        <td>{idx + 1}</td>
                        {view === "class" && (
                          <td className="font-medium">
                            {r.studentId?.name || "Unknown"}
                          </td>
                        )}
                        <td>{r.testId?.title || "Untitled"}</td>
                        <td>{r.testId?.subject || "—"}</td>
                        <td>
                          {r.score}/{r.totalQuestions}
                        </td>
                        <td>
                          <span
                            className={`badge badge-sm ${
                              r.percentage >= 75
                                ? "badge-success"
                                : r.percentage >= 50
                                ? "badge-warning"
                                : "badge-error"
                            }`}
                          >
                            {r.percentage}%
                          </span>
                        </td>
                        <td className="text-xs">
                          {new Date(r.createdAt).toLocaleDateString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTestRecords;
