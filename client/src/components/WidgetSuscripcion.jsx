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
    // Actualizamos 'now' cada 60.000ms (1 minuto) para mantener el contador fresco
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

    // Fallback si el backend no manda fecha (sistema antiguo)
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
      console.error(err);
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
      console.error(err);
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
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl bg-gradient-to-br from-[#7a0b4d] to-[#3b0322] p-6 shadow-lg">
        <h2 className="text-sm font-medium text-pink-100 uppercase tracking-wide">
          Estado de Suscripción
        </h2>
        <p className="mt-6 text-sm text-pink-100/80 text-center">Cargando suscripción...</p>
      </div>
    );
  }

  if (!suscripcion) {
    return (
      <div className="rounded-3xl bg-gradient-to-br from-[#7a0b4d] to-[#3b0322] p-6 shadow-lg space-y-4">
        <h2 className="text-sm font-medium text-pink-100 uppercase tracking-wide">
          Estado de Suscripción
        </h2>
        <div className="mt-4">
          <p className="text-3xl font-extrabold">Sin suscripción activa</p>
          <p className="mt-2 text-sm text-pink-100/80 max-w-md">
            Elige un plan y envía tu comprobante de pago para habilitar tu perfil y aparecer en los resultados públicos.
          </p>
        </div>
        <div className="mt-6 flex gap-3">
          <a
            href="/panel/suscripcion"
            className="flex-1 rounded-full bg-[#ff007f] px-4 py-2 text-sm font-semibold text-white text-center hover:bg-[#ff2b94]"
          >
            Ver planes y enviar comprobante
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#7a0b4d] to-[#3b0322] p-6 shadow-lg space-y-4">
      <h2 className="text-sm font-medium text-pink-100 uppercase tracking-wide">
        Estado de Suscripción
      </h2>

      <div className="mt-4 flex flex-col gap-1">
        {estaPausada ? (
          <>
            <p className="text-4xl font-extrabold text-yellow-400">Pausada</p>
            <p className="text-sm text-pink-100/80 max-w-md">
              Tu perfil no es visible...
            </p>
          </>
        ) : (
          <>
            <div className="flex items-baseline gap-3">
              {/* Aquí usamos el objeto calculado */}
              <p className={`text-5xl font-extrabold leading-none ${estadoSuscripcion.color}`}>
                {estadoSuscripcion.texto}
              </p>
              <span className="text-sm font-medium text-pink-100/80 uppercase tracking-wide">
                {estadoSuscripcion.etiqueta}
              </span>
            </div>
            
            {/* Mensaje contextual */}
            <p className="text-sm text-pink-100/80 max-w-md">
              {estadoSuscripcion.etiqueta.includes("horas") 
                ? "¡Atención! Tu plan vence hoy. Renueva para no perder visibilidad."
                : "Tu perfil está activo y visible para nuevos clientes."
              }
            </p>
          </>
        )}
      </div>

      {error && <p className="text-sm text-[color:var(--color-destructive-foreground)] bg-[color:var(--color-destructive)/0.3] rounded-md px-3 py-1 mt-2 inline-block">{error}</p>}

      <div className="mt-6 flex gap-3">
        {!estaPausada ? (
          <button
            onClick={handlePausar}
            disabled={actionLoading}
            className="flex-1 rounded-full bg-[#5b2946] px-4 py-2 text-sm font-semibold text-pink-100 hover:bg-[#7b3460] disabled:opacity-60"
          >
            {actionLoading ? "Pausando..." : "Pausar Suscripción"}
          </button>
        ) : (
          <button
            onClick={handleReanudar}
            disabled={actionLoading}
            className="flex-1 rounded-full bg-[#ff007f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#ff2b94] disabled:opacity-60"
          >
            {actionLoading ? "Reanudando..." : "Reanudar Suscripción"}
          </button>
        )}

        <a
          href="/panel/suscripcion"
          className="flex-1 rounded-full bg-[color:var(--color-card)/0.1] px-4 py-2 text-sm font-semibold text-pink-100 text-center hover:bg-[color:var(--color-card)/0.2]"
        >
          Ver / cambiar plan
        </a>
      </div>
    </div>
  );
}