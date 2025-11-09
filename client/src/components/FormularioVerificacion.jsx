"use client";
import { useState } from "react";
import useAuthStore from "@/store/auth";
import axios from "@/lib/axiosConfig";

export default function FormularioVerificacion({ onSuccess }) {
  const [fotoDocumento, setFotoDocumento] = useState(null);
  const [selfieConDocumento, setSelfieConDocumento] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(null);
  const [previewSelfie, setPreviewSelfie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = useAuthStore((s) => s.token);

  const handleFileChange = (e, type) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (type === "documento") {
          setFotoDocumento(file);
          setPreviewFoto(event.target?.result);
        } else {
          setSelfieConDocumento(file);
          setPreviewSelfie(event.target?.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fotoDocumento && !selfieConDocumento) {
      setError("Debes subir al menos un documento");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      if (fotoDocumento) {
        formData.append("foto_documento", fotoDocumento);
      }
      if (selfieConDocumento) {
        formData.append("selfie_con_documento", selfieConDocumento);
      }

      await axios.post(
        "/api/verification/upload-documents/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess("¡Documentos enviados correctamente! Serán revisados por nuestro equipo.");
      setFotoDocumento(null);
      setSelfieConDocumento(null);
      setPreviewFoto(null);
      setPreviewSelfie(null);
      
      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
    } catch (err) {
      const apiError =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        (typeof err?.response?.data === "object"
          ? Object.values(err?.response?.data)[0]?.[0]
          : "Error al subir documentos");
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border bg-white p-6 shadow-sm space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Documentos de Verificación</h3>
        <p className="text-sm text-gray-600">
          Carga tus documentos para verificar tu identidad. Necesitamos al menos uno.
        </p>
      </div>

      {/* Foto del Documento */}
      <div className="space-y-3">
        <label className="block font-semibold">📄 Foto del Documento</label>
        <p className="text-xs text-gray-600">
          Foto clara de tu identificación (ambos lados si es necesario)
        </p>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, "documento")}
          className="w-full rounded-md border px-4 py-2"
        />
        {previewFoto && (
          <div className="rounded-lg overflow-hidden">
            <img src={previewFoto} alt="Preview Documento" className="w-full max-h-64 object-cover" />
          </div>
        )}
      </div>

      {/* Selfie con Documento */}
      <div className="space-y-3">
        <label className="block font-semibold">🤳 Selfie con Documento</label>
        <p className="text-xs text-gray-600">
          Tu foto sosteniendo el documento (para verificar que eres tú)
        </p>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, "selfie")}
          className="w-full rounded-md border px-4 py-2"
        />
        {previewSelfie && (
          <div className="rounded-lg overflow-hidden">
            <img src={previewSelfie} alt="Preview Selfie" className="w-full max-h-64 object-cover" />
          </div>
        )}
      </div>

      {/* Important info */}
      <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 space-y-2">
        <p className="font-semibold text-sm text-blue-900">⚠️ Importante:</p>
        <ul className="text-xs text-blue-900 space-y-1">
          <li>• Los documentos deben ser claros y legibles</li>
          <li>• Solo aceptamos identificaciones oficiales</li>
          <li>• La revisión puede tomar 1-3 días hábiles</li>
          <li>• Si son rechazados, puedes volver a intentar</li>
        </ul>
      </div>

      {error && <p className="text-sm text-red-600 font-semibold">{error}</p>}
      {success && <p className="text-sm text-green-600 font-semibold">{success}</p>}

      <button
        type="submit"
        disabled={loading || (!fotoDocumento && !selfieConDocumento)}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white font-semibold hover:bg-blue-700 disabled:opacity-60 transition"
      >
        {loading ? "Enviando..." : "📤 Enviar Documentos"}
      </button>
    </form>
  );
}
