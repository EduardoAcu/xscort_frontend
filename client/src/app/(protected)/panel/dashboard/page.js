"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import WidgetSuscripcion from "@/components/WidgetSuscripcion";
import WidgetCiudad from "@/components/WidgetCiudad";
import WidgetEstadisticas from "@/components/WidgetEstadisticas"; 
import FormularioVerificacion from "@/components/FormularioVerificacion";

// 1. IMPORTA TU STORE DE AUTENTICACIÓN
import useAuthStore from "@/store/auth"; 

import { ShieldAlert, ChevronDown, ChevronUp } from "lucide-react";

export default function DashboardPage() {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [showVerification, setShowVerification] = useState(false);

  // 2. EXTRAE EL USUARIO DIRECTAMENTE DE TU STORE
  const user = useAuthStore((state) => state.user);

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

  const isVerificada = user?.verified || user?.esta_verificada;

  return (
    <ProtectedRoute requireModel>
      <div className="space-y-6 sm:space-y-8 text-white min-h-screen pb-20">
        
        <header className="mb-2 sm:mb-4 border-b border-white/10 pb-6">
          <p className="text-sm text-pink-400 font-bold uppercase tracking-widest font-montserrat">Panel de Escort</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight font-montserrat mt-2">
            Hola, {perfil?.nombre_artistico || user?.username || "Modelo"}
          </h1>
        </header>

        {/* --- BANNER DE VERIFICACIÓN --- */}
        {/* Usamos !isVerificada sacado del 'user' */}
        {!loading && !isVerificada && (
          <div className="bg-gradient-to-r from-pink-900/20 to-purple-900/20 border border-pink-500/30 rounded-2xl p-5 sm:p-6 shadow-[0_0_20px_rgba(236,72,153,0.1)]">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-start sm:items-center gap-4">
                <div className="p-3 bg-pink-500/20 rounded-full text-pink-500 flex-shrink-0">
                  <ShieldAlert className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-montserrat text-white">
                    Tu perfil está oculto
                  </h3>
                  <p className="text-sm text-gray-300 font-montserrat mt-1">
                    Para aparecer en los resultados de búsqueda, debes completar tu verificación de seguridad.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowVerification(!showVerification)}
                className="w-full sm:w-auto py-3 px-6 bg-pink-600 hover:bg-pink-700 text-white font-montserrat font-bold rounded-xl transition-all flex items-center justify-center gap-2 transform active:scale-95 flex-shrink-0"
              >
                {showVerification ? "Cerrar Formulario" : "Verificarme Ahora"}
                {showVerification ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {/* FORMULARIO DESPLEGABLE */}
            {showVerification && (
              <div className="mt-6 pt-6 border-t border-pink-500/20 animate-in slide-in-from-top-4 fade-in duration-300">
                <FormularioVerificacion 
                  onSuccess={() => {
                    setShowVerification(false);
                    // Como la verificación cambia al 'user', actualizamos el store
                    useAuthStore.getState().checkAuth();
                    handleUpdate();
                  }} 
                  ciudadId={perfil?.ciudad?.id || perfil?.ciudad} 
                />
              </div>
            )}
          </div>
        )}

        {/* --- WIDGETS DEL PANEL --- */}
        <section className="grid gap-6 lg:grid-cols-2">
          <WidgetSuscripcion key={`sub-${updateTrigger}`} onUpdate={handleUpdate} />
          <WidgetCiudad ciudadActual={perfil?.ciudad} />
          <WidgetEstadisticas />
        </section>

      </div>
    </ProtectedRoute>
  );
}