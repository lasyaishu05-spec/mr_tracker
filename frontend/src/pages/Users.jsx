import { useCallback, useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-hot-toast";
import { Users as UsersIcon, Shield, ShieldCheck, UserCog, User, ChevronLeft, ChevronRight, UserPlus, X } from "lucide-react";
import { onDataChange, offDataChange, notifyDataChanged } from "../utils/dataEvents";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "MR" });

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await api.post("/users", newUser);
      toast.success("User added successfully");
      setIsModalOpen(false);
      setNewUser({ name: "", email: "", password: "", role: "MR" });
      fetchUsers();
      notifyDataChanged();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add user");
    }
  };

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
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors font-semibold shadow-lg shadow-primary/25 flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          Add User
        </button>
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

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold text-text-h">Add New User</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-text hover:text-text-h hover:bg-surface-hover rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-h mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-text-h"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-h mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-text-h"
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-h mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-text-h"
                  placeholder="••••••••"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-h mb-1.5">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-text-h"
                >
                  <option value="MR">Medical Representative (MR)</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-surface-hover text-text-h font-semibold rounded-xl hover:bg-border transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/25 transition-all"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
