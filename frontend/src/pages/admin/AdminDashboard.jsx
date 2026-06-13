import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { Users, Building2, FileText, ClipboardCheck, Clock, CheckCircle } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/stats")
      .then(res => setStats(res.data.data))
      .catch(err => console.error("Stats error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const cards = [
    { label: "Total Students", value: stats?.totalStudents || 0, icon: <Users size={32} />, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Total Teachers", value: stats?.totalTeachers || 0, icon: <Users size={32} />, color: "text-green-500", bg: "bg-green-50" },
    { label: "Total Institutions", value: stats?.totalInstitutions || 0, icon: <Building2 size={32} />, color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Pending Approvals", value: stats?.pendingInstitutions || 0, icon: <Clock size={32} />, color: "text-yellow-500", bg: "bg-yellow-50" },
    { label: "Approved Institutions", value: stats?.approvedInstitutions || 0, icon: <CheckCircle size={32} />, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Total Tests", value: stats?.totalTests || 0, icon: <FileText size={32} />, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Test Submissions", value: stats?.totalSubmissions || 0, icon: <ClipboardCheck size={32} />, color: "text-rose-500", bg: "bg-rose-50" },
  ];

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-2">📊 Admin Dashboard</h1>
        <p className="text-base-content/60 mb-8">Overview of the entire EduNest platform</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <div key={idx} className={`card ${card.bg} shadow-md hover:shadow-lg transition-shadow`}>
              <div className="card-body">
                <div className={`${card.color} mb-2`}>{card.icon}</div>
                <h2 className="text-3xl font-bold">{card.value}</h2>
                <p className="text-base-content/70 text-sm">{card.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
