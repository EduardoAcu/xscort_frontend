"use client";
import { useState } from "react";
import useAuthStore from "@/store/auth";
import axios from "@/lib/axiosConfig";

export default function FormularioSubirFoto({ onSuccess }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = useAuthStore((s) => s.token);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!file) {
      setError("Selecciona una foto");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("imagen", file);

      await axios.post(
        "/api/profiles/mi-galeria/subir/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setFile(null);
      setPreview(null);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const apiError =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        "Error al subir foto";
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border bg-white p-6 shadow-sm space-y-4">
      <h3 className="text-xl font-bold">Subir Foto</h3>

      {/* File input */}
      <div className="space-y-2">
        <label className="block font-semibold">Selecciona una foto *</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          required
          className="w-full rounded-md border px-4 py-2"
        />
        <p className="text-xs text-gray-600">Formatos: JPG, PNG, GIF (máx 5MB)</p>
      </div>

      {/* Preview */}
      {preview && (
        <div className="space-y-2">
          <p className="font-semibold">Vista previa</p>
          <img src={preview} alt="Preview" className="max-h-64 w-full object-cover rounded-md" />
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading || !file}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Subiendo..." : "📤 Subir Foto"}
      </button>
    </form>
  );
}
