"use client";

import { Suspense, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useAuthStore from "@/store/auth";
import Link from "next/link";
import Image from "next/image";
import MobileMenu from "@/components/MobileMenu";
// Íconos nativos (sin dependencias externas)
import { Lock, User, CheckCircle2, ArrowLeft } from "lucide-react";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");
  
  const login = useAuthStore((s) => s.login);
  const router = useRouter();
  const searchParams = useSearchParams();

  const onSubmit = async (e) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await login({ username, password });
        setErrorMsg("");
        
        // Sincronización extra de seguridad
        try { await useAuthStore.getState().checkAuth(); } catch (e) {}

        const { toast } = await import("sonner");
        toast.success(`Bienvenido de nuevo, ${username}`);

        // Redirección inteligente
        const rawNext = searchParams.get("next");
        const isModelo = useAuthStore.getState().isModelo;
        const defaultNext = isModelo ? "/panel/dashboard" : "/panel/cliente";
        
        const nextPath = rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//") 
          ? rawNext 
          : defaultNext;
          
        router.replace(nextPath);
      } catch (err) {
        const apiError = err?.response?.data?.error || "Credenciales incorrectas. Inténtalo de nuevo.";
        setErrorMsg(apiError);
        const { toast } = await import("sonner");
        toast.error(apiError);
      }
    });
  };

  return (
    <div className="w-full max-w-md space-y-6">
      
      {/* Botón Volver */}
      <div className="mb-2 w-full flex justify-start">
          <Link href="/" className="flex items-center gap-2 font-montserrat font-medium text-gray-400 hover:text-pink-500 transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </Link>
      </div>

      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-fancy mb-2">
          Iniciar Sesión
        </h1>
        <p className="text-gray-400 font-montserrat font-light text-sm">
          Bienvenido a la comunidad exclusiva de xscort.
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={onSubmit} className="space-y-5 pt-4">
        
        <div className="space-y-1">
          <label className="text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wide ml-1">Usuario o Email</label>
          <div className="relative group">
            <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-pink-500 transition-colors" />
            <input
              className="w-full bg-[#1a1018] font-montserrat font-medium border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition-all"
              placeholder="Ej: usuario123"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wide">Contraseña</label>
              <Link href="/forgot-password" className="text-xs font-montserrat text-pink-500 hover:text-pink-400 hover:underline pb-1">
                  ¿Olvidaste tu clave?
              </Link>
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-pink-500 transition-colors" />
            <input
              className="w-full bg-[#1a1018] font-montserrat font-medium border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition-all"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center font-montserrat">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-4 bg-white hover:bg-gray-200 text-black font-montserrat font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform active:scale-95 mt-6"
        >
          {isPending ? "Validando..." : "Ingresar a mi cuenta"}
        </button>

        <div className="text-center pt-4">
          <p className="text-gray-500 font-montserrat text-sm">
            ¿Aún no tienes cuenta?{" "}
            <Link href="/register" className="text-white hover:text-pink-500 font-montserrat font-bold transition-colors">
              Regístrate Gratis
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

// Imagen Hero
const HERO_IMG = "https://images.unsplash.com/photo-1652715256284-6cba3e829a70?q=80&w=2624&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

// Componente Principal de Página
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#050205] text-white flex flex-col lg:flex-row w-full">
      
      {/* Navbar (Fija arriba, igual que en Register) */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 lg:px-12 h-16 sm:h-20 bg-[#050205]/90 backdrop-blur-md lg:bg-transparent border-b border-white/5 lg:border-none">
        <Link href="/" className="w-24 lg:w-28 opacity-80 hover:opacity-100 transition-opacity">
            <Image src="/logo.png" alt="xscort.cl" width={112} height={40} className="w-full h-auto" />
        </Link>
        
        {/* Menú Mobile */}
        <div className="lg:hidden">
            <MobileMenu />
        </div>

        {/* CTA Desktop */}
        <div className="hidden lg:block text-sm font-montserrat font-bold text-gray-400 hover:text-white transition-colors">
            <Link href="/register">¿Eres nueva? Únete aquí</Link>
        </div>
      </nav>

      {/* Columna Izquierda: Formulario centrado */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center min-h-screen pt-24 pb-12 px-6 lg:px-12 bg-[#050205] relative z-10">
        <Suspense fallback={<div className="text-pink-500 animate-pulse font-montserrat">Cargando acceso...</div>}>
          <LoginForm />
        </Suspense>
      </div>

      {/* Columna Derecha: Hero Image (ARREGLADA sin overflow-hidden que rompía) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#110a10] border-l border-white/10 min-h-screen flex-col justify-end">
        <Image 
            src={HERO_IMG}
            alt="xscort login background"
            fill
            className="object-cover opacity-50"
            priority
        />
        {/* Degradados */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050205] via-[#050205]/30 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#050205] via-transparent to-transparent"></div>
        
        {/* Textos sobre la imagen */}
        <div className="relative z-10 p-12 lg:p-16 max-w-xl">
            <div className="inline-block px-4 py-1.5 bg-pink-600 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 font-montserrat shadow-lg shadow-pink-900/40">
                Portal Seguro
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold font-fancy leading-tight mb-8">
                Eleva tu experiencia <br/> <span className="text-pink-500">sin intermediarios.</span>
            </h2>
            <ul className="space-y-5 text-gray-300 font-montserrat font-medium text-sm">
                <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Perfiles 100% validados manualmente.</span>
                </li>
                <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Privacidad absoluta garantizada.</span>
                </li>
            </ul>
        </div>
      </div>

    </div>
  );
}