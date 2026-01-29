"use client";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/auth";

export default function LogoutButton({ className = "" }) {
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const handleLogout = async () => {
    await logout(); // Ahora logout es async y llama al endpoint del backend
    router.replace("/");
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={
        className ||
        "inline-flex items-center gap-1 rounded-lg border px-3 py-1 text-sm text-[color:var(--color-muted-foreground)] hover:bg-[color:var(--color-card)/0.06]"
      }
    >
      <span>Cerrar sesión</span>
    </button>
  );
}