"use client";
import { useState } from "react";
import api from "@/lib/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function FormularioFotoPerfil({ initialFotoUrl, onSuccess }) {
  
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initialFotoUrl || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result || null);
    };
    reader.readAsDataURL(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!file) {
      setError("Selecciona una foto");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("foto_perfil", file);

      const res = await api.patch("/api/profiles/mi-perfil/actualizar/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const nuevaFoto = res.data?.foto_perfil;
      if (nuevaFoto) {
        const url = nuevaFoto.startsWith("http") ? nuevaFoto : `${API_BASE_URL}${nuevaFoto}`;
        setPreview(url);
        if (onSuccess) onSuccess(url);
      }
      setFile(null);
    } catch (err) {
      const apiError =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        "Error al actualizar foto de perfil";
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border bg-[var(--color-card)] p-6 shadow-sm space-y-4">
      <h3 className="text-lg font-bold">Foto de perfil</h3>
      <p className="text-xs text-gray-600">
        Esta foto se mostrará en tu perfil público y en el panel.
      </p>

      {preview && (
        <div className="flex justify-center">
          <img
            src={preview}
            alt="Foto de perfil"
            className="h-32 w-32 rounded-full object-cover border"
          />
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-semibold">Selecciona una foto *</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
        <p className="text-xs text-gray-500">Formatos recomendados: JPG o PNG, máximo 5MB.</p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading || !file}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Guardando..." : "Actualizar foto"}
      </button>
    </form>
  );
}
