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
      <div className="rounded-lg border bg-[var(--color-card)] p-6 shadow-sm bg-transparent">
        <h3 className="text-xl font-bold mb-4">Ubicación</h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-[color:var(--color-muted-foreground)]">Ciudad actual</p>
            <p className="text-2xl font-bold text-white-600">{ciudadActual || "No especificada"}</p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="w-full rounded-lg bg-pink-600 px-4 py-2 text-white font-semibold hover:bg-pink-500 transition"
          >
            Solicitar Cambio de Ciudad
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 ">
          <div className="rounded-lg bg-[var(--color-card)] p-6 max-w-md w-full shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Solicitar Cambio de Ciudad</h2>

            <form onSubmit={handleSolicitar} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Nueva Ciudad *</label>
                <select
                  value={nuevaCiudadId}
                  onChange={(e) => setNuevaCiudadId(e.target.value)}
                  required
                  className="w-full rounded-md border px-4 py-2"
                >
                  <option value="">Selecciona una ciudad</option>
                  {ciudades.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <p className="text-xs text-[color:var(--color-muted-foreground)] bg-[color:var(--color-card)/0.04] p-3 rounded">
                Tu solicitud será revisada por un administrador. Este proceso puede tomar un tiempo.
              </p>

              {error && <p className="text-sm text-red-600">{error}</p>}
              {success && <p className="text-sm text-green-600">{success}</p>}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                  className="flex-1 rounded-lg border px-4 py-2 hover:bg-[color:var(--color-card)/0.03] disabled:opacity-60"
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
