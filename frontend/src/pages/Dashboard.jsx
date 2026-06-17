import { useCallback, useEffect, useRef, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Users, Activity, FileText, TrendingUp, ChevronRight } from 'lucide-react';
import api from '../services/api';
import { LoadingSpinner } from '../utils/loaders';
import { showError } from '../utils/toast';
import { DATA_CHANGED_EVENT } from '../utils/dataEvents';

const REFRESH_INTERVAL_MS = 15000;

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const dashboardRef = useRef(null);

  const fetchDashboard = useCallback(async ({ silent = false } = {}) => {
    try {
      if (!silent) {
        setLoading(true);
      }

      let role = "MR";
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          role = payload.role;
        } catch {
          role = "MR";
        }
      }
      const endpoint = role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/mr';
      const res = await api.get(endpoint);
      dashboardRef.current = res.data.data;
      setDashboard(res.data.data);
    } catch (error) {
      if (!dashboardRef.current) {
        showError('Failed to load dashboard');
      }
      console.error('Dashboard Error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    const refreshSilently = () => fetchDashboard({ silent: true });
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshSilently();
      }
    };

    const intervalId = window.setInterval(refreshSilently, REFRESH_INTERVAL_MS);

    window.addEventListener("focus", refreshSilently);
    window.addEventListener(DATA_CHANGED_EVENT, refreshSilently);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refreshSilently);
      window.removeEventListener(DATA_CHANGED_EVENT, refreshSilently);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchDashboard]);

  if (loading) {
    return <div className="h-full flex items-center justify-center"><LoadingSpinner /></div>;
  }

  if (!dashboard) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-text">Failed to load dashboard data</p>
      </div>
    );
  }

  const chartData = dashboard.visitsByStatus?.map(item => ({
    name: item.status,
    count: item.count ?? item._count?.status ?? 0,
  })) || [];

  const COLORS = ['var(--primary)', 'var(--accent)', '#a855f7', '#eab308'];

  const getStatusClass = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'status-completed';
      case 'PENDING':
        return 'status-pending';
      case 'INTERESTED':
        return 'status-interested';
      case 'NOT_INTERESTED':
        return 'status-not-interested';
      default:
        return 'status-default';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-2">
            Dashboard Overview
          </h1>
          <p className="text-text text-lg">
            Welcome back! Here's your performance snapshot.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-1">
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full mix-blend-screen filter blur-[64px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-surface-hover flex items-center justify-center border border-border">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-text">Total Doctors</p>
              <h3 className="text-2xl font-bold text-text-h">{dashboard.totalDoctors || 0}</h3>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent rounded-full mix-blend-screen filter blur-[64px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-surface-hover flex items-center justify-center border border-border">
              <Activity className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-text">Total Visits</p>
              <h3 className="text-2xl font-bold text-text-h">{dashboard.totalVisits || 0}</h3>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#a855f7] rounded-full mix-blend-screen filter blur-[64px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-surface-hover flex items-center justify-center border border-border">
              <FileText className="w-6 h-6 text-[#a855f7]" />
            </div>
            <div>
              <p className="text-sm font-medium text-text">Total Follow-ups</p>
              <h3 className="text-2xl font-bold text-text-h">{dashboard.totalFollowups || 0}</h3>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#eab308] rounded-full mix-blend-screen filter blur-[64px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-surface-hover flex items-center justify-center border border-border">
              <TrendingUp className="w-6 h-6 text-[#eab308]" />
            </div>
            <div>
              <p className="text-sm font-medium text-text">Pending Follow-ups</p>
              <h3 className="text-2xl font-bold text-text-h">{dashboard.pendingFollowups || 0}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Charts & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 stagger-2">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-text-h mb-6">Visits by Status</h3>
          <div className="h-[300px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="count"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-surface-hover)', border: '1px solid var(--border)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--text-h)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: 'var(--text)' }}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-text">No data available</div>
            )}
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex flex-col">
          <h3 className="text-xl font-bold text-text-h mb-6">Quick Stats</h3>
          <div className="flex-1 space-y-4">
            {[
              { label: "Completed Visits", value: dashboard.completedVisits || 0 },
              { label: "Pending Visits", value: dashboard.pendingVisits || 0 },
              { label: "Interested Doctors", value: dashboard.interestedDoctors || 0 },
              dashboard.totalMRs && { label: "Total MRs", value: dashboard.totalMRs }
            ].filter(Boolean).map((stat, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-surface-hover border border-border rounded-xl">
                <span className="text-text">{stat.label}</span>
                <span className="text-xl font-bold text-text-h">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 stagger-3">
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-text-h mb-6">Recent Visits</h3>
          <div className="space-y-3">
            {dashboard.recentVisits?.length > 0 ? (
              dashboard.recentVisits.slice(0, 5).map((visit, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-surface-hover hover:bg-surface transition-colors border border-border rounded-xl group cursor-pointer">
                  <div>
                    <h4 className="font-semibold text-text-h group-hover:text-primary transition-colors">{visit.doctor?.doctorName || 'Unknown Doctor'}</h4>
                    <p className="text-sm text-text mt-1">{new Date(visit.visitDate).toLocaleDateString()}</p>
                    <div className="flex gap-4 mt-1">
                      <p className="text-xs text-text font-mono">Visited by: {visit.user?.name || 'Unknown'}</p>
                      <p className="text-xs text-text font-mono">Owner: {visit.doctor?.managedBy?.name || 'Unassigned'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`status-badge ${getStatusClass(visit.status)}`}>
                      {visit.status?.replace('_', ' ')}
                    </span>
                    <ChevronRight className="w-5 h-5 text-text opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0" />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-text">No recent visits</div>
            )}
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-text-h mb-6">Upcoming Follow-ups</h3>
          <div className="space-y-3">
            {dashboard.upcomingFollowups?.length > 0 ? (
              dashboard.upcomingFollowups.slice(0, 5).map((followup, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-surface-hover hover:bg-surface transition-colors border border-border rounded-xl group cursor-pointer">
                  <div>
                    <h4 className="font-semibold text-text-h group-hover:text-accent transition-colors">
                      {followup.visit?.doctor?.doctorName || `Follow-up #${followup.id}`}
                    </h4>
                    <p className="text-sm text-text mt-1">{new Date(followup.nextDate).toLocaleDateString()}</p>
                    <div className="flex gap-4 mt-1">
                      <p className="text-xs text-text font-mono">Last Visit: {followup.visit?.user?.name || 'Unknown'}</p>
                      <p className="text-xs text-text font-mono">Owner: {followup.visit?.doctor?.managedBy?.name || 'Unassigned'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
                      new Date(followup.nextDate) < new Date()
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {new Date(followup.nextDate) < new Date() ? 'Overdue' : 'Scheduled'}
                    </span>
                    <ChevronRight className="w-5 h-5 text-text opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0" />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-text">No upcoming follow-ups</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
