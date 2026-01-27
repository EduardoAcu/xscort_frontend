"use client";
import { useState, useRef } from "react";
import api from "@/lib/api";
import { Camera, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner"; // Asegúrate de tener sonner instalado

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function FormularioFotoPerfil({ initialFotoUrl, onSuccess }) {
  
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(
    initialFotoUrl 
      ? (initialFotoUrl.startsWith("http") ? initialFotoUrl : `${API_BASE_URL}${initialFotoUrl}`) 
      : null
  );
  const [loading, setLoading] = useState(false);
  
  // Referencia para activar el input oculto
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // Validación de tamaño (5MB)
    if (selected.size > 5 * 1024 * 1024) {
      toast.error("La imagen es muy pesada (Máximo 5MB)");
      return;
    }

    // Validación de tipo
    if (!selected.type.startsWith("image/")) {
      toast.error("El archivo debe ser una imagen (JPG, PNG)");
      return;
    }

    setFile(selected);
    
    // Crear preview rápido
    const objectUrl = URL.createObjectURL(selected);
    setPreview(objectUrl);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("foto_perfil", file);

      const res = await api.patch("/api/profiles/mi-perfil/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const nuevaFoto = res.data?.foto_perfil;
      if (nuevaFoto) {
        const url = nuevaFoto.startsWith("http") ? nuevaFoto : `${API_BASE_URL}${nuevaFoto}`;
        setPreview(url);
        if (onSuccess) onSuccess(url);
        toast.success("Foto de perfil actualizada");
        setFile(null); // Reseteamos el archivo seleccionado para ocultar el botón de guardar
      }
    } catch (err) {
      const apiError = err?.response?.data?.detail || "Error al subir la imagen";
      toast.error(apiError);
      // Revertir preview si falla
      if (initialFotoUrl) {
          const url = initialFotoUrl.startsWith("http") ? initialFotoUrl : `${API_BASE_URL}${initialFotoUrl}`;
          setPreview(url);
      } else {
          setPreview(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1a1018] border border-white/10 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        
        {/* ÁREA DE FOTO (Clickeable) */}
        <div className="relative group cursor-pointer" onClick={triggerFileInput}>
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#331926] group-hover:border-pink-500 transition-colors relative bg-black">
                {preview ? (
                    <img
                        src={preview}
                        alt="Foto de perfil"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <ImageIcon className="w-12 h-12" />
                    </div>
                )}
                
                {/* Overlay al pasar el mouse */}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                </div>
            </div>
            
            {/* Badge de edición */}
            <div className="absolute bottom-1 right-1 bg-pink-600 p-2 rounded-full border-2 border-[#1a1018] shadow-lg group-hover:scale-110 transition-transform">
                <Camera className="w-4 h-4 text-white" />
            </div>
        </div>

        {/* INFO Y ACCIONES */}
        <div className="flex-1 text-center sm:text-left space-y-3">
            <div>
                <h3 className="text-lg font-bold text-white font-fancy">Foto de Perfil</h3>
                <p className="text-sm text-gray-400 font-light">
                    Sube una foto clara y profesional. <br className="hidden sm:block"/>
                    Formatos: JPG o PNG. Máx 5MB.
                </p>
            </div>

            {/* Input oculto */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />

            {/* BOTONES DE ACCIÓN */}
            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                <button
                    type="button"
                    onClick={triggerFileInput}
                    className="px-4 py-2 rounded-lg border border-white/10 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                >
                    <Upload className="w-4 h-4" /> Seleccionar Archivo
                </button>

                {/* El botón de guardar solo aparece si hay un archivo nuevo seleccionado */}
                {file && (
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-sm font-bold shadow-lg shadow-pink-900/20 transition-all flex items-center gap-2 animate-in fade-in zoom-in"
                    >
                        {loading ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
                        ) : (
                            "Guardar Cambios"
                        )}
                    </button>
                )}
            </div>
        </div>

      </div>
    </div>
  );
}