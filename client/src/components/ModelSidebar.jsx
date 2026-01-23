"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/api";
import LogoutButton from "@/components/LogoutButton";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ModelSidebar() {
  const pathname = usePathname();
  const [displayName, setDisplayName] = useState("Mi Perfil");
  const [avatar, setAvatar] = useState("");
  const [publicProfileUrl, setPublicProfileUrl] = useState("");
  
  // Estado de bloqueo y carga
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- NUEVO: Estado para menú móvil ---
  const [isOpen, setIsOpen] = useState(false);

  // --- NUEVO: Cerrar menú al cambiar de ruta (navegar) ---
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. CARGAR DATOS VISUALES
        const resPerfil = await api.get("/api/profiles/mi-perfil/");
        const data = resPerfil.data;
        
        setDisplayName(data.nombre_artistico || "Mi Perfil");
        if (data.id) setPublicProfileUrl(`/perfil/${data.id}`);
        
        if (data.foto_perfil) {
          const url = data.foto_perfil.startsWith("http")
            ? data.foto_perfil
            : `${API_BASE_URL}${data.foto_perfil}`;
          setAvatar(url);
        }

        // 2. CARGAR ESTADO DE SUSCRIPCIÓN
        try {
          const resSub = await api.get("/api/subscriptions/mi-suscripcion/");
          const sub = resSub.data;
          const dias = sub.dias_restantes_calculado ?? sub.dias_restantes ?? 0;
          const activa = dias > 0 && !sub.esta_pausada;
          setIsSubscribed(activa);
        } catch (subErr) {
          setIsSubscribed(false);
        }

      } catch (err) {
        console.warn("Error cargando sidebar", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const initials = useMemo(() => {
    return displayName
      ? displayName.split(" ").filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase()
      : "EV";
  }, [displayName]);

  const handleProfileClick = (e) => {
    if (!isSubscribed) {
      e.preventDefault(); 
      toast.error("Debes tener una suscripción activa para ver tu perfil público.");
    }
  };

  const navItems = [
    { href: "/panel/dashboard", icon: "apps", label: "Dashboard" },
    { href: "/panel/editar-perfil", icon: "account_circle", label: "Editar Perfil" },
    { href: "/panel/servicios", icon: "room_service", label: "Servicios" },
    { href: "/panel/galeria", icon: "photo_library", label: "Galería" },
    { href: "/panel/suscripcion", icon: "workspace_premium", label: "Suscripción" },
    { href: "/panel/verificacion", icon: "fact_check", label: "Verificación" },
  ];

  return (
    <>
      {/* --- 1. BOTÓN HAMBURGUESA (Solo visible en Móvil) --- */}
      <div className="lg:hidden fixed top-0 left-0 w-full h-16 bg-[#180417] border-b border-[#3b1027] z-40 flex items-center px-4 justify-between">
        <div className="flex items-center gap-3">
            {/* Logo o Título simple para móvil */}
            <span className="font-bold text-pink-500">XSCORT PANEL</span>
        </div>
        <button 
            onClick={() => setIsOpen(true)}
            className="text-white p-2 rounded-md hover:bg-pink-900/50"
        >
            <span className="material-symbols-outlined text-3xl">menu</span>
        </button>
      </div>

      {/* --- 2. BACKDROP (Fondo oscuro al abrir menú) --- */}
      {isOpen && (
        <div 
            className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
        />
      )}

      {/* --- 3. SIDEBAR (Adaptable) --- */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen z-50
        w-64 bg-[#180417] border-r border-[#3b1027] flex flex-col text-white text-montserrat
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        
        {/* Botón cerrar (Solo móvil) */}
        <div className="lg:hidden absolute top-4 right-4">
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                <span className="material-symbols-outlined">close</span>
            </button>
        </div>

        {/* --- CONTENIDO ORIGINAL DEL SIDEBAR --- */}
        <div className="px-6 py-6 flex items-center gap-3 border-b border-[#3b1027] mt-8 lg:mt-0">
          {avatar ? (
            <img src={avatar} alt={displayName} className="h-12 w-12 rounded-full object-cover" />
          ) : (
            <div className="h-12 w-12 rounded-full bg-pink-500 flex items-center justify-center text-lg font-bold">
              {initials}
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-sm font-semibold truncate max-w-[140px]">{displayName}</span>
            <Link
              href={publicProfileUrl || "#"}
              onClick={handleProfileClick}
              className={`text-xs transition-colors font-medium mt-1 ${
                loading 
                  ? "text-gray-500" 
                  : isSubscribed 
                    ? "text-pink-400 hover:text-pink-300 underline" 
                    : "text-gray-500 cursor-not-allowed hover:text-gray-400"
              }`}
              prefetch={false}
            >
              {loading ? "Cargando..." : "Ver Perfil Público"}
            </Link>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-2 text-sm overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-full px-4 py-2 transition ${
                  active
                    ? "bg-[#ff007f] text-white font-semibold"
                    : "text-gray-200 hover:bg-[#2a0c21]"
                }`}
                prefetch={false}
              >
                <span className="material-symbols-outlined text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-[#3b1027]">
          <LogoutButton className="w-full inline-flex items-center justify-center gap-1 rounded-full border border-[#ff007f] px-4 py-2 text-sm text-gray-100 hover:bg-[#ff007f] hover:text-white" />
        </div>
      </aside>
    </>
  );
}