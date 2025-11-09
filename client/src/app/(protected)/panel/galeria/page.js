"use client";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/auth";
import axios from "@/lib/axiosConfig";
import ProtectedRoute from "@/components/ProtectedRoute";
import FormularioSubirFoto from "@/components/FormularioSubirFoto";
import GridFotos from "@/components/GridFotos";

export default function GaleriaPage() {
  const token = useAuthStore((s) => s.token);
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchFotos();
    }
  }, [token]);

  const fetchFotos = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/profiles/mi-galeria/", {
        headers: { Authorization: `Bearer ${token}` },
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
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white px-6 py-8 sm:px-12 lg:px-24 shadow-sm border-b">
          <h1 className="text-4xl font-bold">Mi Galería</h1>
          <p className="text-gray-600 mt-2">Sube y gestiona tus fotos</p>
        </div>

        {/* Content */}
        <div className="px-6 py-12 sm:px-12 lg:px-24">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Upload form */}
            <div className="lg:col-span-1">
              <FormularioSubirFoto onSuccess={fetchFotos} />
            </div>

            {/* Photos grid */}
            <div className="lg:col-span-2">
              <GridFotos fotos={fotos} onDelete={fetchFotos} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
