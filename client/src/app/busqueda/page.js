"use client";
import { Suspense } from "react";
import FilterPanel from "@/components/FilterPanel";
import GridResultados from "@/components/GridResultados";
import SearchHeader from "@/components/SearchHeader";
import Link from "next/link";
import Image from "next/image";
import NavAuthCta from "@/components/NavAuthCta";

export default function BusquedaPage() {
  return (
    <div className="min-h-screen bg-[#120912] text-white">
      <nav className="fixed top-0 w-full bg-black bg-opacity-95 backdrop-blur px-6 sm:px-12 lg:px-24 z-50 border-b border-gray-800">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex-shrink-0">
            <Image src="/logo.svg" alt="xscort.cl" width={100} height={100} />
          </Link>
          <div className="hidden sm:flex gap-8 text-sm items-center ml-auto">
            <Link href="/" className="hover:text-pink-500 transition text-gray-300">Inicio</Link>
            <Link href="/busqueda" className="hover:text-pink-500 transition text-gray-300">Modelos</Link>
            <Link href="/#servicios" className="hover:text-pink-500 transition text-gray-300">Servicios</Link>
            <div className="h-6 w-px bg-gray-700"></div>
            <NavAuthCta />
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-10 py-10 pt-32">
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
