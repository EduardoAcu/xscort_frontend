"use client";
import { useEffect, useState } from "react";
import axios from "@/lib/axiosConfig";
import Link from "next/link";

export default function GridModelosDestacadas() {
  const [perfiles, setPerfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPerfiles = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/profiles/?limit=8");
        setPerfiles(response.data.results || response.data);
        setError(null);
      } catch (err) {
        setError("Error al cargar perfiles destacados");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPerfiles();
  }, []);

  if (loading) {
    return <div className="py-8 text-center">Cargando modelos...</div>;
  }

  if (error) {
    return <div className="py-8 text-center text-red-600">{error}</div>;
  }

  if (!perfiles || perfiles.length === 0) {
    return <div className="py-8 text-center text-gray-500">No hay modelos disponibles</div>;
  }

  return (
    <div className="py-12">
      <h2 className="mb-8 text-3xl font-bold">Modelos destacadas</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {perfiles.map((perfil) => (
          <Link key={perfil.id} href={`/perfil/${perfil.id}`}>
            <div className="group overflow-hidden rounded-lg border shadow-md transition-transform hover:shadow-lg hover:scale-105">
              {perfil.foto_perfil && (
                <img
                  src={perfil.foto_perfil}
                  alt={perfil.nombre_publico}
                  className="h-64 w-full object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold">{perfil.nombre_publico}</h3>
                <p className="text-sm text-gray-600">{perfil.ciudad}</p>
                {perfil.tags && perfil.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {perfil.tags.slice(0, 3).map((tag, idx) => {
                      const tagName = typeof tag === 'object' ? tag.nombre || tag.name || '' : tag;
                      return (
                        <span key={idx} className="inline-block bg-blue-100 px-2 py-1 text-xs text-blue-700 rounded">
                          {tagName}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
