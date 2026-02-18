"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import useAuthStore from "@/store/auth";

export default function useAuthGuard({ 
  redirectTo = "/login", 
  withNext = true, 
  requireModel = false, 
  requireClient = false 
} = {}) {
  
  const { isAuthenticated, isCheckingAuth, hasHydrated, isModelo, checkAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (hasHydrated && isCheckingAuth) {
      
      // Buscamos el token físico en el navegador
      // (Ajusta los nombres si usas otros en tu app)
      const isLoggedIn = localStorage.getItem("is_logged_in") === "true";

        if (!isLoggedIn) {
            // FALLO RÁPIDO: Lo pateamos al login
            const target = withNext ? `${redirectTo}?next=${encodeURIComponent(pathname || "/")}` : redirectTo;
            router.replace(target);
            useAuthStore.setState({ isCheckingAuth: false }); 
            return; 
        }
      checkAuth();
    }
  }, [hasHydrated, isCheckingAuth, checkAuth, pathname, redirectTo, router, withNext]);

  useEffect(() => {
    if (!hasHydrated) return;
    
    // Esperar a que termine de verificar la autenticación
    if (isCheckingAuth) return;
    
    // Si no está autenticado después de verificar, redirigir
    if (!isAuthenticated) {
      const target = withNext
        ? `${redirectTo}?next=${encodeURIComponent(pathname || "/")}`
        : redirectTo;
      router.replace(target);
      return; // Importante poner return para detener la ejecución
    }

    // Si requiere modelo y no lo es, enviarlo a panel de cliente
    if (requireModel && !isModelo) {
      router.replace("/panel/cliente");
      return;
    }

    // Lógica para Clientes
    if (requireClient) {
      if (isModelo) {
        router.replace("/panel/dashboard");
        return;
      }
      // Forzar a que clientes permanezcan en su panel
      if (pathname !== "/panel/cliente") {
        router.replace("/panel/cliente");
        return;
      }
    }
  }, [hasHydrated, isAuthenticated, isCheckingAuth, isModelo, router, redirectTo, withNext, pathname, requireModel, requireClient]);

  return { 
    isAuthenticated, 
    // Solo está "isReady" cuando terminó de hidratar, terminó de chequear 
    // y cumple exactamente con el rol que pide la página.
    isReady: hasHydrated &&
      (!isCheckingAuth) &&
      (!requireModel || isModelo) &&
      (!requireClient || !isModelo) 
  };
} 