"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BuscadorRapido() {
  const [ciudad, setCiudad] = useState("");
  const [tags, setTags] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (ciudad) params.append("ciudad", ciudad);
    if (tags) params.append("tags", tags);
    
    const queryString = params.toString();
    router.push(`/busqueda${queryString ? "?" + queryString : ""}`);
  };

  return (
    <form onSubmit={handleSearch} className="space-y-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
      <h2 className="text-3xl font-bold">Encuentra tu compañía perfecta</h2>
      
      <div className="grid gap-4 sm:grid-cols-3">
        <input
          type="text"
          placeholder="Ciudad"
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
          className="rounded-md border-0 px-4 py-2 text-black"
        />
        <input
          type="text"
          placeholder="Etiquetas (ej: rubia, tatuajes)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="rounded-md border-0 px-4 py-2 text-black"
        />
        <button
          type="submit"
          className="rounded-md bg-white px-6 py-2 font-semibold text-blue-700 hover:bg-gray-100"
        >
          Buscar
        </button>
      </div>
    </form>
  );
}
