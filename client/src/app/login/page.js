"use client";

import { Suspense, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useAuthStore from "@/store/auth";
import Link from "next/link";
import Image from "next/image";
import NavAuthCta from "@/components/NavAuthCta";
import MobileMenu from "@/components/MobileMenu";
// Íconos nativos (sin dependencias externas)
import { Lock, Mail, User, CheckCircle2, ChevronRight, ArrowLeft } from "lucide-react";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("cliente"); 
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
    <div className="w-full flex items-center justify-center p-6 sm:p-8 md:p-12 relative z-10">
      <div className="w-full max-w-md space-y-8">
        
        {/* Encabezado Mobile: Volver */}
        <div className="lg:hidden mb-6">
            <Link href="/" className="flex items-center gap-2 text-gray-400 text-sm">
                <ArrowLeft className="w-4 h-4" /> Volver al inicio
            </Link>
        </div>

        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-fancy mb-2">
            Iniciar Sesión
          </h1>
          <p className="text-gray-400 font-light">
            Bienvenido a la comunidad exclusiva de xscort.
          </p>
        </div>

        {/* Selector de Rol (Estético) */}
        <div className="bg-[#1a1018] p-1 rounded-xl border border-white/5 flex">
            <button
              type="button"
              onClick={() => setRole("cliente")}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                role === "cliente" 
                ? "bg-zinc-800 text-white shadow-lg" 
                : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Soy Cliente
            </button>
            <button
              type="button"
              onClick={() => setRole("modelo")}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                role === "modelo" 
                ? "bg-pink-600 text-white shadow-lg shadow-pink-900/20" 
                : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Soy Escort
            </button>
        </div>

        {/* Formulario */}
        <form onSubmit={onSubmit} className="space-y-5">
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Usuario o Email</label>
            <div className="relative group">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-pink-500 transition-colors" />
              <input
                className="w-full bg-[#1a1018] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition-all"
                placeholder="Ej: usuario123"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-gray-300">Contraseña</label>
                <Link href="/forgot-password" className="text-xs text-pink-500 hover:text-pink-400 hover:underline">
                    ¿Olvidaste tu clave?
                </Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-pink-500 transition-colors" />
              <input
                className="w-full bg-[#1a1018] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition-all"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center animate-shake">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-4 bg-white hover:bg-gray-200 text-black font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform active:scale-95"
          >
            {isPending ? "Validando..." : "Ingresar a mi cuenta"}
          </button>

          <div className="text-center pt-2">
            <p className="text-gray-500 text-sm">
              ¿Aún no tienes cuenta?{" "}
              <Link href="/register" className="text-white hover:text-pink-500 font-bold transition-colors">
                Regístrate Gratis
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

// Imagen Hero (Local o Externa optimizada)
const HERO_IMG = "https://images.unsplash.com/photo-1616004655123-818cad908146?q=80&w=1287&auto=format&fit=crop";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#050205] text-white flex flex-col lg:flex-row">
      
      {/* Navbar simplificado integrado */}
      <nav className="fixed top-0 w-full lg:w-1/2 bg-[#050205]/90 backdrop-blur-md px-6 z-50 border-b border-white/5 lg:border-none h-16 sm:h-20 flex items-center justify-between lg:justify-start">
        <Link href="/" className="w-24 opacity-80 hover:opacity-100 transition-opacity">
            <Image src="/logo.png" alt="xscort.cl" width={100} height={35} className="w-full h-auto" />
        </Link>
        {/* Solo mostrar menú móvil en pantallas pequeñas */}
        <div className="lg:hidden">
            <MobileMenu />
        </div>
      </nav>

      {/* Columna Izquierda: Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center min-h-screen pt-16 lg:pt-0 bg-[#050205]">
        <Suspense fallback={<div className="text-pink-500 animate-pulse">Cargando acceso...</div>}>
          <LoginForm />
        </Suspense>
      </div>

      {/* Columna Derecha: Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-900 overflow-hidden">
        <Image 
            src={HERO_IMG}
            alt="xscort login background"
            fill
            className="object-cover opacity-60"
            priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050205] via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#050205] via-transparent to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 p-16 z-10 max-w-xl">
            <div className="inline-block px-3 py-1 bg-pink-600 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                Portal Verificado
            </div>
            <h2 className="text-5xl font-bold font-fancy leading-tight mb-6">
                Eleva tu experiencia <br/> <span className="text-pink-500">sin intermediarios.</span>
            </h2>
            <ul className="space-y-4 text-gray-300 font-light">
                <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>Perfiles 100% validados manualmente.</span>
                </li>
                <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>Contacto directo a WhatsApp.</span>
                </li>
                <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>Privacidad absoluta garantizada.</span>
                </li>
            </ul>
        </div>
      </div>
    </div>
  );
}