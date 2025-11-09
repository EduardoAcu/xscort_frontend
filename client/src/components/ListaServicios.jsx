"use client";
import useAuthStore from "@/store/auth";
import axios from "@/lib/axiosConfig";

export default function ListaServicios({ servicios, onEdit, onDelete, loading }) {
  const token = useAuthStore((s) => s.token);

  const handleDeleteClick = async (id) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este servicio?")) {
      return;
    }

    try {
      await axios.delete(`/api/profiles/mis-servicios/${id}/eliminar/`, {
        headers: { Authorization: `Bearer ${token}` },
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
      <div className="rounded-lg border bg-gray-50 p-6 text-center">
        <p className="text-gray-600">No hay servicios aún. ¡Crea uno!</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Nombre</th>
              <th className="px-6 py-3 text-left font-semibold">Descripción</th>
              <th className="px-6 py-3 text-left font-semibold">Precio</th>
              <th className="px-6 py-3 text-center font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {servicios.map((servicio) => (
              <tr key={servicio.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold">{servicio.nombre}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {servicio.descripcion || "-"}
                </td>
                <td className="px-6 py-4 font-bold text-blue-600">
                  ${servicio.precio || "N/A"}
                </td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button
                    onClick={() => onEdit && onEdit(servicio)}
                    disabled={loading}
                    className="inline-block rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600 disabled:opacity-60"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleDeleteClick(servicio.id)}
                    disabled={loading}
                    className="inline-block rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600 disabled:opacity-60"
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
