"use client";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/auth";
import axios from "@/lib/axiosConfig";

export default function WidgetPlanes() {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    fetchPlanes();
  }, []);

  const fetchPlanes = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/subscriptions/planes/");
      setPlanes(res.data || []);
      setError(null);
    } catch (err) {
      setError("Error al cargar planes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="text-center text-gray-500">Cargando planes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border bg-red-50 p-6 shadow-sm">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Planes Disponibles</h3>
      
      {planes.length === 0 ? (
        <div className="rounded-lg border bg-gray-50 p-6">
          <p className="text-gray-600">No hay planes disponibles</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {planes.map((plan) => (
            <div
              key={plan.id}
              className="rounded-lg border bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              <h4 className="text-xl font-bold mb-2">{plan.nombre}</h4>
              
              {plan.descripcion && (
                <p className="text-sm text-gray-600 mb-4">{plan.descripcion}</p>
              )}

              <div className="my-4 border-t border-b py-4">
                <p className="text-3xl font-bold text-blue-600">
                  ${plan.precio || "N/A"}
                </p>
                {plan.duracion_dias && (
                  <p className="text-sm text-gray-600">
                    {plan.duracion_dias} días
                  </p>
                )}
              </div>

              {plan.caracteristicas && (
                <ul className="mb-4 space-y-2">
                  {plan.caracteristicas.split(",").map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>{feature.trim()}</span>
                    </li>
                  ))}
                </ul>
              )}

              <button
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 transition"
              >
                Suscribirse
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
