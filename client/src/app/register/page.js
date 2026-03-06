"use client";
import { Suspense, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useAuthStore from "@/store/auth";
import { becomeModel } from "@/lib/api-model";
import Link from "next/link"; 
import Image from "next/image";
import MobileMenu from "@/components/MobileMenu";
import { 
  User, Mail, Lock, Calendar, MapPin, Check, 
  AlertCircle, ArrowLeft, CheckCircle2, Loader2, Sparkles
} from "lucide-react";

const HERO_IMG = "https://images.unsplash.com/photo-1652715257860-596178e1a923?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

function RegisterForm() {
  // --- ESTADOS ---
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState(""); 
  const [ciudadId, setCiudadId] = useState(""); 
  const [ciudades, setCiudades] = useState([]); 
  const [accepted, setAccepted] = useState(false);
  
  // Paso 1: Elegir Rol | Paso 2: Formulario
  const [role, setRole] = useState(""); 
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
        const cleanUsername = username.trim();
        const cleanEmail = email.trim().toLowerCase();

        await register({ 
            username: cleanUsername, 
            email: cleanEmail, 
            password, 
            password2: password, 
            fecha_nacimiento: fechaNacimiento 
        });
        
        await login({ username: cleanUsername, password });
        const { toast } = await import("sonner");

        if (role === "modelo") {
          try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            await becomeModel(ciudadId);
            
            await useAuthStore.getState().checkAuth(); 

            toast.success("Cuenta creada exitosamente. Redirigiendo a tu panel...");
            
            // REDIRECCIÓN DIRECTA AL DASHBOARD
            const rawNext = searchParams.get("next");
            const nextPath = rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//") 
              ? rawNext 
              : "/panel/dashboard";
            router.replace(nextPath);

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
          toast.error("El nombre de usuario ya existe o tiene caracteres inválidos.");
        } else if (errorData?.email) {
          setEmailError("Correo ya registrado o inválido.");
          toast.error("Este correo ya está en uso o no es válido.");
        } else {
          toast.error(errorData?.detail || errorData?.error || "Error al registrarse. Revisa tus datos.");
        }
      }
    });
  };

  // Cálculo de la barra de progreso (Solo 2 pasos)
  const progress = step === 1 ? "50%" : "100%";

  return (
    <div className="w-full max-w-md space-y-6">
        
        {/* Header Volver */}
        <div className="mb-2 w-full flex justify-start">
            <Link href="/" className="flex items-center gap-2 font-montserrat font-medium text-gray-400 hover:text-pink-500 transition-colors text-sm">
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

        {/* BARRA DE PROGRESO */}
        <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-400 font-montserrat uppercase tracking-wider">
                <span>{step === 1 ? "Tipo de Cuenta" : "Datos Personales"}</span>
                <span>{step === 1 ? "Paso 1/2" : "Paso 2/2"}</span>
            </div>
            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-pink-600 to-purple-600 transition-all duration-500 ease-out" 
                    style={{ width: progress }} 
                />
            </div>
        </div>

        {/* --- PASO 1: SELECCIÓN DE ROL --- */}
        {step === 1 && (
          <div className="space-y-4 mt-8 animate-in fade-in slide-in-from-bottom-4">
            <button
              type="button"
              onClick={() => { setRole("cliente"); setStep(2); }}
              className="w-full flex items-center p-6 border border-white/10 rounded-2xl bg-[#1a1018] hover:bg-[#251722] hover:border-white/30 transition-all group"
            >
              <div className="p-4 bg-gray-800/50 rounded-full group-hover:bg-gray-700 transition-colors">
                <User className="w-8 h-8 text-gray-300" />
              </div>
              <div className="ml-5 text-left">
                <h3 className="text-xl font-bold text-white">Busco Compañía</h3>
                <p className="text-sm text-gray-400 mt-1">Quiero ver perfiles y contactar escorts de forma segura.</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => { setRole("modelo"); setStep(2); }}
              className="w-full flex items-center p-6 border border-pink-500/30 rounded-2xl bg-[#1a1018] hover:bg-pink-900/20 hover:border-pink-500 transition-all group shadow-[0_0_15px_rgba(236,72,153,0.1)]"
            >
              <div className="p-4 bg-pink-500/10 rounded-full group-hover:bg-pink-500/20 transition-colors">
                <Sparkles className="w-8 h-8 text-pink-500" />
              </div>
              <div className="ml-5 text-left">
                <h3 className="text-xl font-bold text-white">Soy Escort</h3>
                <p className="text-sm text-gray-400 mt-1">Quiero crear mi perfil, publicar avisos y conseguir clientes.</p>
              </div>
            </button>
          </div>
        )}

        {/* --- PASO 2: FORMULARIO DE DATOS --- */}
        {step === 2 && (
            <form onSubmit={onSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4">
              
              <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                <h2 className="text-lg font-bold text-white font-montserrat">
                  Registro de {role === "modelo" ? "Escort" : "Cuenta"}
                </h2>
                <button 
                  type="button" 
                  onClick={() => setStep(1)} 
                  className="text-xs text-pink-500 hover:text-pink-400 flex items-center gap-1 font-montserrat"
                >
                  <ArrowLeft className="w-3 h-3" /> Cambiar rol
                </button>
              </div>
              
              {/* Usuario */}
              <div className="space-y-1">
                <label className="text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wide ml-1">
                  {role === "modelo" ? "Nombre Artístico (Usuario)" : "Usuario"}
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-pink-500 transition-colors" />
                  <input
                    className={`w-full bg-[#1a1018] border rounded-xl py-3 pl-12 pr-10 text-white placeholder:text-gray-600 focus:ring-1 outline-none transition-all font-montserrat font-medium ${usernameError ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-pink-500'}`}
                    placeholder={role === "modelo" ? "Ej: mia_santiago" : "usuario123"}
                    value={username}
                    
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                    
                    required
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                    autoComplete="username"
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
                    onChange={(e) => { 
                        setEmail(e.target.value.toLowerCase().replace(/\s/g, '')); 
                        setEmailError(""); 
                    }}
                    required
                    autoCapitalize="none"
                    autoCorrect="off"     
                    spellCheck="false"
                    autoComplete="email"
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
                    className="mt-1 h-4 w-4 rounded border-gray-600 bg-gray-800 text-pink-600 focus:ring-pink-500 cursor-pointer" 
                />
                <label htmlFor="terms" className="font-montserrat text-xs text-gray-400 cursor-pointer">
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
                    role === "modelo" ? "Crear Cuenta de Escort" : "Finalizar Registro"
                )}
              </button>
            </form>
        )}
    </div>
  );
}

