"use client";
import { useState } from "react";
import api from "@/lib/api";
import useAuthStore from "@/store/auth";
import { Star, Send, AlertCircle, CheckCircle2, Lock } from "lucide-react";
import Link from "next/link";

export default function FormularioResena({ perfilId, onReviewSubmitted }) {
  const [puntuacion, setPuntuacion] = useState(5);
  const [hoverRating, setHoverRating] = useState(0); // Para efecto visual al pasar el mouse
  const [comentario, setComentario] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!comentario.trim()) {
      setError("Por favor escribe un comentario sobre tu experiencia.");
      return;
    }

    setLoading(true);
    try {
      await api.post(
        "/api/reviews/crear/",
        {
          perfil_modelo: perfilId,
          rating: puntuacion,
          comentario,
        }
      );
      setSuccess("¡Gracias! Tu reseña se ha publicado.");
      setPuntuacion(5);
      setComentario("");
      if (onReviewSubmitted) {
        // Pequeño delay para que el usuario lea el mensaje de éxito antes de refrescar
        setTimeout(() => onReviewSubmitted(), 1500);
      }
    } catch (err) {
      const apiError = err?.response?.data?.detail || "Error al enviar la reseña. Inténtalo de nuevo.";
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  if (!hasHydrated) return null;

  // ESTADO: NO LOGUEADO
  if (!isAuthenticated) {
    return (
      <div className="bg-[#120912] border border-dashed border-white/10 rounded-2xl p-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 mb-3">
          <Lock className="w-5 h-5 text-pink-500" />
        </div>
        <h4 className="text-white font-bold mb-2">¿Ya conoces a esta modelo?</h4>
        <p className="text-sm text-gray-400 mb-4">
          Necesitas iniciar sesión para compartir tu experiencia y ayudar a otros usuarios.
        </p>
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors"
        >
          Iniciar Sesión
        </Link>
      </div>
    );
  }

  // ESTADO: LOGUEADO (Formulario)
  return (
    <div className="bg-[#120912] border border-white/5 rounded-2xl p-6 shadow-xl">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Star className="w-5 h-5 text-pink-500 fill-pink-500" />
        Deja tu Opinión
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Selector de Estrellas */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Calificación</label>
          <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setPuntuacion(star)}
                onMouseEnter={() => setHoverRating(star)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star 
                  className={`w-8 h-8 transition-colors ${
                    star <= (hoverRating || puntuacion) 
                      ? "text-yellow-400 fill-yellow-400" 
                      : "text-gray-700 fill-gray-900"
                  }`} 
                />
              </button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tu Experiencia</label>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="¿Qué tal fue el servicio? Cuéntanos detalles..."
            required
            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all resize-none"
            rows="4"
          />
        </div>

        {/* Mensajes de Estado */}
        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}
        
        {success && (
          <div className="flex items-center gap-2 text-green-400 text-sm bg-green-500/10 p-3 rounded-lg border border-green-500/20">
            <CheckCircle2 className="w-4 h-4" /> {success}
          </div>
        )}

        {/* Botón */}
        <div className="flex justify-end">
            <button
            type="submit"
            disabled={loading || success}
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-pink-900/20 active:scale-95"
            >
            {loading ? (
                <span className="animate-pulse">Enviando...</span>
            ) : (
                <>
                Enviar Reseña <Send className="w-4 h-4" />
                </>
            )}
            </button>
        </div>
      </form>
    </div>
  );
}