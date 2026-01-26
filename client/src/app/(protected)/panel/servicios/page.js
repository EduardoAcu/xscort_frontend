"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ServiciosPage() {
  const [catalogo, setCatalogo] = useState([]); // Todos los servicios disponibles
  const [misServiciosIds, setMisServiciosIds] = useState(new Set()); // IDs seleccionados (Set para búsqueda rápida)
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 1. Hacemos dos peticiones en paralelo: Catálogo y Mi Perfil
      const [resCatalogo, resPerfil] = await Promise.all([
        api.get("/api/profiles/servicios/"),      // Catálogo global
        api.get("/api/profiles/mi-perfil/")       // Mis datos actuales
      ]);

      setCatalogo(resCatalogo.data || []);
      
      // 2. Extraemos los IDs de los servicios que la modelo YA tiene
      // La API devuelve objetos completos {id, nombre...}, mapeamos solo a IDs
      const currentIds = new Set(resPerfil.data.servicios.map(s => s.id));
      setMisServiciosIds(currentIds);
      
      setError("");
    } catch (err) {
      console.error("Error cargando datos", err);
      setError("Error al cargar los servicios. Intenta recargar la página.");
    } finally {
      setLoading(false);
    }
  };

  const toggleServicio = (id) => {
    setMisServiciosIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id); // Si lo tenía, lo quita
      } else {
        next.add(id);    // Si no lo tenía, lo agrega
      }
      return next;
    });
    setSuccess(""); // Limpiar mensaje de éxito si edita algo nuevo
  };

  const handleSave = async () => {
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // Convertimos el Set a Array para enviarlo al backend
      const payload = {
        servicios: Array.from(misServiciosIds)
      };

      // PATCH al perfil general
      await api.patch("/api/profiles/mi-perfil/", payload);
      
      setSuccess("¡Servicios actualizados correctamente!");
      window.scrollTo(0, 0);
    } catch (err) {
      setError("Error al guardar los cambios.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requireModel>
        <div className="min-h-screen bg-[#120912] flex items-center justify-center text-white">
          <div className="animate-pulse">Cargando catálogo...</div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireModel>
      <div className="min-h-screen bg-[#120912] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-10 py-10">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
            <div>
              <p className="text-sm uppercase text-pink-200 font-semibold font-montserrat">xscort.cl</p>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-montserrat mt-2">Mis Servicios</h1>
              <p className="text-pink-100 mt-2 text-sm sm:text-base font-montserrat opacity-80">
                Selecciona los servicios que ofreces para que aparezcan en tu perfil.
              </p>
            </div>
            
            <button
              onClick={handleSave}
              disabled={submitting}
              className="w-full md:w-auto px-6 py-3 bg-[#ff007f] hover:bg-pink-600 text-white font-bold rounded-xl shadow-lg shadow-pink-600/20 transition-all disabled:opacity-50"
            >
              {submitting ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 text-red-200 rounded-lg text-sm font-montserrat">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-900/20 border border-green-500/50 text-green-200 rounded-lg text-sm font-montserrat">
              {success}
            </div>
          )}

          {/* Grid de Selección */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {catalogo.map((servicio) => {
              const isSelected = misServiciosIds.has(servicio.id);
              
              return (
                <div
                  key={servicio.id}
                  onClick={() => toggleServicio(servicio.id)}
                  className={`
                    relative group cursor-pointer rounded-xl p-4 border transition-all duration-200
                    flex items-center gap-3
                    ${isSelected 
                      ? "bg-pink-900/20 border-pink-500 shadow-[0_0_15px_rgba(255,0,127,0.15)]" 
                      : "bg-[#1b0d18] border-white/5 hover:border-white/20 hover:bg-white/5"
                    }
                  `}
                >
                  {/* Checkbox Visual */}
                  <div className={`
                    w-6 h-6 rounded-md border flex items-center justify-center transition-colors
                    ${isSelected ? "bg-pink-500 border-pink-500" : "border-gray-600 group-hover:border-gray-400"}
                  `}>
                    {isSelected && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  {/* Info Servicio */}
                  <div className="flex-1">
                    <p className={`font-bold font-montserrat text-sm ${isSelected ? "text-white" : "text-gray-300"}`}>
                      {servicio.nombre}
                    </p>
                    {/* Si decides usar los iconos de texto más adelante */}
                    {servicio.icono && (
                        <span className="text-xs text-gray-500 font-mono hidden">{servicio.icono}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

            {/* Empty State si no cargó el catálogo */}
            {!loading && catalogo.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    <p>No se encontraron servicios disponibles en el sistema.</p>
                </div>
            )}

        </div>
      </div>
    </ProtectedRoute>
  );
}