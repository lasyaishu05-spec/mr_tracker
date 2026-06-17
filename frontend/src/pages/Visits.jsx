import { useCallback, useState, useEffect, useContext } from "react";
import api from "../services/api";
import { toast } from "react-hot-toast";
import { CalendarDays, Filter, Plus, FileEdit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import VisitForm from "../components/VisitForm";
import { AuthContext } from "../context/auth-context";
import { Modal } from "../components/Modal";
import { notifyDataChanged, onDataChange, offDataChange } from "../utils/dataEvents";

const PAGE_SIZE = 10;

const Visits = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("");
  const [doctorsList, setDoctorsList] = useState([]);

  const { user } = useContext(AuthContext);
  const role = user?.role || "MR";

  const fetchDoctorsList = useCallback(async () => {
    try {
      const res = await api.get('/doctors?limit=1000');
      setDoctorsList(res.data.data);
    } catch (error) {
      console.error("Failed to load doctors:", error);
    }
  }, []);

  const fetchVisits = useCallback(async ({ silent = false } = {}) => {
    try {
      if (!silent) setLoading(true);
      const res = await api.get(`/visits?page=${page}&limit=${PAGE_SIZE}&status=${statusFilter}&doctorId=${doctorFilter}`);
      setVisits(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Failed to load visits:", error);
      if (!silent) toast.error("Failed to load visits");
    } finally {
      if (!silent) setLoading(false);
    }
  }, [doctorFilter, page, statusFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchVisits();
    fetchDoctorsList();

    const handleDataChange = () => {
      fetchVisits({ silent: true });
      fetchDoctorsList();
    };
    onDataChange(handleDataChange);
    return () => offDataChange(handleDataChange);
  }, [fetchVisits, fetchDoctorsList]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'COMPLETED': return 'status-completed';
      case 'PENDING': return 'status-pending';
      case 'INTERESTED': return 'status-interested';
      case 'NOT_INTERESTED': return 'status-not-interested';
      default: return 'status-default';
    }
  };

  const visitMatchesFilters = (visit) => {
    const matchesStatus = !statusFilter || visit.status === statusFilter;
    const matchesDoctor = !doctorFilter || visit.doctorId === Number(doctorFilter);
    return matchesStatus && matchesDoctor;
  };

  const handleSaveVisit = async (formData) => {
    try {
      setSaving(true);
      if (selectedVisit) {
        const res = await api.put(`/visits/${selectedVisit.id}`, formData);
        const updatedVisit = res.data.data;
        setVisits((currentVisits) =>
          currentVisits.map((v) => (v.id === updatedVisit.id ? updatedVisit : v))
        );
        toast.success("Visit updated successfully");
      } else {
        const res = await api.post("/visits", formData);
        const newVisit = res.data.data;

        if (visitMatchesFilters(newVisit)) {
          setVisits((currentVisits) => [newVisit, ...currentVisits].slice(0, PAGE_SIZE));
        }
        toast.success("Visit logged successfully");
      }

      setIsModalOpen(false);
      setSelectedVisit(null);
      notifyDataChanged();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save visit");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVisit = async (id) => {
    if (!window.confirm("Are you sure you want to delete this visit?")) return;
    try {
      await api.delete(`/visits/${id}`);
      setVisits((currentVisits) => currentVisits.filter((visit) => visit.id !== id));
      notifyDataChanged();
      toast.success("Visit deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete visit");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r - - mb-2">
            Visit Tracker
          </h1>
          <p className="text-text text-lg">
            Monitor and log your engagements with healthcare professionals.
          </p>
        </div>
        
        {role === "MR" && (
          <button
            onClick={() => { setSelectedVisit(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-all transform hover:translate-y-[-2px] shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Log Visit
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 stagger-1 border border-border shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3 bg-surface rounded-xl border border-border">
          <Filter className="w-5 h-5 text-text" />
          <span className="text-text-h font-medium">Filters:</span>
        </div>
        
        <select 
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="flex-1 px-4 py-3 bg-surface border border-border rounded-xl text-text-h focus:outline-none focus:border-primary transition-all font-sans shadow-sm"
        >
          <option value="" className="bg-surface-hover">All Statuses</option>
          <option value="PENDING" className="bg-surface-hover">Pending</option>
          <option value="COMPLETED" className="bg-surface-hover">Completed</option>
          <option value="INTERESTED" className="bg-surface-hover">Interested</option>
          <option value="NOT_INTERESTED" className="bg-surface-hover">Not Interested</option>
        </select>

        <select 
          value={doctorFilter}
          onChange={(e) => { setDoctorFilter(e.target.value); setPage(1); }}
          className="flex-1 px-4 py-3 bg-surface border border-border rounded-xl text-text-h focus:outline-none focus:border-primary transition-all font-sans shadow-sm"
        >
          <option value="" className="bg-surface-hover">All Doctors</option>
          {doctorsList.map(d => (
            <option key={d.id} value={d.id} className="bg-surface-hover">{d.doctorName}</option>
          ))}
        </select>
      </div>

      {/* Visits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 stagger-2">
        {loading ? (
          <div className="col-span-full py-20 text-center text-text">Loading visits...</div>
        ) : visits.length === 0 ? (
          <div className="col-span-full py-20 text-center text-text">No visits match your filters.</div>
        ) : (
          visits.map((visit) => (
            <div key={visit.id} className="glass-panel p-6 rounded-2xl border border-border relative overflow-hidden group hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl bg-surface">
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-surface-hover flex items-center justify-center border border-border shadow-sm">
                    <CalendarDays className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-h">{visit.doctor?.doctorName || 'Unknown'}</h3>
                    <p className="text-xs text-text font-mono">{new Date(visit.visitDate).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
                <span className={`status-badge ${getStatusColor(visit.status)}`}>
                  {visit.status.replace('_', ' ')}
                </span>
              </div>
              
              <div className="space-y-3 relative z-10">
                <div className="p-3 bg-surface-hover rounded-xl border border-border">
                  <p className="text-xs text-text uppercase tracking-wider font-semibold mb-1">Products Discussed</p>
                  <p className="text-sm text-text-h line-clamp-2">{visit.productsDiscussed || "None recorded"}</p>
                </div>
                <div className="flex justify-between items-center px-2">
                  <p className="text-xs text-text">Samples: <strong className="text-text-h">{visit.samplesGiven}</strong></p>
                  <p className="text-xs text-text font-mono">Rep: {visit.user?.name}</p>
                </div>
              </div>

              {role === "MR" && (
                <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-all duration-300 z-20">
                  <button onClick={() => { setSelectedVisit(visit); setIsModalOpen(true); }} className="p-3 bg-surface border border-border hover:bg-primary text-text-h hover:text-white rounded-full transition-colors shadow-lg" title="Edit">
                    <FileEdit className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDeleteVisit(visit.id)} className="p-3 bg-red-500/10 border border-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-full transition-colors shadow-lg" title="Delete">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-6 mt-8">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-xl hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-text-h shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>
          <span className="text-text font-mono">
            {page} / {totalPages}
          </span>
          <button 
            disabled={page === totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-xl hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-text-h shadow-sm"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => { if (!saving) { setIsModalOpen(false); setSelectedVisit(null); } }}
        title={selectedVisit ? "Edit Visit" : "Log Visit"}
        size="xl"
      >
        <VisitForm
          key={isModalOpen ? (selectedVisit ? `edit-${selectedVisit.id}` : "new-visit") : "closed"}
          visit={selectedVisit}
          doctors={doctorsList}
          loading={saving}
          onCancel={() => setIsModalOpen(false)}
          onSubmit={handleSaveVisit}
        />
      </Modal>
    </div>
  );
};

export default Visits;
