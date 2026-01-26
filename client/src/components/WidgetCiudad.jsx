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

  // 1. Lógica segura: Detecta si llega objeto o texto y extrae el string correcto
  const nombreCiudadMostrar = 
    typeof ciudadActual === "object" && ciudadActual !== null
      ? ciudadActual.nombre
      : ciudadActual; 
  
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
      setError("Selecciona una ciudad nueva");
      return;
    }

    setLoading(true);
    try {
      await api.post(
        "/api/profiles/solicitar-cambio-ciudad/",
        { 
          ciudad_nueva: nuevaCiudadId 
        }
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
      <div className="rounded-lg bg-[var(--color-card)] p-6 shadow-sm bg-transparent border border-white/5">
        <h3 className="text-xl font-bold mb-4 font-montserrat text-white">Ubicación</h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-400 font-montserrat uppercase tracking-wider font-bold">Ciudad actual</p>
            
            {/* CORRECCIÓN AQUÍ: Usamos la variable segura, no el objeto directo */}
            <p className="text-2xl font-bold text-pink-500 font-montserrat">
              {nombreCiudadMostrar || "Sin ciudad"}
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="w-full rounded-lg bg-pink-600 px-4 py-2 text-white font-semibold hover:bg-pink-500 transition font-montserrat shadow-lg shadow-pink-600/20"
          >
            Solicitar Cambio
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="rounded-2xl bg-[#1b0d18] p-6 max-w-md w-full shadow-2xl border border-pink-500/20">
            <h2 className="text-2xl font-bold mb-4 font-montserrat text-white">Solicitar Cambio de Ciudad</h2>

            <form onSubmit={handleSolicitar} className="space-y-4">
              <div className="space-y-2 font-montserrat">
                <label className="block text-sm font-bold font-montserrat text-gray-300 uppercase">Nueva Ciudad *</label>
                <select
                  value={nuevaCiudadId}
                  onChange={(e) => setNuevaCiudadId(e.target.value)}
                  required
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white hover:border-pink-500/50 focus:border-pink-500 focus:outline-none transition [&>option]:text-black"
                >
                  <option value="">Selecciona una ciudad...</option>
                  {ciudades.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-xs text-gray-400 bg-white/5 p-3 rounded-lg font-montserrat border border-white/5">
                ℹ️ Tu solicitud será revisada por un administrador. Mientras se aprueba, tu perfil seguirá mostrándose en <strong>{nombreCiudadMostrar}</strong>.
              </p>

              {error && <p className="text-sm text-red-400 bg-red-900/20 p-2 rounded border border-red-500/30 font-montserrat">{error}</p>}
              {success && <p className="text-sm text-green-400 bg-green-900/20 p-2 rounded border border-green-500/30 font-montserrat">{success}</p>}

              <div className="flex gap-3 pt-4 font-montserrat">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                  className="flex-1 rounded-lg border border-white/10 px-4 py-2 text-gray-300 hover:bg-white/5 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-pink-600 px-4 py-2 text-white font-semibold hover:bg-pink-500 disabled:opacity-60 transition shadow-lg shadow-pink-600/20"
                >
                  {loading ? "Enviando..." : "Enviar Solicitud"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}