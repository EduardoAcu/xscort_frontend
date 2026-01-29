"use client";
import Link from "next/link";
import useAuthStore from "@/store/auth";

export default function NavAuthCta() {
  const { isAuthenticated, isModelo } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <>
        <Link href="/login" className="hover:text-pink-500 font-montserrat font-bold transition text-gray-300">
          Acceso
        </Link>
        <Link
          href="/register"
          className="bg-pink-500 text-white px-5 py-2 rounded-full font-semibold font-montserrat hover:bg-pink-600 transition whitespace-nowrap"
        >
          Regístrate
        </Link>
      </>
    );
  }

  const panelUrl = isModelo ? "/panel/dashboard" : "/panel/cliente";
  return (
    <Link
      href={panelUrl}
      className="bg-pink-500 text-white px-5 py-2 rounded-full font-montserrat font-semibold hover:bg-pink-600 transition whitespace-nowrap"
    >
      Ir a mi panel
    </Link>
  );
}
