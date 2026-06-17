import { useCallback, useEffect, useState, useContext } from "react";
import api from "../services/api";
import { toast } from "react-hot-toast";
import { Search, Plus, FileEdit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import DoctorForm from "../components/DoctorForm";
import { AuthContext } from "../context/auth-context";
import { Modal } from "../components/Modal";
import { notifyDataChanged, onDataChange, offDataChange } from "../utils/dataEvents";

const PAGE_SIZE = 10;

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [saving, setSaving] = useState(false);

  const { user } = useContext(AuthContext);
  const role = user?.role || "MR";

  const fetchDoctors = useCallback(async ({ silent = false } = {}) => {
    try {
      if (!silent) setLoading(true);
      const res = await api.get("/doctors", {
        params: {
          page,
          limit: PAGE_SIZE,
          search,
        },
      });
      setDoctors(res.data.data);
      setTotalPages(res.data.totalPages);
      setTotalDoctors(res.data.totalDoctors);
    } catch (error) {
      console.error("Failed to load doctors:", error);
      if (!silent) toast.error("Failed to load doctors");
    } finally {
      if (!silent) setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDoctors();
    const handleDataChange = () => fetchDoctors({ silent: true });
    onDataChange(handleDataChange);
    return () => offDataChange(handleDataChange);
  }, [fetchDoctors]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const doctorMatchesSearch = (doctor, query) => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return true;
    }

    return [
      doctor.doctorName,
      doctor.hospitalName,
      doctor.specialization,
      doctor.mrOwner?.name,
    ].some((value) => value?.toLowerCase().includes(normalizedQuery));
  };

  const openAddModal = () => {
    setSelectedDoctor(null);
    setIsModalOpen(true);
  };

  const openEditModal = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setIsModalOpen(false);
    setSelectedDoctor(null);
  };

  const handleSave = async (formData) => {
    try {
      setSaving(true);

      if (selectedDoctor) {
        const res = await api.put(`/doctors/${selectedDoctor.id}`, formData);
        const updatedDoctor = res.data.data;

        setDoctors((currentDoctors) =>
          currentDoctors.map((doctor) =>
            doctor.id === updatedDoctor.id ? updatedDoctor : doctor
          )
        );
        notifyDataChanged();
        toast.success("Doctor updated successfully");
      } else {
        const res = await api.post("/doctors", formData);
        const newDoctor = res.data.data;

        if (doctorMatchesSearch(newDoctor, search)) {
          setDoctors((currentDoctors) => [newDoctor, ...currentDoctors].slice(0, PAGE_SIZE));
          setTotalDoctors((currentTotal) => {
            const nextTotal = currentTotal + 1;
            setTotalPages(Math.max(1, Math.ceil(nextTotal / PAGE_SIZE)));
            return nextTotal;
          });

          if (page !== 1) {
            setPage(1);
          }
        }

        notifyDataChanged();
        toast.success("Doctor added successfully");
      }

      setIsModalOpen(false);
      setSelectedDoctor(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save doctor");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      await api.delete(`/doctors/${id}`);

      const remainingDoctors = doctors.filter((doctor) => doctor.id !== id);

      setDoctors(remainingDoctors);
      setTotalDoctors((currentTotal) => {
        const nextTotal = Math.max(0, currentTotal - 1);
        setTotalPages(Math.max(1, Math.ceil(nextTotal / PAGE_SIZE)));
        return nextTotal;
      });

      if (remainingDoctors.length === 0 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      }

      notifyDataChanged();
      toast.success("Doctor deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r - - mb-2">
            Doctors Directory
          </h1>
          <p className="text-text text-lg">
            Manage doctors and see which MR is handling each account. ({totalDoctors} total)
          </p>
        </div>
        
        {role === "MR" && (
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-6 py-3 - - font-semibold rounded-xl hover:scale-[1.02] transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Doctor
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 stagger-1">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text" />
          <input
            type="text"
            placeholder="Search by doctor, hospital, specialization, or MR..."
            value={search}
            onChange={handleSearch}
            className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-xl text-text-h placeholder-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans shadow-sm"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="glass-panel rounded-2xl overflow-hidden stagger-2 border border-border shadow-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-hover">
                <th className="p-5 font-semibold text-text-h text-sm tracking-wide">Doctor</th>
                <th className="p-5 font-semibold text-text-h text-sm tracking-wide">Hospital</th>
                <th className="p-5 font-semibold text-text-h text-sm tracking-wide">Specialization</th>
                <th className="p-5 font-semibold text-text-h text-sm tracking-wide">MR Owner</th>
                <th className="p-5 font-semibold text-text-h text-sm tracking-wide text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-text">Loading...</td>
                </tr>
              ) : doctors.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-text">No doctors found matching your criteria.</td>
                </tr>
              ) : (
                doctors.map((doc) => (
                  <tr key={doc.id} className="border-b border-border hover:bg-surface-hover transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br - - flex items-center justify-center font-bold text-white shadow-glow">
                          {doc.doctorName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-text-h">{doc.doctorName}</p>
                          <p className="text-xs text-text font-mono mt-0.5">ID: DOC-{doc.id.toString().padStart(4, '0')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-text">{doc.hospitalName}</td>
                    <td className="p-5">
                      <span className="px-3 py-1 bg-surface text-text-h rounded-full text-xs border border-border font-medium shadow-sm">
                        {doc.specialization || "General"}
                      </span>
                    </td>
                    <td className="p-5">
                      {doc.mrOwner ? (
                        <div>
                          <p className="font-semibold text-text-h">{doc.mrOwner.name}</p>
                          <p className="text-xs text-text font-mono mt-0.5">{doc.mrOwner.email}</p>
                        </div>
                      ) : (
                        <span className="text-sm text-text">Unassigned</span>
                      )}
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {role === "MR" && (
                          <>
                            <button
                              onClick={() => openEditModal(doc)}
                              className="p-2 bg-surface text-primary hover:bg-primary hover:text-white rounded-lg transition-colors border border-border shadow-sm"
                              title="Edit"
                            >
                              <FileEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(doc.id)}
                              className="p-2 bg-surface text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-border shadow-sm"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
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

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedDoctor ? "Edit Doctor" : "Add Doctor"}
        size="lg"
      >
        <DoctorForm
          key={selectedDoctor?.id || "new-doctor"}
          doctor={selectedDoctor}
          loading={saving}
          onCancel={closeModal}
          onSubmit={handleSave}
        />
      </Modal>
    </div>
  );
};

export default Doctors;
