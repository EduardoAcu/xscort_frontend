"use client";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/auth";
import axios from "@/lib/axiosConfig";
import ProtectedRoute from "@/components/ProtectedRoute";
import FormularioServicio from "@/components/FormularioServicio";
import ListaServicios from "@/components/ListaServicios";

export default function ServiciosPage() {
  const token = useAuthStore((s) => s.token);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingServicio, setEditingServicio] = useState(null);

  useEffect(() => {
    if (token) {
      fetchServicios();
    }
  }, [token]);

  const fetchServicios = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/profiles/mis-servicios/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServicios(res.data || []);
    } catch (err) {
      console.error("Error al cargar servicios", err);
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
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white px-6 py-8 sm:px-12 lg:px-24 shadow-sm border-b">
          <h1 className="text-4xl font-bold">Mis Servicios</h1>
          <p className="text-gray-600 mt-2">Crea y gestiona tus servicios</p>
        </div>

        {/* Content */}
        <div className="px-6 py-12 sm:px-12 lg:px-24">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Form */}
            <div className="lg:col-span-1">
              <FormularioServicio
                servicio={editingServicio}
                onSuccess={handleFormSuccess}
                onCancel={editingServicio ? () => setEditingServicio(null) : undefined}
              />
            </div>

            {/* List */}
            <div className="lg:col-span-2">
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
    </ProtectedRoute>
  );
}
