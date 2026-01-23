"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import FormularioSubirFoto from "@/components/FormularioSubirFoto";
import GridFotos from "@/components/GridFotos";

export default function GaleriaPage() {
  
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFotos();
  }, []);

  const fetchFotos = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/profiles/mi-galeria/", {
      });
      setFotos(res.data || []);
    } catch (err) {
      console.error("Error al cargar fotos", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#120912] text-montserrat text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-10 py-10">
          <div>
            <p className="text-sm uppercase text-pink-200 font-semibold">xscort.cl</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Mi Galería</h1>
            <p className="text-pink-100 mt-1 text-sm sm:text-base">Sube y gestiona tus fotos</p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {/* Upload form (tarjeta) */}
            <div className="w-full lg:col-span-1">
              <div className="rounded-2xl bg-[#1b0d18] p-6 shadow-md">
                <h1 className="text-3xl font-semibold text-white mb-4">Subir Foto</h1>
                <FormularioSubirFoto onSuccess={fetchFotos} />
              </div>
            </div>

            {/* Photos grid (tarjeta grande) */}
            <div className="flex-1 lg:col-span-2 space-y-6">
              <div className="rounded-2xl bg-[#1b0d18] p-6 shadow-md">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Tus Fotos</h2>
                  <p className="text-sm text-pink-200">{loading ? "Cargando..." : `${fotos.length} fotos`}</p>
                </div>

                <div className="mt-4">
                  {loading ? (
                    <div className="text-center py-6">Cargando galería...</div>
                  ) : fotos.length === 0 ? (
                    <div className="text-center py-10 text-pink-200">
                      Aún no tienes fotos. Usa el formulario para subir la primera.
                    </div>
                  ) : (
                    <GridFotos fotos={fotos} onDelete={fetchFotos} loading={loading} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
