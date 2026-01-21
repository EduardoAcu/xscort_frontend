"use client";
import FilterPanel from "@/components/FilterPanel";
import SearchResultsWrapper from "@/components/SearchResultsWrapper";
import Link from "next/link";
import Image from "next/image";
import NavAuthCta from "@/components/NavAuthCta";
import MobileMenu from "@/components/MobileMenu";

export const dynamic = 'force-dynamic';

export default function BusquedaPage() {
  return (
    <div className="min-h-screen bg-[#120912] text-white">
      <nav className="fixed top-0 w-full bg-black bg-opacity-95 backdrop-blur px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 z-50 border-b border-gray-800">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <Link href="/" className="flex-shrink-0">
            <Image src="/logo.png" alt="xscort.cl" width={100} height={100} />
          </Link>
          <div className="hidden sm:flex gap-6 lg:gap-8 text-sm items-center ml-auto">
            <Link href="/" className="hover:text-pink-500 transition text-gray-300 font-montserrat font-semibold">
              Inicio
            </Link>
            <Link href="/busqueda" className="hover:text-pink-500 transition text-gray-300 font-montserrat font-semibold">
              Modelos
            </Link>
            <Link href="#servicios" className="hover:text-pink-500 transition text-gray-300 font-montserrat font-semibold">
              Servicios
            </Link>
            <div className="h-6 w-px bg-gray-700"></div>
            <NavAuthCta />
          </div>
          <MobileMenu />
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-3 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-10 md:py-14 pt-20 sm:pt-24 md:pt-28 lg:pt-32">
        <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-start">
          {/* Sidebar filters */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="sticky top-6 sm:top-8">
              <FilterPanel />
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 space-y-4 sm:space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-fancy tracking-tight">Modelos Verificadas</h1>
              <p className="text-pink-100 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base font-montserrat">
                Descubre perfiles exclusivos y verificados en tu zona.
              </p>
            </div>

            <SearchResultsWrapper />
          </div>
        </div>
      </div>
    </div>
  );
}
