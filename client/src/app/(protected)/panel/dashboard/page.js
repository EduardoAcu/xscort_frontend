"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import WidgetSuscripcion from "@/components/WidgetSuscripcion";
import WidgetCiudad from "@/components/WidgetCiudad";
// 1. IMPORTAMOS EL NUEVO WIDGET
import WidgetEstadisticas from "@/components/WidgetEstadisticas"; 

export default function DashboardPage() {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // Cargamos el perfil para saber la ciudad actual
  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await api.get("/api/profiles/mi-perfil/");
        setPerfil(res.data);
      } catch (err) {
        console.error("Error cargando perfil en dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPerfil();
  }, [updateTrigger]); 

  const handleUpdate = () => {
    setUpdateTrigger((prev) => prev + 1);
  };

  return (
    <ProtectedRoute requireModel>
      <div className="space-y-6 sm:space-y-8 text-white min-h-screen pb-20">
        <header className="mb-2 sm:mb-4 border-b border-white/10 pb-6">
          <p className="text-sm text-pink-400 font-bold uppercase tracking-widest font-montserrat">Panel de Escort</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight font-montserrat mt-2">
            Hola, {perfil?.nombre_artistico || "Modelo"}
          </h1>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">

          {/* Widget 1: Suscripción */}
          <WidgetSuscripcion key={`sub-${updateTrigger}`} onUpdate={handleUpdate} />

          {/* Widget 2: Ubicación */}
          <WidgetCiudad 
            ciudadActual={perfil?.ciudad} 
          />
          
          {/* Widget 3: Estadísticas */}
          <WidgetEstadisticas />
        </section>
      </div>
    </ProtectedRoute>
  );
}