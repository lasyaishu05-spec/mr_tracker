import { useCallback, useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-hot-toast";
import { User, Activity, FileText } from "lucide-react";
import { LoadingSpinner } from "../utils/loaders";
import { onDataChange, offDataChange } from "../utils/dataEvents";

const MRPerformance = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/users/mr-stats");
      setStats(res.data.data);
    } catch {
      toast.error("Failed to load MR statistics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    
    // Auto-update without reloading when data changes
    onDataChange(fetchStats);
    return () => {
      offDataChange(fetchStats);
    };
  }, [fetchStats]);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r - - mb-2">
            MR Performance
          </h1>
          <p className="text-text text-lg">
            Track visits and follow-ups for each Medical Representative.
          </p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden stagger-1 border border-border shadow-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-hover">
                <th className="p-5 font-semibold text-text-h text-sm tracking-wide">MR Name</th>
                <th className="p-5 font-semibold text-text-h text-sm tracking-wide">Email</th>
                <th className="p-5 font-semibold text-text-h text-sm tracking-wide">Total Visits</th>
                <th className="p-5 font-semibold text-text-h text-sm tracking-wide">Total Follow-ups</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-10 text-center"><LoadingSpinner /></td>
                </tr>
              ) : stats.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-text">No MR statistics found.</td>
                </tr>
              ) : (
                stats.map((mr) => (
                  <tr key={mr.id} className="border-b border-border hover:bg-surface-hover transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-surface-hover flex items-center justify-center border border-border shadow-sm">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-text-h">{mr.name}</p>
                          <p className="text-xs text-text font-mono mt-0.5">ID: {mr.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-text font-mono text-sm">{mr.email}</td>
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-accent" />
                        <span className="font-bold text-text-h text-lg">{mr.totalVisits}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-purple-500" />
                        <span className="font-bold text-text-h text-lg">{mr.totalFollowups}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MRPerformance;
