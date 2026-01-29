"use client";
import { useState } from "react";
import api from "@/lib/api";
import { Trash2, Loader2, Calendar, AlertTriangle, X, Eye, EyeOff } from "lucide-react"; // Importamos Eye y EyeOff
import { toast } from "sonner";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");

// ... (El componente ConfirmationModal se mantiene IGUAL, no lo copies de nuevo si ya lo tienes) ...
function ConfirmationModal({ isOpen, onClose, onConfirm, isDeleting }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={!isDeleting ? onClose : undefined} />
      <div className="relative w-full max-w-sm bg-[#1a1018] border border-white/10 rounded-2xl p-6 shadow-2xl scale-100 animate-in zoom-in-95">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">¿Eliminar esta foto?</h3>
            <p className="text-sm text-gray-400">Esta acción es permanente.</p>
          </div>
          <div className="flex gap-3 w-full mt-2">
            <button onClick={onClose} disabled={isDeleting} className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5">Cancelar</button>
            <button onClick={onConfirm} disabled={isDeleting} className="flex-1 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold flex justify-center gap-2">
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sí, eliminar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// COMPONENTE PRINCIPAL (ACTUALIZADO)
// ============================================================
export default function GridFotos({ fotos, onDelete, onUpdate }) { // Agregamos onUpdate prop
  const [photoToDelete, setPhotoToDelete] = useState(null); 
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadingId, setLoadingId] = useState(null); // Para el spinner del ojo

  // --- LÓGICA DE ELIMINAR ---
  const requestDelete = (id) => setPhotoToDelete(id);

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
      toast.error("Error al eliminar.");
    } finally {
      setIsDeleting(false);
    }
  };

  // --- NUEVA LÓGICA: TOGGLE VISIBILIDAD ---
  const toggleVisibility = async (foto) => {
    try {
      setLoadingId(foto.id);
      // Invertimos el valor actual
      const nuevoEstado = !foto.es_publica;
      
      // Llamamos al endpoint con PATCH (actualización parcial)
      await api.patch(`/api/profiles/mi-galeria/${foto.id}/`, {
        es_publica: nuevoEstado
      });

      toast.success(nuevoEstado ? "Foto ahora es PÚBLICA" : "Foto OCULTADA del perfil");
      
      // Recargamos la lista
      if (onUpdate) onUpdate(); // Usamos onUpdate o onDelete para recargar
      else if (onDelete) onDelete();

    } catch (err) {
      console.error(err);
      toast.error("Error al cambiar visibilidad");
    } finally {
      setLoadingId(null);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  };

  // State Vacío
  if (!fotos || fotos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#1a1018]/50 p-12 text-center">
        <p className="text-gray-400 text-sm">No tienes fotos aún.</p>
      </div>
    );
  }

  return (
    <>
      <ConfirmationModal 
        isOpen={!!photoToDelete} 
        onClose={() => setPhotoToDelete(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-white font-fancy">Mi Galería</h3>
            <span className="px-2 py-1 rounded bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-bold">
                {fotos.length} Fotos
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {fotos.map((foto) => (
            <div 
              key={foto.id} 
              className={`group relative aspect-[3/4] overflow-hidden rounded-xl bg-black border transition-all shadow-lg ${
                foto.es_publica ? 'border-white/10' : 'border-red-500/30' // Borde rojo si está oculta
              }`}
            >
              <img
                src={getImageUrl(foto.imagen)}
                alt="Foto"
                className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                    !foto.es_publica ? 'opacity-50 grayscale' : '' // Efecto visual si está oculta
                }`}
                loading="lazy"
              />

              {/* Badge de Estado (Visible/Oculta) */}
              <div className="absolute top-2 left-2 z-10">
                {foto.es_publica ? (
                    <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold border border-green-500/30 backdrop-blur-md">
                        Pública
                    </span>
                ) : (
                    <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold border border-red-500/30 backdrop-blur-md flex items-center gap-1">
                        <EyeOff className="w-3 h-3" /> Oculta
                    </span>
                )}
              </div>

              {/* Overlay de Acciones */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
                
                {/* Botón 1: Visibilidad */}
                <button
                  onClick={() => toggleVisibility(foto)}
                  disabled={loadingId === foto.id}
                  className="flex items-center gap-2 bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-lg font-bold shadow-lg transform transition-transform active:scale-95 disabled:opacity-50 w-32 justify-center text-xs"
                >
                  {loadingId === foto.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                  ) : foto.es_publica ? (
                      <> <EyeOff className="w-4 h-4" /> Ocultar </>
                  ) : (
                      <> <Eye className="w-4 h-4" /> Publicar </>
                  )}
                </button>

                {/* Botón 2: Eliminar */}
                <button
                  onClick={() => requestDelete(foto.id)}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg transform transition-transform active:scale-95 w-32 justify-center text-xs"
                >
                  <Trash2 className="w-4 h-4" /> Eliminar
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </>
  );
}