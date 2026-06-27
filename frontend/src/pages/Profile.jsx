import { useCallback, useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-hot-toast";
import { User, ShieldCheck, KeyRound, Save, Loader2 } from "lucide-react";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get("/users/profile");
      setProfile(res.data.data);
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfile();
  }, [fetchProfile]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    
    setSaving(true);
    try {
      await api.put("/users/change-password", { oldPassword, newPassword });
      toast.success("Password updated successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r - - mb-2">
            My Profile
          </h1>
          <p className="text-text text-lg">
            Manage your personal information and security.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Info Card */}
        <div className="md:col-span-1 glass-panel p-8 rounded-2xl border border-border flex flex-col items-center text-center stagger-1 relative overflow-hidden bg-surface shadow-sm">
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b -/20 to-transparent"></div>
          
          <div className="w-24 h-24 rounded-full bg-gradient-to-br - - p-1 mt-4 relative z-10 shadow-glow mb-6">
            <div className="w-full h-full rounded-full - flex items-center justify-center border-4 -">
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br - -">
                {profile?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-text-h mb-1 relative z-10">{profile?.name}</h2>
          <p className="text-text font-mono text-sm relative z-10 mb-6">{profile?.email}</p>
          
          <div className="w-full flex justify-between items-center px-4 py-3 bg-surface-hover rounded-xl border border-border mt-auto relative z-10">
            <span className="text-sm text-text">Role</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
              profile?.role === 'ADMIN' 
                ? 'bg-primary/10 text-primary border-primary/20' 
                : 'bg-surface text-text-h border-border'
            }`}>
              {profile?.role === 'ADMIN' ? (
                <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> ADMIN</span>
              ) : (
                <span className="flex items-center gap-1"><User className="w-3 h-3" /> MR</span>
              )}
            </span>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="md:col-span-2 glass-panel p-8 rounded-2xl border border-border stagger-2 bg-surface shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/30">
              <KeyRound className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-text-h">Change Password</h3>
              <p className="text-sm text-text">Ensure your account is using a long, random password.</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">Current Password or Master PIN</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-h placeholder-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono shadow-sm"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-h placeholder-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono shadow-sm"
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-h placeholder-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono shadow-sm"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-all transform hover:translate-y-[-2px] shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
