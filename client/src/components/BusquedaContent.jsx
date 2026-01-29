"use client";
import { Suspense } from "react";
import Link from "next/link";
import BarraFiltros from "./BarraFiltros";
import { UserRoundSearch, MapPin } from "lucide-react"

export default function BusquedaContent({ perfiles }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
        {/* Grid ajustado: 2 columnas en móvil, 5 en monitores grandes */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {perfiles && perfiles.length > 0 ? (
              perfiles.map((perfil) => {
                
                let imageUrl = "/placeholder-user.jpg";
                if (perfil.foto_portada) {
                    imageUrl = perfil.foto_portada.startsWith("http") ? perfil.foto_portada : `${API_URL}${perfil.foto_portada}`;
                } else if (perfil.foto_perfil) {
                    imageUrl = perfil.foto_perfil.startsWith("http") ? perfil.foto_perfil : `${API_URL}${perfil.foto_perfil}`;
                }

                return (
                  <Link key={perfil.id} href={`/perfil/${perfil.slug}`} className="group block h-full">
                    {/* --- TARJETA RECTA (SHARP) --- */}
                    <div className="
                        relative h-full overflow-hidden 
                        bg-[#1b101a] border border-white/10 
                        transition-all duration-300
                        hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/10
                        /* SIN ROUNDED - Borde recto puro */
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
      </div>
      
    </div>
  );
}