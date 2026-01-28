"use client";

import { Suspense, useState, useTransition } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";
// Íconos Nativos
import { Lock, Eye, EyeOff, CheckCircle2, ShieldCheck, KeyRound, ArrowLeft } from "lucide-react";

function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const router = useRouter();
  const params = useParams();
  const token = params.token;

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    
    if (newPassword !== confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden.");
      return;
    }
    
    if (newPassword.length < 8) {
      setErrorMsg("La contraseña es muy corta (mínimo 8 caracteres).");
      return;
    }

    startTransition(async () => {
      try {
        await api.post("/api/auth/reset-password/", {
          token,
          new_password: newPassword,
          confirm_password: confirmPassword
        });
        
        const { toast } = await import("sonner");
        toast.success("¡Contraseña actualizada!");
        setSuccess(true);
      } catch (err) {
        const apiError = err?.response?.data?.error || "El enlace ha expirado o es inválido.";
        setErrorMsg(apiError);
        const { toast } = await import("sonner");
        toast.error(apiError);
      }
    });
  };

  // ESTADO DE ÉXITO
  if (success) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#050205] p-4">
        <div className="w-full max-w-md p-8 bg-[#1a1018] border border-white/10 rounded-2xl text-center shadow-2xl">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 text-green-500 mx-auto mb-6 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-white font-fancy mb-4">¡Todo listo!</h1>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Tu contraseña ha sido blindada correctamente. Ya puedes acceder a tu cuenta con tus nuevas credenciales.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="w-full py-4 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-pink-900/20"
            >
              Ir a Iniciar Sesión
            </button>
        </div>
      </div>
    );
  }

  // ESTADO FORMULARIO
  return (
    <div className="flex min-h-screen w-full bg-[#050205] text-white">
      
      {/* LADO IZQUIERDO */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative z-10">
        
        <div className="absolute top-6 left-6 lg:hidden">
             <Link href="/login" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
                <ArrowLeft className="w-4 h-4" /> Cancelar
             </Link>
        </div>

        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="inline-block p-3 rounded-full bg-pink-600/10 mb-4">
                <KeyRound className="w-8 h-8 text-pink-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-fancy mb-2">Nueva Contraseña</h1>
            <p className="text-gray-400 text-sm">Crea una clave segura para proteger tu perfil.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            
            {/* Input 1 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Contraseña Nueva</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-pink-500 transition-colors" />
                <input
                  className="w-full bg-[#1a1018] border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white placeholder:text-gray-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition-all"
                  placeholder="Mínimo 8 caracteres"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Input 2 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Confirmar Contraseña</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-pink-500 transition-colors" />
                <input
                  className="w-full bg-[#1a1018] border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white placeholder:text-gray-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition-all"
                  placeholder="Repite la contraseña"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-3.5 text-gray-500 hover:text-white transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Mensajes de Error / Validación */}
            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm text-center">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 bg-white hover:bg-gray-200 text-black font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform active:scale-95"
            >
              {isPending ? "Actualizando..." : "Cambiar Contraseña"}
            </button>

          </form>
        </div>
      </div>

      {/* LADO DERECHO: Hero */}
      <div className="hidden lg:flex w-1/2 relative bg-zinc-900 overflow-hidden items-center justify-center">
        {/* Imagen de fondo de seguridad */}
        <Image 
            src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1470&auto=format&fit=crop"
            alt="Security Background"
            fill
            className="object-cover opacity-40"
            priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050205] to-transparent"></div>
        
        <div className="relative z-10 max-w-lg p-12 text-left">
          <h2 className="text-5xl font-bold font-fancy leading-tight mb-6">
            Seguridad de <br/> <span className="text-pink-500">Alto Nivel.</span>
          </h2>
          
          <div className="space-y-6 mt-8">
            <div className="flex gap-4 items-start">
               <div className="mt-1 bg-pink-600/20 p-2 rounded-lg text-pink-500">
                  <Lock className="w-5 h-5" />
               </div>
               <div>
                  <h3 className="font-bold text-lg">Encriptación Total</h3>
                  <p className="text-gray-400 text-sm">Tus datos viajan seguros y encriptados.</p>
               </div>
            </div>

            <div className="flex gap-4 items-start">
               <div className="mt-1 bg-pink-600/20 p-2 rounded-lg text-pink-500">
                  <ShieldCheck className="w-5 h-5" />
               </div>
               <div>
                  <h3 className="font-bold text-lg">Protección de Cuenta</h3>
                  <p className="text-gray-400 text-sm">Nadie más tiene acceso a tu nueva clave.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-black text-white">Cargando...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}