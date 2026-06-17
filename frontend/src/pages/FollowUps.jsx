import { useCallback, useEffect, useState, useContext } from "react";
import api from "../services/api";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { toast } from "react-hot-toast";
import { CalendarDays, Clock, Plus, Search } from "lucide-react";
import FollowUpForm from "../components/FollowUpForm";
import { Modal } from "../components/Modal";
import { AuthContext } from "../context/auth-context";
import { notifyDataChanged, onDataChange, offDataChange } from "../utils/dataEvents";

// Setup moment localizer
const localizer = momentLocalizer(moment);

const formatEvent = (followup) => ({
  id: followup.id,
  title: `Follow-up: ${followup.visit?.doctor?.doctorName || 'Unknown Doctor'}`,
  start: new Date(followup.nextDate),
  end: new Date(new Date(followup.nextDate).getTime() + 60 * 60 * 1000),
  allDay: false,
  resource: followup
});

const FollowUps = () => {
  const [events, setEvents] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("ALL");
  const [selectedDate, setSelectedDate] = useState(null);

  const { user } = useContext(AuthContext);
  const role = user?.role || "MR";

  const handleSelectSlot = (slotInfo) => {
    if (role === "MR") {
      setSelectedDate(slotInfo.start);
      setIsModalOpen(true);
    }
  };

  const handleOpenNewModal = () => {
    setSelectedDate(null);
    setIsModalOpen(true);
  };

  const fetchFollowUps = useCallback(async ({ silent = false } = {}) => {
    try {
      if (!silent) setLoading(true);
      const res = await api.get(`/followups`);
      
      const formattedEvents = res.data.data.map(formatEvent);
      
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Failed to load follow-ups:", error);
      if (!silent) toast.error("Failed to load follow-ups");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  const fetchVisits = useCallback(async () => {
    try {
      const res = await api.get("/visits?limit=1000");
      setVisits(res.data.data || []);
    } catch (error) {
      console.error("Failed to load visits:", error);
      toast.error("Failed to load visits for follow-ups");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFollowUps();
    fetchVisits();

    const handleDataChange = () => {
      fetchFollowUps({ silent: true });
      fetchVisits();
    };
    onDataChange(handleDataChange);
    return () => offDataChange(handleDataChange);
  }, [fetchFollowUps, fetchVisits]);

  const handleSaveFollowUp = async (formData) => {
    try {
      setSaving(true);
      const res = await api.post("/followups", formData);
      setEvents((currentEvents) => [...currentEvents, formatEvent(res.data.data)]);
      setIsModalOpen(false);
      notifyDataChanged();
      toast.success("Follow-up scheduled successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to schedule follow-up");
    } finally {
      setSaving(false);
    }
  };

  const matchesSearch = (event) => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return true;
    }

    const followup = event.resource;

    return [
      event.title,
      followup.status,
      followup.notes,
      followup.visit?.doctor?.doctorName,
      followup.visit?.doctor?.hospitalName,
      followup.visit?.user?.name,
    ].some((value) => value?.toLowerCase().includes(query));
  };

  const matchesDateFilter = (event) => {
    const now = new Date();
    const eventDate = new Date(event.start);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

    if (dateFilter === "UPCOMING") {
      return eventDate >= now;
    }

    if (dateFilter === "OVERDUE") {
      return eventDate < now;
    }

    if (dateFilter === "TODAY") {
      return eventDay.getTime() === today.getTime();
    }

    return true;
  };

  const visibleEvents = events.filter((event) => matchesSearch(event) && matchesDateFilter(event));

  const eventStyleGetter = (event) => {
    const isOverdue = new Date(event.start) < new Date();
    return {
      style: {
        backgroundColor: isOverdue ? 'rgba(244, 63, 94, 0.2)' : 'rgba(6, 182, 212, 0.2)',
        borderRadius: '6px',
        opacity: 0.9,
        color: 'white',
        border: `1px solid ${isOverdue ? 'rgba(244, 63, 94, 0.5)' : 'rgba(6, 182, 212, 0.5)'}`,
        display: 'block',
        fontFamily: 'var(--sans)',
        fontSize: '0.8rem',
        padding: '2px 4px'
      }
    };
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r - - mb-2">
            Schedule
          </h1>
        <p className="text-text text-lg">
            Search, filter, and manage follow-ups from one calendar.
          </p>
        </div>
        
        {role === "MR" && (
          <button
            onClick={handleOpenNewModal}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-all transform hover:translate-y-[-2px] shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            <Plus className="w-5 h-5" />
            Schedule Follow-up
          </button>
        )}
      </div>

      <div className="glass-panel p-4 rounded-2xl flex flex-col lg:flex-row gap-4 stagger-1 border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text" />
          <input
            type="text"
            placeholder="Search doctor, hospital, MR, notes, or status..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-xl text-text-h placeholder-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans shadow-sm"
          />
        </div>

        <select
          value={dateFilter}
          onChange={(event) => setDateFilter(event.target.value)}
          className="lg:w-48 px-4 py-3 bg-surface border border-border rounded-xl text-text-h focus:outline-none focus:border-primary transition-all font-sans shadow-sm"
        >
          <option value="ALL" className="bg-surface-hover">All follow-ups</option>
          <option value="UPCOMING" className="bg-surface-hover">Upcoming</option>
          <option value="TODAY" className="bg-surface-hover">Today</option>
          <option value="OVERDUE" className="bg-surface-hover">Overdue</option>
        </select>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-6 flex-1 min-h-[640px]">
        <div className="glass-panel p-6 rounded-2xl border border-border shadow-xl relative stagger-2 min-h-[640px] bg-surface">
        {/* Custom styles for React Big Calendar to match dark theme */}
        <style dangerouslySetInnerHTML={{__html: `
          .rbc-calendar { font-family: var(--sans); color: var(--text-h); }
          .rbc-month-view, .rbc-time-view, .rbc-agenda-view { border-color: var(--border); border-radius: 12px; overflow: hidden; }
          .rbc-header { border-color: var(--border); padding: 12px 0; font-weight: 600; font-family: var(--heading); }
          .rbc-month-row, .rbc-day-bg, .rbc-time-content, .rbc-timeslot-group { border-color: var(--border); }
          .rbc-off-range-bg { background: rgba(0,0,0,0.2); }
          .rbc-today { background: rgba(6, 182, 212, 0.05); }
          .rbc-event { box-shadow: 0 2px 4px rgba(0,0,0,0.2); transition: transform 0.2s; }
          .rbc-event:hover { transform: scale(1.02); }
          .rbc-toolbar button { color: var(--text); border-color: var(--border); border-radius: 8px; transition: all 0.2s; }
          .rbc-toolbar button:hover { background: var(--bg-surface-hover); color: var(--text-h); }
          .rbc-toolbar button.rbc-active { background: var(--primary); color: white; border-color: var(--primary); box-shadow: 0 0 10px rgba(6,182,212,0.3); }
          .rbc-toolbar .rbc-toolbar-label { font-family: var(--heading); font-weight: 700; font-size: 1.25rem; color: var(--text-h); }
          .rbc-time-header-content { border-color: var(--border); }
          .rbc-time-content > * + * > * { border-color: var(--border); }
        `}} />
        
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10 rounded-2xl">
            <span className="text-text font-mono animate-pulse">Loading schedule...</span>
          </div>
        ) : null}

        <Calendar
          localizer={localizer}
          events={visibleEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          eventPropGetter={eventStyleGetter}
          views={['month', 'week', 'day']}
          defaultView="month"
          selectable={true}
          onSelectSlot={handleSelectSlot}
          onDrillDown={(date) => {
            if (role === "MR") {
              setSelectedDate(date);
              setIsModalOpen(true);
            }
          }}
          onSelectEvent={(e) => toast(`Selected: ${e.title}`)}
        />
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-border shadow-xl stagger-3 min-h-[640px] flex flex-col bg-surface">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h3 className="text-xl font-bold text-text-h">Follow-up List</h3>
              <p className="text-sm text-text mt-1">{visibleEvents.length} matching item{visibleEvents.length === 1 ? "" : "s"}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-primary" />
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {visibleEvents.length > 0 ? (
              visibleEvents
                .slice()
                .sort((a, b) => a.start - b.start)
                .map((event) => {
                  const followup = event.resource;
                  const isOverdue = new Date(event.start) < new Date();

                  return (
                    <div key={event.id} className="p-4 bg-surface-hover hover:bg-surface border border-border rounded-xl transition-colors shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-semibold text-text-h">{followup.visit?.doctor?.doctorName || "Unknown Doctor"}</h4>
                          <p className="text-xs text-text mt-1">{followup.visit?.doctor?.hospitalName || "No hospital listed"}</p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
                          isOverdue
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        }`}>
                          {isOverdue ? "Overdue" : "Scheduled"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-4 text-sm text-text">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(event.start).toLocaleDateString()}</span>
                      </div>

                      {followup.notes ? (
                        <p className="mt-3 text-sm text-text leading-relaxed">{followup.notes}</p>
                      ) : null}
                    </div>
                  );
                })
            ) : (
              <div className="h-full flex items-center justify-center text-center text-text">
                No follow-ups match your search.
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => !saving && setIsModalOpen(false)}
        title="Schedule Follow-up"
        size="xl"
      >
        <FollowUpForm
          key={isModalOpen ? "follow-up-form-open" : "follow-up-form-closed"}
          visits={visits}
          loading={saving}
          initialDate={selectedDate}
          onCancel={() => setIsModalOpen(false)}
          onSubmit={handleSaveFollowUp}
        />
      </Modal>
    </div>
  );
};

export default FollowUps;
