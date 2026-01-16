"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import FormularioServicio from "@/components/FormularioServicio";
import ListaServicios from "@/components/ListaServicios";

export default function ServiciosPage() {
  
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingServicio, setEditingServicio] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchServicios();
  }, []);

  const fetchServicios = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/profiles/mis-servicios/", {
      });
      setServicios(res.data || []);
      setError("");
    } catch (err) {
      console.error("Error al cargar servicios", err);
      const apiError =
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        "Error al cargar servicios";
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setEditingServicio(null);
    fetchServicios();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#120912] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-10 py-10">
          <div>
            <p className="text-sm uppercase text-pink-200 font-semibold">xscort.cl</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Mis Servicios</h1>
            <p className="text-pink-100 mt-1 text-sm sm:text-base">Crea y gestiona tus servicios</p>
          </div>

          <div className="mt-8">
            {error && error.includes("No tienes un perfil de modelo asociado") ? (
              <div className="max-w-xl mx-auto mb-8 rounded-2xl bg-[#1b0d18] p-6 shadow-md text-center">
                <h2 className="text-2xl font-bold mb-2">Aún no tienes un perfil de modelo</h2>
                <p className="text-pink-100 mb-4">
                  Para gestionar servicios primero necesitas crear tu perfil de modelo.
                </p>
                <a
                  href="/panel/editar-perfil"
                  className="inline-flex items-center justify-center rounded-lg bg-[#ff007f] px-4 py-2 text-white font-semibold hover:bg-pink-500"
                >
                  Ir a crear mi perfil
                </a>
              </div>
            ) : null}

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Form */}
              <div className="lg:col-span-1">
                <div className="rounded-2xl bg-[#1b0d18] p-6 shadow-md">
                  <FormularioServicio
                    servicio={editingServicio}
                    onSuccess={handleFormSuccess}
                    onCancel={editingServicio ? () => setEditingServicio(null) : undefined}
                  />
                </div>
              </div>

              {/* List */}
              <div className="lg:col-span-2">
                <div className="rounded-2xl bg-[#1b0d18] p-6 shadow-md">
                  <ListaServicios
                    servicios={servicios}
                    onEdit={setEditingServicio}
                    onDelete={fetchServicios}
                    loading={loading}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
