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
    <div className="rounded-lg border bg-[var(--color-card)] p-4 shadow-sm">
      <form onSubmit={handleFilter} className="space-y-4">
        <h3 className="text-lg font-semibold">Filtros</h3>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Ciudad</label>
          <input
            type="text"
            placeholder="Ej: Santiago, Valparaíso"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Etiquetas</label>
          <input
            type="text"
            placeholder="Ej: rubia, tatuajes"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Aplicar filtros
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="flex-1 rounded-md border border-[color:var(--color-border)] px-4 py-2 hover:bg-[color:var(--color-card)/0.03]"
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
}
