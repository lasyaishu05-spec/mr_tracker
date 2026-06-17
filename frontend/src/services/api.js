import axios from "axios";

let baseURL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// Automatically append /api if the user forgot it in their environment variable
if (baseURL && !baseURL.endsWith('/api') && !baseURL.endsWith('/api/')) {
  // Trim trailing slash before appending
  baseURL = `${baseURL.replace(/\/$/, '')}/api`;
}

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;