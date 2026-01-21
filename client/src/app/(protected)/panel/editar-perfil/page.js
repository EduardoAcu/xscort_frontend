"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import WidgetCiudad from "@/components/WidgetCiudad";
import FormularioFotoPerfil from "@/components/FormularioFotoPerfil";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function EditarPerfilPage() {
  const router = useRouter();
  

  const [formData, setFormData] = useState({
    nombre_publico: "",
    descripcion: "",
    edad: "",
    genero: "",
    peso: "",
    altura: "",
    medidas: "",
    nacionalidad: "",
    telefono_contacto: "",
    telegram_contacto: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [ciudadActual, setCiudadActual] = useState("");
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState("");

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/profiles/mi-perfil/", {
      });
      const data = res.data;
      setFormData({
        nombre_publico: data.nombre_artistico || "",
        descripcion: data.biografia || "",
        edad: data.edad || "",
        genero: data.genero || "",
        peso: data.peso || "",
        altura: data.altura || "",
        medidas: data.medidas || "",
        nacionalidad: data.nacionalidad || "",
        telefono_contacto: data.telefono_contacto || "",
        telegram_contacto: data.telegram_contacto || "",
      });
      setCiudadActual(data.ciudad || "");
      if (data.foto_perfil) {
        const url = data.foto_perfil.startsWith("http")
          ? data.foto_perfil
          : `${API_BASE_URL}${data.foto_perfil}`;
        setFotoPerfilUrl(url);
      } else {
        setFotoPerfilUrl("");
      }
      setError("");
    } catch (err) {
      const apiError =
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        "Error al cargar el perfil";
      setError(apiError);
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
      await api.patch(
        "/api/profiles/mi-perfil/actualizar/",
        {
          nombre_artistico: formData.nombre_publico,
          biografia: formData.descripcion,
          edad: formData.edad ? parseInt(formData.edad, 10) : null,
          genero: formData.genero || null,
          peso: formData.peso ? parseInt(formData.peso, 10) : null,
          altura: formData.altura ? parseInt(formData.altura, 10) : null,
          medidas: formData.medidas || null,
          nacionalidad: formData.nacionalidad || null,
          telefono_contacto: formData.telefono_contacto || null,
          telegram_contacto: formData.telegram_contacto || null,
        },
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
      <ProtectedRoute requireModel>
        <div className="min-h-screen bg-[#120912] px-4 sm:px-8 lg:px-10 py-10 text-white">
          <div className="max-w-2xl mx-auto text-center">Cargando perfil...</div>
        </div>
      </ProtectedRoute>
    );
  }

  // Si el backend indica que no existe perfil de modelo, mostramos un mensaje amigable
  if (error && error.includes("No tienes un perfil de modelo asociado")) {
    return (
      <ProtectedRoute requireModel>
        <div className="min-h-screen bg-[#120912] px-4 sm:px-8 lg:px-10 py-10 flex items-center justify-center text-white">
          <div className="max-w-lg rounded-2xl bg-[#1b0d18] p-6 shadow-md space-y-4 text-center">
            <h1 className="text-2xl font-bold">Aún no tienes un perfil de modelo</h1>
            <p className="text-pink-100">
              Para crear tu perfil de modelo, primero debes completar el proceso de verificación y contar con una
              suscripción activa.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
              <a
                href="/panel/verificacion"
                className="rounded-lg bg-[#ff007f] px-4 py-2 text-white font-semibold hover:bg-pink-500"
              >
                Ir a verificación
              </a>
              <a
                href="/panel/suscripcion"
                className="rounded-lg border border-pink-600 px-4 py-2 font-semibold hover:bg-white/5"
              >
                Ver planes de suscripción
              </a>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireModel>
      <div className="min-h-screen bg-[#120912] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-10 py-10">
          <div>
            <p className="text-sm uppercase text-pink-200 font-semibold font-montserrat">xscort.cl</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-montserrat">Editar Mi Perfil</h1>
            <p className="text-pink-100 mt-1 text-sm sm:text-base font-montserrat">Actualiza tu información personal</p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6 font-montserrat">
              <div className="rounded-2xl bg-[#1b0d18] p-6 shadow-md">
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
                      className="w-full rounded-md border px-4 py-2 bg-transparent text-white"
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
                      className="w-full rounded-md border px-4 py-2 bg-transparent text-white"
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
                      className="w-full rounded-md border px-4 py-2 bg-transparent text-white"
                      rows="5"
                      placeholder="Cuéntanos sobre ti..."
                    />
                  </div>

                  {/* Características Físicas */}
                  <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold mb-4">Características Físicas</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {/* Género */}
                      <div className="space-y-2">
                        <label className="block font-semibold">Género</label>
                        <select
                          name="genero"
                          value={formData.genero}
                          onChange={handleChange}
                          className="w-full rounded-md border px-4 py-2 bg-transparent text-white"
                        >
                          <option value="">Selecciona género</option>
                          <option value="M">Masculino</option>
                          <option value="F">Femenino</option>
                          <option value="T">Transgénero</option>
                        </select>
                      </div>

                      {/* Altura */}
                      <div className="space-y-2">
                        <label className="block font-semibold">Altura (cm)</label>
                        <input
                          type="number"
                          name="altura"
                          value={formData.altura}
                          onChange={handleChange}
                          min="100"
                          max="250"
                          className="w-full rounded-md border px-4 py-2 bg-transparent text-white"
                          placeholder="Ej: 170"
                        />
                      </div>

                      {/* Peso */}
                      <div className="space-y-2">
                        <label className="block font-semibold">Peso (kg)</label>
                        <input
                          type="number"
                          name="peso"
                          value={formData.peso}
                          onChange={handleChange}
                          min="30"
                          max="200"
                          className="w-full rounded-md border px-4 py-2 bg-transparent text-white"
                          placeholder="Ej: 60"
                        />
                      </div>

                      {/* Medidas */}
                      <div className="space-y-2">
                        <label className="block font-semibold">Medidas (cm)</label>
                        <input
                          type="text"
                          name="medidas"
                          value={formData.medidas}
                          onChange={handleChange}
                          className="w-full rounded-md border px-4 py-2 bg-transparent text-white"
                          placeholder="Ej: 90-60-90"
                        />
                      </div>
                    </div>

                    {/* Nacionalidad */}
                    <div className="space-y-2 mt-4">
                      <label className="block font-semibold">Nacionalidad</label>
                      <input
                        type="text"
                        name="nacionalidad"
                        value={formData.nacionalidad}
                        onChange={handleChange}
                        className="w-full rounded-md border px-4 py-2 bg-transparent text-white"
                        placeholder="Ej: Chilena"
                      />
                    </div>
                  </div>

                  {/* Información de Contacto */}
                  <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold mb-4">Información de Contacto Público</h3>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {/* Teléfono */}
                      <div className="space-y-2">
                        <label className="block font-semibold">Teléfono</label>
                        <input
                          type="tel"
                          name="telefono_contacto"
                          value={formData.telefono_contacto}
                          onChange={handleChange}
                          className="w-full rounded-md border px-4 py-2 bg-transparent text-white"
                          placeholder="+56 9 1234 5678"
                        />
                        <p className="text-xs text-gray-400">Este número será visible en tu perfil público</p>
                      </div>

                      {/* Telegram */}
                      <div className="space-y-2">
                        <label className="block font-semibold">Telegram</label>
                        <input
                          type="text"
                          name="telegram_contacto"
                          value={formData.telegram_contacto}
                          onChange={handleChange}
                          className="w-full rounded-md border px-4 py-2 bg-transparent text-white"
                          placeholder="@tu_usuario_telegram"
                        />
                        <p className="text-xs text-gray-400">Este usuario será visible en tu perfil público</p>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="border-t border-gray-700 pt-6 space-y-2 opacity-60">
                    <label className="block font-semibold">Etiquetas</label>
                    <p className="text-sm text-gray-600">
                      La edición de etiquetas se hará en una sección dedicada más adelante.
                    </p>
                  </div>

                  {error && <p className="text-sm text-red-600">{error}</p>}
                  {success && <p className="text-sm text-green-600">{success}</p>}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="flex-1 rounded-lg border border-pink-600 px-4 py-2 hover:bg-white/5"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 rounded-lg bg-[#ff007f] px-4 py-2 text-white font-semibold hover:bg-pink-500 disabled:opacity-60"
                    >
                      {submitting ? "Guardando..." : "Guardar Cambios"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Foto de perfil + City Widget */}
            <div className="lg:col-span-1 space-y-6">
              <div className="rounded-2xl bg-[#1b0d18] p-6 shadow-md">
                <FormularioFotoPerfil
                  initialFotoUrl={fotoPerfilUrl}
                  onSuccess={(url) => setFotoPerfilUrl(url)}
                />
              </div>

              <div className="rounded-2xl bg-[#1b0d18] p-6 shadow-md">
                <WidgetCiudad ciudadActual={ciudadActual} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
