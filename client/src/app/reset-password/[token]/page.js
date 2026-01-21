"use client";
import { Suspense, useState, useTransition } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/api";

function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const params = useParams();
  const token = params.token;

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      const { toast } = await import("sonner");
      toast.error("Las contraseñas no coinciden");
      return;
    }
    
    if (newPassword.length < 8) {
      const { toast } = await import("sonner");
      toast.error("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    startTransition(async () => {
      try {
        const res = await api.post("/api/auth/reset-password/", {
          token,
          new_password: newPassword,
          confirm_password: confirmPassword
        });
        const { toast } = await import("sonner");
        toast.success(res.data.message || "Contraseña cambiada exitosamente");
        setSuccess(true);
      } catch (err) {
        const apiError = err?.response?.data?.error || err?.message || "Error al cambiar contraseña";
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
              <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">¡Contraseña cambiada!</h1>
            <p className="text-base text-[#c992ad]">
              Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-colors mt-6"
            >
              Iniciar Sesión
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
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Nueva Contraseña</h1>
            <p className="text-xs sm:text-sm md:text-base text-[#c992ad] mt-2">Ingresa tu nueva contraseña para tu cuenta.</p>
          </div>

          {/* Formulario */}
          <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4 px-3 sm:px-4">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-white text-base font-medium leading-normal pb-2">Nueva Contraseña</p>
              <div className="relative">
                <input
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#67324d] bg-[#331926] focus:border-[#67324d] h-14 placeholder:text-[#c992ad] p-[15px] text-base font-normal leading-normal pr-12"
                  placeholder="Mínimo 8 caracteres"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#c992ad] hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined select-none">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </label>

            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-white text-base font-medium leading-normal pb-2">Confirmar Contraseña</p>
              <div className="relative">
                <input
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#67324d] bg-[#331926] focus:border-[#67324d] h-14 placeholder:text-[#c992ad] p-[15px] text-base font-normal leading-normal pr-12"
                  placeholder="Repite tu contraseña"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#c992ad] hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined select-none">
                    {showConfirm ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </label>

            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <p className="text-sm text-red-400 px-1">Las contraseñas no coinciden</p>
            )}

            {newPassword && newPassword.length > 0 && newPassword.length < 8 && (
              <p className="text-sm text-yellow-400 px-1">La contraseña debe tener al menos 8 caracteres</p>
            )}

            <button
              type="submit"
              disabled={isPending || newPassword !== confirmPassword || newPassword.length < 8}
              className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? "Cambiando..." : "Cambiar Contraseña"}
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
                Crea una contraseña segura
              </h1>
              <h2 className="text-gray-200 text-base font-normal leading-normal xl:text-lg">
                Asegura tu cuenta con una contraseña fuerte y única.
              </h2>
            </div>

            <div className="flex flex-col gap-4 mt-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary">
                  <span className="material-symbols-outlined">lock</span>
                </div>
                <div>
                  <h3 className="font-bold">Mínimo 8 Caracteres</h3>
                  <p className="text-sm text-gray-300">Usa una combinación de letras, números y símbolos.</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary">
                  <span className="material-symbols-outlined">shield_lock</span>
                </div>
                <div>
                  <h3 className="font-bold">Token de Un Solo Uso</h3>
                  <p className="text-sm text-gray-300">Este enlace expirará después de cambiar tu contraseña.</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary">
                  <span className="material-symbols-outlined">verified_user</span>
                </div>
                <div>
                  <h3 className="font-bold">Cuenta Protegida</h3>
                  <p className="text-sm text-gray-300">Tu nueva contraseña se guardará de forma segura.</p>
                </div>
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
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Cargando…</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
