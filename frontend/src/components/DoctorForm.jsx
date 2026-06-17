import { useState, useEffect } from "react";
import api from "../services/api";

const DoctorForm = ({ doctor, loading = false, onCancel, onSubmit }) => {
  const [formData, setFormData] = useState({
    doctorName: doctor?.doctorName || "",
    hospitalName: doctor?.hospitalName || "",
    specialization: doctor?.specialization || "",
    managedById: doctor?.managedById || doctor?.managedBy?.id || "",
  });
  const [errors, setErrors] = useState({});
  const [mrs, setMrs] = useState([]);

  // Role check
  let role = "MR";
  const token = localStorage.getItem("token");
  if (token) {
    try {
      role = JSON.parse(atob(token.split('.')[1])).role;
    } catch {
      role = "MR";
    }
  }

  useEffect(() => {
    if (role === "ADMIN") {
      api.get("/users?limit=100")
        .then(res => {
          setMrs(res.data.users.filter(u => u.role === "MR"));
        })
        .catch(err => console.error("Failed to load users", err));
    }
  }, [role]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (!formData.doctorName.trim()) {
      nextErrors.doctorName = "Doctor name is required";
    }
    if (!formData.hospitalName.trim()) {
      nextErrors.hospitalName = "Hospital name is required";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      doctorName: formData.doctorName.trim(),
      hospitalName: formData.hospitalName.trim(),
      specialization: formData.specialization.trim(),
      managedById: formData.managedById || null,
    });
  };

  const inputClass =
    "w-full px-4 py-3 bg-surface-hover border border-border rounded-xl text-text-h placeholder-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-text mb-2">
          Doctor name
        </label>
        <input
          name="doctorName"
          value={formData.doctorName}
          onChange={handleChange}
          className={inputClass}
          placeholder="Dr. Ananya Rao"
          autoFocus
        />
        {errors.doctorName && (
          <p className="mt-2 text-sm text-red-400">{errors.doctorName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-2">
          Hospital name
        </label>
        <input
          name="hospitalName"
          value={formData.hospitalName}
          onChange={handleChange}
          className={inputClass}
          placeholder="City Care Hospital"
        />
        {errors.hospitalName && (
          <p className="mt-2 text-sm text-red-400">{errors.hospitalName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-2">
          Specialization
        </label>
        <input
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          className={inputClass}
          placeholder="Cardiology"
        />
      </div>

      {role === "ADMIN" && (
        <div>
          <label className="block text-sm font-medium text-text mb-2">
            Assign MR (Owner)
          </label>
          <select
            name="managedById"
            value={formData.managedById}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">-- Select MR --</option>
            {mrs.map(mr => (
              <option key={mr.id} value={mr.id}>{mr.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-3 bg-surface-hover border border-border text-text-h font-semibold rounded-xl hover:bg-surface transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Saving..." : doctor ? "Update Doctor" : "Add Doctor"}
        </button>
      </div>
    </form>
  );
};

export default DoctorForm;
