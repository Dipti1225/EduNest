import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { CheckCircle, XCircle, Trash2, Clock } from "lucide-react";

const ManageInstitutions = () => {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchInstitutions = () => {
    setLoading(true);
    const params = statusFilter ? { status: statusFilter } : {};
    api.get("/admin/institutions", { params })
      .then(res => setInstitutions(res.data.data))
      .catch(err => console.error("Fetch institutions error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchInstitutions(); }, [statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/institutions/${id}/status`, { status });
      setInstitutions(institutions.map(inst =>
        inst._id === id ? { ...inst, status } : inst
      ));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete institution "${name}"?`)) return;
    try {
      await api.delete(`/admin/institutions/${id}`);
      setInstitutions(institutions.filter(i => i._id !== id));
    } catch (err) {
      alert("Failed to delete institution");
    }
  };

  const statusBadge = (status) => {
    switch (status) {
      case "approved": return <span className="badge badge-success gap-1"><CheckCircle size={12} /> Approved</span>;
      case "rejected": return <span className="badge badge-error gap-1"><XCircle size={12} /> Rejected</span>;
      default: return <span className="badge badge-warning gap-1"><Clock size={12} /> Pending</span>;
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-6">🏫 Manage Institutions</h1>

        {/* Status Filter */}
        <div className="mb-6">
          <select
            className="select select-bordered"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
          <div className="grid gap-4">
            {institutions.length === 0 ? (
              <div className="text-center py-10 text-base-content/50">No institutions found</div>
            ) : (
              institutions.map(inst => (
                <div key={inst._id} className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div>
                        <h2 className="card-title">{inst.name}</h2>
                        <p className="text-sm text-base-content/60">
                          Type: <span className="font-medium">{inst.type}</span> · Contact: {inst.contactPerson}
                        </p>
                        <p className="text-sm text-base-content/60">
                          Email: {inst.email} · Phone: {inst.phone}
                        </p>
                        {inst.address && <p className="text-sm text-base-content/50">📍 {inst.address}</p>}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {statusBadge(inst.status)}
                        <div className="flex gap-2 mt-2">
                          {inst.status !== "approved" && (
                            <button className="btn btn-success btn-sm" onClick={() => updateStatus(inst._id, "approved")}>
                              <CheckCircle size={14} /> Approve
                            </button>
                          )}
                          {inst.status !== "rejected" && (
                            <button className="btn btn-warning btn-sm" onClick={() => updateStatus(inst._id, "rejected")}>
                              <XCircle size={14} /> Reject
                            </button>
                          )}
                          <button className="btn btn-error btn-sm btn-outline" onClick={() => handleDelete(inst._id, inst.name)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <div className="mt-4 text-sm text-base-content/50">
          Total: {institutions.length} institutions
        </div>
      </div>
    </div>
  );
};

export default ManageInstitutions;
