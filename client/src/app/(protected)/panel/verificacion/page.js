"use client";
import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import FormularioVerificacion from "@/components/FormularioVerificacion";
import WidgetEstadoVerificacion from "@/components/WidgetEstadoVerificacion";
import { UserRoundCheck, BadgeCheck, CircleCheckBig, Lock } from "lucide-react";

export default function VerificacionPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
    // Hacemos scroll arriba para que vea el nuevo estado
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ProtectedRoute requireModel>
      <div className="min-h-screen bg-[#120912] text-white font-montserrat">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-10 py-10">
          
          {/* Header */}
          <div className="mb-8">
            <p className="text-sm uppercase text-pink-200 font-semibold tracking-wider">xscort.cl</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-2">Verificación de Cuenta</h1>
            <p className="text-pink-100 mt-2 text-sm sm:text-base opacity-80">
              Valida tu identidad para obtener la insignia de verificación y generar más confianza.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            
            {/* Columna Izquierda: Estado + Info */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Widget de Estado (Reacciona al refreshTrigger) */}
              <div className="rounded-2xl bg-gradient-to-br from-[#2a1225] to-[#1b0d18] p-1 shadow-xl border border-white/5">
                <WidgetEstadoVerificacion key={refreshTrigger} />
              </div>

              {/* Tarjeta de Información */}
              <div className="rounded-2xl bg-[#1b0d18] p-6 shadow-xl border border-white/5 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <UserRoundCheck className="w-5 h-5 text-pink-500" />
                  ¿Por qué verificarme?
                </h3>
                <p className="text-sm text-pink-100/90 leading-relaxed">
                  La insignia de verificado aumenta tus contactos hasta un 300% al demostrar que eres real.
                </p>
                
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <CircleCheckBig className="w-5 h-5 text-green-400 mt-0.5" />
                    <span>Destaca sobre perfiles falsos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CircleCheckBig className="w-5 h-5 text-green-400 mt-0.5" />
                    <span>Genera confianza inmediata</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CircleCheckBig className="w-5 h-5 text-green-400 mt-0.5" />
                    <span>Prioridad en el soporte</span>
                  </li>
                </ul>

                {/* Caja de Privacidad Corregida */}
                <div className="mt-6 w-full rounded-lg bg-green-500/10 border border-green-500/20 p-4">
                  <div className="flex items-start gap-3 mb-2">
                    <Lock className="w-5 h-5 text-green-400" />
                    <p className="font-bold text-sm text-green-200">Privacidad Garantizada</p>
                  </div>
                  <p className="text-xs text-green-100/80 leading-relaxed pl-8">
                    Tus documentos se eliminan automáticamente tras la verificación. Nunca serán públicos ni compartidos.
                  </p>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Formulario */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-[#1b0d18] p-6 sm:p-8 shadow-xl border border-white/5 h-full">
                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                  <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center text-white">
                    <BadgeCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Sube tus documentos</h2>
                    <p className="text-sm text-gray-400">Sigue los pasos para completar el proceso</p>
                  </div>
                </div>

                <FormularioVerificacion onSuccess={handleSuccess} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}