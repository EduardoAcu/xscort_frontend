"use client";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchPerfiles = async () => {
      try {
        setLoading(true);
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

  const stars = (rating = 0) =>
    [...Array(5)].map((_, i) => (
      <span key={i} className={i < Math.round(rating) ? "text-yellow-400" : "text-white/30"}>
        ★
      </span>
    ));

  const Badge = () => (
    <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--color-primary)/0.12] text-[color:var(--color-primary)] text-xs font-semibold px-2 py-1">
      <span className="h-2 w-2 rounded-full bg-[color:var(--color-primary)]" /> Verificada
    </span>
  );

  if (loading) return <div className="py-8 text-center">Cargando resultados...</div>;
  if (error) return <div className="py-8 text-center text-red-400">{error}</div>;
  if (!perfiles || perfiles.length === 0) return <div className="py-8 text-center text-pink-100">No se encontraron resultados</div>;

  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {perfiles.map((perfil) => {
          const img = perfil.foto_perfil
            ? perfil.foto_perfil.startsWith("http")
              ? perfil.foto_perfil
              : `${API_URL}${perfil.foto_perfil}`
            : null;
          const nombre = perfil.nombre_artistico || "Modelo";
          const ciudad = perfil.ciudad || "";
          const rating = perfil.rating || perfil.puntuacion || 4.8;
          return (
            <Link key={perfil.id} href={`/perfil/${perfil.id}`}>
              <div className="group overflow-hidden rounded-2xl border border-white/10 bg-[#1a0f1a] shadow-xl hover:-translate-y-1 transition">
                <div className="relative h-64 w-full overflow-hidden">
                  {img && (
                    <Image
                      src={img}
                      alt={nombre}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge />
                  </div>
                </div>
                <div className="p-4 space-y-1">
                  <p className="text-sm text-pink-200">{ciudad}</p>
                  <h3 className="text-lg font-bold">{nombre}</h3>
                  <div className="flex items-center gap-1 text-sm">{stars(rating)}</div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 text-sm">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="rounded-full border border-white/15 px-3 py-2 text-white/80 disabled:opacity-40 hover:bg-[color:var(--color-card)/0.05]"
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`rounded-full px-3 py-2 ${
                currentPage === page
                  ? "bg-pink-600 text-white"
                  : "border border-white/15 text-white/80 hover:bg-[color:var(--color-card)/0.05]"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="rounded-full border border-white/15 px-3 py-2 text-white/80 disabled:opacity-40 hover:bg-[color:var(--color-card)/0.05]"
          >
            ›
          </button>
        </div>
      )}

      <div className="text-center text-xs text-pink-100/80">
        Mostrando {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalCount)} de {totalCount} resultados
      </div>
    </div>
  );
}
