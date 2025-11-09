"use client";
import { useState } from "react";
import useAuthStore from "@/store/auth";
import axios from "@/lib/axiosConfig";

export default function FormularioServicio({ servicio, onSuccess, onCancel }) {
  const [nombre, setNombre] = useState(servicio?.nombre || "");
  const [descripcion, setDescripcion] = useState(servicio?.descripcion || "");
  const [precio, setPrecio] = useState(servicio?.precio || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = useAuthStore((s) => s.token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!nombre.trim()) {
      setError("El nombre es requerido");
      return;
    }

    setLoading(true);
    try {
      const data = {
        nombre,
        descripcion,
        precio: precio ? parseFloat(precio) : null,
      };

      if (servicio?.id) {
        // Edit
        await axios.patch(
          `/api/profiles/mis-servicios/${servicio.id}/actualizar/`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Create
        await axios.post(
          "/api/profiles/mis-servicios/crear/",
          data,
          { headers: { Authorization: `Bearer ${token}` } }
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
    <form onSubmit={handleSubmit} className="rounded-lg border bg-white p-6 shadow-sm space-y-4">
      <h3 className="text-xl font-bold">
        {servicio ? "Editar Servicio" : "Nuevo Servicio"}
      </h3>

      <div className="space-y-2">
        <label className="block font-semibold">Nombre *</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="w-full rounded-md border px-4 py-2"
          placeholder="Ej: Cita personal"
        />
      </div>

      <div className="space-y-2">
        <label className="block font-semibold">Descripción</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full rounded-md border px-4 py-2 resize-none"
          rows="3"
          placeholder="Descripción del servicio"
        />
      </div>

      <div className="space-y-2">
        <label className="block font-semibold">Precio ($)</label>
        <input
          type="number"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          step="0.01"
          min="0"
          className="w-full rounded-md border px-4 py-2"
          placeholder="Ej: 50000"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-lg border px-4 py-2 hover:bg-gray-50 disabled:opacity-60"
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
