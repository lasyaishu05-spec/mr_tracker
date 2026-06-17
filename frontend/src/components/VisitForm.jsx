import { useState } from "react";

const VisitForm = ({ visit = null, doctors = [], loading = false, onCancel, onSubmit }) => {
  const [formData, setFormData] = useState({
    doctorId: visit?.doctorId?.toString() || "",
    visitDate: visit?.visitDate ? new Date(visit.visitDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
    status: visit?.status || "PENDING",
    productsDiscussed: visit?.productsDiscussed || "",
    samplesGiven: visit?.samplesGiven?.toString() || "0",
    feedback: visit?.feedback || "",
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
    if (!formData.doctorId) nextErrors.doctorId = "Doctor is required";
    if (!formData.visitDate) nextErrors.visitDate = "Visit date is required";
    if (Number(formData.samplesGiven) < 0) {
      nextErrors.samplesGiven = "Samples cannot be negative";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      ...formData,
      doctorId: Number(formData.doctorId),
      samplesGiven: Number(formData.samplesGiven || 0),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-text mb-2">Doctor</label>
        <select name="doctorId" value={formData.doctorId} onChange={handleChange} className={inputClass}>
          <option value="">Select doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.doctorName} - {doctor.hospitalName}
            </option>
          ))}
        </select>
        {errors.doctorId && <p className="mt-2 text-sm text-red-400">{errors.doctorId}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text mb-2">Visit date</label>
          <input type="date" name="visitDate" value={formData.visitDate} onChange={handleChange} className={inputClass} />
          {errors.visitDate && <p className="mt-2 text-sm text-red-400">{errors.visitDate}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-2">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
            <option value="PENDING">Pending</option>
            <option value="INTERESTED">Interested</option>
            <option value="NOT_INTERESTED">Not Interested</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-2">Products discussed</label>
        <textarea name="productsDiscussed" value={formData.productsDiscussed} onChange={handleChange} className={`${inputClass} min-h-24 resize-y`} placeholder="Products, samples, or topics discussed" />
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-2">Samples given</label>
        <input type="number" min="0" name="samplesGiven" value={formData.samplesGiven} onChange={handleChange} className={inputClass} />
        {errors.samplesGiven && <p className="mt-2 text-sm text-red-400">{errors.samplesGiven}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-2">Feedback</label>
        <textarea name="feedback" value={formData.feedback} onChange={handleChange} className={`${inputClass} min-h-24 resize-y`} placeholder="Doctor feedback or next steps" />
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-5 py-3 bg-surface-hover border border-border text-text-h font-semibold rounded-xl hover:bg-surface transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="px-5 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
          {loading ? "Saving..." : "Log Visit"}
        </button>
      </div>
    </form>
  );
};

export default VisitForm;
