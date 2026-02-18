"use client";
import { create } from "zustand";
import api from "@/lib/api";

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true, 
  hasHydrated: true, 
  isModelo: false,

  login: async ({ username, password }) => {
  const res = await api.post("/api/token/", { username, password });
  if (res.data.user) {
    const isModelo = res.data.user.es_modelo || false;
    
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem("is_logged_in", "true");
      }
    } catch (error) {
      console.warn("Telegram bloqueó el guardado de sesión, pero la app sigue viva.");
    }

    set({ user: res.data.user, isAuthenticated: true, isCheckingAuth: false, isModelo });
  }
  return res.data;
  },

  register: async (payload) => {
    const { username, email, password, password2, fecha_nacimiento } = payload;
    const res = await api.post("/api/register/", {
      username, email, password, password2: password2 ?? password, fecha_nacimiento,
    });
    return res.data;
  },

  logout: async () => {
    try {
      await api.post("/api/logout/");
    } catch (err) {
      console.error("Error en logout:", err);
    } finally {
      try {
        if (typeof window !== 'undefined') {
          localStorage.removeItem("is_logged_in");
        }
      } catch (error) {
        // Silenciamos el error
      }
      set({ user: null, isAuthenticated: false, isCheckingAuth: false });
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });

    try {
      const res = await api.get("/api/verification/status/");
      const isModelo = res.data.es_modelo || false;

      const currentlyAuthenticated = get().isAuthenticated;
      if (!currentlyAuthenticated) {
        set({
          isAuthenticated: true,
          isCheckingAuth: false,
          user: { 
            verified: res.data.esta_verificada,
            es_modelo: res.data.es_modelo,
            username: res.data.username,
            email: res.data.email,
          },
          isModelo,
        });
      } else {
        set({ isCheckingAuth: false, isModelo });
      }
      return true;
    } catch (err) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem("is_logged_in");
      }
      set({ user: null, isAuthenticated: false, isCheckingAuth: false });
      return false;
    }
  },
}));

export default useAuthStore;