"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="sm:hidden flex items-center">
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="p-2 text-gray-300 hover:text-pink-500 transition"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X size={24} className="text-pink-500" />
        ) : (
          <Menu size={24} />
        )}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 top-16 left-0 right-0 bottom-0 bg-[#120912] z-40 w-screen h-screen overflow-y-auto">
          <nav className="flex flex-col space-y-0 p-0 w-full">
            {/* Menu Items */}
            <Link
              href="/"
              onClick={closeMenu}
              className="block w-full px-6 py-4 text-base font-montserrat font-semibold text-gray-300 hover:text-pink-500 hover:bg-gray-900/50 transition border-b border-gray-800"
            >
              Inicio
            </Link>

            <Link
              href="/busqueda"
              onClick={closeMenu}
              className="block w-full px-6 py-4 text-base font-montserrat font-semibold text-gray-300 hover:text-pink-500 hover:bg-gray-900/50 transition border-b border-gray-800"
            >
              Modelos
            </Link>

            <Link
              href="/#servicios"
              onClick={closeMenu}
              className="block w-full px-6 py-4 text-base font-montserrat font-semibold text-gray-300 hover:text-pink-500 hover:bg-gray-900/50 transition border-b border-gray-800"
            >
              Servicios
            </Link>

            {/* Auth Buttons */}
            <div className="flex flex-col gap-0 pt-0 border-t border-gray-700">
              <Link
                href="/login"
                onClick={closeMenu}
                className="block w-full px-6 py-4 text-base font-montserrat font-semibold text-gray-300 hover:text-pink-500 hover:bg-gray-900/50 transition border-b border-gray-800"
              >
                Iniciar Sesión
              </Link>

              <Link
                href="/register"
                onClick={closeMenu}
                className="block w-full px-6 py-4 text-base font-montserrat font-semibold bg-pink-500 hover:bg-pink-600 text-white transition"
              >
                Registrarse
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
