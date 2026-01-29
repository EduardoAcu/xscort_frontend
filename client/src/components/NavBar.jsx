// components/Navbar.js
import Link from "next/link";
import Image from "next/image";
import NavAuthCta from "@/components/NavAuthCta";
import MobileMenu from "@/components/MobileMenu";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-black/95 backdrop-blur-md px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 z-50 border-b border-white/5 font-montserrat">
      <div className="flex justify-between items-center h-16 sm:h-20">
        <Link href="/" className="flex-shrink-0 w-20 sm:w-24 md:w-28 transition-transform hover:scale-105">
            <Image src="/logo.png" alt="xscort.cl" width={120} height={120} className="w-full h-auto" />
        </Link>
        <div className="hidden sm:flex gap-6 lg:gap-8 text-xs sm:text-sm md:text-base items-center ml-auto">
          <Link href="/" className="hover:text-pink-500 transition text-gray-300 font-montserrat font-semibold tracking-wide">Inicio</Link>
          <Link href="/busqueda" className="hover:text-pink-500 transition text-gray-300 font-montserrat font-semibold tracking-wide">Modelos</Link>
          <div className="h-6 w-px  bg-white/10"></div>
          <NavAuthCta />
        </div>
        <MobileMenu />
      </div>
    </nav>
  );
}
