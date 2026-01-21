"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import api from "@/lib/api";
import LogoutButton from "@/components/LogoutButton";

export default function ClientSidebar() {
  const pathname = usePathname();
  const [username, setUsername] = useState("Usuario");

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
    { href: "/", icon: "home", label: "Inicio" },
  ];

  return (
    <aside className="hidden lg:flex w-64 bg-[#180417] border-r border-[#3b1027] flex-col text-white">
      <div className="px-6 py-6 flex items-center gap-3 border-b border-[#3b1027]">
        <div className="h-12 w-12 rounded-full bg-pink-500 flex items-center justify-center text-lg font-bold">
          {initials}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold truncate max-w-[140px]">{username}</span>
          <span className="text-xs text-pink-400">Cuenta Cliente</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-2 text-sm">
        {navItems.map((item) => {
          const active = pathname === item.href;
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
