 "use client";
import { Suspense, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useAuthStore from "@/store/auth";
import dynamic from "next/dynamic";
import { becomeModel } from "@/lib/api-model";
const HERO_IMG = "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80";
// Cargar el formulario de verificación de forma dinámica (client-only)
const FormularioVerificacion = dynamic(() => import("@/components/FormularioVerificacion"), { ssr: false });

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState(""); // NUEVO: fecha de nacimiento
  const [accepted, setAccepted] = useState(false);
  const [role, setRole] = useState("cliente"); // cliente | modelo
  const [step, setStep] = useState(1); // 1: datos personales, 2: documentos (solo modelo)
  const [isPending, startTransition] = useTransition();

  const register = useAuthStore((s) => s.register);
  const login = useAuthStore((s) => s.login);
  const router = useRouter();
  const searchParams = useSearchParams();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!accepted) return;
    startTransition(async () => {
      try {
        // Incluir fecha_nacimiento en el registro
        await register({ username, email, password, password2: password, fecha_nacimiento: fechaNacimiento });
        await login({ username, password });
        const { toast } = await import("sonner");

        if (role === "modelo") {
          try {
            await becomeModel();
          } catch (e) {
            // Si falla, igualmente dejamos continuar a verificación para reintentar desde ahí
          }
          toast.success("Cuenta creada. Continúa con la verificación de identidad.");
          setStep(2);
        } else {
          toast.success("Cuenta creada.");
          const rawNext = searchParams.get("next");
          const isModeloReal = useAuthStore.getState().isModelo;
          const nextPath = rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//") && rawNext !== "/"
            ? rawNext
            : (isModeloReal ? "/panel/dashboard" : "/panel/cliente");
          router.replace(nextPath);
        }
      } catch (err) {
        const apiError = err?.response?.data?.detail || err?.message || "Error al registrarse";
        const { toast } = await import("sonner");
        toast.error(apiError);
      }
    });
  };

  const progress = role === "modelo" ? (step === 1 ? "50%" : "100%") : "100%";

  // Si el usuario cambia a cliente, aseguramos volver al paso 1
  useEffect(() => {
    if (role === "cliente" && step !== 1) {
      setStep(1);
    }
  }, [role, step]);

  // Password strength logic
  const passwordChecks = useMemo(() => {
    const lengthOK = password.length >= 8;
    const upperOK = /[A-Z]/.test(password);
    const numberOK = /[0-9]/.test(password);
    const specialOK = /[^A-Za-z0-9]/.test(password);
    const score = [lengthOK, upperOK, numberOK, specialOK].filter(Boolean).length;
    return { lengthOK, upperOK, numberOK, specialOK, score };
  }, [password]);

  const strengthColor = useMemo(() => {
    if (passwordChecks.score <= 1) return "bg-red-500";
    if (passwordChecks.score === 2) return "bg-amber-400";
    return "bg-green-500";
  }, [passwordChecks]);

  return (
    <div className="min-h-screen bg-[#120912] text-white flex flex-col lg:flex-row">
      {/* Columna izquierda: formulario / pasos */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 sm:px-10 lg:px-16 py-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Bienvenida</h1>
            <p className="text-base text-white mt-2">Crea tu cuenta y completa la verificación.</p>
          </div>

          {/* Toggle login/register */}
          <div className="flex px-4 py-3">
            <div className="flex h-10 flex-1 items-center justify-center rounded-lg bg-[#482336] p-1">
              <span className="flex h-full grow items-center justify-center overflow-hidden rounded-lg px-2 bg-[#22111a] shadow-[0_0_4px_rgba(0,0,0,0.1)] text-white text-sm font-medium leading-normal">
                <span className="truncate">Registrarse</span>
              </span>
              <a href="/login" className="flex h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-[#c992ad] text-sm font-medium leading-normal hover:text-white">
                <span className="truncate">Iniciar Sesión</span>
              </a>
            </div>
          </div>

          {/* Selector de tipo de cuenta */}
          <div className="flex px-4 pb-4">
            <div className="flex h-10 flex-1 items-center justify-center rounded-lg bg-[#482336] p-1">
              <button
                type="button"
                className={`flex h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium leading-normal ${
                  role === "cliente" ? "bg-[#22111a] text-white" : "text-[#c992ad] hover:text-white"
                }`}
                onClick={() => setRole("cliente")}
              >
                <span className="truncate">Cuenta Cliente</span>
              </button>
              <button
                type="button"
                className={`flex h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium leading-normal ${
                  role === "modelo" ? "bg-[#22111a] text-white" : "text-[#c992ad] hover:text-white"
                }`}
                onClick={() => setRole("modelo")}
              >
                <span className="truncate">Cuenta Scort</span>
              </button>
            </div>
          </div>

          {/* Progreso */}
          <div className="flex flex-col gap-3 p-4">
            <div className="flex gap-6 justify-between">
              <p className="text-white text-base font-medium leading-normal">
                {role === "modelo"
                  ? step === 1
                    ? "Paso 1 de 2: Datos personales de modelo"
                    : "Paso 2 de 2: Verificación de identidad"
                  : "Registro de cuenta cliente"}
              </p>
            </div>
            <div className="rounded-full bg-[#67324d]"><div className="h-2 rounded-full bg-primary" style={{ width: progress }}></div></div>
          </div>

          {/* Paso 1: Registro */}
          {step === 1 && (
            <form onSubmit={onSubmit} className="space-y-4 px-4">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-white text-base font-medium leading-normal pb-2">Nombre de Usuario</p>
                <input
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#67324d] bg-[#331926] focus:border-[#67324d] h-14 placeholder:text-[#c992ad] p-[15px] text-base font-normal leading-normal"
                  placeholder="Ingresa tu nombre y apellido"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </label>

              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-white text-base font-medium leading-normal pb-2">Correo electrónico</p>
                <input
                  type="email"
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#67324d] bg-[#331926] focus:border-[#67324d] h-14 placeholder:text-[#c992ad] p-[15px] text-base font-normal leading-normal"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-white text-base font-medium leading-normal pb-2">Fecha de Nacimiento *</p>
                <input
                  type="date"
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#67324d] bg-[#331926] focus:border-[#67324d] h-14 placeholder:text-[#c992ad] p-[15px] text-base font-normal leading-normal"
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                  required
                />
                <p className="text-xs text-[#c992ad] mt-1">Debes ser mayor de 18 años</p>
              </label>

              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-white text-base font-medium leading-normal pb-2">Crear contraseña</p>
                <div className="relative">
                  <input
                    type="password"
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#67324d] bg-[#331926] focus:border-[#67324d] h-14 placeholder:text-[#c992ad] p-[15px] text-base font-normal leading-normal pr-12"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#c992ad] select-none">lock</span>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="h-2 w-full rounded-full bg-[#67324d] overflow-hidden">
                    <div className={`h-full ${strengthColor} transition-all duration-200`} style={{ width: `${(passwordChecks.score / 4) * 100}%` }} />
                  </div>
                  <ul className="text-xs text-slate-200 space-y-1">
                    <li className={passwordChecks.lengthOK ? "text-green-300" : "text-slate-300"}>
                      {passwordChecks.lengthOK ? "✔" : "•"} Mínimo 8 caracteres
                    </li>
                    <li className={passwordChecks.upperOK ? "text-green-300" : "text-slate-300"}>
                      {passwordChecks.upperOK ? "✔" : "•"} Al menos una mayúscula
                    </li>
                    <li className={passwordChecks.numberOK ? "text-green-300" : "text-slate-300"}>
                      {passwordChecks.numberOK ? "✔" : "•"} Al menos un número
                    </li>
                    <li className={passwordChecks.specialOK ? "text-green-300" : "text-slate-300"}>
                      {passwordChecks.specialOK ? "✔" : "•"} Un carácter especial
                    </li>
                  </ul>
                </div>
              </label>

              <div className="flex items-start space-x-3 pt-2">
                <input id="terms" type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="h-5 w-5 rounded border-[#67324d] bg-[#331926] text-primary focus:ring-primary" />
                <div className="text-sm">
                  <label htmlFor="terms" className="text-white">Acepto los <a className="font-medium text-primary hover:underline" href="/terminos">Términos y Condiciones</a> y la <a className="font-medium text-primary hover:underline" href="/privacidad">Política de Privacidad</a>.</label>
                </div>
              </div>


              <button
                type="submit"
                disabled={isPending || !accepted}
                className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-colors mt-2 disabled:opacity-60"
              >
                {isPending ? "Creando cuenta..." : "Crear Cuenta"}
              </button>
            </form>
          )}

          {/* Paso 2: Verificación - Subida de documentos */}
          {step === 2 && (
            <div className="px-4">
              <div className="flex flex-col gap-3 mb-4">
                <p className="text-white text-base font-medium leading-normal">Documento de verificación</p>
                <p className="text-xs text-[#c992ad]">Tu información es confidencial y se usa solo para verificación.</p>
              </div>
              <FormularioVerificacion
                onSuccess={() => {
                  const rawNext = searchParams.get("next");
                  const nextPath = rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//")
                    ? rawNext
                    : "/panel/dashboard";
                  router.replace(nextPath);
                }}
              />
              <p className="text-xs text-[#c992ad] mt-3">
                Si ves un error de permiso, escribe a soporte para habilitar tu cuenta de modelo.
              </p>
            </div>
          )}
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
            <p className="text-pink-300 uppercase tracking-wide text-sm font-semibold">xscort.cl</p>
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

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Cargando…</div>}>
      <RegisterForm />
    </Suspense>
  );
}
