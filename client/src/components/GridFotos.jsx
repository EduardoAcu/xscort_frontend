"use client";
import api from "@/lib/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function GridFotos({ fotos, onDelete, loading }) {
  

  const handleDeleteClick = async (id) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta foto?")) {
      return;
    }

    try {
      await api.delete(`/api/profiles/mi-galeria/${id}/eliminar/`, {
      });
      if (onDelete) {
        onDelete();
      }
    } catch (err) {
      alert("Error al eliminar foto");
      console.error(err);
    }
  };

  if (!fotos || fotos.length === 0) {
    return (
      <div className="rounded-lg border bg-[var(--color-card)] p-12 text-center">
        <p className="text-[color:var(--color-muted-foreground)]">No hay fotos aún. ¡Sube tu primera foto!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Mi Galería ({fotos.length})</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fotos.map((foto) => (
          <div key={foto.id} className="group relative overflow-hidden rounded-lg shadow-md">
            {/* Image */}
            <img
              src={foto.imagen?.startsWith("http") ? foto.imagen : `${API_BASE_URL}${foto.imagen}`}
              alt={`Foto ${foto.id}`}
              className="h-64 w-full object-cover"
            />

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <button
                onClick={() => handleDeleteClick(foto.id)}
                disabled={loading}
                className="rounded bg-[color:var(--color-destructive)] px-4 py-2 text-white font-semibold hover:bg-[color:var(--color-destructive)/0.9] disabled:opacity-60"
              >
                🗑️ Eliminar
              </button>
            </div>

            {/* Date */}
            {foto.fecha_subida && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-30 px-3 py-1 text-xs text-white">
                {new Date(foto.fecha_subida).toLocaleDateString()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
