"use client";
import { useState, useRef } from "react";
import api from "@/lib/api";
import { UploadCloud, X, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

export default function FormularioSubirFoto({ onSuccess }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const inputRef = useRef(null);

  // Manejar validación y previsualización
  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    // Validación: Tamaño (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("El archivo es demasiado grande (Máximo 5MB)");
      return;
    }

    // Validación: Tipo
    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Solo se permiten imágenes (JPG, PNG, GIF)");
      return;
    }

    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  };

  const handleChange = (e) => {
    handleFile(e.target.files?.[0]);
  };

  // --- Lógica Drag & Drop ---
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  // ---------------------------

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Debes seleccionar una foto primero");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("imagen", file);

      await api.post("/api/profiles/mi-galeria/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Foto añadida a tu galería");
      
      // Limpiar todo
      clearFile();
      
      // Recargar galería
      if (onSuccess) onSuccess();

    } catch (err) {
      console.error("Error subiendo foto:", err);
      const apiError = err?.response?.data?.detail || "Error al subir la imagen";
      toast.error(apiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1a1018] border border-white/10 rounded-2xl p-6 shadow-xl">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white font-fancy">Añadir a Galería</h3>
        <p className="text-sm text-gray-400 font-light">
          Sube tus mejores fotos para atraer más clientes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* ZONA DE CARGA (DRAG & DROP) */}
        {!preview ? (
          <div
            className={`
              relative h-48 rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-3
              ${dragActive 
                ? "border-pink-500 bg-pink-500/10" 
                : "border-white/10 bg-black/20 hover:border-white/30 hover:bg-black/40"
              }
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <div className="p-3 bg-[#2a1d25] rounded-full text-pink-500">
                <UploadCloud className="w-8 h-8" />
            </div>
            <div className="text-center px-4">
                <p className="text-sm font-bold text-gray-200">
                    Arrastra tu foto aquí
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    o haz clic para explorar archivos
                </p>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
          </div>
        ) : (
          /* PREVISUALIZACIÓN */
          <div className="relative h-64 rounded-xl overflow-hidden border border-white/10 bg-black group">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-contain"
            />
            {/* Overlay y Botón eliminar */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                    type="button"
                    onClick={clearFile}
                    className="bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur-sm transition-transform hover:scale-110"
                    title="Eliminar foto"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>
          </div>
        )}

        {/* BOTÓN DE SUBIDA */}
        <button
          type="submit"
          disabled={loading || !file}
          className="w-full py-3 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl shadow-lg shadow-pink-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Subiendo...</>
          ) : (
            <><ImageIcon className="w-5 h-5" /> Publicar Foto</>
          )}
        </button>
      </form>
    </div>
  );
}