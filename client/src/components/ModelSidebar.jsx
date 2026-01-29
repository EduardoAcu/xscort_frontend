"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/api";
import LogoutButton from "@/components/LogoutButton";

// 1. IMPORTAMOS LOS ÍCONOS (Incluyendo LogOut)
import { 
  LayoutDashboard, 
  UserCog, 
  Sparkles, 
  Image as ImageIcon, 
  Crown, 
  ShieldCheck, 
  Menu, 
  X,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ModelSidebar() {
  const pathname = usePathname();
  const [displayName, setDisplayName] = useState("Mi Perfil");
  const [avatar, setAvatar] = useState("");
  const [publicProfileUrl, setPublicProfileUrl] = useState("");
  
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // Cerrar menú al navegar
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Bloquear scroll del body cuando el menú está abierto (Móvil)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resPerfil = await api.get("/api/profiles/mi-perfil/");
        const data = resPerfil.data;
        
        setDisplayName(data.nombre_artistico || "Mi Perfil");
        
        const slug = data.slug || data.id; 
        if (slug) setPublicProfileUrl(`/perfil/${slug}`);
        
        if (data.foto_perfil) {
          const url = data.foto_perfil.startsWith("http")
            ? data.foto_perfil
            : `${API_BASE_URL}${data.foto_perfil}`;
          setAvatar(url);
        }

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
    { href: "/panel/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/panel/editar-perfil", icon: UserCog, label: "Editar Perfil" },
    { href: "/panel/servicios", icon: Sparkles, label: "Servicios" },
    { href: "/panel/galeria", icon: ImageIcon, label: "Galería" },
    { href: "/panel/suscripcion", icon: Crown, label: "Suscripción" },
    { href: "/panel/verificacion", icon: ShieldCheck, label: "Verificación" },
  ];

  return (
    <>
      {/* HEADER MÓVIL */}
      <div className="lg:hidden fixed top-0 left-0 w-full h-16 bg-[#180417] border-b border-[#3b1027] z-40 flex items-center px-4 justify-between select-none font-montserrat">
        <div className="flex items-center gap-2">
            <span className="font-bold text-pink-500">XSCORT</span>
        </div>
        <button 
            onClick={() => setIsOpen(true)}
            className="text-white p-2 rounded-md active:bg-pink-900/50 hover:bg-pink-900/30 transition-colors"
            aria-label="Abrir menú"
        >
            <Menu className="w-8 h-8" />
        </button>
      </div>

      {/* BACKDROP OSCURO */}
      <div 
        className={`fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* SIDEBAR DESLIZANTE */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50
        flex flex-col text-white font-montserrat bg-[#180417] border-r border-[#3b1027]
        transition-transform duration-300 ease-out
        
        lg:translate-x-0 lg:h-screen lg:w-64
        h-[100dvh] w-[85vw] sm:w-80
        ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:shadow-none"}
      `}>
        
        {/* Botón cerrar (X) en móvil */}
        <div className="lg:hidden absolute top-4 right-4 z-50">
            <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 text-gray-400 hover:text-white bg-[#180417]/50 rounded-full hover:bg-pink-900/30 transition-colors"
            >
                <X className="w-6 h-6" />
            </button>
        </div>

        {/* CABECERA PERFIL */}
        <div className="px-6 py-8 lg:py-6 flex items-center gap-3 border-b border-[#3b1027] mt-2 lg:mt-0">
          {avatar ? (
            <img src={avatar} alt={displayName} className="h-14 w-14 lg:h-12 lg:w-12 rounded-full object-cover ring-2 ring-[#3b1027]" />
          ) : (
            <div className="h-14 w-14 lg:h-12 lg:w-12 rounded-full bg-pink-500 flex items-center justify-center text-xl font-bold">
              {initials}
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-base lg:text-sm font-semibold truncate max-w-[160px]">{displayName}</span>
            <Link
              href={publicProfileUrl || "#"}
              onClick={handleProfileClick}
              className={`text-xs transition-colors font-medium mt-1 ${
                loading 
                  ? "text-gray-500" 
                  : isSubscribed 
                    ? "text-pink-400 hover:text-pink-300 underline" 
                    : "text-gray-500 cursor-not-allowed"
              }`}
            >
              {loading ? "Cargando..." : "Ver Perfil Público"}
            </Link>
          </div>
        </div>

        {/* NAVEGACIÓN */}
        <nav className="flex-1 px-4 py-6 space-y-2 text-sm overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname?.startsWith(item.href);
            const IconComponent = item.icon; 
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 lg:gap-3 rounded-xl px-4 py-3 lg:py-2 transition ${
                  active
                    ? "bg-[#ff007f] text-white font-semibold shadow-lg shadow-pink-900/20"
                    : "text-gray-300 hover:bg-[#2a0c21] hover:text-white"
                }`}
              >
                <IconComponent className="w-5 h-5 lg:w-4 lg:h-4" />
                <span className="text-base lg:text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* 2. FOOTER CORREGIDO CON ÍCONO */}
        <div className="px-4 py-4 lg:py-4 border-t border-[#3b1027] bg-[#180417] pb-10 lg:pb-4">
          <LogoutButton className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[#ff007f] px-4 py-3 lg:py-2 text-sm text-gray-100 hover:bg-[#ff007f] hover:text-white transition-all font-semibold">
            <span>Cerrar Sesión</span>
          </LogoutButton>

        </div>
      </aside>
    </>
  );
}