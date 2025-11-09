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
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white px-6 py-8 sm:px-12 lg:px-24 shadow-sm border-b">
          <h1 className="text-4xl font-bold">Verificación de Cuenta</h1>
          <p className="text-gray-600 mt-2">Verifica tu identidad para habilitar tu perfil</p>
        </div>

        {/* Content */}
        <div className="px-6 py-12 sm:px-12 lg:px-24">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Status Widget */}
            <div className="lg:col-span-1">
              <WidgetEstadoVerificacion key={refreshTrigger} />
            </div>

            {/* Upload Form */}
            <div className="lg:col-span-2">
              <FormularioVerificacion onSuccess={handleSuccess} />

              {/* Information */}
              <div className="mt-8 rounded-lg border bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-xl font-bold">¿Por qué la verificación?</h3>
                <p className="text-gray-700">
                  La verificación es un paso importante para mantener la seguridad y confianza en nuestra plataforma.
                  Nos ayuda a:
                </p>
                <ul className="space-y-2 text-gray-700 ml-6">
                  <li>✓ Confirmar que eres quien dices ser</li>
                  <li>✓ Prevenir fraudes y cuentas falsas</li>
                  <li>✓ Proteger a nuestros usuarios</li>
                  <li>✓ Cumplir con regulaciones legales</li>
                </ul>

                <div className="mt-6 rounded-lg bg-green-50 border border-green-200 p-4">
                  <p className="font-semibold text-sm text-green-900 mb-2">✓ Tu privacidad es importante</p>
                  <p className="text-sm text-green-900">
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
