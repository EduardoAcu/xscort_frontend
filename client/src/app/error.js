"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log del error para debugging
    console.error("Error capturado:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#140411] via-[#1f0f1a] to-[#140411] text-white px-6">
      <div className="max-w-md text-center space-y-6">
        {/* Error Icon */}
        <div className="space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-red-500">
              error
            </span>
          </div>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">¡Algo salió mal!</h2>
          <p className="text-gray-300">
            Ha ocurrido un error inesperado. No te preocupes, puedes intentar nuevamente.
          </p>
          
          {/* Error details (solo en desarrollo) */}
          {process.env.NODE_ENV === "development" && (
            <details className="mt-4 text-left bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <summary className="cursor-pointer text-sm text-red-400 font-mono">
                Detalles del error (desarrollo)
              </summary>
              <pre className="mt-2 text-xs text-red-300 overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-3 font-semibold text-white hover:from-pink-600 hover:to-pink-700 transition-all transform hover:scale-105"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
            <span>Reintentar</span>
          </button>

          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-pink-500 px-6 py-3 font-semibold text-pink-500 hover:bg-pink-500 hover:text-white transition-all"
          >
            <span className="material-symbols-outlined text-base">home</span>
            <span>Ir al Inicio</span>
          </a>
        </div>

        {/* Additional help */}
        <div className="pt-6 text-sm text-gray-400">
          <p>Si el problema persiste, <a href="#" className="text-pink-400 hover:text-pink-300 underline">contacta con soporte</a></p>
        </div>
      </div>
    </div>
  );
}
