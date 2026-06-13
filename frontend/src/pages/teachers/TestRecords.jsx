import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { useUser } from "../../context/UserContext";
import { Trophy, TrendingUp, Download } from "lucide-react";

const TeacherTestRecords = () => {
  const { user } = useUser();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterClass, setFilterClass] = useState("");
  const [filterTest, setFilterTest] = useState("");

  useEffect(() => {
    if (!user) return;
    api.get("/tests/all-records")
      .then((res) => setRecords(res.data.data || []))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  }, [user]);

  // Unique classes and tests for filter
  const uniqueClasses = [...new Set(records.map((r) => r.studentId?.classNumber).filter(Boolean))].sort();
  const uniqueTests = [...new Set(records.map((r) => r.testId?.title).filter(Boolean))];

  const filtered = records.filter((r) => {
    if (filterClass && r.studentId?.classNumber !== filterClass) return false;
    if (filterTest && r.testId?.title !== filterTest) return false;
    return true;
  });

  // Summary stats
  const totalStudents = new Set(filtered.map((r) => r.studentId?._id)).size;
  const avgScore = filtered.length
    ? Math.round(filtered.reduce((s, r) => s + (r.percentage || 0), 0) / filtered.length)
    : 0;
  const passRate = filtered.length
    ? Math.round((filtered.filter((r) => r.percentage >= 50).length / filtered.length) * 100)
    : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 pb-24 lg:pb-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Trophy className="text-warning" size={28} /> Test Records
        </h1>
        <p className="text-base-content/60 mt-1">
          View all student test performances across your school
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card bg-primary/10 shadow-sm">
          <div className="card-body p-3 text-center">
            <p className="text-2xl font-bold text-primary">{filtered.length}</p>
            <p className="text-xs">Total Attempts</p>
          </div>
        </div>
        <div className="card bg-secondary/10 shadow-sm">
          <div className="card-body p-3 text-center">
            <p className="text-2xl font-bold text-secondary">{totalStudents}</p>
            <p className="text-xs">Students</p>
          </div>
        </div>
        <div className="card bg-accent/10 shadow-sm">
          <div className="card-body p-3 text-center">
            <p className="text-2xl font-bold text-accent">{avgScore}%</p>
            <p className="text-xs">Avg Score</p>
          </div>
        </div>
        <div className="card bg-success/10 shadow-sm">
          <div className="card-body p-3 text-center">
            <p className="text-2xl font-bold text-success">{passRate}%</p>
            <p className="text-xs">Pass Rate</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select className="select select-bordered select-sm" value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
          <option value="">All Classes</option>
          {uniqueClasses.map((c) => <option key={c} value={c}>Class {c}</option>)}
        </select>
        <select className="select select-bordered select-sm" value={filterTest} onChange={(e) => setFilterTest(e.target.value)}>
          <option value="">All Tests</option>
          {uniqueTests.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        {(filterClass || filterTest) && (
          <button className="btn btn-ghost btn-sm" onClick={() => { setFilterClass(""); setFilterTest(""); }}>
            Clear Filters
          </button>
        )}
      </div>

      {/* Records Table */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          {filtered.length === 0 ? (
            <p className="text-base-content/50 text-center py-4">No records found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Student</th>
                    <th>Class</th>
                    <th>Test</th>
                    <th>Subject</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, idx) => (
                    <tr key={r._id || idx}>
                      <td>{idx + 1}</td>
                      <td className="font-medium">{r.studentId?.name || "Unknown"}</td>
                      <td>{r.studentId?.classNumber || "—"}</td>
                      <td>{r.testId?.title || "—"}</td>
                      <td>{r.testId?.subject || "—"}</td>
                      <td>{r.score}/{r.totalQuestions}</td>
                      <td>
                        <span className={`badge badge-sm ${r.percentage >= 75 ? "badge-success" : r.percentage >= 50 ? "badge-warning" : "badge-error"}`}>
                          {r.percentage}%
                        </span>
                      </td>
                      <td className="text-xs">{new Date(r.createdAt).toLocaleDateString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherTestRecords;
