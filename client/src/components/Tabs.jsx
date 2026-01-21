"use client";
import { useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Tabs({ perfil, servicios, galeria, resenas }) {
  const [activeTab, setActiveTab] = useState("sobre-mi");

  const tabs = [
    { id: "sobre-mi", label: "Sobre mí" },
    { id: "servicios", label: "Servicios" },
    { id: "galeria", label: "Galería" },
    { id: "resenas", label: "Reseñas" },
  ];

  return (
    <div className="space-y-6">
      {/* Tab buttons */}
      <div className="border-b">
        <div className="flex gap-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-2 font-semibold border-b-2 transition ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div>
        {/* Sobre mí */}
        {activeTab === "sobre-mi" && (
          <div className="rounded-lg border bg-[var(--color-card)] p-6">
            <h3 className="text-2xl font-bold mb-4">Acerca de mí</h3>
            {perfil?.descripcion ? (
              <p className="text-gray-700 whitespace-pre-wrap">{perfil.descripcion}</p>
            ) : (
              <p className="text-gray-500">Sin información adicional</p>
            )}
          </div>
        )}

        {/* Servicios */}
        {activeTab === "servicios" && (
          <div className="rounded-lg border bg-[var(--color-card)] p-6">
            <h3 className="text-2xl font-bold mb-4">Mis servicios</h3>
            {servicios && servicios.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {servicios.map((servicio) => {
                  const nombre = typeof servicio.nombre === 'object' ? servicio.nombre?.nombre || servicio.nombre?.categoria || JSON.stringify(servicio.nombre) : servicio.nombre;
                  return (
                    <div key={servicio.id} className="border rounded-lg p-4">
                      <h4 className="font-semibold text-lg">{nombre}</h4>
                      {servicio.descripcion && (
                        <p className="text-[color:var(--color-muted-foreground)] text-sm mt-2">{servicio.descripcion}</p>
                      )}
                      {servicio.precio && (
                        <p className="font-bold text-blue-600 mt-2">${servicio.precio}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">No hay servicios disponibles</p>
            )}
          </div>
        )}

        {/* Galería */}
        {activeTab === "galeria" && (
          <div className="rounded-lg border bg-[var(--color-card)] p-6">
            <h3 className="text-2xl font-bold mb-4">Galería</h3>
            {galeria && galeria.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {galeria.map((foto) => (
                  <div key={foto.id} className="overflow-hidden rounded-lg">
                    <img
                      src={foto.imagen?.startsWith("http") ? foto.imagen : `${API_BASE_URL}${foto.imagen}`}
                      alt={`Foto ${foto.id}`}
                      className="h-64 w-full object-cover hover:scale-110 transition"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No hay fotos en la galería</p>
            )}
          </div>
        )}

        {/* Reseñas */}
        {activeTab === "resenas" && (
          <div className="rounded-lg border bg-[var(--color-card)] p-6">
            <h3 className="text-2xl font-bold mb-4">Reseñas</h3>
            {resenas && resenas.length > 0 ? (
              <div className="space-y-4">
                {resenas.map((resena) => (
                  <div key={resena.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold">{resena.usuario_nombre || "Anónimo"}</p>
                      <div className="text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>
                            {i < (resena.puntuacion || 0) ? "★" : "☆"}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{resena.comentario}</p>
                    <p className="text-xs text-gray-500 mt-2">{new Date(resena.fecha).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No hay reseñas aún</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
