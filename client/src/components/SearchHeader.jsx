"use client";
import Link from "next/link";
import Image from "next/image";

export default function SearchHeader() {
  return (
    <header className="sticky top-0 z-30 bg-[#0f0812]/90 backdrop-blur supports-[backdrop-filter]:backdrop-blur border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-10 h-14 flex items-center gap-3">
        <Link href="/" className="flex-shrink-0">
            <Image src="/logo.svg" alt="xscort.cl" width={120} height={120} />
          </Link>
        
        <nav className="hidden sm:flex items-center gap-4 text-sm text-pink-100">
          <Link href="/" className="hover:text-white">Inicio</Link>
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          <Link
            href="/login"
            className="rounded-full border border-white/15 px-3 py-1 text-sm text-pink-50 hover:bg-[color:var(--color-card)/0.05]"
          >
            Acceso
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-pink-600 px-3 py-1 text-sm font-semibold text-white hover:bg-pink-700"
          >
            Registro
          </Link>
        </div>
      </div>
    </header>
  );
}
