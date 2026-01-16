"use client";
import api from "@/lib/api";

export default function ListaServicios({ servicios, onEdit, onDelete, loading }) {
  

  const handleDeleteClick = async (id) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este servicio?")) {
      return;
    }

    try {
      await api.delete(`/api/profiles/mis-servicios/${id}/eliminar/`, {
      });
      if (onDelete) {
        onDelete();
      }
    } catch (err) {
      alert("Error al eliminar servicio");
      console.error(err);
    }
  };

  if (!servicios || servicios.length === 0) {
    return (
      <div className="rounded-lg border bg-[var(--color-card)] p-6 text-center">
        <p className="text-[color:var(--color-muted-foreground)]">No hay servicios aún. ¡Crea uno!</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-[var(--color-card)] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[color:var(--color-card)/0.04] border-b">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Nombre</th>
              <th className="px-6 py-3 text-center font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {servicios.map((servicio) => (
              <tr key={servicio.id} className="border-b hover:bg-[color:var(--color-card)/0.03]">
                <td className="px-6 py-4 font-semibold">
                  {servicio.catalogo?.nombre || "Personalizado"}
                  {servicio.custom_text ? ` (${servicio.custom_text})` : ""}
                </td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button
                    onClick={() => onEdit && onEdit(servicio)}
                    disabled={loading}
                    className="inline-block rounded bg-[color:var(--color-primary)] px-3 py-1 text-sm text-white hover:bg-[color:var(--color-primary)/0.9] disabled:opacity-60"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleDeleteClick(servicio.id)}
                    disabled={loading}
                    className="inline-block rounded bg-[color:var(--color-destructive)] px-3 py-1 text-sm text-white hover:bg-[color:var(--color-destructive)/0.9] disabled:opacity-60"
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
