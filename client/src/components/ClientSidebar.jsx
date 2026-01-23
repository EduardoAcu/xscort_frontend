"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import api from "@/lib/api";
import LogoutButton from "@/components/LogoutButton";

export default function ClientSidebar() {
  const pathname = usePathname();
  const [username, setUsername] = useState("Usuario");
  
  // --- Estados para menú móvil ---
  const [isOpen, setIsOpen] = useState(false);

  // 1. Cerrar menú al cambiar de ruta
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // 2. Bloquear scroll del body cuando el menú está abierto (UX móvil)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/me/");
        setUsername(res.data.username || "Usuario");
      } catch (err) {
        console.warn("No se pudo cargar datos de usuario", err);
      }
    };
    fetchUser();
  }, []);

  const initials = useMemo(() => {
    return username
      ? username
          .split(" ")
          .filter(Boolean)
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "U";
  }, [username]);

  const navItems = [
    { href: "/panel/cliente", icon: "account_circle", label: "Mi Cuenta" },
    { href: "/", icon: "home", label: "Volver al Inicio" },
  ];

  return (
    <>
      {/* 1. HEADER MÓVIL (Solo visible en LG hidden) */}
      <div className="lg:hidden fixed top-0 left-0 w-full h-16 bg-[#180417] border-b border-[#3b1027] z-40 flex items-center px-4 justify-between select-none">
        <div className="flex items-center gap-2">
            <span className="font-bold text-pink-500 font-montserrat">XSCORT</span>
        </div>
        <button 
            onClick={() => setIsOpen(true)}
            className="text-white p-2 rounded-md active:bg-pink-900/50"
            aria-label="Abrir menú"
        >
            <span className="material-symbols-outlined text-3xl">menu</span>
        </button>
      </div>

      {/* 2. BACKDROP OSCURO */}
      <div 
        className={`fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* 3. SIDEBAR DESLIZANTE */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50
        flex flex-col text-white text-montserrat bg-[#180417] border-r border-[#3b1027]
        transition-transform duration-300 ease-out
        
        /* DIMENSIONES PARA ESCRITORIO */
        lg:translate-x-0 lg:h-screen lg:w-64
        
        /* DIMENSIONES PARA MÓVIL (iPhone Fixes: 100dvh) */
        h-[100dvh] w-[85vw] sm:w-80
        ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:shadow-none"}
      `}>
        
        {/* Botón cerrar (X) en móvil */}
        <div className="lg:hidden absolute top-4 right-4 z-50">
            <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 text-gray-400 hover:text-white bg-[#180417]/50 rounded-full"
            >
                <span className="material-symbols-outlined text-2xl">close</span>
            </button>
        </div>

        {/* --- CABECERA USUARIO --- */}
        <div className="px-6 py-8 lg:py-6 flex items-center gap-3 border-b border-[#3b1027] mt-2 lg:mt-0">
          <div className="h-14 w-14 lg:h-12 lg:w-12 rounded-full bg-pink-500 flex items-center justify-center text-xl lg:text-lg font-bold shadow-lg shadow-pink-900/30">
            {initials}
          </div>
          <div className="flex flex-col">
            <span className="text-base lg:text-sm font-semibold truncate max-w-[160px]">{username}</span>
            <span className="text-xs text-pink-400 font-medium">Cuenta Cliente</span>
          </div>
        </div>

        {/* --- NAVEGACIÓN --- */}
        <nav className="flex-1 px-4 py-6 space-y-2 text-sm overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 lg:gap-3 rounded-xl px-4 py-3 lg:py-2 transition ${
                  active
                    ? "bg-[#ff007f] text-white font-semibold shadow-lg shadow-pink-900/20"
                    : "text-gray-300 hover:bg-[#2a0c21] hover:text-white"
                }`}
                prefetch={false}
              >
                <span className="material-symbols-outlined text-[22px] lg:text-base">{item.icon}</span>
                <span className="text-base lg:text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* --- FOOTER / LOGOUT --- */}
        {/* Padding extra bottom para iPhone Home Indicator */}
        <div className="px-4 py-4 lg:py-4 border-t border-[#3b1027] bg-[#180417] pb-10 lg:pb-4">
          <LogoutButton className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[#ff007f] px-4 py-3 lg:py-2 text-sm text-gray-100 hover:bg-[#ff007f] hover:text-white transition-all font-semibold" />
        </div>
      </aside>
    </>
  );
}