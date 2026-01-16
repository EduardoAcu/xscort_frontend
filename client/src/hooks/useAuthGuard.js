"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import useAuthStore from "@/store/auth";

export default function useAuthGuard({ redirectTo = "/login", withNext = true, requireModel = false, requireClient = false } = {}) {
  const { isAuthenticated, isCheckingAuth, hasHydrated, isModelo, checkAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  // Si está en proceso de verificación, asegúrate de disparar checkAuth
  useEffect(() => {
    if (hasHydrated && isCheckingAuth) {
      checkAuth();
    }
  }, [hasHydrated, isCheckingAuth, checkAuth]);

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
    }
    // Si requiere modelo y no lo es, enviarlo a panel de cliente
    if (requireModel && !isModelo) {
      router.replace("/panel/cliente");
      return;
    }
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
    isReady: hasHydrated &&
      (isAuthenticated || !isCheckingAuth) &&
      (!requireModel || isModelo) &&
      (!requireClient || !isModelo) // Solo listo cuando cumple el rol requerido
  };
}
