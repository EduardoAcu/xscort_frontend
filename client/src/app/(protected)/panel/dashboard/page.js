"use client";
import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import WidgetSuscripcion from "@/components/WidgetSuscripcion";
import WidgetPlanes from "@/components/WidgetPlanes";
import { theme } from "@/lib/theme";

export default function DashboardPage() {
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const handleSuscripcionUpdate = () => {
    setUpdateTrigger((prev) => prev + 1);
  };

  return (
    <ProtectedRoute>
      <div className={`min-h-screen ${theme.colors.bg.primary} ${theme.colors.text.primary}`}>
        {/* Header */}
        <div className={`${theme.colors.bg.secondary} px-6 py-8 sm:px-12 lg:px-24 border-b ${theme.colors.border}`}>
          <h1 className="text-4xl font-bold">Mi Panel</h1>
          <p className={`${theme.colors.text.secondary} mt-2`}>Gestiona tu perfil, suscripción y servicios</p>
        </div>

        {/* Content */}
        <div className="px-6 py-12 sm:px-12 lg:px-24">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left column: Subscription widget */}
            <div className="lg:col-span-1">
              <WidgetSuscripcion onUpdate={handleSuscripcionUpdate} />
            </div>

            {/* Right column: Quick actions and plans */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick actions */}
              <div className="grid gap-4 sm:grid-cols-2">
                <a
                  href="/panel/editar-perfil"
                  className={`${theme.colors.bg.accent} border ${theme.colors.border} p-6 hover:bg-gray-800 transition text-center rounded-lg`}
                >
                  <h3 className="text-lg font-bold">📝 Mi Perfil</h3>
                  <p className={`text-sm ${theme.colors.text.secondary} mt-2`}>
                    Actualiza tu información y fotos
                  </p>
                </a>

                <a
                  href="/panel/servicios"
                  className={`${theme.colors.bg.accent} border ${theme.colors.border} p-6 hover:bg-gray-800 transition text-center rounded-lg`}
                >
                  <h3 className="text-lg font-bold">💼 Mis Servicios</h3>
                  <p className={`text-sm ${theme.colors.text.secondary} mt-2`}>
                    Gestiona tus servicios
                  </p>
                </a>

                <a
                  href="/panel/galeria"
                  className={`${theme.colors.bg.accent} border ${theme.colors.border} p-6 hover:bg-gray-800 transition text-center rounded-lg`}
                >
                  <h3 className="text-lg font-bold">🖼️ Mi Galería</h3>
                  <p className={`text-sm ${theme.colors.text.secondary} mt-2`}>
                    Sube y gestiona tus fotos
                  </p>
                </a>

                <a
                  href="/panel/verificacion"
                  className={`${theme.colors.bg.accent} border ${theme.colors.border} p-6 hover:bg-gray-800 transition text-center rounded-lg`}
                >
                  <h3 className="text-lg font-bold">✓ Verificación</h3>
                  <p className={`text-sm ${theme.colors.text.secondary} mt-2`}>
                    Verifica tu cuenta
                  </p>
                </a>
              </div>

              {/* Plans widget */}
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <WidgetPlanes />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
