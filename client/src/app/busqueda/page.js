"use client";
import { Suspense } from "react";
import FilterPanel from "@/components/FilterPanel";
import GridResultados from "@/components/GridResultados";
import SearchHeader from "@/components/SearchHeader";

export default function BusquedaPage() {
  return (
    <div className="min-h-screen bg-[#120912] text-white">
      <SearchHeader />
      <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-10 py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Sidebar filters */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="sticky top-6">
              <FilterPanel />
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 space-y-6">
            <div>
              <p className="text-sm uppercase text-pink-200 font-semibold">xscort.cl</p>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Modelos Verificadas</h1>
              <p className="text-pink-100 mt-1 text-sm sm:text-base">
                Descubre perfiles exclusivos y verificados en tu zona.
              </p>
            </div>

            <Suspense fallback={<div className="text-center py-8">Cargando...</div>}>
              <GridResultados />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
