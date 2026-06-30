import { useCallback, useEffect, useRef, useState } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import { Users, Activity, FileText, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import api from '../services/api';
import { LoadingSpinner } from '../utils/loaders';
import { showError } from '../utils/toast';
import { DATA_CHANGED_EVENT } from '../utils/dataEvents';
import { useNavigate } from 'react-router-dom';

const REFRESH_INTERVAL_MS = 15000;

const Dashboard = () => {
  const navigate = useNavigate();
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
        <p className="text-gray-500 dark:text-gray-400">Failed to load dashboard data</p>
      </div>
    );
  }

  // Map backend status to our new chart colors
  const statusColorMap = {
    'COMPLETED': '#FF9100', // Orange
    'INTERESTED': '#00B4D8', // Cyan
    'REJECTED': '#6B4C9A', // Purple
    'NOT_INTERESTED': '#6B4C9A',
    'PENDING': '#E8308C', // Magenta
  };

  const chartData = dashboard.visitsByStatus?.map(item => ({
    name: item.status,
    count: item.count ?? item._count?.status ?? 0,
    color: statusColorMap[item.status] || '#E8308C'
  })) || [];

  const totalChartVisits = chartData.reduce((acc, curr) => acc + curr.count, 0);

  const getStatusBadge = (status) => {
    const s = status || '';
    if (s === 'INTERESTED') return <span className="bg-[#E6F8FB] dark:bg-[#00B4D8]/20 text-[#00B4D8] px-3 py-1 rounded-full text-[10px] font-bold tracking-wider">INTERESTED</span>;
    if (s === 'PENDING') return <span className="bg-[#FCEAF3] dark:bg-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-bold tracking-wider">PENDING</span>;
    if (s === 'COMPLETED') return <span className="bg-[#FFF4E5] dark:bg-[#FF9100]/20 text-[#FF9100] px-3 py-1 rounded-full text-[10px] font-bold tracking-wider">COMPLETED</span>;
    return <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider">{s.replace('_', ' ')}</span>;
  };

  return (
    <div className="animate-fade-in pb-12 max-w-[1400px] mx-auto">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-1">
          Dashboard Overview
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          Welcome back! Let's make today joyful.
        </p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 stagger-1">
        
        <div className="bg-white dark:bg-[#111827] rounded-[32px] p-3 pr-6 flex items-center gap-4 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
          <div className="w-14 h-14 rounded-full bg-[#FCEAF3] dark:bg-primary/20 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-widest uppercase">Total Doctors</p>
            <h3 className="text-2xl font-bold text-black dark:text-white leading-none mt-1">{dashboard.totalDoctors || 0}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-[32px] p-3 pr-6 flex items-center gap-4 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
          <div className="w-14 h-14 rounded-full bg-[#F3F0FA] dark:bg-[#6B4C9A]/20 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6 text-[#6B4C9A]" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-widest uppercase">Total Visits</p>
            <h3 className="text-2xl font-bold text-black dark:text-white leading-none mt-1">{dashboard.totalVisits || 0}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-[32px] p-3 pr-6 flex items-center gap-4 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
          <div className="w-14 h-14 rounded-full bg-[#E6F8FB] dark:bg-[#00B4D8]/20 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6 text-[#00B4D8]" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-widest uppercase">Follow-ups</p>
            <h3 className="text-2xl font-bold text-black dark:text-white leading-none mt-1">{dashboard.totalFollowups || 0}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-[32px] p-3 pr-6 flex items-center gap-4 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
          <div className="w-14 h-14 rounded-full bg-[#FFF4E5] dark:bg-[#FF9100]/20 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6 text-[#FF9100]" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-widest uppercase">Pending</p>
            <h3 className="text-2xl font-bold text-black dark:text-white leading-none mt-1">{dashboard.pendingFollowups || 0}</h3>
          </div>
        </div>

      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 stagger-2">
        
        {/* Left Column */}
        <div className="space-y-8">
          
          {/* Chart Card */}
          <div className="bg-white dark:bg-[#111827] rounded-[40px] p-8 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-black dark:text-white">Visits by Status</h3>
              <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                Detailed View <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="h-[340px] relative flex items-center justify-center">
              {chartData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={90}
                        outerRadius={140}
                        paddingAngle={2}
                        dataKey="count"
                        stroke="none"
                        cornerRadius={8}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Text inside Doughnut */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                     <span className="text-4xl font-bold text-primary">{totalChartVisits}</span>
                     <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-widest uppercase mt-1">Visits</span>
                  </div>
                </>
              ) : (
                <div className="text-gray-400 dark:text-gray-500 font-medium">No data available</div>
              )}
            </div>

            {/* Custom Legend */}
            <div className="flex flex-wrap justify-center gap-6 mt-2">
               {chartData.map((entry, idx) => (
                 <div key={idx} className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                   <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: entry.color }}>
                     {entry.name.replace('_', ' ')}
                   </span>
                 </div>
               ))}
            </div>
          </div>

          {/* Bottom Row in Left Col */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Recent Visits */}
            <div className="bg-white dark:bg-[#111827] rounded-[40px] p-8 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
               <div className="flex justify-between items-center mb-8">
                 <h3 className="text-lg font-bold text-black dark:text-white">Recent Visits</h3>
                 <button 
                   onClick={() => navigate('/visits')}
                   className="bg-[#FCEAF3] dark:bg-primary/20 text-primary px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-primary hover:text-white dark:hover:bg-primary transition-colors"
                 >
                   View All
                 </button>
               </div>
               
               <div className="space-y-6">
                 {dashboard.recentVisits?.length > 0 ? (
                   dashboard.recentVisits.slice(0, 3).map((visit, idx) => {
                     const docName = visit.doctor?.doctorName || 'Unknown Doctor';
                     const initials = docName.replace('Dr. ', '').substring(0, 2).toUpperCase();
                     return (
                       <div key={idx} className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-[#F3F0FA] dark:bg-[#6B4C9A]/20 text-[#6B4C9A] flex items-center justify-center font-bold text-xs shrink-0">
                             {initials}
                           </div>
                           <div>
                             <h4 className="font-bold text-sm text-black dark:text-white">{docName}</h4>
                             <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wide font-semibold mt-0.5">
                               CARDIOLOGY &bull; {new Date(visit.visitDate).toLocaleDateString()}
                             </p>
                           </div>
                         </div>
                         {getStatusBadge(visit.status)}
                       </div>
                     );
                   })
                 ) : (
                   <p className="text-sm text-gray-400 dark:text-gray-500">No recent visits</p>
                 )}
               </div>
            </div>

            {/* Scheduled for Tomorrow Widget */}
            <div className="bg-white dark:bg-[#111827] rounded-[40px] p-8 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center text-center relative overflow-hidden transition-colors">
               <img src="/calendar.png" alt="Calendar" className="w-40 h-40 object-contain mb-4 hover:scale-105 transition-transform duration-500" />
               <h3 className="text-lg font-bold text-primary mb-2">2 Scheduled for Tomorrow</h3>
               <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[200px]">Get ready to shine! Clinical precision with a joyful pop.</p>
            </div>

          </div>

        </div>

        {/* Right Column - Quick Stats */}
        <div className="bg-white dark:bg-[#111827] rounded-[40px] p-8 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col h-full transition-colors">
          <h3 className="text-xl font-bold text-black dark:text-white mb-8">Quick Stats</h3>
          
          <div className="space-y-4 flex-1">
            {[
              { label: "Completed", value: dashboard.completedVisits || 0 },
              { label: "Pending", value: dashboard.pendingVisits || 0 },
              { label: "Interested", value: dashboard.interestedDoctors || 0 },
              dashboard.totalMRs && { label: "Total MRs", value: dashboard.totalMRs }
            ].filter(Boolean).map((stat, idx) => (
              <div key={idx} className="flex items-center justify-between p-5 bg-[#FAFAFA] dark:bg-gray-800/50 rounded-[24px]">
                <span className="text-sm font-bold text-black dark:text-gray-200">{stat.label}</span>
                <span className="text-2xl font-bold text-primary">{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Sweet Performance Widget */}
          <div className="mt-8 bg-[#FCEAF3] dark:bg-primary/10 rounded-[32px] p-6 text-center">
             <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center">
               <Sparkles className="w-6 h-6 text-primary" />
             </div>
             <h4 className="font-bold text-black dark:text-white text-sm mb-2">Sweet Performance!</h4>
             <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
               You're crushing it! Reached 50% of your weekly quota. Just 2 more follow-ups to hit that candy-coated target! 🍭
             </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
