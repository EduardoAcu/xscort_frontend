"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import useAuthStore from "@/store/auth";
import { Heart } from "lucide-react"; // Asegúrate de tener lucide-react instalado

export default function LikeButtonCliente({ perfilId, initialLiked = false, initialCount = 0 }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Desaparecer el mensaje de error automáticamente después de 3 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const toggle = async (e) => {
    // 1. Evita que el clic active enlaces (<Link>) que estén por debajo
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setError("Inicia sesión para guardar");
      return;
    }

    if (loading) return;

    // 2. Guardamos el estado anterior por si la API falla (Rollback)
    const prevLiked = liked;
    const prevCount = count;

    // 3. ACTUALIZACIÓN OPTIMISTA: Cambiamos la UI de inmediato sin esperar a la API
    setLiked(!prevLiked);
    setCount((c) => (prevLiked ? Math.max(0, c - 1) : c + 1));
    setError("");
    setLoading(true);

    try {
      if (prevLiked) {
        await api.delete(`/api/profiles/${perfilId}/unlike/`);
      } else {
        await api.post(`/api/profiles/${perfilId}/like/`);
      }
    } catch (err) {
      // 4. Si la API falla, deshacemos el cambio visual sin que el usuario se dé cuenta
      setLiked(prevLiked);
      setCount(prevCount);
      const apiError = err?.response?.data?.error || "Error al procesar";
      setError(apiError);
    } finally {
      // Usamos setTimeout minúsculo para evitar "doble clics" rápidos que rompan el estado
      setTimeout(() => setLoading(false), 300);
    }
  };

  return (
    <div className="relative inline-flex flex-col items-center">
      <button
        onClick={toggle}
        disabled={loading}
        title={liked ? "Quitar de favoritos" : "Guardar en favoritos"}
        className={`
          group flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold 
          transition-all duration-300 border shadow-sm backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50
          ${
            liked
              ? "bg-pink-600/20 border-pink-500 text-pink-400 shadow-pink-500/10 hover:bg-pink-600/30"
              : "bg-black/40 border-white/10 text-gray-300 hover:bg-white/5 hover:border-pink-500/50 hover:text-pink-400"
          }
        `}
      >
        <Heart
          className={`w-4 h-4 transition-transform duration-300 ${
            liked ? "fill-current scale-110" : "group-hover:scale-110"
          } ${loading ? "animate-pulse" : ""}`}
        />
        {/* Solo mostramos el contador si es mayor a 0 o si quieres mostrar el texto */}
        <span className="min-w-[12px] text-center">
            {count > 0 ? count : liked ? "Guardado" : "Guardar"}
        </span>
      </button>

      {/* Mensaje flotante (Tooltip) para errores */}
      {error && (
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-red-900/95 text-red-100 text-[11px] font-medium px-3 py-1.5 rounded-lg border border-red-700 pointer-events-none shadow-xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {error}
        </span>
      )}
    </div>
  );
}