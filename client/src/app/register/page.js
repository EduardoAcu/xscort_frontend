"use client";
import { Suspense, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useAuthStore from "@/store/auth";
import dynamic from "next/dynamic";
import { becomeModel } from "@/lib/api-model";
import Link from "next/link"; 
import Image from "next/image";
import MobileMenu from "@/components/MobileMenu";
// Íconos
import { 
  User, Mail, Lock, Calendar, MapPin, Check, 
  AlertCircle, ArrowLeft, CheckCircle2, Loader2 
} from "lucide-react";

const HERO_IMG = "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80";

// Carga dinámica del componente pesado
const FormularioVerificacion = dynamic(() => import("@/components/FormularioVerificacion"), { 
  ssr: false,
  loading: () => <div className="text-pink-500 text-sm animate-pulse">Cargando formulario...</div>
});

function RegisterForm() {
  // --- ESTADOS ---
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState(""); 
  const [ciudadId, setCiudadId] = useState(""); 
  const [ciudades, setCiudades] = useState([]); 
  const [accepted, setAccepted] = useState(false);
  const [role, setRole] = useState("cliente"); 
  const [step, setStep] = useState(1); 
  const [modelVerificationError, setModelVerificationError] = useState(""); 
  const [usernameError, setUsernameError] = useState(""); 
  const [emailError, setEmailError] = useState(""); 
  const [checkingUsername, setCheckingUsername] = useState(false); 
  const [isPending, startTransition] = useTransition();

  const register = useAuthStore((s) => s.register);
  const login = useAuthStore((s) => s.login);
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- EFECTOS ---
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
          setUsernameError("Este usuario ya está en uso.");
        } else {
          setUsernameError("");
        }
      } catch {
        setUsernameError("");
      } finally {
        setCheckingUsername(false);
      }
    };
    const timer = setTimeout(checkUsername, 500);
    return () => clearTimeout(timer);
  }, [username]);

  useEffect(() => {
    if (role === "cliente" && step !== 1) {
      setStep(1);
      setModelVerificationError("");
    }
  }, [role, step]);

  // --- LOGICA PASSWORD ---
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

  // --- SUBMIT ---
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!accepted) return;
    if (usernameError) return;
    if (checkingUsername) return;
    
    setModelVerificationError("");
    setEmailError("");
    
    if (role === "modelo" && !ciudadId) {
      setModelVerificationError("Debes seleccionar una ciudad");
      return;
    }
    
    startTransition(async () => {
      try {
        await register({ username, email, password, password2: password, fecha_nacimiento: fechaNacimiento });
        await login({ username, password });
        const { toast } = await import("sonner");

        if (role === "modelo") {
          try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            await becomeModel(ciudadId);
            toast.success("Cuenta creada. Completa la verificación.");
            setStep(2);
          } catch (e) {
            const modelError = e?.response?.data?.detail || "Error al solicitar verificación";
            setModelVerificationError(modelError);
            toast.error(modelError);
          }
        } else {
          toast.success("Cuenta creada exitosamente.");
          const rawNext = searchParams.get("next");
          const isModeloReal = useAuthStore.getState().isModelo;
          const nextPath = rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//") 
            ? rawNext 
            : (isModeloReal ? "/panel/dashboard" : "/panel/cliente");
          router.replace(nextPath);
        }
      } catch (err) {
        const errorData = err?.response?.data;
        const { toast } = await import("sonner");
        
        if (errorData?.username) {
          setUsernameError("Usuario no disponible.");
          toast.error("El nombre de usuario ya existe.");
        } else if (errorData?.email) {
          setEmailError("Correo ya registrado.");
          toast.error("Este correo ya está en uso.");
        } else {
          toast.error(errorData?.detail || "Error al registrarse");
        }
      }
    });
  };

  const progress = role === "modelo" ? (step === 1 ? "50%" : "100%") : "100%";

  return (
    <div className="w-full max-w-md space-y-6">
        
        {/* Header Mobile Volver */}
        <div className="lg:hidden mb-2">
            <Link href="/" className="flex items-center gap-2 font-montserrat font-medium text-gray-400 text-sm">
                <ArrowLeft className="w-4 h-4" /> Volver al inicio
            </Link>
        </div>

        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-fancy mb-2">
            Crear Cuenta
          </h1>
          <p className="text-gray-400 font-montserrat font-light text-sm">
            Únete y gestiona tu experiencia en xscort.
          </p>
        </div>

        {/* SELECTOR DE ROL */}
        <div className="bg-[#1a1018] font-montserrat p-1 rounded-xl border border-white/5 flex">
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

        {/* BARRA DE PROGRESO */}
        <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-400 font-montserrat uppercase tracking-wider">
                <span>{step === 1 ? "Datos Personales" : "Verificación"}</span>
                <span>{step === 1 ? (role === "modelo" ? "Paso 1/2" : "Paso Final") : "Paso 2/2"}</span>
            </div>
            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-pink-600 to-purple-600 transition-all duration-500 ease-out" 
                    style={{ width: progress }} 
                />
            </div>
        </div>

        {/* --- PASO 1: FORMULARIO DE DATOS --- */}
        {step === 1 && (
            <form onSubmit={onSubmit} className="space-y-4">
              
              {/* Usuario */}
              <div className="space-y-1">
                <label className="text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wide ml-1">Usuario</label>
                <div className="relative group">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-pink-500 transition-colors" />
                  <input
                    className={`w-full bg-[#1a1018] border rounded-xl py-3 pl-12 pr-10 text-white placeholder:text-gray-600 focus:ring-1 outline-none transition-all font-montserrat font-medium ${usernameError ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-pink-500'}`}
                    placeholder="Usuario único"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  {checkingUsername && (
                    <Loader2 className="absolute right-4 top-3.5 w-5 h-5 text-pink-500 animate-spin" />
                  )}
                </div>
                {usernameError && <p className="text-xs text-red-400 ml-1">{usernameError}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wide ml-1">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-pink-500 transition-colors" />
                  <input
                    type="email"
                    className={`w-full bg-[#1a1018] border rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:ring-1 outline-none transition-all font-montserrat font-medium ${emailError ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-pink-500'}`}
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                    required
                  />
                </div>
                {emailError && <p className="text-xs text-red-400 ml-1">{emailError}</p>}
              </div>

              {/* Fecha Nacimiento */}
              <div className="space-y-1">
                <label className="text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wide ml-1">Fecha de Nacimiento</label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-pink-500 transition-colors" />
                  <input
                    type="date"
                    className="w-full bg-[#1a1018] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition-all font-montserrat font-medium"
                    value={fechaNacimiento}
                    onChange={(e) => setFechaNacimiento(e.target.value)}
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                    required
                  />
                </div>
                <p className="text-[10px] font-montserrat text-gray-500 ml-1">Debes ser mayor de 18 años.</p>
              </div>

              {/* Ciudad (Solo Modelos) */}
              {role === "modelo" && (
                <div className="space-y-1 animate-in fade-in slide-in-from-top-2">
                  <label className="text-xs font-montserrat font-bold text-pink-500 uppercase tracking-wide ml-1">Ciudad de Atención</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-pink-500" />
                    <select
                      value={ciudadId}
                      onChange={(e) => setCiudadId(e.target.value)}
                      required={role === "modelo"}
                      className="w-full bg-[#1a1018] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition-all appearance-none font-montserrat font-medium"
                    >
                      <option value="">Selecciona tu ciudad...</option>
                      {ciudades.map((c) => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wide ml-1">Contraseña</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-pink-500 transition-colors" />
                  <input
                    type="password"
                    className="w-full bg-[#1a1018] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition-all font-montserrat font-medium"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                {/* Medidor de Fuerza */}
                <div className="flex gap-1 mt-2 h-1">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`flex-1 rounded-full transition-all duration-300 ${
                            passwordChecks.score >= i ? strengthColor : "bg-gray-800"
                        }`} />
                    ))}
                </div>
                <div className="flex flex-wrap gap-2 mt-2 font-montserrat">
                    <Requirement met={passwordChecks.lengthOK} text="8+ car." />
                    <Requirement met={passwordChecks.upperOK} text="Mayúscula" />
                    <Requirement met={passwordChecks.numberOK} text="Número" />
                </div>
              </div>

              {/* Checkbox */}
              <div className="flex items-start gap-3 pt-2">
                <input 
                    id="terms" 
                    type="checkbox" 
                    checked={accepted} 
                    onChange={(e) => setAccepted(e.target.checked)} 
                    className="mt-1 h-4 w-4 rounded border-gray-600 bg-gray-800 text-pink-600 focus:ring-pink-500" 
                />
                <label htmlFor="terms" className="font-montserrat text-xs text-gray-400">
                  Acepto los <Link className="text-pink-500 hover:underline" href="/terminos">Términos</Link> y <Link className="text-pink-500 hover:underline" href="/privacidad">Políticas</Link>.
                </label>
              </div>

              {/* Error General Modelo */}
              {modelVerificationError && (
                <div className="flex gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-xs items-center">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{modelVerificationError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isPending || !accepted || (role === "modelo" && !ciudadId) || !!usernameError || checkingUsername}
                className="w-full py-4 bg-white hover:bg-gray-200 text-black font-montserrat font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform active:scale-95 mt-4"
              >
                {isPending ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Procesando...</>
                ) : (
                    "Crear Cuenta"
                )}
              </button>
            </form>
        )}

        {/* --- PASO 2: VERIFICACIÓN (Solo Modelos) --- */}
        {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4">
              <div className="bg-[#1a1018] border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-pink-500/20 rounded-full text-pink-500">
                          <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                          <h3 className="font-bold text-white">¡Cuenta Creada!</h3>
                          <p className="text-xs text-gray-400">Ahora verifica tu identidad para publicar.</p>
                      </div>
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

                  <p className="text-[10px] text-gray-500 mt-4 text-center">
                    Tus documentos están encriptados y solo administración puede verlos.
                  </p>
              </div>
            </div>
        )}

    </div>
  );
}

