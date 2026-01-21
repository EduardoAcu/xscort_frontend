"use client";
import Link from "next/link";
import Image from "next/image";

export default function SearchHeader() {
  return (
    <header className="sticky top-0 z-30 bg-[#0f0812]/90 backdrop-blur supports-[backdrop-filter]:backdrop-blur border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 h-14 sm:h-16 flex items-center gap-2 sm:gap-3 md:gap-4">
        <Link href="/" className="flex-shrink-0">
            <Image src="/logo.svg" alt="xscort.cl" width={100} height={100} className="w-20 h-auto sm:w-24" />
          </Link>
        
        <nav className="hidden sm:flex items-center gap-2 md:gap-4 text-xs sm:text-sm md:text-base text-pink-100">
          <Link href="/" className="hover:text-white transition">Inicio</Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          <Link
            href="/login"
            className="rounded-full border border-white/15 px-2 sm:px-3 py-1 text-xs sm:text-sm text-pink-50 hover:bg-[color:var(--color-card)/0.05] transition"
          >
            Acceso
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-pink-600 px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold text-white hover:bg-pink-700 transition"
          >
            Registro
          </Link>
        </div>
      </div>
    </header>
  );
}
