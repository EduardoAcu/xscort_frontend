"use client";
import { useState } from "react";
import useAuthStore from "@/store/auth";
import axios from "@/lib/axiosConfig";

export default function WidgetCiudad({ ciudadActual }) {
  const [showModal, setShowModal] = useState(false);
  const [nuevaCiudad, setNuevaCiudad] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = useAuthStore((s) => s.token);

  const handleSolicitar = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!nuevaCiudad.trim()) {
      setError("Ingresa una nueva ciudad");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "/api/profiles/solicitar-cambio-ciudad/",
        { nueva_ciudad: nuevaCiudad },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("¡Solicitud enviada! Será revisada por un administrador.");
      setNuevaCiudad("");
      setTimeout(() => setShowModal(false), 2000);
    } catch (err) {
      const apiError =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        "Error al solicitar cambio de ciudad";
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h3 className="text-xl font-bold mb-4">Ubicación</h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Ciudad actual</p>
            <p className="text-2xl font-bold text-blue-600">{ciudadActual || "No especificada"}</p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 transition"
          >
            📍 Solicitar Cambio de Ciudad
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="rounded-lg bg-white p-6 max-w-md w-full shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Solicitar Cambio de Ciudad</h2>

            <form onSubmit={handleSolicitar} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Nueva Ciudad *</label>
                <input
                  type="text"
                  value={nuevaCiudad}
                  onChange={(e) => setNuevaCiudad(e.target.value)}
                  placeholder="Ej: Santiago, Valparaíso"
                  required
                  className="w-full rounded-md border px-4 py-2"
                />
              </div>

              <p className="text-xs text-gray-600 bg-blue-50 p-3 rounded">
                📌 Tu solicitud será revisada por un administrador. Este proceso puede tomar algunos días.
              </p>

              {error && <p className="text-sm text-red-600">{error}</p>}
              {success && <p className="text-sm text-green-600">{success}</p>}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                  className="flex-1 rounded-lg border px-4 py-2 hover:bg-gray-50 disabled:opacity-60"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
                >
                  {loading ? "Enviando..." : "Solicitar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
