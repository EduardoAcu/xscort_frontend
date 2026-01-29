"use client";
import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";

export default function WidgetSuscripcion({ onUpdate }) {
  const [suscripcion, setSuscripcion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  // 1. Estado para guardar la hora actual y que sea reactiva
  const [now, setNow] = useState(new Date());

  // 2. Efecto para actualizar el reloj interno cada 1 minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchSuscripcion();
  }, []); 

  const estadoSuscripcion = useMemo(() => {
    if (!suscripcion) return { texto: "0", etiqueta: "días", color: "text-white" };

    // Si está pausada, ignorar tiempo
    if (suscripcion.esta_pausada) {
      return { texto: "PAUSADA", etiqueta: "", color: "text-yellow-400" };
    }

    // Si tenemos fecha exacta, calculamos con precisión
    if (suscripcion.fecha_expiracion) {
      const exp = new Date(suscripcion.fecha_expiracion);
      const diffMs = exp - now; // Diferencia en milisegundos

      // Ya expiró
      if (diffMs <= 0) {
        return { texto: "0", etiqueta: "días (Vencida)", color: "text-red-400" };
      }

      const horasRestantes = diffMs / (1000 * 60 * 60);

      // CASO CRÍTICO: Menos de 24 horas
      if (horasRestantes < 24) {
        return { 
          texto: Math.ceil(horasRestantes), 
          etiqueta: "horas restantes", 
          color: "text-orange-400" // Alerta visual
        };
      }

      // Más de 1 día
      const dias = Math.ceil(horasRestantes / 24);
      return { 
        texto: dias, 
        etiqueta: "días restantes", 
        color: dias <= 3 ? "text-orange-300" : "text-white" // Naranja si quedan 3 días o menos
      };
    }

    // Fallback si el backend no manda fecha
    const diasBackend = suscripcion.dias_restantes_calculado ?? suscripcion.dias_restantes ?? 0;
    return { 
      texto: Math.max(diasBackend, 0), 
      etiqueta: "días restantes", 
      color: "text-white" 
    };

  }, [suscripcion, now]);

  const estaPausada = suscripcion?.esta_pausada || false;

  const fetchSuscripcion = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/subscriptions/mi-suscripcion/");
      setSuscripcion(res.data);
      setError(null);
    } catch (err) {
      if (err.response?.status === 404) {
        setSuscripcion(null);
        setError("");
      } else {
        const apiError =
          err?.response?.data?.error ||
          err?.response?.data?.detail ||
          "Error al cargar suscripción";
        setError(apiError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePausar = async () => {
    setActionLoading(true);
    try {
      await api.post("/api/subscriptions/pausar/");
      await fetchSuscripcion();
      if (onUpdate) onUpdate();
    } catch (err) {
      setError("Error al pausar suscripción");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReanudar = async () => {
    setActionLoading(true);
    try {
      await api.post("/api/subscriptions/resumir/");
      await fetchSuscripcion();
      if (onUpdate) onUpdate();
    } catch (err) {
      setError("Error al reanudar suscripción");
    } finally {
      setActionLoading(false);
    }
  };

  // --- RENDERIZADO ---

  if (loading) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-[#7a0b4d] to-[#3b0322] p-6 shadow-xl border border-white/5 animate-pulse">
        <h2 className="text-sm font-bold text-pink-200 uppercase tracking-widest font-montserrat">
          Estado de Suscripción
        </h2>
        <div className="mt-6 h-8 bg-white/10 rounded w-1/2 mx-auto"></div>
      </div>
    );
  }

  if (!suscripcion) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-[#7a0b4d] to-[#3b0322] p-6 shadow-xl border border-white/5 space-y-4">
        <h2 className="text-sm font-bold text-pink-200 uppercase tracking-widest font-montserrat">
          Estado de Suscripción
        </h2>
        <div className="mt-4">
          <p className="text-3xl font-black text-white font-montserrat">Inactiva</p>
          <p className="mt-2 text-sm text-pink-100/90 font-montserrat leading-relaxed">
            Activa tu cuenta para aparecer en los resultados y que los clientes puedan contactarte.
          </p>
        </div>
        <div className="mt-6 flex gap-3">
          <a
            href="/panel/suscripcion"
            className="flex-1 rounded-xl bg-[#ff007f] px-4 py-3 text-sm font-bold text-white text-center hover:bg-[#d6006b] transition shadow-lg shadow-pink-900/40 font-montserrat"
          >
            Activar Plan Ahora
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#7a0b4d] to-[#3b0322] p-6 shadow-xl border border-white/5 space-y-4 font-montserrat">
      <h2 className="text-xs font-bold text-pink-200 uppercase tracking-widest border-b border-white/10 pb-2">
        Tu Plan Actual
      </h2>

      <div className="mt-2 flex flex-col gap-1">
        {estaPausada ? (
          <>
            <p className="text-4xl font-black text-yellow-400 tracking-tight">PAUSADA</p>
            <p className="text-sm text-pink-100/80">
              Tu perfil está oculto temporalmente.
            </p>
          </>
        ) : (
          <>
            <div className="flex items-baseline gap-2">
              <p className={`text-6xl font-black leading-none ${estadoSuscripcion.color}`}>
                {estadoSuscripcion.texto}
              </p>
              <span className="text-sm font-bold text-pink-200 uppercase tracking-wide">
                {estadoSuscripcion.etiqueta}
              </span>
            </div>
            
            <p className="text-sm text-pink-100/80 mt-2 font-medium">
              {estadoSuscripcion.etiqueta.includes("horas") 
                ? "¡Tu plan vence muy pronto!"
                : "Tu perfil está visible y activo."
              }
            </p>
          </>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-200 bg-red-900/40 border border-red-500/30 rounded-lg px-3 py-2 mt-2">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
        {!estaPausada ? (
          <button
            onClick={handlePausar}
            disabled={actionLoading}
            className="flex-1 rounded-xl bg-[#5b2946] border border-white/10 px-4 py-2 text-sm font-semibold text-pink-100 hover:bg-[#7b3460] disabled:opacity-60 transition"
          >
            {actionLoading ? "Procesando..." : "Pausar"}
          </button>
        ) : (
          <button
            onClick={handleReanudar}
            disabled={actionLoading}
            className="flex-1 rounded-xl bg-[#ff007f] px-4 py-2 text-sm font-bold text-white hover:bg-[#d6006b] disabled:opacity-60 transition shadow-lg shadow-pink-900/40"
          >
            {actionLoading ? "Procesando..." : "Reanudar"}
          </button>
        )}

        <a
          href="/panel/suscripcion"
          className="flex-1 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white text-center hover:bg-white/20 transition border border-white/5"
        >
          Gestionar Plan
        </a>
      </div>
    </div>
  );
}