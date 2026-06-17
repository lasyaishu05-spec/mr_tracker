import { useCallback, useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-hot-toast";
import { Users as UsersIcon, Shield, ShieldCheck, UserCog, User, ChevronLeft, ChevronRight } from "lucide-react";
import { onDataChange, offDataChange } from "../utils/dataEvents";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchUsers = useCallback(async ({ silent = false } = {}) => {
    try {
      if (!silent) setLoading(true);
      const res = await api.get(`/users?page=${page}&limit=10`);
      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
      setTotalUsers(res.data.total);
    } catch {
      if (!silent) toast.error("Failed to load users. Ensure you are an Admin.");
    } finally {
      if (!silent) setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
    const handleDataChange = () => fetchUsers({ silent: true });
    onDataChange(handleDataChange);
    return () => offDataChange(handleDataChange);
  }, [fetchUsers]);

  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`Change role to ${newRole}?`)) return;
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      toast.success("Role updated successfully");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update role");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r - - mb-2">
            User Management
          </h1>
          <p className="text-text text-lg">
            Manage system access and assign roles. ({totalUsers} total)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-1">
        <div className="glass-panel p-6 rounded-2xl border border-border flex items-center gap-4 bg-surface shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
            <UsersIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-text">Total Users</p>
            <h3 className="text-2xl font-bold text-text-h">{totalUsers}</h3>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="glass-panel rounded-2xl overflow-hidden stagger-2 border border-border shadow-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-hover">
                <th className="p-5 font-semibold text-text-h text-sm tracking-wide">User</th>
                <th className="p-5 font-semibold text-text-h text-sm tracking-wide">Email</th>
                <th className="p-5 font-semibold text-text-h text-sm tracking-wide">Role</th>
                <th className="p-5 font-semibold text-text-h text-sm tracking-wide text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-text">Loading...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-text">No users found.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-surface-hover transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center border border-border shadow-sm">
                          {user.role === 'ADMIN' ? <ShieldCheck className="w-5 h-5 text-primary" /> : <User className="w-5 h-5 text-text" />}
                        </div>
                        <div>
                          <p className="font-semibold text-text-h">{user.name}</p>
                          <p className="text-xs text-text font-mono mt-0.5">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-text font-mono text-sm">{user.email}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${
                        user.role === 'ADMIN' 
                          ? 'bg-primary/10 text-primary border-primary/20' 
                          : 'bg-surface text-text-h border-border'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user.role === 'MR' ? (
                          <button 
                            onClick={() => handleRoleChange(user.id, 'ADMIN')}
                            className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg transition-colors border border-primary/20 text-xs font-semibold"
                          >
                            <Shield className="w-4 h-4" />
                            Make Admin
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleRoleChange(user.id, 'MR')}
                            className="flex items-center gap-2 px-3 py-1.5 bg-surface hover:bg-surface-hover text-text-h rounded-lg transition-colors border border-border text-xs font-semibold shadow-sm"
                          >
                            <UserCog className="w-4 h-4" />
                            Revoke Admin
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="p-5 border-t border-border bg-surface-hover flex items-center justify-between">
            <span className="text-sm text-text font-mono">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="p-2 bg-surface border border-border rounded-lg hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-text-h shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="p-2 bg-surface border border-border rounded-lg hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-text-h shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
