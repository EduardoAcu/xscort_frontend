"use client";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/auth";

export default function AuthProvider({ children }) {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Verificar autenticación solo una vez al cargar la app
    if (!hasChecked && !isAuthenticated) {
      checkAuth().finally(() => setHasChecked(true));
    }
  }, [hasChecked, isAuthenticated, checkAuth]);

  return children;
}
