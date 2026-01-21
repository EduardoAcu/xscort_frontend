"use client";
import { Suspense } from "react";
import FilterPanel from "./FilterPanel";
import SearchResultsWrapper from "./SearchResultsWrapper";

export default function BusquedaContent() {
  return (
    <>
      <div className="w-full lg:w-72 shrink-0">
        <div className="sticky top-6 sm:top-8">
          <Suspense fallback={<div className="text-white">Cargando filtros...</div>}>
            <FilterPanel />
          </Suspense>
        </div>
      </div>

      <div className="flex-1 space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-fancy tracking-tight">
            Modelos Verificadas
          </h1>
          <p className="text-pink-100 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base font-montserrat">
            Descubre perfiles exclusivos y verificados en tu zona.
          </p>
        </div>

        <SearchResultsWrapper />
      </div>
    </>
  );
}
