"use client";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/auth";
import axios from "@/lib/axiosConfig";

export default function WidgetSuscripcion({ onUpdate }) {
  const [suscripcion, setSuscripcion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    fetchSuscripcion();
  }, [token]);

  const fetchSuscripcion = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await axios.get("/api/subscriptions/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuscripcion(res.data);
      setError(null);
    } catch (err) {
      if (err.response?.status === 404) {
        setSuscripcion(null);
      } else {
        setError("Error al cargar suscripción");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePausar = async () => {
    setActionLoading(true);
    try {
      await axios.post(
        "/api/subscriptions/pausar/",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
      await axios.post(
        "/api/subscriptions/resumir/",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="text-center text-gray-500">Cargando suscripción...</div>
      </div>
    );
  }

  if (!suscripcion) {
    return (
      <div className="rounded-lg border bg-yellow-50 p-6 shadow-sm">
        <p className="text-yellow-800">No tienes una suscripción activa</p>
      </div>
    );
  }

  const diasRestantes = suscripcion.dias_restantes || 0;
  const estaPausada = suscripcion.esta_pausada || false;
  const porcentaje = Math.min(100, Math.max(0, (diasRestantes / 30) * 100));

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-bold">Mi Suscripción</h3>
          <p className="text-sm text-gray-600 mt-1">
            {estaPausada ? "Estado: Pausada" : "Estado: Activa"}
          </p>
        </div>
        <div className={`px-4 py-2 rounded-full text-white font-semibold ${
          estaPausada ? "bg-gray-500" : "bg-green-500"
        }`}>
          {estaPausada ? "⏸ Pausada" : "✓ Activa"}
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="font-semibold">Días restantes</span>
          <span className="text-lg font-bold text-blue-600">{diasRestantes}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className={`h-4 rounded-full transition-all ${
              estaPausada ? "bg-gray-400" : "bg-blue-600"
            }`}
            style={{ width: `${porcentaje}%` }}
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        {!estaPausada ? (
          <button
            onClick={handlePausar}
            disabled={actionLoading}
            className="flex-1 rounded-lg bg-yellow-500 px-4 py-2 text-white font-semibold hover:bg-yellow-600 disabled:opacity-60 transition"
          >
            {actionLoading ? "Pausando..." : "⏸ Pausar"}
          </button>
        ) : (
          <button
            onClick={handleReanudar}
            disabled={actionLoading}
            className="flex-1 rounded-lg bg-green-500 px-4 py-2 text-white font-semibold hover:bg-green-600 disabled:opacity-60 transition"
          >
            {actionLoading ? "Reanudando..." : "▶ Reanudar"}
          </button>
        )}
      </div>
    </div>
  );
}
