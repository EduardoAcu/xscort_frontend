"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

export default function GridResultados() {
  const searchParams = useSearchParams();
  
  const [perfiles, setPerfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Cache para evitar solicitudes repetidas
  const cacheRef = useRef({});
  const debounceTimerRef = useRef(null);

  // Construir clave de caché
  const getCacheKey = useCallback(() => {
    const ciudad = searchParams.get("ciudad") || "";
    const tags = searchParams.get("tags") || "";
    const servicio = searchParams.get("servicio") || "";
    return `${ciudad}|${tags}|${servicio}|${currentPage}`;
  }, [searchParams, currentPage]);

  const fetchPerfiles = useCallback(async () => {
    try {
      setLoading(true);
      const cacheKey = getCacheKey();

      if (cacheRef.current[cacheKey]) {
        const cachedData = cacheRef.current[cacheKey];
        setPerfiles(cachedData.results);
        setTotalCount(cachedData.count);
        setError(null);
        setLoading(false);
        return;
      }

      const params = new URLSearchParams();
      const ciudad = searchParams.get("ciudad");
      const tags = searchParams.get("tags");
      const servicio = searchParams.get("servicio");

      if (ciudad) params.append("ciudad", ciudad);
      if (tags) params.append("tags", tags);
      if (servicio) params.append("servicio", servicio);

      params.append("page_size", pageSize);
      params.append("page", currentPage);

      const response = await api.get(`/api/profiles/?${params.toString()}`);
      
      const results = response.data.results || response.data;
      const count = response.data.count || response.data.length || 0;

      cacheRef.current[cacheKey] = { results, count };

      setPerfiles(results);
      setTotalCount(count);
      setError(null);
    } catch (err) {
      const errorMessage = err.message || "Error al cargar resultados";
      setError(errorMessage);
      console.error("Error fetching profiles:", err);
    } finally {
      setLoading(false);
    }
  }, [searchParams, currentPage, pageSize, getCacheKey]);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      fetchPerfiles();
    }, 300);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [searchParams, currentPage, fetchPerfiles]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const stars = (rating = 0) =>
    [...Array(5)].map((_, i) => (
      <span key={i} className={i < Math.round(rating) ? "text-yellow-400" : "text-white/30"}>
        ★
      </span>
    ));

  const Badge = () => (
    <span className="inline-flex items-center gap-1 rounded-full bg-pink-500/20 text-pink-400 text-xs font-semibold px-2 py-1 backdrop-blur-sm border border-pink-500/30">
      <span className="h-2 w-2 rounded-full bg-pink-500" /> Verificada
    </span>
  );

  if (loading) return <div className="py-20 text-center text-pink-200">Buscando modelos...</div>;
  if (error) return <div className="py-20 text-center text-red-400">{error}</div>;
  if (!perfiles || perfiles.length === 0) return <div className="py-20 text-center text-pink-100/60 italic">No se encontraron resultados para tu búsqueda.</div>;

  return (
    <div className="space-y-8 font-montserrat">
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {perfiles.map((perfil) => {
          const img = perfil.foto_perfil
            ? perfil.foto_perfil.startsWith("http")
              ? perfil.foto_perfil
              : `${API_URL}${perfil.foto_perfil}`
            : null;
          
          const nombre = perfil.nombre_artistico || "Modelo";
          
          // CORRECCIÓN CLAVE: Extraer nombre de ciudad seguro
          const ciudadNombre = typeof perfil.ciudad === 'object' && perfil.ciudad !== null 
              ? perfil.ciudad.nombre 
              : perfil.ciudad || "Sin ubicación";

          const rating = perfil.rating || perfil.puntuacion || 5.0;
          const href = `/perfil/${perfil.slug || perfil.id}`; // Preferimos slug

          return (
            <Link key={perfil.id} href={href}>
              <div className="group overflow-hidden rounded-2xl border border-white/5 bg-[#1a0f1a] shadow-lg hover:shadow-pink-500/10 hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-black">
                  {img ? (
                    <Image
                      src={img}
                      alt={nombre}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/30">
                        <span className="material-symbols-outlined text-4xl">person</span>
                    </div>
                  )}
                  
                  {/* Gradiente para mejorar lectura de texto sobre imagen */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                  <div className="absolute top-3 right-3">
                    <Badge />
                  </div>
                  
                  {/* Info sobrepuesta en la imagen (Estilo Moderno) */}
                  <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                     <h3 className="text-xl font-bold text-white mb-0.5 shadow-black drop-shadow-md">{nombre}</h3>
                     <p className="text-sm text-pink-200 font-medium flex items-center gap-1 shadow-black drop-shadow-md">
                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                        {ciudadNombre}
                     </p>
                  </div>
                </div>
                
                {/* Footer de la tarjeta */}
                <div className="p-3 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-1 text-sm">{stars(rating)}</div>
                   <span className="text-xs text-gray-400 group-hover:text-pink-400 transition-colors">Ver Perfil →</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 text-sm pt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="rounded-full border border-white/10 w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition"
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`rounded-full w-10 h-10 flex items-center justify-center font-bold transition ${
                currentPage === page
                  ? "bg-pink-600 text-white shadow-lg shadow-pink-600/20"
                  : "border border-white/10 text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="rounded-full border border-white/10 w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition"
          >
            ›
          </button>
        </div>
      )}

      <div className="text-center text-xs text-gray-500 mt-4">
        Mostrando {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalCount)} de {totalCount} resultados
      </div>
    </div>
  );
}