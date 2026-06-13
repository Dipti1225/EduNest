import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { useUser } from "../../context/UserContext";
import { Clock, CheckCircle, AlertTriangle, BookOpen } from "lucide-react";

const StudentHomework = () => {
  const { user } = useUser();
  const [homework, setHomework] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user?.classNumber) {
      setLoading(false);
      return;
    }
    api.get(`/homework/class/${user.classNumber}`)
      .then((res) => setHomework(res.data.data || []))
      .catch(() => setHomework([]))
      .finally(() => setLoading(false));
  }, [user]);

  const markComplete = async (id) => {
    try {
      await api.put(`/homework/complete/${id}`);
      setHomework((prev) =>
        prev.map((hw) => (hw._id === id ? { ...hw, status: "completed" } : hw))
      );
    } catch {
      alert("Failed to update");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <span className="badge badge-success gap-1 text-xs">
            <CheckCircle size={12} /> Completed
          </span>
        );
      case "overdue":
        return (
          <span className="badge badge-error gap-1 text-xs">
            <AlertTriangle size={12} /> Overdue
          </span>
        );
      default:
        return (
          <span className="badge badge-info gap-1 text-xs">
            <Clock size={12} /> Active
          </span>
        );
    }
  };

  const filteredHomework = homework.filter((hw) => {
    if (filter === "all") return true;
    return hw.status === filter;
  });

  const stats = {
    total: homework.length,
    active: homework.filter((h) => h.status === "active").length,
    completed: homework.filter((h) => h.status === "completed").length,
    overdue: homework.filter((h) => h.status === "overdue").length,
  };

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
          <BookOpen className="text-primary" size={28} /> My Homework
        </h1>
        <p className="text-base-content/60 mt-1">
          Stay on top of your assignments and deadlines
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body p-3 text-center">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-base-content/60">Total</p>
          </div>
        </div>
        <div className="card bg-info/10 shadow-sm border border-info/20">
          <div className="card-body p-3 text-center">
            <p className="text-2xl font-bold text-info">{stats.active}</p>
            <p className="text-xs text-info/80">Active</p>
          </div>
        </div>
        <div className="card bg-success/10 shadow-sm border border-success/20">
          <div className="card-body p-3 text-center">
            <p className="text-2xl font-bold text-success">{stats.completed}</p>
            <p className="text-xs text-success/80">Done</p>
          </div>
        </div>
        <div className="card bg-error/10 shadow-sm border border-error/20">
          <div className="card-body p-3 text-center">
            <p className="text-2xl font-bold text-error">{stats.overdue}</p>
            <p className="text-xs text-error/80">Overdue</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {["all", "active", "completed", "overdue"].map((f) => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-outline"}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Homework List */}
      <div className="space-y-3">
        {filteredHomework.length === 0 && (
          <p className="text-base-content/50 text-center py-8">
            No homework found for this filter.
          </p>
        )}
        {filteredHomework.map((hw) => (
          <div
            key={hw._id}
            className="card bg-base-100 shadow-sm hover:shadow-md transition border border-base-200"
          >
            <div className="card-body p-4">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{hw.title}</h3>
                  <p className="text-sm text-base-content/60 mt-1">{hw.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2 text-xs">
                    <span className="badge badge-outline">{hw.subject}</span>
                    <span className="text-base-content/50">
                      Due: {new Date(hw.dueDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    {hw.createdBy?.name && (
                      <span className="text-base-content/50">
                        by {hw.createdBy.name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(hw.status)}
                  {hw.status === "active" && (
                    <button
                      onClick={() => markComplete(hw._id)}
                      className="btn btn-success btn-xs gap-1"
                    >
                      <CheckCircle size={12} /> Mark Done
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentHomework;
