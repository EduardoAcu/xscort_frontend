"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner"; // Importamos para feedback visual
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import FormularioSubirFoto from "@/components/FormularioSubirFoto";
import GridFotos from "@/components/GridFotos";
import { Images, ImagePlus } from "lucide-react";

export default function GaleriaPage() {
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFotos();
  }, []);

  const fetchFotos = async () => {
    try {
      setLoading(true);
      // GET a /api/profiles/mi-galeria/ (Correcto según tu urls.py)
      const res = await api.get("/api/profiles/mi-galeria/");
      setFotos(res.data || []);
    } catch (err) {
      console.error("Error al cargar fotos", err);
      // Feedback usuario:
      if (err?.response?.status !== 404) {
         toast.error("Error al cargar la galería. Intenta recargar.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // IMPORTANTE: Agregamos requireModel para seguridad
    <ProtectedRoute requireModel>
      <div className="min-h-screen bg-[#120912] text-montserrat text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-10 py-10">
          
          {/* Header */}
          <div className="mb-8">
            <p className="text-sm uppercase text-pink-200 font-semibold tracking-wider">xscort.cl</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-2">Mi Galería</h1>
            <p className="text-pink-100 mt-2 text-sm sm:text-base opacity-80">
              Sube fotos para atraer más clientes. Las primeras fotos definen tu portada.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Columna Izquierda: Formulario de Subida */}
            <div className="w-full lg:col-span-1">
              <div className="rounded-2xl bg-[#1b0d18] p-6 shadow-xl border border-white/5 sticky top-24">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  Subir Foto
                </h2>
                {/* Pasamos fetchFotos para que recargue la grilla al subir */}
                <FormularioSubirFoto onSuccess={fetchFotos} />
              </div>
            </div>

            {/* Columna Derecha: Grilla de Fotos */}
            <div className="flex-1 lg:col-span-2 space-y-6">
              <div className="rounded-2xl bg-[#1b0d18] p-6 shadow-xl border border-white/5 min-h-[400px]">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Images className="w-5 h-5" />
                    Tus Fotos
                  </h2>
                  <span className="text-xs bg-pink-900/30 text-pink-200 px-3 py-1 rounded-full border border-pink-500/20">
                    {loading ? "..." : `${fotos.length} fotos`}
                  </span>
                </div>

                <div className="mt-4">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                       <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                       <p className="text-gray-400 text-sm">Cargando tu galería...</p>
                    </div>
                  ) : fotos.length === 0 ? (
                    <div className="text-center py-20 px-6 border-2 border-dashed border-white/10 rounded-xl bg-white/5">
                      <ImagePlus className="w-12 h-12 text-pink-500 mx-auto mb-3" />
                      <p className="text-pink-100 font-semibold">Tu galería está vacía</p>
                    </div>
                  ) : (
                    // Aquí pasamos las fotos y la función para recargar al borrar
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