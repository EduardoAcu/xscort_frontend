"use client";
import { useState } from "react";
import api from "@/lib/api";
import { Trash2, Loader2, Calendar, AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";

// Aseguramos que la URL base no tenga slash final
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");

// ============================================================
// 1. COMPONENTE DIALOG UI (MODAL PERSONALIZADO)
// ============================================================
function ConfirmationModal({ isOpen, onClose, onConfirm, isDeleting }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop (Fondo oscuro borroso) */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={!isDeleting ? onClose : undefined} 
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-sm bg-[#1a1018] border border-white/10 rounded-2xl p-6 shadow-2xl shadow-pink-900/10 scale-100 animate-in zoom-in-95 duration-200">
        
        <div className="flex flex-col items-center text-center gap-4">
          {/* Icono de Alerta */}
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white font-fancy">
              ¿Eliminar esta foto?
            </h3>
            <p className="text-sm text-gray-400">
              Esta acción es permanente y no se puede deshacer. La foto dejará de ser visible en tu perfil.
            </p>
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-3 w-full mt-2">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-gray-300 font-semibold hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold shadow-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Borrando...
                </>
              ) : (
                "Sí, eliminar"
              )}
            </button>
          </div>
        </div>

        {/* Botón cerrar esquina */}
        {!isDeleting && (
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                <X className="w-5 h-5" />
            </button>
        )}
      </div>
    </div>
  );
}

// ============================================================
// 2. COMPONENTE PRINCIPAL (GRID)
// ============================================================
export default function GridFotos({ fotos, onDelete }) {
  // Estado para controlar qué foto se quiere borrar
  const [photoToDelete, setPhotoToDelete] = useState(null); 
  const [isDeleting, setIsDeleting] = useState(false);

  // Paso 1: El usuario hace clic en el botón de la tarjeta -> Abrimos Modal
  const requestDelete = (id) => {
    setPhotoToDelete(id);
  };

  // Paso 2: El usuario confirma en el Modal -> Ejecutamos API
  const confirmDelete = async () => {
    if (!photoToDelete) return;

    try {
      setIsDeleting(true);
      await api.delete(`/api/profiles/mi-galeria/${photoToDelete}/`);
      toast.success("Foto eliminada correctamente");
      
      if (onDelete) onDelete();
      setPhotoToDelete(null);
    } catch (err) {
      console.error(err);
      toast.error("Error al eliminar. Intenta nuevamente.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper URL
  const getImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  };

  if (!fotos || fotos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#1a1018]/50 p-12 text-center">
        {/* ... (código de estado vacío igual al anterior) ... */}
        <h3 className="text-lg font-bold text-white mb-1">Tu galería está vacía</h3>
        <p className="text-gray-400 text-sm">Sube fotos de alta calidad para atraer más clientes.</p>
      </div>
    );
  }

  return (
    <>
      {/* RENDERIZADO DEL MODAL */}
      <ConfirmationModal 
        isOpen={!!photoToDelete} 
        onClose={() => setPhotoToDelete(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />

      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <h3 className="text-xl font-bold text-white font-fancy">Mi Galería</h3>
          <span className="px-2 py-1 rounded bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-bold">
              {fotos.length} Fotos
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {fotos.map((foto) => (
            <div 
              key={foto.id} 
              className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-black border border-white/10 hover:border-pink-500/50 transition-all shadow-lg"
            >
              <img
                src={getImageUrl(foto.imagen)}
                alt="Foto de galería"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                {/* Al hacer click, se solicita el borrado (no borramos directo) */}
                <button
                  onClick={() => requestDelete(foto.id)}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg transform transition-transform active:scale-95"
                >
                  <Trash2 className="w-5 h-5" /> Eliminar
                </button>
              </div>

              {foto.fecha_subida && (
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1 text-[10px] text-gray-300 font-medium opacity-80">
                  <Calendar className="w-3 h-3" />
                  {new Date(foto.fecha_subida).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}