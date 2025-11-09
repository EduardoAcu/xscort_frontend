"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/auth";
import axios from "@/lib/axiosConfig";
import ProtectedRoute from "@/components/ProtectedRoute";
import WidgetCiudad from "@/components/WidgetCiudad";

export default function EditarPerfilPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);

  const [formData, setFormData] = useState({
    nombre_publico: "",
    descripcion: "",
    edad: "",
    tags: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [ciudadActual, setCiudadActual] = useState("");

  useEffect(() => {
    if (token) {
      fetchProfileData();
    }
  }, [token]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/profiles/mi-perfil/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      setFormData({
        nombre_publico: data.nombre_publico || "",
        descripcion: data.descripcion || "",
        edad: data.edad || "",
        tags: Array.isArray(data.tags)
          ? data.tags.map((t) => (typeof t === "object" ? t.nombre : t)).join(", ")
          : data.tags || "",
      });
      setCiudadActual(data.ciudad || "");
      setError("");
    } catch (err) {
      setError("Error al cargar el perfil");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    setSubmitting(true);
    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      await axios.patch(
        "/api/profiles/mi-perfil/actualizar/",
        {
          nombre_publico: formData.nombre_publico,
          descripcion: formData.descripcion,
          edad: formData.edad ? parseInt(formData.edad) : null,
          tags: tagsArray,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("¡Perfil actualizado correctamente!");
      setTimeout(() => router.push("/panel/dashboard"), 2000);
    } catch (err) {
      const apiError =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        "Error al actualizar perfil";
      setError(apiError);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 px-6 py-12 sm:px-12 lg:px-24">
          <div className="text-center">Cargando perfil...</div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white px-6 py-8 sm:px-12 lg:px-24 shadow-sm border-b">
          <h1 className="text-4xl font-bold">Editar Mi Perfil</h1>
          <p className="text-gray-600 mt-2">Actualiza tu información personal</p>
        </div>

        {/* Content */}
        <div className="px-6 py-12 sm:px-12 lg:px-24">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nombre Público */}
                  <div className="space-y-2">
                    <label className="block font-semibold">Nombre Público *</label>
                    <input
                      type="text"
                      name="nombre_publico"
                      value={formData.nombre_publico}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border px-4 py-2"
                      placeholder="Tu nombre artístico"
                    />
                  </div>

                  {/* Edad */}
                  <div className="space-y-2">
                    <label className="block font-semibold">Edad</label>
                    <input
                      type="number"
                      name="edad"
                      value={formData.edad}
                      onChange={handleChange}
                      min="18"
                      max="100"
                      className="w-full rounded-md border px-4 py-2"
                      placeholder="Ej: 25"
                    />
                  </div>

                  {/* Descripción */}
                  <div className="space-y-2">
                    <label className="block font-semibold">Descripción</label>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      className="w-full rounded-md border px-4 py-2 resize-none"
                      rows="5"
                      placeholder="Cuéntanos sobre ti..."
                    />
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <label className="block font-semibold">Etiquetas (separadas por coma)</label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      className="w-full rounded-md border px-4 py-2"
                      placeholder="Ej: rubia, tatuajes, activa"
                    />
                    <p className="text-xs text-gray-600">Separa cada etiqueta con una coma</p>
                  </div>

                  {error && <p className="text-sm text-red-600">{error}</p>}
                  {success && <p className="text-sm text-green-600">{success}</p>}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="flex-1 rounded-lg border px-4 py-2 hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
                    >
                      {submitting ? "Guardando..." : "Guardar Cambios"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* City Widget */}
            <div className="lg:col-span-1">
              <WidgetCiudad ciudadActual={ciudadActual} />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
