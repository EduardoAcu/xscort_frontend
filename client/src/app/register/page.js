"use client";
import { Suspense, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useAuthStore from "@/store/auth";

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const register = useAuthStore((s) => s.register);
  const login = useAuthStore((s) => s.login);
  const router = useRouter();
  const searchParams = useSearchParams();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      try {
        await register({ username, email, password });
        // Opcional: iniciar sesión automáticamente
        await login({ username, password });
        const next = searchParams.get("next") || "/panel/dashboard";
        router.replace(next);
      } catch (err) {
        const apiError = err?.response?.data?.detail || err?.message || "Error al registrarse";
        setError(apiError);
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 rounded-lg border p-6">
        <h1 className="text-2xl font-semibold">Registro</h1>

        <div className="space-y-2">
          <label className="block text-sm">Usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full rounded-md border px-3 py-2"
            placeholder="usuario"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border px-3 py-2"
            placeholder="email@dominio.com"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-md border px-3 py-2"
            placeholder="••••••••"
          />
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-md bg-black px-3 py-2 text-white disabled:opacity-60"
        >
          {isPending ? "Creando cuenta..." : "Registrarse"}
        </button>

        <p className="text-sm text-muted-foreground">
          ¿Ya tienes cuenta? <a href="/login" className="underline">Inicia sesión</a>
        </p>
      </form>
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
