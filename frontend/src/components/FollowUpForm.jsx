import { useState } from "react";

const FollowUpForm = ({ visits = [], loading = false, initialDate = null, onCancel, onSubmit }) => {
  const [formData, setFormData] = useState({
    visitId: "",
    nextDate: initialDate 
      ? new Date(initialDate.getTime() - (initialDate.getTimezoneOffset() * 60000)).toISOString().slice(0, 10) 
      : new Date().toISOString().slice(0, 10),
    notes: "",
  });
  const [errors, setErrors] = useState({});

  const inputClass =
    "w-full px-4 py-3 bg-surface-hover border border-border rounded-xl text-text-h placeholder-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (!formData.visitId) nextErrors.visitId = "Visit is required";
    if (!formData.nextDate) nextErrors.nextDate = "Follow-up date is required";
    if (!formData.notes.trim()) nextErrors.notes = "Notes are required";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      visitId: Number(formData.visitId),
      nextDate: formData.nextDate,
      notes: formData.notes.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-text mb-2">Visit</label>
        <select name="visitId" value={formData.visitId} onChange={handleChange} className={inputClass}>
          <option value="">Select visit</option>
          {visits.map((visit) => (
            <option key={visit.id} value={visit.id}>
              {visit.doctor?.doctorName || "Unknown Doctor"} - {new Date(visit.visitDate).toLocaleDateString()}
            </option>
          ))}
        </select>
        {errors.visitId && <p className="mt-2 text-sm text-red-400">{errors.visitId}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-2">Follow-up date</label>
        <input type="date" name="nextDate" value={formData.nextDate} onChange={handleChange} className={inputClass} />
        {errors.nextDate && <p className="mt-2 text-sm text-red-400">{errors.nextDate}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-2">Notes</label>
        <textarea name="notes" value={formData.notes} onChange={handleChange} className={`${inputClass} min-h-28 resize-y`} placeholder="What should be followed up?" />
        {errors.notes && <p className="mt-2 text-sm text-red-400">{errors.notes}</p>}
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-5 py-3 bg-surface-hover border border-border text-text-h font-semibold rounded-xl hover:bg-surface transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={loading || visits.length === 0} className="px-5 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
          {loading ? "Saving..." : "Schedule Follow-up"}
        </button>
      </div>
    </form>
  );
};

export default FollowUpForm;
