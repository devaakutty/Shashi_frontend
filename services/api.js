import axios from "axios";

// ✅ Smart URL switching
const API_URL = 
  process.env.NODE_ENV === "production"
    ? "https://shashichoco.vercel.app/api" // Your live Vercel backend
    : "http://localhost:5000/api";         // Your local backend

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;