"use client";
import api from "@/lib/api";

export default function ListaServicios({ servicios, onDelete, loading }) {
  

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
      <div className="rounded-lg sm:rounded-xl bg-transparent bg-[var(--color-card)] p-4 sm:p-5 md:p-6 text-center">
        <p className="text-xs sm:text-sm md:text-base text-[color:var(--color-muted-foreground)]">No hay servicios aún. ¡Crea uno!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Desktop - Tabla */}
      <div className="hidden md:block rounded-lg sm:rounded-xl bg-[var(--color-card)] overflow-hidden shadow-sm bg-transparent font-montserrat">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[color:var(--color-card)/0.04] border-b">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left font-semibold text-sm md:text-base">Nombre</th>
                <th className="px-4 sm:px-6 py-3 text-center font-semibold text-sm md:text-base">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {servicios.map((servicio) => (
                <tr key={servicio.id} className="border-b hover:bg-[color:var(--color-card)/0.03]">
                  <td className="px-4 sm:px-6 py-4 font-semibold text-xs sm:text-sm md:text-base">
                    {servicio.catalogo?.nombre || "Personalizado"}
                    {servicio.custom_text ? ` (${servicio.custom_text})` : ""}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-center space-x-1 sm:space-x-2">
                    <button
                      onClick={() => handleDeleteClick(servicio.id)}
                      disabled={loading}
                      className="inline-block rounded bg-[color:var(--color-destructive)] px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold text-white hover:bg-[color:var(--color-destructive)/0.9] disabled:opacity-60 transition"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Móvil - Cards */}
      <div className="md:hidden space-y-3 sm:space-y-4">
        {servicios.map((servicio) => (
          <div key={servicio.id} className="rounded-lg border bg-[var(--color-card)] p-3 sm:p-4 font-montserrat">
            <p className="font-semibold text-xs sm:text-sm md:text-base mb-3">
              {servicio.catalogo?.nombre || "Personalizado"}
              {servicio.custom_text ? ` (${servicio.custom_text})` : ""}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => handleDeleteClick(servicio.id)}
                disabled={loading}
                className="flex-1 rounded bg-[color:var(--color-destructive)] px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-[color:var(--color-destructive)/0.9] disabled:opacity-60 transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
