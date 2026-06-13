import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { Trash2, Search } from "lucide-react";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = () => {
    setLoading(true);
    const params = roleFilter ? { role: roleFilter } : {};
    api.get("/admin/users", { params })
      .then(res => setUsers(res.data.data))
      .catch(err => console.error("Fetch users error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [roleFilter]);

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-6">👤 Manage Users</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="form-control">
            <div className="input-group flex gap-2">
              <select
                className="select select-bordered"
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="student">Students</option>
                <option value="teacher">Teachers</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>
          <div className="form-control flex-1">
            <label className="input input-bordered flex items-center gap-2">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search by name or email..."
                className="grow"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </label>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>School</th>
                  <th>Class</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-6 text-base-content/50">No users found</td></tr>
                ) : (
                  filteredUsers.map((user, idx) => (
                    <tr key={user._id}>
                      <td>{idx + 1}</td>
                      <td className="font-medium">{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge ${
                          user.role === "admin" ? "badge-error" :
                          user.role === "teacher" ? "badge-info" : "badge-success"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{user.schoolId?.name || "—"}</td>
                      <td>{user.classNumber || "—"}</td>
                      <td>
                        <button
                          className="btn btn-error btn-sm btn-outline"
                          onClick={() => handleDelete(user._id, user.name)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 text-sm text-base-content/50">
          Total: {filteredUsers.length} users
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
