"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/auth";
import ProtectedRoute from "@/components/ProtectedRoute";
import axios from "axios";

function CreateProfileForm() {
  const [nombre_publico, setNombrePublico] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const token = useAuthStore((s) => s.token);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      try {
        const response = await axios.post(
          "/api/profiles/create/",
          {
            nombre_publico,
            ciudad,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        router.push("/dashboard");
      } catch (err) {
        const apiError =
          err?.response?.data?.detail ||
          err?.response?.data?.error ||
          (typeof err?.response?.data === "object"
            ? Object.values(err?.response?.data)[0]?.[0]
            : err?.message) ||
          "Error al crear perfil";
        setError(apiError);
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-4 rounded-lg border p-6"
      >
        <h1 className="text-2xl font-semibold">Crear mi perfil</h1>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Nombre Público *</label>
          <input
            type="text"
            value={nombre_publico}
            onChange={(e) => setNombrePublico(e.target.value)}
            required
            className="w-full rounded-md border px-3 py-2"
            placeholder="Tu nombre artístico"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Ciudad *</label>
          <input
            type="text"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            required
            className="w-full rounded-md border px-3 py-2"
            placeholder="Tu ciudad"
          />
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-md bg-black px-3 py-2 text-white disabled:opacity-60"
        >
          {isPending ? "Creando perfil..." : "Crear perfil"}
        </button>
      </form>
    </div>
  );
}

export default function CreateProfilePage() {
  return (
    <ProtectedRoute>
      <CreateProfileForm />
    </ProtectedRoute>
  );
}
