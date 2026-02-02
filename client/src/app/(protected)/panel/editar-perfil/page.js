"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
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
    whatsapp: "",
    telegram_contacto: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [ciudadActual, setCiudadActual] = useState(null); 
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState("");

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/profiles/mi-perfil/");
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
        whatsapp: data.whatsapp || "",
        telegram_contacto: data.telegram_contacto || "",
      });

      setCiudadActual(data.ciudad);

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
        "/api/profiles/mi-perfil/", 
        {
          nombre_artistico: formData.nombre_publico,
          biografia: formData.descripcion,
          edad: formData.edad ? parseInt(formData.edad, 10) : null,
          genero: formData.genero || null,
          peso: formData.peso ? parseInt(formData.peso, 10) : null,
          altura: formData.altura ? parseInt(formData.altura, 10) : null,
          medidas: formData.medidas || null,
          nacionalidad: formData.nacionalidad || null,
          whatsapp: formData.whatsapp || null,
          telegram_contacto: formData.telegram_contacto || null,
        }
      );
      
      setSuccess("¡Perfil actualizado correctamente!");
      window.scrollTo(0, 0);
      
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
        <div className="min-h-screen bg-[#120912] px-4 sm:px-8 lg:px-10 py-10 text-white flex items-center justify-center">
          <div className="animate-pulse">Cargando perfil...</div>
        </div>
      </ProtectedRoute>
    );
  }

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
              <a href="/panel/verificacion" className="rounded-lg bg-[#ff007f] px-4 py-2 text-white font-semibold hover:bg-pink-500">
                Ir a verificación
              </a>
              <a href="/panel/suscripcion" className="rounded-lg border border-pink-600 px-4 py-2 font-semibold hover:bg-white/5">
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
        <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-10 py-10">
          
          {/* Header */}
          <div className="mb-8 text-center sm:text-left">
            <p className="text-sm uppercase text-pink-200 font-semibold font-montserrat tracking-widest">xscort.cl</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-montserrat mt-2">Editar Mi Perfil</h1>
            <p className="text-pink-100 mt-2 text-sm sm:text-base font-montserrat opacity-80">
                Personaliza cómo te ven los clientes en la plataforma.
            </p>
          </div>

          <div className="space-y-8 font-montserrat">
            
            {/* 1. SECCIÓN FOTO DE PERFIL (AHORA ARRIBA) */}
            <section>
                <FormularioFotoPerfil
                  initialFotoUrl={fotoPerfilUrl}
                  onSuccess={(url) => setFotoPerfilUrl(url)}
                />
            </section>

            {/* 2. SECCIÓN FORMULARIO DE DATOS */}
            <section className="rounded-2xl bg-[#1b0d18] p-6 sm:p-8 shadow-xl border border-white/5">
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Feedback UI */}
                  {error && (
                    <div className="p-4 bg-red-900/20 border border-red-500/50 text-red-200 rounded-lg text-sm">
                        {error}
                    </div>
                  )}
                  {success && (
                    <div className="p-4 bg-green-900/20 border border-green-500/50 text-green-200 rounded-lg text-sm">
                        {success}
                    </div>
                  )}

                  {/* Nombre Público */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-pink-100 uppercase tracking-wide">Nombre Público *</label>
                    <input
                      type="text"
                      name="nombre_publico"
                      value={formData.nombre_publico}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition-all"
                      placeholder="Tu nombre artístico"
                    />
                  </div>

                  {/* Descripción */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-pink-100 uppercase tracking-wide">Sobre mí</label>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition-all min-h-[120px]"
                      placeholder="Cuéntanos qué te hace única, tus gustos y qué ofreces..."
                    />
                  </div>

                  {/* Bloque: Datos Físicos */}
                  <div className="pt-6 border-t border-white/10">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <span className="w-1 h-6 bg-pink-500 rounded-full"></span>
                        Características Físicas
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Edad */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-400 uppercase">Edad</label>
                        <input
                          type="number"
                          name="edad"
                          value={formData.edad}
                          onChange={handleChange}
                          min="18"
                          className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-white focus:border-pink-500 outline-none"
                        />
                      </div>

                      {/* Género */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-400 uppercase">Género</label>
                          <select
                            name="genero"
                            value={formData.genero}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-white focus:border-pink-500 outline-none [&>option]:text-black"
                          >
                            <option value="">Selecciona...</option>
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                            <option value="T">Transgénero</option>
                          </select>
                      </div>

                      {/* Altura */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-400 uppercase">Altura (cm)</label>
                        <input
                          type="number"
                          name="altura"
                          value={formData.altura}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-white focus:border-pink-500 outline-none"
                          placeholder="Ej: 170"
                        />
                      </div>

                      {/* Peso */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-400 uppercase">Peso (kg)</label>
                        <input
                          type="number"
                          name="peso"
                          value={formData.peso}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-white focus:border-pink-500 outline-none"
                          placeholder="Ej: 60"
                        />
                      </div>

                      {/* Medidas */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-400 uppercase">Medidas</label>
                        <input
                          type="text"
                          name="medidas"
                          value={formData.medidas}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-white focus:border-pink-500 outline-none"
                          placeholder="Ej: 90-60-90"
                        />
                      </div>

                      {/* Nacionalidad */}
                      <div className="space-y-2">
                         <label className="block text-xs font-bold text-gray-400 uppercase">Nacionalidad</label>
                         <input
                           type="text"
                           name="nacionalidad"
                           value={formData.nacionalidad}
                           onChange={handleChange}
                           className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-white focus:border-pink-500 outline-none"
                           placeholder="Ej: Chilena"
                         />
                      </div>
                    </div>
                  </div>

                  {/* Bloque: Contacto */}
                  <div className="pt-6 border-t border-white/10">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <span className="w-1 h-6 bg-pink-500 rounded-full"></span>
                        Contacto Público
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-5">
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-400 uppercase">WhatsApp / Teléfono</label>
                        <div className="relative">
                            <input
                            type="tel"
                            name="whatsapp"
                            value={formData.whatsapp}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-white/10 bg-black/20 pl-12 pr-4 py-2 text-white focus:border-pink-500 outline-none"
                            placeholder="+56 9 1234 5678"
                            />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-400 uppercase">Telegram</label>
                        <div className="relative">
                            <input
                            type="text"
                            name="telegram_contacto"
                            value={formData.telegram_contacto}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-white/10 bg-black/20 pl-12 pr-4 py-2 text-white focus:border-pink-500 outline-none"
                            placeholder="usuario_telegram"
                            />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botones Acción */}
                  <div className="flex gap-4 pt-6 mt-6 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="flex-1 rounded-xl border border-white/20 px-4 py-3 text-gray-300 hover:bg-white/5 transition-colors font-semibold"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 rounded-xl bg-gradient-to-r from-[#ff007f] to-[#ff0055] px-4 py-3 text-white font-bold hover:shadow-lg hover:shadow-pink-600/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {submitting ? "Guardando..." : "Guardar Cambios"}
                    </button>
                  </div>
                </form>
            </section>

          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}