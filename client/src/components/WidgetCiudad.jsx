"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function WidgetCiudad({ ciudadActual }) {
  const [showModal, setShowModal] = useState(false);
  const [nuevaCiudadId, setNuevaCiudadId] = useState("");
  const [ciudades, setCiudades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  useEffect(() => {
    const fetchCiudades = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/profiles/ciudades/`, { next: { revalidate: 300 } });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setCiudades(data);
      } catch {
        setCiudades([]);
      }
    };
    fetchCiudades();
  }, []);

  const handleSolicitar = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!nuevaCiudadId) {
      setError("Selecciona una ciudad");
      setError("Ingresa una nueva ciudad");
      return;
    }

    setLoading(true);
    try {
      await api.post(
        "/api/profiles/solicitar-cambio-ciudad/",
        { ciudad_nueva_id: nuevaCiudadId },
      );
      setSuccess("¡Solicitud enviada! Será revisada por un administrador.");
      setNuevaCiudadId("");
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
      <div className="rounded-lg bg-[var(--color-card)] p-6 shadow-sm bg-transparent">
        <h3 className="text-xl font-bold mb-4 font-montserrat">Ubicación</h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-[color:var(--color-muted-foreground)] font-montserrat">Ciudad actual</p>
            <p className="text-2xl font-bold text-white-600 font-montserrat">{ciudadActual || "No especificada"}</p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="w-full rounded-lg bg-pink-600 px-4 py-2 text-white font-semibold hover:bg-pink-500 transition font-montserrat"
          >
            Solicitar Cambio de Ciudad
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="rounded-lg bg-zinc-950 p-6 max-w-md w-full shadow-lg border border-gray-800">
            <h2 className="text-2xl font-bold mb-4 font-montserrat text-white">Solicitar Cambio de Ciudad</h2>

            <form onSubmit={handleSolicitar} className="space-y-4">
              <div className="space-y-2 font-montserrat">
                <label className="block text-sm font-medium font-montserrat text-gray-300">Nueva Ciudad *</label>
                <select
                  value={nuevaCiudadId}
                  onChange={(e) => setNuevaCiudadId(e.target.value)}
                  required
                  className="w-full rounded-md border border-gray-700 bg-zinc-900 px-4 py-2 text-white hover:border-gray-600 focus:border-pink-500 focus:outline-none transition"
                >
                  <option value="">Selecciona una ciudad</option>
                  {ciudades.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <p className="text-xs text-gray-400 bg-zinc-900/50 p-3 rounded font-montserrat border border-gray-800">
                Tu solicitud será revisada por un administrador. Este proceso puede tomar un tiempo.
              </p>

              {error && <p className="text-sm text-red-500 font-montserrat">{error}</p>}
              {success && <p className="text-sm text-green-500 font-montserrat">{success}</p>}

              <div className="flex gap-3 pt-4 font-montserrat">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                  className="flex-1 rounded-lg border border-gray-700 px-4 py-2 text-gray-300 hover:bg-zinc-900 hover:border-gray-600 disabled:opacity-60 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-pink-600 px-4 py-2 text-white font-semibold hover:bg-pink-700 disabled:opacity-60 transition"
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