// Subcomponente
function Requirement({ met, text }) {
    return (
        <span className={`text-[10px] flex items-center gap-1 ${met ? "text-green-400" : "text-gray-600"}`}>
            {met ? <Check className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-gray-600" />}
            {text}
        </span>
    );
}

// Componente Principal de Página
export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#050205] text-white flex flex-col lg:flex-row">
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 h-16 sm:h-20 bg-[#050205] lg:bg-transparent border-b border-white/5 lg:border-none">
        <Link href="/" className="w-24 opacity-80 hover:opacity-100 transition-opacity">
            <Image src="/logo.png" alt="xscort.cl" width={100} height={35} className="w-full h-auto" />
        </Link>
        
        {/* Menú Mobile */}
        <div className="lg:hidden">
            <MobileMenu />
        </div>

        {/* CTA Desktop */}
        <div className="hidden lg:block text-sm font-montserrat font-bold text-gray-400 hover:text-white transition-colors">
            <Link href="/login">¿Ya tienes cuenta? Ingresa aquí</Link>
        </div>
      </nav>

      {/* Columna Izquierda: Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center min-h-screen pt-24 pb-10 lg:py-0 bg-[#050205] relative z-10">
        <Suspense fallback={<div className="text-pink-500 animate-pulse">Cargando registro...</div>}>
          <RegisterForm />
        </Suspense>
      </div>

      {/* Columna Derecha: Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-900 overflow-hidden fixed right-0 top-0 h-full border-l border-white/10">
        <Image 
            src={HERO_IMG}
            alt="xscort registro background"
            fill
            className="object-cover opacity-60"
            priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050205] via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#050205] via-transparent to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 p-16 z-10 max-w-xl">
            <div className="inline-block px-3 py-1 bg-pink-600 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                Comunidad Exclusiva
            </div>
            <h2 className="text-5xl font-bold font-fancy leading-tight mb-6">
                Tu perfil, tus reglas, <br/> <span className="text-pink-500">tu éxito.</span>
            </h2>
            <ul className="space-y-4 text-gray-300 font-light">
                <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>Panel de control avanzado.</span>
                </li>
                <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>Visibilidad en las mejores ciudades.</span>
                </li>
            </ul>
        </div>
      </div>
    </div>
  );
}