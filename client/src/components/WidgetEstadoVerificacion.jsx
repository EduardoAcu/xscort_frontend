"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { BadgeCheck, Clock, X, AlertTriangle } from "lucide-react";

export default function WidgetEstadoVerificacion() {
  const [estado, setEstado] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/verification/status/", {
      });
      setEstado(res.data);
    } catch (err) {
      console.error("Error al cargar estado de verificación", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg border bg-[var(--color-card)] p-6 shadow-sm">
        <div className="text-center text-gray-500">Cargando estado...</div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    const iconClass = "w-8 h-8";
    switch (status) {
      case "verificada":
        return <BadgeCheck className={iconClass} />;
      case "pendiente":
        return <Clock className={iconClass} />;
      case "rechazada":
        return <X className={iconClass} />;
      default:
        return <AlertTriangle className={iconClass} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "verificada":
        return "bg-green-100 border-green-300 text-green-800";
      case "pendiente":
        return "bg-yellow-100 border-yellow-300 text-yellow-800";
      case "rechazada":
        return "bg-red-100 border-red-300 text-red-800";
      default:
        return "bg-[color:var(--color-card)/0.06] border-[color:var(--color-border)] text-[color:var(--color-foreground)]";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "verificada":
        return "Verificada";
      case "pendiente":
        return "Pendiente de revisión";
      case "rechazada":
        return "Rechazada";
      default:
        return "Sin verificar";
    }
  };

  const status = estado?.esta_verificada ? "verificada" : estado?.tiene_documentos ? "pendiente" : "sin_documentos";

  return (
    <div className={`rounded-lg border-2 p-6 shadow-sm ${getStatusColor(status)}`}>
      <div className="flex items-center gap-4">
        <div>{getStatusIcon(status)}</div>
        <div>
          <h3 className="text-xl font-bold">Estado de Verificación</h3>
          <p className="text-sm font-semibold">{getStatusLabel(status)}</p>
        </div>
      </div>

      {estado?.motivo_rechazo && (
        <div className="mt-4 rounded bg-black bg-opacity-10 p-3">
          <p className="text-xs font-semibold">Motivo del rechazo:</p>
          <p className="text-sm">{estado.motivo_rechazo}</p>
        </div>
      )}

      {!estado?.esta_verificada && !estado?.tiene_documentos && (
        <div className="mt-4 rounded bg-blue-50 p-3">
          <p className="text-xs font-semibold">Tip:</p>
          <p className="text-sm">Sube tus documentos para que podamos verificar tu identidad y habilitar tu perfil.</p>
        </div>
      )}

      {estado?.tiene_documentos && !estado?.esta_verificada && !estado?.motivo_rechazo && (
        <div className="mt-4 rounded bg-blue-50 p-3">
          <p className="text-xs font-semibold">Espera:</p>
          <p className="text-sm">Tu solicitud está siendo revisada. Esto puede tomar un tiempo.</p>
        </div>
      )}
    </div>
  );
}
