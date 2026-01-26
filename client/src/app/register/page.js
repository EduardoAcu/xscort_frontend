 "use client";
import { Suspense, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useAuthStore from "@/store/auth";
import dynamic from "next/dynamic";
import { becomeModel } from "@/lib/api-model";
import Link from "next/link";
import Image from "next/image";
import NavAuthCta from "@/components/NavAuthCta";
import MobileMenu from "@/components/MobileMenu";
const HERO_IMG = "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80";
// Cargar el formulario de verificación de forma dinámica (client-only)
const FormularioVerificacion = dynamic(() => import("@/components/FormularioVerificacion"), { ssr: false });

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState(""); // NUEVO: fecha de nacimiento
  const [ciudadId, setCiudadId] = useState(""); // NUEVO: ciudad para modelos
  const [ciudades, setCiudades] = useState([]); // NUEVO: lista de ciudades
  const [accepted, setAccepted] = useState(false);
  const [role, setRole] = useState("cliente"); // cliente | modelo
  const [step, setStep] = useState(1); // 1: datos personales, 2: documentos (solo modelo)
  const [modelVerificationError, setModelVerificationError] = useState(""); // Error al verificar como modelo
  const [usernameError, setUsernameError] = useState(""); // Error cuando username ya existe
  const [emailError, setEmailError] = useState(""); // Error cuando email ya existe
  const [checkingUsername, setCheckingUsername] = useState(false); // Verificando si username existe
  const [isPending, startTransition] = useTransition();

  const register = useAuthStore((s) => s.register);
  const login = useAuthStore((s) => s.login);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Cargar ciudades disponibles para modelos
  useEffect(() => {
    const fetchCiudades = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/profiles/ciudades/`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setCiudades(data);
      } catch {
        setCiudades([]);
      }
    };
    fetchCiudades();
  }, []);

  // Validar disponibilidad de username en tiempo real
  useEffect(() => {
    if (!username || username.length < 3) {
      setUsernameError("");
      setCheckingUsername(false);
      return;
    }

    const checkUsername = async () => {
      setCheckingUsername(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/validate-username/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        });
        const data = await res.json();
        if (!res.ok || data.exists) {
          setUsernameError("Este nombre de usuario ya está en uso.");
        } else {
          setUsernameError("");
        }
      } catch {
        setUsernameError("");
      } finally {
        setCheckingUsername(false);
      }
    };

    // Debounce de 500ms para no hacer muchas peticiones
    const timer = setTimeout(checkUsername, 500);
    return () => clearTimeout(timer);
  }, [username]);

  // Mostrar notificación cuando hay error de username
  useEffect(() => {
    if (usernameError) {
      const showToast = async () => {
        const { toast } = await import("sonner");
        toast.error(usernameError);
      };
      showToast();
    }
  }, [usernameError]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!accepted) return;
    
    // Validación preventiva: si hay error en username, no permitir envío
    if (usernameError) {
      const { toast } = await import("sonner");
      toast.error("Por favor, elige otro nombre de usuario.");
      return;
    }
    
    // Si aún está verificando username, no permitir envío
    if (checkingUsername) {
      const { toast } = await import("sonner");
      toast.error("Por favor, espera a que se verifique el nombre de usuario.");
      return;
    }
    
    setModelVerificationError("");
    setEmailError("");
    
    // Validar que si es modelo, tiene ciudad seleccionada
    if (role === "modelo" && !ciudadId) {
      setModelVerificationError("Debes seleccionar una ciudad");
      return;
    }
    
    startTransition(async () => {
      try {
        // Incluir fecha_nacimiento en el registro
        await register({ username, email, password, password2: password, fecha_nacimiento: fechaNacimiento });
        await login({ username, password });
        const { toast } = await import("sonner");

        if (role === "modelo") {
          try {
            // Pequeño delay para asegurar que el token esté disponible en las cookies
            await new Promise((resolve) => setTimeout(resolve, 500));
            
            // Solicitar verificación como modelo - REQUERIDO antes de subir documentos
            await becomeModel(ciudadId);
            toast.success("Cuenta creada. Continúa con la verificación de identidad.");
            setStep(2);
          } catch (e) {
            // Si falla request-model-verification, mostrar error y no continuar
            const modelError = 
              e?.response?.data?.detail || 
              e?.response?.data?.error || 
              e?.message ||
              "Error al solicitar verificación como modelo";
            setModelVerificationError(modelError);
            toast.error(`Error de verificación: ${modelError}`);
            // No avanzar al paso 2
          }
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
        const errorData = err?.response?.data;
        const { toast } = await import("sonner");
        
        // Manejar errores específicos de username y email
        if (errorData?.username) {
          const userMsg = Array.isArray(errorData.username) 
            ? errorData.username[0] 
            : errorData.username;
          setUsernameError();
          toast.error("Este nombre de usuario ya existe.");
        } else if (errorData?.email) {
          const emailMsg = Array.isArray(errorData.email) 
            ? errorData.email[0] 
            : errorData.email;
          setEmailError("Este correo electrónico ya está registrado. ¿Deseas iniciar sesión?");
          toast.error("Este correo ya está registrado.");
        } else {
          const apiError = errorData?.detail || err?.message || "Error al registrarse";
          toast.error(apiError);
        }
      }
    });
  };

  const progress = role === "modelo" ? (step === 1 ? "50%" : "100%") : "100%";

  // Si el usuario cambia a cliente, aseguramos volver al paso 1 y limpiar error
  useEffect(() => {
    if (role === "cliente" && step !== 1) {
      setStep(1);
      setModelVerificationError("");
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
      
      <nav className="fixed top-0 w-full bg-black bg-opacity-95 backdrop-blur px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 z-50 border-b border-gray-800">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <Link href="/" className="flex-shrink-0">
            <Image src="/logo.png" alt="xscort.cl" width={100} height={100} />
          </Link>
          <div className="hidden sm:flex gap-6 lg:gap-8 text-sm items-center ml-auto">
            <Link href="/" className="hover:text-pink-500 transition text-gray-300 font-montserrat font-semibold">
              Inicio
            </Link>
            <Link href="/busqueda" className="hover:text-pink-500 transition text-gray-300 font-montserrat font-semibold">
              Modelos
            </Link>
            <Link href="#servicios" className="hover:text-pink-500 transition text-gray-300 font-montserrat font-semibold">
              Servicios
            </Link>
            <div className="h-6 w-px bg-gray-700"></div>
            <NavAuthCta />
          </div>
          <MobileMenu />
        </div>
      </nav>

      {/* Columna izquierda: formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-8 pt-20 sm:pt-24 md:pt-28 lg:pt-32">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold  font-montserrat tracking-tight text-white">Registro</h1>
            <p className="text-base text-white font-montserrat mt-2">Crea tu cuenta y completa la verificación.</p>
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
                <span className="truncate font-montserrat font-bold">Soy Cliente</span>
              </button>
              <button
                type="button"
                className={`flex h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium leading-normal ${
                  role === "modelo" ? "bg-[#22111a] text-white" : "text-[#c992ad] hover:text-white"
                }`}
                onClick={() => setRole("modelo")}
              >
                <span className="truncate font-montserrat font-bold">Soy Escort</span>
              </button>
            </div>
          </div>

          {/* Progreso */}
          <div className="flex flex-col gap-3 p-4 font-montserrat mb-4">
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
                <p className="text-white text-base font-medium leading-normal pb-2 font-montserrat">Nombre de Usuario</p>
                <div className="relative">
                  <input
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#67324d] bg-[#331926] focus:border-[#67324d] h-14 placeholder:text-[#c992ad] p-[15px] text-base font-normal leading-normal font-montserrat"
                    placeholder="Ingresa tu nombre usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  {checkingUsername && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#c992ad]">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                  )}
                </div>
                {usernameError && (
                  <p className="text-xs text-red-400 mt-2 font-montserrat">{usernameError}</p>
                )}
              </label>

              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-white text-base font-medium leading-normal pb-2 font-montserrat">Correo electrónico</p>
                <input
                  type="email"
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#67324d] bg-[#331926] focus:border-[#67324d] h-14 placeholder:text-[#c992ad] p-[15px] text-base font-normal leading-normal font-montserrat"
                  placeholder="ejemplo@gmail.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                  required
                />
                {emailError && (
                  <p className="text-xs text-red-400 mt-2 font-montserrat">{emailError}</p>
                )}
              </label>

              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-white text-base font-medium leading-normal pb-2 font-montserrat">Fecha de Nacimiento *</p>
                <input
                  type="date"
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#67324d] bg-[#331926] focus:border-[#67324d] h-14 placeholder:text-[#c992ad] p-[15px] text-base font-normal leading-normal font-montserrat"
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                  required
                />
                <p className="text-xs text-[#c992ad] mt-1 font-montserrat">Debes ser mayor de 18 años</p>
              </label>

              {/* Selector de Ciudad - Solo para Modelos */}
              {role === "modelo" && (
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-white text-base font-medium leading-normal pb-2 font-montserrat">Ciudad *</p>
                  <select
                    value={ciudadId}
                    onChange={(e) => setCiudadId(e.target.value)}
                    required={role === "modelo"}
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#67324d] bg-[#331926] focus:border-[#67324d] h-14 p-[15px] text-base font-normal leading-normal font-montserrat"
                  >
                    <option value="">Selecciona una ciudad</option>
                    {ciudades.map((c) => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                  <p className="text-xs text-[#c992ad] mt-1 font-montserrat">Selecciona la ciudad donde ofrecerás servicios</p>
                </label>
              )}

              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-white text-base font-medium leading-normal pb-2 font-montserrat">Crear contraseña</p>
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
                <div className="mt-3 space-y-2 font-montserrat">
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
                <div className="text-sm font-montserrat">
                  <label htmlFor="terms" className="text-white">Acepto los <a className="font-medium text-primary hover:underline" href="/terminos">Términos y Condiciones</a> y la <a className="font-medium text-primary hover:underline" href="/privacidad">Política de Privacidad</a>.</label>
                </div>
              </div>

              {modelVerificationError && (
                <div className="rounded-lg bg-red-950/50 border border-red-800 p-3 mt-3">
                  <p className="text-sm text-red-400 font-montserrat">{modelVerificationError}</p>
                  <p className="text-xs text-red-300 mt-2 font-montserrat">Por favor, contacta a soporte si el problema persiste.</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isPending || !accepted || (role === "modelo" && !ciudadId) || !!usernameError || checkingUsername}
                className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-colors mt-2 disabled:opacity-60 font-montserrat"
              >
                {isPending ? "Creando cuenta..." : "Crear Cuenta"}
              </button>
            </form>
          )}

          {/* Paso 2: Verificación - Subida de documentos */}
          {step === 2 && (
            <div className="px-4 font-montserrat">
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
                ciudadId={ciudadId}
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
            <p className="text-pink-300 uppercase tracking-wide text-sm font-semibold font-montserrat">xscort.cl</p>
            <h2 className="text-4xl font-extrabold leading-tight font-fancy">
              Únete a la comunidad de modelos verificadas más exclusiva de Chile.
            </h2>
            <p className="text-pink-100 text-sm font-montserrat">
              Accede a una plataforma segura y profesional para gestionar tu perfil.
            </p>
            <div className="space-y-3 text-pink-100 text-sm font-montserrat">
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
