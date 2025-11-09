"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "@/lib/axiosConfig";

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      login: async ({ username, password }) => {
        const res = await axios.post("/api/token/", { username, password });
        const token = res?.data?.tokens?.access || res?.data?.access || res?.data?.token || res?.data?.jwt;
        const refresh = (res?.data?.tokens?.refresh || res?.data?.refresh) ?? null;
        if (!token) throw new Error("No se recibió un token válido");
        set({ token, refreshToken: refresh });
        return res.data;
      },

      register: async ({ username, email, password }) => {
        const res = await axios.post("/api/register/", { username, email, password, password2: password });
        return res.data;
      },

      logout: () => set({ token: null, refreshToken: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ token: state.token, refreshToken: state.refreshToken }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated?.(true);
      },
      // Importante: solo usar storage en el cliente
      skipHydration: typeof window === "undefined",
    }
  )
);

export default useAuthStore;
