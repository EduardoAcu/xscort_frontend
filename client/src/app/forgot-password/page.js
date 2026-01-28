"use client";

import { Suspense, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "@/lib/api"; // Tu cliente axios configurado
import { Mail, ShieldCheck, Lock, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        // Asegúrate que tu backend espere { email } en el body
        const res = await api.post("/api/auth/forgot-password/", { email });
        // Usamos alert nativo o tu librería de toast preferida si está configurada
        // Si tienes sonner instalado: toast.success(...)
        setSuccess(true);
      } catch (err) {
        console.error(err);
        // Manejo de error básico si falla la librería de toast
        alert(err?.response?.data?.error || "Error al enviar el correo. Intenta nuevamente.");
      }
    });
  };

  // ESTADO DE ÉXITO
  if (success) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#120912] text-white p-4">
        <div className="w-full max-w-md p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-500 mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold mb-4 font-fancy">¡Correo Enviado!</h1>
            <p className="text-gray-300 mb-8 leading-relaxed">
              Si el correo <strong>{email}</strong> está registrado, recibirás un enlace mágico para recuperar tu acceso en unos instantes.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="w-full py-4 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl transition-all"
            >
              Volver a Iniciar Sesión
            </button>
        </div>
      </div>
    );
  }

  // ESTADO FORMULARIO
  return (
    <div className="flex min-h-screen w-full bg-[#050205]">
      
      {/* LADO IZQUIERDO: Formulario */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative z-10">
        
        {/* Botón Volver flotante */}
        <div className="absolute top-6 left-6">
             <Link href="/login" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
                <ArrowLeft className="w-4 h-4" /> Volver
             </Link>
        </div>

        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="inline-block p-3 rounded-full bg-pink-600/10 mb-4">
                <Lock className="w-8 h-8 text-pink-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white font-fancy mb-3">Recuperar Acceso</h1>
            <p className="text-gray-400">Ingresa tu email y te enviaremos las instrucciones.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                <input
                  className="w-full bg-[#1a1018] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition-all"
                  placeholder="ejemplo@xscort.cl"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 bg-gradient-to-r from-pink-700 to-pink-600 hover:from-pink-600 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-pink-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPending ? (
                 <span className="animate-pulse">Enviando...</span>
              ) : (
                 <>Enviar Enlace de Recuperación</>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            ¿Ya tienes contraseña? <Link href="/login" className="text-pink-500 hover:underline font-bold">Inicia Sesión</Link>
          </p>
        </div>
      </div>

      {/* LADO DERECHO: Imagen Decorativa (Solo Desktop) */}
      <div className="hidden lg:flex w-1/2 relative bg-zinc-900 overflow-hidden items-center justify-center">
        {/* Usamos un degradado elegante si no tienes foto, o pon una foto local en /public */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-900/40 via-[#120912] to-black z-0"></div>
        
        {/* Contenido flotante */}
        <div className="relative z-10 max-w-lg p-12">
            <h2 className="text-5xl font-bold text-white font-fancy mb-6 leading-tight">
                Seguridad y <br/> <span className="text-pink-500">Privacidad.</span>
            </h2>
            
            <div className="space-y-6 mt-12">
                <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 flex-shrink-0">
                        <ShieldCheck className="w-6 h-6 text-pink-500" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg">Proceso Blindado</h3>
                        <p className="text-gray-400 text-sm">El enlace expira en 60 minutos para proteger tu cuenta.</p>
                    </div>
                </div>
                
                <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 flex-shrink-0">
                        <Mail className="w-6 h-6 text-pink-500" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg">Confirmación Obligatoria</h3>
                        <p className="text-gray-400 text-sm">Nadie puede cambiar tu clave sin acceso a tu email.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

// Wrapper con Suspense para evitar errores de hidratación en Next.js
export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Cargando...</div>}>
      <ForgotPasswordForm />
    </Suspense>
  );
}