"use client";
import { Suspense } from "react";
import BarraFiltros from "@/components/BarraFiltros";
import GridResultados from "@/components/GridResultados";

function SearchContent() {
  return (
    <div className="grid gap-6 lg:grid-cols-4">
      {/* Filters sidebar */}
      <div className="lg:col-span-1">
        <BarraFiltros />
      </div>

      {/* Results */}
      <div className="lg:col-span-3">
        <GridResultados />
      </div>
    </div>
  );
}

export default function BusquedaPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12 sm:px-12 lg:px-24">
      <h1 className="mb-8 text-3xl font-bold">Resultados de búsqueda</h1>
      
      <Suspense fallback={<div className="text-center">Cargando...</div>}>
        <SearchContent />
      </Suspense>
    </div>
  );
}
