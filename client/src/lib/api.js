import axios from "axios";
import { useAuthStore } from "@/store/authStore"; // Asegúrate que esta ruta sea correcta

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // ¡Aquí está la magia!
  headers: {
    'Content-Type': 'application/json',
  }
});

// Tu interceptor está perfecto
api.interceptors.request.use((config) => {
  try {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {}
  return config;
});

export default api;