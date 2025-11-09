"use client";
import { useState } from "react";
import useAuthStore from "@/store/auth";
import axios from "@/lib/axiosConfig";

export default function FormularioResena({ perfilId, onReviewSubmitted }) {
  const [puntuacion, setPuntuacion] = useState(5);
  const [comentario, setComentario] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const token = useAuthStore((s) => s.token);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Debes iniciar sesión para dejar una reseña");
      return;
    }

    if (!comentario.trim()) {
      setError("El comentario es requerido");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "/api/reviews/crear/",
        {
          perfil_id: perfilId,
          puntuacion,
          comentario,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSuccess("¡Reseña enviada correctamente!");
      setPuntuacion(5);
      setComentario("");
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err) {
      const apiError =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        "Error al enviar reseña";
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  if (!hasHydrated) {
    return null;
  }

  if (!token) {
    return (
      <div className="rounded-lg border bg-yellow-50 p-6">
        <p className="text-yellow-800">
          <a href="/login" className="font-semibold underline">
            Inicia sesión
          </a>{" "}
          para dejar una reseña
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white p-6">
      <h3 className="text-2xl font-bold mb-4">Dejar una reseña</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Puntuación */}
        <div className="space-y-2">
          <label className="block font-semibold">Puntuación</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setPuntuacion(star)}
                className={`text-4xl transition ${
                  star <= puntuacion ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600">{puntuacion} estrella(s)</p>
        </div>

        {/* Comentario */}
        <div className="space-y-2">
          <label className="block font-semibold">Comentario *</label>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Comparte tu experiencia..."
            required
            className="w-full rounded-md border px-4 py-2 resize-none"
            rows="5"
          />
        </div>

        {/* Errores y éxito */}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        {/* Botón enviar */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Enviando..." : "Enviar reseña"}
        </button>
      </form>
    </div>
  );
}
