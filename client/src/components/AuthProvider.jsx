"use client";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/auth";

export default function AuthProvider({ children }) {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Verificar autenticación solo una vez al cargar la app
    if (!hasChecked && !isAuthenticated) {
      
        let isLoggedIn = false;
        try {
          if (typeof window !== "undefined") {
            isLoggedIn = localStorage.getItem("is_logged_in") === "true";
          }
        } catch (error) {
          console.warn("Navegador estricto detectado en AuthProvider. Asumiendo visitante.");
          isLoggedIn = false;
        }

        if (!isLoggedIn) {
          // Visitante sin sesión. Omitiendo checkAuth para evitar error 401.
          setHasChecked(true);
          // Importante: Dile al store que ya no está chequeando para destrabar la UI
          useAuthStore.setState({ isCheckingAuth: false }); 
          return; 
        }

      // Solo si encontramos un token físico, vamos a validarlo con el backend
      checkAuth().finally(() => setHasChecked(true));
    }
  }, [hasChecked, isAuthenticated, checkAuth]);

  return children;
}