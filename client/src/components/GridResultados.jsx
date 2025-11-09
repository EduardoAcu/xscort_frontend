"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "@/lib/axiosConfig";
import Link from "next/link";

export default function GridResultados() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [perfiles, setPerfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    const fetchPerfiles = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        
        const ciudad = searchParams.get("ciudad");
        const tags = searchParams.get("tags");
        
        if (ciudad) params.append("ciudad", ciudad);
        if (tags) params.append("tags", tags);
        params.append("limit", pageSize);
        params.append("offset", (currentPage - 1) * pageSize);
        
        const response = await axios.get(`/api/profiles/?${params.toString()}`);
        
        if (response.data.results) {
          setPerfiles(response.data.results);
          setTotalCount(response.data.count || 0);
        } else {
          setPerfiles(response.data);
          setTotalCount(response.data.length);
        }
        setError(null);
      } catch (err) {
        setError("Error al cargar resultados");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPerfiles();
  }, [searchParams, currentPage]);

  const totalPages = Math.ceil(totalCount / pageSize);

  if (loading) {
    return <div className="py-8 text-center">Cargando resultados...</div>;
  }

  if (error) {
    return <div className="py-8 text-center text-red-600">{error}</div>;
  }

  if (!perfiles || perfiles.length === 0) {
    return <div className="py-8 text-center text-gray-500">No se encontraron resultados</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {perfiles.map((perfil) => (
          <Link key={perfil.id} href={`/perfil/${perfil.id}`}>
            <div className="overflow-hidden rounded-lg border shadow-md transition-transform hover:shadow-lg hover:scale-105">
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="rounded-md border px-3 py-2 disabled:opacity-50 hover:bg-gray-100"
          >
            Anterior
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`rounded-md px-3 py-2 ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "border hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="rounded-md border px-3 py-2 disabled:opacity-50 hover:bg-gray-100"
          >
            Siguiente
          </button>
        </div>
      )}

      <div className="text-center text-sm text-gray-600">
        Mostrando {(currentPage - 1) * pageSize + 1} -{" "}
        {Math.min(currentPage * pageSize, totalCount)} de {totalCount} resultados
      </div>
    </div>
  );
}
