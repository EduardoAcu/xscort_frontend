"use client";
import { Suspense, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useAuthStore from "@/store/auth";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("cliente"); // solo para UX, no decide el destino real
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
        // Asegurar que el estado local esté sincronizado con el backend
        // (evita condiciones de carrera donde el redirect se decide antes de que
        // la store reciba los flags actualizados desde el servidor)
        try {
          await useAuthStore.getState().checkAuth();
        } catch (e) {
          // Si falla la verificación no interrumpimos el flujo de login
          console.warn("checkAuth tras login falló:", e);
        }
        const { toast } = await import("sonner");
        toast.success(`Bienvenido${username ? `, ${username}` : ""}`);
        const rawNext = searchParams.get("next");
        // Usar el rol real devuelto por el backend (estado global ya sincronizado)
        const isModelo = useAuthStore.getState().isModelo;
        const defaultNext = isModelo ? "/panel/dashboard" : "/panel/cliente";
        const nextPath = rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//") && rawNext !== "/"
          ? rawNext
          : defaultNext;
        router.replace(nextPath);
      } catch (err) {
        const apiError = err?.response?.data?.error || "Usuario o contraseña incorrectos";
        setErrorMsg(apiError);
        const { toast } = await import("sonner");
        toast.error(apiError);
      }
    });
  };

  return (
    <div className="w-full flex items-center justify-center p-6 sm:p-8 md:p-12">
      <div className="w-full max-w-md">
          <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Bienvenida</h1>
          <p className="text-base text-slate-700 mt-2">Accede a tu cuenta o regístrate para empezar.</p>
        </div>

        {/* Toggle login/register */}
        <div className="flex px-4 py-3">
          <div className="flex h-10 flex-1 items-center justify-center rounded-lg bg-[#482336] p-1">
            <a href="/register" className="flex h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-[#c992ad] text-sm font-medium leading-normal hover:text-white">
              <span className="truncate">Registrarse</span>
            </a>
            <span className="flex h-full grow items-center justify-center overflow-hidden rounded-lg px-2 bg-[#22111a] shadow-[0_0_4px_rgba(0,0,0,0.1)] text-white text-sm font-medium leading-normal">
              <span className="truncate">Iniciar Sesión</span>
            </span>
          </div>
        </div>

        {/* Selector de tipo de cuenta */}
        <div className="flex px-4 pb-4">
          <div className="flex h-10 flex-1 items-center justify-center rounded-lg bg-[#482336] p-1">
            <button
              type="button"
              className={`flex h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium leading-normal ${role === "cliente" ? "bg-[#22111a] text-white" : "text-[#c992ad] hover:text-white"}`}
              onClick={() => setRole("cliente")}
            >
              <span className="truncate">Cuenta Cliente</span>
            </button>
            <button
              type="button"
              className={`flex h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium leading-normal ${role === "modelo" ? "bg-[#22111a] text-white" : "text-[#c992ad] hover:text-white"}`}
              onClick={() => setRole("modelo")}
            >
              <span className="truncate">Cuenta Modelo</span>
            </button>
          </div>
        </div>

        {/* Formulario de login */}
        <form onSubmit={onSubmit} className="space-y-4 px-4">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-slate-800 text-base font-medium leading-normal pb-2">Correo o usuario</p>
            <input
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#67324d] bg-[#331926] focus:border-[#67324d] h-14 placeholder:text-[#c992ad] p-[15px] text-base font-normal leading-normal"
              placeholder="usuario o email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>

          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-slate-800 text-base font-medium leading-normal pb-2">Contraseña</p>
            <div className="relative">
              <input
                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#67324d] bg-[#331926] focus:border-[#67324d] h-14 placeholder:text-[#c992ad] p-[15px] text-base font-normal leading-normal pr-12"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#c992ad] select-none">lock</span>
            </div>
          </label>

          <button
            type="submit"
            disabled={isPending}
            className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-colors mt-2 disabled:opacity-60"
          >
            {isPending ? "Ingresando..." : "Entrar"}
          </button>

          {errorMsg && (
            <p className="px-1 text-sm text-red-200 bg-red-500/20 border border-red-500/40 rounded-md py-2 text-center">
              {errorMsg}
            </p>
          )}

          <div className="flex flex-col gap-2">
            <p className="px-1 text-sm text-[#c992ad] text-center">
              <a href="/forgot-password" className="font-medium text-primary hover:underline">¿Olvidaste tu contraseña?</a>
            </p>
            <p className="px-1 text-sm text-[#c992ad] text-center">
              ¿No tienes cuenta? <a href="/register" className="font-medium text-primary hover:underline">Regístrate</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

const HERO_IMG =
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#120912] text-white flex flex-col lg:flex-row">
      {/* Columna izquierda: formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-10 lg:px-16 py-10">
        <div className="w-full max-w-md">
          <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Cargando…</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>

      {/* Columna derecha: hero */}
      <div
        className="hidden lg:block w-full lg:w-1/2 relative"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.85), rgba(0,0,0,0.7)), url(${HERO_IMG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center px-10">
          <div className="max-w-lg text-left space-y-5">
            <p className="text-pink-300 uppercase tracking-wide text-sm font-semibold">
              xscort.cl
            </p>
            <h2 className="text-4xl font-extrabold leading-tight">
              Únete a la comunidad de modelos verificadas más exclusiva de Chile.
            </h2>
            <p className="text-pink-100 text-sm">
              Accede a una plataforma segura y profesional para gestionar tu perfil.
            </p>
            <div className="space-y-3 text-pink-100 text-sm">
              <Item text="Seguridad y Verificación" />
              <Item text="Control Total de tu Perfil" />
              <Item text="Plataforma Confiable" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Item({ text }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-pink-400">●</span>
      <span>{text}</span>
    </div>
  );
}