// Subcomponente de requisitos de password
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
    <div className="min-h-screen bg-[#050205] text-white flex flex-col lg:flex-row w-full">
      
      {/* Navbar (Fija arriba) */}
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
            <Link href="/login">¿Ya tienes cuenta? Ingresa aquí</Link>
        </div>
      </nav>

      {/* Columna Izquierda: Formulario (Ahora con flex-col y centrado arreglado) */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center min-h-screen pt-24 pb-12 px-6 lg:px-12 bg-[#050205] relative z-10">
        <Suspense fallback={<div className="text-pink-500 animate-pulse font-montserrat">Cargando registro...</div>}>
          <RegisterForm />
        </Suspense>
      </div>

      {/* Columna Derecha: Hero Image (ARREGLADA sin fixed) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#110a10] border-l border-white/10 min-h-screen flex-col justify-end">
        <Image 
            src={HERO_IMG}
            alt="xscort registro background"
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
                Comunidad Exclusiva
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold font-fancy leading-tight mb-8">
                Tu perfil, tus reglas, <br/> <span className="text-pink-500">tu éxito.</span>
            </h2>
            <ul className="space-y-5 text-gray-300 font-montserrat font-medium text-sm">
                <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Panel de control avanzado y 100% privado.</span>
                </li>
                <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Contacto directo y sin intermediarios.</span>
                </li>
            </ul>
        </div>
      </div>

    </div>
  );
}