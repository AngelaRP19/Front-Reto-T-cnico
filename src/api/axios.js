// src/api/axios.js
import axios from "axios";
import i18n from "../i18n/i18n";

// Crear instancia de Axios con configuración base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8081", // usa variable de entorno o valor por defecto
});

// Interceptor para añadir idioma automáticamente
api.interceptors.request.use((config) => {
  config.headers["Accept-Language"] = i18n.language;
  return config;
});

export default api;
