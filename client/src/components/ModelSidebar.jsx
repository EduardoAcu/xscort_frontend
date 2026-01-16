"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import api from "@/lib/api";
import LogoutButton from "@/components/LogoutButton";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ModelSidebar() {
  const pathname = usePathname();
  const [displayName, setDisplayName] = useState("Mi Perfil");
  const [avatar, setAvatar] = useState("");
  const [publicProfileUrl, setPublicProfileUrl] = useState("");

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await api.get("/api/profiles/mi-perfil/");
        const data = res.data;
        setDisplayName(data.nombre_artistico || "Mi Perfil");
        if (data.id) setPublicProfileUrl(`/perfil/${data.id}`);
        if (data.foto_perfil) {
          const url = data.foto_perfil.startsWith("http")
            ? data.foto_perfil
            : `${API_BASE_URL}${data.foto_perfil}`;
          setAvatar(url);
        } else {
          setAvatar("");
        }
      } catch (err) {
        // Si falla, mantener valores por defecto
        console.warn("No se pudo cargar perfil para sidebar", err);
      }
    };
    fetchPerfil();
  }, []);

  const initials = useMemo(() => {
    return displayName
      ? displayName
          .split(" ")
          .filter(Boolean)
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "EV";
  }, [displayName]);

  const navItems = [
    { href: "/panel/dashboard", icon: "apps", label: "Dashboard" },
    { href: "/panel/editar-perfil", icon: "account_circle", label: "Editar Perfil" },
    { href: "/panel/servicios", icon: "room_service", label: "Servicios" },
    { href: "/panel/galeria", icon: "photo_library", label: "Galería" },
    { href: "/panel/suscripcion", icon: "workspace_premium", label: "Suscripción" },
    { href: "/panel/verificacion", icon: "fact_check", label: "Verificación" },
  ];

  return (
    <aside className="hidden lg:flex w-64 bg-[#180417] border-r border-[#3b1027] flex-col text-white">
      <div className="px-6 py-6 flex items-center gap-3 border-b border-[#3b1027]">
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
            className="text-xs text-pink-400 hover:text-pink-300"
            prefetch={false}
          >
            Ver Perfil Público
          </Link>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-2 text-sm">
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
  );
}
