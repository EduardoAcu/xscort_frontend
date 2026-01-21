"use client";
import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import FormularioVerificacion from "@/components/FormularioVerificacion";
import WidgetEstadoVerificacion from "@/components/WidgetEstadoVerificacion";

export default function VerificacionPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#120912] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-10 py-10">
          <div>
            <p className="text-sm uppercase text-pink-200 font-semibold">xscort.cl</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Verificación de Cuenta</h1>
            <p className="text-pink-100 mt-1 text-sm sm:text-base">Verifica tu identidad para habilitar tu perfil</p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {/* Status Widget */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl bg-[#1b0d18] p-6 shadow-md">
                <WidgetEstadoVerificacion key={refreshTrigger} />
              </div>
            </div>

            {/* Upload Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl bg-[#1b0d18] p-6 shadow-md">
                <FormularioVerificacion onSuccess={handleSuccess} />
              </div>

              {/* Information */}
              <div className="rounded-2xl bg-[#1b0d18] p-6 shadow-md space-y-4">
                <h3 className="text-xl font-bold text-white">¿Por qué la verificación?</h3>
                <p className="text-pink-100">
                  La verificación es un paso importante para mantener la seguridad y confianza en nuestra plataforma.
                  Nos ayuda a:
                </p>
                <ul className="space-y-2 text-pink-100 ml-6">
                  <li>✓ Confirmar que eres quien dices ser</li>
                  <li>✓ Prevenir fraudes y cuentas falsas</li>
                  <li>✓ Proteger a nuestros usuarios</li>
                  <li>✓ Cumplir con regulaciones legales</li>
                </ul>

                <div className="mt-6 rounded-lg bg-green-900/10 border border-green-800/30 p-4">
                  <p className="font-semibold text-sm text-green-300 mb-2">✓ Tu privacidad es importante</p>
                  <p className="text-sm text-green-200">
                    Tus documentos se almacenan de forma segura y solo serán accesibles por nuestro equipo de
                    verificación. Nunca serán compartidos ni utilizados para otro propósito.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
