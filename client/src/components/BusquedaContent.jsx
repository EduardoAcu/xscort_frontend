"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import BarraFiltros from "./BarraFiltros";
import { UserRoundSearch, MapPin, Loader2 } from "lucide-react";

export default function BusquedaContent({ perfiles: perfilesIniciales }) {
  // Aseguramos el dominio para producción en caso de que falle la variable
  const API_URL = (process.env.NEXT_PUBLIC_API_URL || "https://api.xscort.cl").replace(/\/$/, "");
  const searchParams = useSearchParams();

  // --- ESTADOS DEL SCROLL INFINITO ---
  const [perfiles, setPerfiles] = useState(perfilesIniciales);
  const [page, setPage] = useState(2);
  // Asumimos que si vienen 12 perfiles (tu page_size de Django), hay más páginas
  const [hasMore, setHasMore] = useState(perfilesIniciales?.length >= 12); 
  const [isLoading, setIsLoading] = useState(false);

  const observer = useRef();

  // Reiniciar la lista si el usuario usa la BarraFiltros y cambia la URL
  useEffect(() => {
    setPerfiles(perfilesIniciales);
    setPage(2);
    setHasMore(perfilesIniciales?.length >= 12);
  }, [perfilesIniciales, searchParams]);

  // --- FUNCIÓN PARA TRAER MÁS PERFILES ---
  const fetchMorePerfiles = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const currentParams = new URLSearchParams(searchParams.toString());
      currentParams.set("page", page); // Agregamos la página a pedir

      const res = await fetch(`${API_URL}/api/profiles/?${currentParams.toString()}`);
      if (!res.ok) throw new Error("Error fetching more profiles");
      
      const data = await res.json();
      const nuevosPerfiles = data.results || data || [];

      if (nuevosPerfiles.length === 0) {
        setHasMore(false); // Llegamos al final
      } else {
        setPerfiles((prev) => [...prev, ...nuevosPerfiles]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error al cargar más perfiles:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, hasMore, searchParams, API_URL]);

  // --- OBSERVADOR DE LA ÚLTIMA TARJETA ---
  const lastElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver((entries) => {
        // Si la última tarjeta entra en la pantalla, disparamos el fetch
        if (entries[0].isIntersecting && hasMore) {
          fetchMorePerfiles();
        }
      });
      
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, fetchMorePerfiles]
  );

  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. Panel de Filtros */}
      <div className="w-full relative z-20"> 
        <Suspense fallback={<div className="h-20 bg-white/5 animate-pulse" />}>
          <BarraFiltros />
        </Suspense>
      </div>

      {/* 2. Grid de Resultados */}
      <div className="w-full min-h-[500px]">
        {/* Mantenemos tu Grid exacto */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {perfiles && perfiles.length > 0 ? (
              perfiles.map((perfil, index) => {
                
                // Procesamiento de Imagen
                let imageUrl = "/placeholder-user.jpg";
                if (perfil.foto_portada) {
                    imageUrl = perfil.foto_portada.startsWith("http") ? perfil.foto_portada : `${API_URL}${perfil.foto_portada}`;
                } else if (perfil.foto_perfil) {
                    imageUrl = perfil.foto_perfil.startsWith("http") ? perfil.foto_perfil : `${API_URL}${perfil.foto_perfil}`;
                }

                // Determinar si es la última tarjeta para ponerle la referencia
                const isLastElement = perfiles.length === index + 1;

                return (
                  <Link 
                    key={`${perfil.id}-${index}`} 
                    href={`/perfil/${perfil.slug}`} 
                    className="group block h-full"
                    ref={isLastElement ? lastElementRef : null} // <-- AQUÍ SE CONECTA EL SCROLL
                  >
                    {/* --- TARJETA RECTA (SHARP) --- */}
                    <div className="
                        relative h-full overflow-hidden 
                        bg-[#1b101a] border border-white/10 
                        transition-all duration-300
                        hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/10
                    ">
                      
                      {/* Aspect Ratio 3:4 */}
                      <div className="aspect-[3/4] w-full relative overflow-hidden">
                          <img 
                              src={imageUrl} 
                              alt={perfil.nombre_artistico}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          
                          {/* Gradiente sutil */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-90" />
                          
                          {/* INFO */}
                          <div className="absolute bottom-0 left-0 w-full p-3">
                              
                              <div className="flex items-end justify-between gap-2">
                                <h3 className="text-sm sm:text-lg font-bold text-white leading-tight truncate group-hover:text-pink-500 transition-colors uppercase tracking-tight">
                                    {perfil.nombre_artistico}
                                </h3>
                                {perfil.edad && (
                                    <span className="text-[10px] text-pink-400 font-mono border border-pink-500/30 px-1 bg-black/50">
                                        {perfil.edad}
                                    </span>
                                )}
                              </div>

                              {perfil.ciudad && (
                                  <div className="flex items-center gap-1 mt-1 text-gray-400">
                                      <MapPin className="w-3 h-3" />
                                      <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wide truncate">{perfil.ciudad.nombre}</span>
                                  </div>
                              )}
                          </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              // Empty State (También recto)
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-center border border-dashed border-white/10 bg-white/[0.02]">
                <UserRoundSearch className="w-12 h-12 text-gray-600 mb-2" />
                <p className="text-lg font-bold text-white">Sin resultados</p>
                <p className="text-sm text-gray-500">Prueba otros filtros.</p>
              </div>
            )}
        </div>
        
        {/* --- INDICADOR DE CARGA Y FIN DE RESULTADOS --- */}
        {isLoading && (
            <div className="col-span-full flex justify-center py-8">
                <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
            </div>
        )}

        {!hasMore && perfiles?.length > 0 && (
            <div className="col-span-full text-center py-10">
                <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">
                   Fin de los resultados
                </p>
            </div>
        )}
      </div>
      
    </div>
  );
}