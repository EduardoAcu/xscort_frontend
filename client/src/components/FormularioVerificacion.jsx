"use client";
import { useState } from "react";
import api from "@/lib/api";
import { 
  ShieldCheck, 
  EyeOff, 
  UserCheck, 
  UploadCloud, 
  Info, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function FormularioVerificacion({ onSuccess, ciudadId }) {
  const [fotoDocumento, setFotoDocumento] = useState(null);
  const [selfieConDocumento, setSelfieConDocumento] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(null);
  const [previewSelfie, setPreviewSelfie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const subirDocumentos = async () => {
    const formData = new FormData();
    if (fotoDocumento) formData.append("foto_documento", fotoDocumento);
    if (selfieConDocumento) formData.append("selfie_con_documento", selfieConDocumento);
    if (ciudadId) formData.append("ciudad_id", ciudadId); 
    
    await api.post("/api/verification/upload-documents/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fotoDocumento || !selfieConDocumento) {
      setError("Debes subir ambas fotos para poder verificarte.");
      return;
    }

    setLoading(true);
    try {
      await subirDocumentos();
      setSuccess("¡Documentos enviados correctamente! Serán revisados en breve.");
      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
    } catch (err) {
      const apiError =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        (typeof err?.response?.data === "object"
          ? Object.values(err?.response?.data)[0]?.[0]
          : "Error al subir documentos. Inténtalo de nuevo.");
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Reduje el space-y-6 a space-y-4 en móviles para que no quede tan estirado
    <form onSubmit={handleSubmit} className="w-full space-y-4 sm:space-y-6 animate-in fade-in">
      
      {/* CUADRO DE CONFIANZA */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 sm:p-4 flex gap-2 sm:gap-3 items-start">
        <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-green-400 font-bold font-montserrat text-xs sm:text-sm mb-1">
            Verificación 100% Segura
          </h4>
          <p className="text-gray-300 text-[11px] sm:text-xs font-montserrat leading-relaxed">
            Por tu seguridad, te pedimos explícitamente que 
            <strong className="text-white"> TAPES con un papel o tu dedo </strong> 
            tu RUT, apellidos y número de serie del carnet.
          </p>
        </div>
      </div>

      {/* INSTRUCCIONES CLARAS */}
      <div className="bg-[#1a1018] rounded-xl p-3 sm:p-4 border border-white/5 space-y-2 sm:space-y-3">
        <h5 className="text-xs sm:text-sm font-bold text-gray-300 font-montserrat flex items-center gap-2">
          <Info className="w-4 h-4 text-pink-500 flex-shrink-0" /> ¿Qué mostrar y qué ocultar?
        </h5>
        <ul className="text-[11px] sm:text-xs text-gray-400 space-y-2 font-montserrat">
          <li className="flex items-start gap-2">
            <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0 mt-0.5" />
            <span><strong>SÍ NECESITAMOS VER:</strong> Foto del carnet, primer nombre y fecha de nacimiento (+18).</span>
          </li>
          <li className="flex items-start gap-2">
            <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span><strong>DEBES OCULTAR:</strong> Tu RUT, número de documento y apellidos.</span>
          </li>
        </ul>
      </div>

      {/* CONTENEDOR DE INPUTS */}
      <div className="space-y-4 sm:space-y-5">
        
        {/* INPUT 1: FOTO DEL DOCUMENTO */}
        <div className="space-y-1.5">
          <label className="text-[11px] sm:text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wide ml-1">
            1. Foto de tu carnet (Censurado)
          </label>
          <label className="block border-2 border-dashed border-white/10 hover:border-pink-500/50 transition-colors rounded-xl p-1 text-center bg-[#1a1018] cursor-pointer group relative overflow-hidden">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "documento")}
              className="hidden"
            />
            
            {previewFoto ? (
              // Altura reducida en móviles (h-36) y normal en PC (sm:h-48)
              <div className="relative w-full h-36 sm:h-48 rounded-lg overflow-hidden group">
                <img src={previewFoto} alt="Preview Documento" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white font-bold font-montserrat text-xs sm:text-sm bg-black/60 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg backdrop-blur-sm">Cambiar Foto</span>
                </div>
              </div>
            ) : (
              // Padding reducido en móviles (py-5)
              <div className="py-5 sm:py-8 px-2">
                <UploadCloud className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500 group-hover:text-pink-500 mx-auto mb-2 transition-colors" />
                <p className="text-xs sm:text-sm text-gray-300 font-montserrat font-medium">Toca aquí para subir la foto</p>
                <p className="text-[10px] text-gray-500 mt-1 font-montserrat leading-tight">Recuerda tapar tus datos sensibles primero.</p>
              </div>
            )}
          </label>
        </div>

        {/* INPUT 2: SELFIE CON EL DOCUMENTO */}
        <div className="space-y-1.5">
          <label className="text-[11px] sm:text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wide ml-1">
            2. Selfie sosteniendo el carnet
          </label>
          <label className="block border-2 border-dashed border-white/10 hover:border-pink-500/50 transition-colors rounded-xl p-1 text-center bg-[#1a1018] cursor-pointer group relative overflow-hidden">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "selfie")}
              className="hidden"
            />
            
            {previewSelfie ? (
              <div className="relative w-full h-36 sm:h-48 rounded-lg overflow-hidden group">
                <img src={previewSelfie} alt="Preview Selfie" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white font-bold font-montserrat text-xs sm:text-sm bg-black/60 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg backdrop-blur-sm">Cambiar Selfie</span>
                </div>
              </div>
            ) : (
              <div className="py-5 sm:py-8 px-2">
                <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500 group-hover:text-pink-500 mx-auto mb-2 transition-colors" />
                <p className="text-xs sm:text-sm text-gray-300 font-montserrat font-medium">Toca para subir una selfie</p>
                <p className="text-[10px] text-gray-500 mt-1 font-montserrat leading-tight">Tu cara y el carnet censurado deben verse claros.</p>
              </div>
            )}
          </label>
        </div>

      </div>

      {/* MENSAJES DE ERROR Y ÉXITO */}
      {error && (
        <div className="flex gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-xs sm:text-sm items-center font-montserrat">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="flex gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-300 text-xs sm:text-sm items-center font-montserrat">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* BOTÓN DE ENVÍO */}
      <button
        type="submit"
        disabled={loading || !fotoDocumento || !selfieConDocumento}
        className="w-full py-3 sm:py-4 bg-pink-600 hover:bg-pink-700 text-white font-montserrat font-bold rounded-xl shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 text-sm sm:text-base"
      >
        {loading ? (
           <span className="flex items-center gap-2 animate-pulse">
             <UploadCloud className="w-4 h-4 sm:w-5 sm:h-5 animate-bounce" /> Subiendo...
           </span>
        ) : (
          "Enviar Verificación Segura"
        )}
      </button>
    </form>
  );
}