"use client";
import { Suspense, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const res = await api.post("/api/auth/forgot-password/", { email });
        const { toast } = await import("sonner");
        toast.success(res.data.message || "Revisa tu email para continuar");
        setSuccess(true);
      } catch (err) {
        const apiError = err?.response?.data?.error || err?.message || "Error al enviar email";
        const { toast } = await import("sonner");
        toast.error(apiError);
      }
    });
  };

  if (success) {
    return (
      <div className="relative flex min-h-screen w-full items-center justify-center">
        <div className="w-full max-w-md p-6 sm:p-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary mx-auto">
              <span className="material-symbols-outlined text-4xl">mail</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Revisa tu email</h1>
            <p className="text-base text-[#c992ad]">
              Si el email existe en nuestro sistema, recibirás un correo con instrucciones para recuperar tu contraseña.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-colors mt-6"
            >
              Volver a Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full">
      {/* Columna izquierda: formulario */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-8 md:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Recuperar Contraseña</h1>
            <p className="text-xs sm:text-sm md:text-base text-[#c992ad] mt-2">Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.</p>
          </div>

          {/* Formulario */}
          <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4 px-3 sm:px-4">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-white text-base font-medium leading-normal pb-2">Email</p>
              <input
                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#67324d] bg-[#331926] focus:border-[#67324d] h-14 placeholder:text-[#c992ad] p-[15px] text-base font-normal leading-normal"
                placeholder="tu@email.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <button
              type="submit"
              disabled={isPending}
              className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-colors mt-2 disabled:opacity-60"
            >
              {isPending ? "Enviando..." : "Enviar enlace"}
            </button>

            <p className="px-1 text-sm text-[#c992ad] text-center">
              ¿Recordaste tu contraseña? <a href="/login" className="font-medium text-primary hover:underline">Volver a iniciar sesión</a>
            </p>
          </form>
        </div>
      </div>

      {/* Columna derecha: hero */}
      <div
        className="hidden lg:flex w-1/2 bg-center bg-no-repeat bg-cover relative items-center justify-center p-12"
        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCnP8wKO-C9IUvxLmwZLAJxZUMnxrLlfOoJy40TCD7QGeordn1zkNiqy6GqCTsjHdQFsdy9B4wHRjqpo67K8MtdNkGluaHXaJWVFnZdMeYCm-mYHvQtZpJkKcLKnrlR42NGAuydR1Nm9MkAU318NwxcjExZn30kgGx-l7RIgH8eZBK-hmULOD9Fcsqi0gaFQzXP33pPj0STEsAaQx5XnBSY7VFlAHEFN8FgQNGLyu1dqgA42-_D7JDJsw6Xx8O2Hxg__nXWbysIpqRu")' }}
        data-alt="Fotografía profesional y elegante de una modelo en un ambiente de clase y exclusividad."
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div className="relative z-10 max-w-lg text-left text-white">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] xl:text-5xl">
                Recupera el acceso a tu cuenta de forma segura
              </h1>
              <h2 className="text-gray-200 text-base font-normal leading-normal xl:text-lg">
                Te enviaremos un enlace temporal a tu email registrado.
              </h2>
            </div>

            <div className="flex flex-col gap-4 mt-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary">
                  <span className="material-symbols-outlined">shield_lock</span>
                </div>
                <div>
                  <h3 className="font-bold">Proceso Seguro</h3>
                  <p className="text-sm text-gray-300">Link temporal de un solo uso con expiración de 1 hora.</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <div>
                  <h3 className="font-bold">Verifica tu Email</h3>
                  <p className="text-sm text-gray-300">Recibirás instrucciones en tu correo registrado.</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary">
                  <span className="material-symbols-outlined">verified_user</span>
                </div>
                <div>
                  <h3 className="font-bold">Tu Cuenta Está Protegida</h3>
                  <p className="text-sm text-gray-300">Nadie puede acceder sin tu confirmación por email.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Cargando…</div>}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
