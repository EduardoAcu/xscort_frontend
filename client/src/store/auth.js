"use client";
import { create } from "zustand";
import api from "@/lib/api";

/**
 * Store de autenticación con cookies HttpOnly.
 * 
 * IMPORTANTE: Ya NO almacenamos tokens en localStorage.
 * Los tokens se manejan automáticamente como cookies HttpOnly por el backend.
 * 
 * Solo mantenemos estado de usuario y métodos de login/logout.
 */
const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true, // Arrancamos verificando hasta que checkAuth termine
  hasHydrated: true, // Sin persistencia, siempre está listo
  isModelo: false,

  login: async ({ username, password }) => {
    const res = await api.post("/api/token/", { username, password });
    if (res.data.user) {
      // El backend ya incluye es_modelo en los datos del usuario
      const isModelo = res.data.user.es_modelo || false;
      set({
        user: res.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
        isModelo,
      });
    }
    return res.data;
  },

  register: async (payload) => {
    const { username, email, password, password2, fecha_nacimiento } = payload;
    const res = await api.post("/api/register/", {
      username,
      email,
      password,
      password2: password2 ?? password,
      fecha_nacimiento,
    });
    return res.data;
  },

  logout: async () => {
    try {
      // Llamar al endpoint de logout para limpiar cookies
      await api.post("/api/logout/");
    } catch (err) {
      console.error("Error en logout:", err);
    } finally {
      // Limpiar estado local
      set({ user: null, isAuthenticated: false, isCheckingAuth: false });
    }
  },

  // Método para verificar si hay sesión activa
  checkAuth: async () => {
    set({ isCheckingAuth: true });

    try {
      // Verificar sesión - este endpoint ya devuelve los datos del usuario
      const res = await api.get("/api/verification/status/");
      // El backend incluye es_modelo en los datos del usuario
      const isModelo = res.data.es_modelo || false;

      // Evitar sobrescribir el estado si ya hay una sesión autenticada activa
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
        // Solo actualizar flags de verificación sin tocar el objeto user completo
        set({ isCheckingAuth: false, isModelo });
      }
      return true;
    } catch (err) {
      set({ user: null, isAuthenticated: false, isCheckingAuth: false });
      return false;
    }
  },
}));

export default useAuthStore;
