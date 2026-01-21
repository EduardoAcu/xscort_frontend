"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function BarraFiltros() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [ciudad, setCiudad] = useState(searchParams.get("ciudad") || "");
  const [tags, setTags] = useState(searchParams.get("tags") || "");

  const handleFilter = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (ciudad) params.append("ciudad", ciudad);
    if (tags) params.append("tags", tags);
    
    const queryString = params.toString();
    router.push(`/busqueda${queryString ? "?" + queryString : ""}`);
  };

  const handleClear = () => {
    setCiudad("");
    setTags("");
    router.push("/busqueda");
  };

  return (
    <div className="rounded-lg sm:rounded-xl border bg-[var(--color-card)] p-3 sm:p-4 md:p-5 lg:p-6 shadow-sm">
      <form onSubmit={handleFilter} className="space-y-3 sm:space-y-4 md:space-y-5">
        <h3 className="text-base sm:text-lg md:text-xl font-semibold">Filtros</h3>
        
        <div className="space-y-2">
          <label className="block text-xs sm:text-sm md:text-base font-medium">Ciudad</label>
          <input
            type="text"
            placeholder="Ej: Santiago, Valparaíso"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            className="w-full rounded-md border px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs sm:text-sm md:text-base font-medium">Etiquetas</label>
          <input
            type="text"
            placeholder="Ej: rubia, tatuajes"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full rounded-md border px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            type="submit"
            className="w-full sm:flex-1 rounded-md bg-blue-600 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base font-semibold text-white hover:bg-blue-700 transition"
          >
            Aplicar filtros
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="w-full sm:flex-1 rounded-md border border-[color:var(--color-border)] px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base font-semibold hover:bg-[color:var(--color-card)/0.03] transition"
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
}
