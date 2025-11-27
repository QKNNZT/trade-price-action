// Centralized API configuration
// Uses Vite env if available, falls back to localhost:5000

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";
