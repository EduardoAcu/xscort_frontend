"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function FormularioServicio({ servicio, onSuccess, onCancel }) {
  const [catalogoId, setCatalogoId] = useState(servicio?.catalogo?.id || servicio?.catalogo_id || "");
  const [customText, setCustomText] = useState(servicio?.custom_text || "");
  const [catalogo, setCatalogo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCatalogo = async () => {
      try {
        const res = await api.get("/api/profiles/servicios-catalogo/");
        setCatalogo(res.data || []);
      } catch (err) {
        setCatalogo([]);
      }
    };
    fetchCatalogo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!catalogoId && !customText.trim()) {
      setError("Selecciona un servicio del catálogo o escribe uno personalizado");
      setError("El nombre es requerido");
      return;
    }

    setLoading(true);
    try {
      const data = {
        catalogo_id: catalogoId || undefined,
        custom_text: customText || undefined,
      };

      if (servicio?.id) {
        // Edit
        await api.patch(
          `/api/profiles/mis-servicios/${servicio.id}/actualizar/`,
          data,
        );
      } else {
        // Create
        await api.post(
          "/api/profiles/mis-servicios/crear/",
          data,
        );
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const apiError =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        "Error al guardar servicio";
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border bg-[var(--color-card)] p-6 shadow-sm space-y-4">
      <h3 className="text-xl font-bold">
        {servicio ? "Editar Servicio" : "Nuevo Servicio"}
      </h3>
      <p className="text-xs text-[color:var(--color-muted-foreground)]">
        Selecciona un servicio del catálogo. Si es exclusivo, escribe el detalle en personalizado.
      </p>

      <div className="space-y-2">
        <label className="block font-semibold">Catálogo</label>
        <select
          value={catalogoId}
          onChange={(e) => setCatalogoId(e.target.value)}
          className="w-full rounded-md border px-4 py-2"
        >
          <option value="">-- Selecciona --</option>
          {catalogo.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block font-semibold">Texto personalizado (opcional)</label>
        <input
          type="text"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          className="w-full rounded-md border px-4 py-2"
          placeholder="Ej: Solo VIP, incluye ... (máx 120 caracteres)"
          maxLength={120}
        />
        <p className="text-xs text-gray-500">Solo si el servicio lo permite; se validará en el backend.</p>
      </div>

      {/* Descripción y precio fueron eliminados del backend.
          Si se vuelven a necesitar, deben reintroducirse en la API primero. */}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-lg border px-4 py-2 hover:bg-[color:var(--color-card)/0.03] disabled:opacity-60"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Guardando..." : servicio ? "Actualizar" : "Crear"}
        </button>
      </div>
    </form>
  );
}
