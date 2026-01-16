"use client";
import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";

export default function WidgetSuscripcion({ onUpdate }) {
  const [suscripcion, setSuscripcion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchSuscripcion();
  }, []); // Solo cargar una vez al montar
  const diasRestantes = useMemo(() => {
    if (!suscripcion) return 0;
    const now = new Date();
    // Preferir fecha_expiracion si viene del backend
    if (suscripcion.fecha_expiracion) {
      const exp = new Date(suscripcion.fecha_expiracion);
      const diff = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
      return Math.max(diff, 0);
    }
    // Si no, usar calculado; fallback a dias_restantes almacenado
    if (typeof suscripcion.dias_restantes_calculado === "number") {
      return Math.max(suscripcion.dias_restantes_calculado, 0);
    }
    return Math.max(suscripcion.dias_restantes || 0, 0);
  }, [suscripcion]);
  const estaPausada = suscripcion?.esta_pausada || false;

  const fetchSuscripcion = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/subscriptions/mi-suscripcion/");
      setSuscripcion(res.data);
      setError(null);
    } catch (err) {
      if (err.response?.status === 404) {
        // No hay suscripción activa, esto es un caso esperado
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
            <p className="text-4xl font-extrabold">Pausada</p>
            <p className="text-sm text-pink-100/80 max-w-md">
              Tu perfil no es visible para nuevos clientes mientras la suscripción esté pausada.
            </p>
          </>
        ) : (
          <>
            <div className="flex items-baseline gap-3">
              <p className="text-5xl font-extrabold leading-none">{diasRestantes}</p>
              <span className="text-sm font-medium text-pink-100/80 uppercase tracking-wide">
                días restantes
              </span>
            </div>
            <p className="text-sm text-pink-100/80 max-w-md">
              Tu perfil está activo y visible para nuevos clientes mientras tu suscripción tenga días disponibles.
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
