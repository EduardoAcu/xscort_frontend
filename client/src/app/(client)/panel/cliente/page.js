"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function PanelClientePage() {
  const [form, setForm] = useState({ username: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [likes, setLikes] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const meRes = await api.get("/api/me/");
        setForm({ username: meRes.data.username || "", email: meRes.data.email || "" });
        const likesRes = await api.get("/api/profiles/likes/");
        setLikes(likesRes.data || []);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la información");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await api.patch("/api/me/", {
        email: form.email,
      });
      setForm(prev => ({ ...prev, email: res.data.email }));
      setMessage("Datos actualizados correctamente");
    } catch (err) {
      const apiErr = err?.response?.data;
      setError(apiErr?.email?.[0] || "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleUnlike = async (perfilId) => {
    try {
      await api.delete(`/api/profiles/${perfilId}/unlike/`);
      setLikes((prev) => prev.filter((l) => l.perfil_id !== perfilId));
    } catch (err) {
      console.error(err);
      setError("No se pudo quitar el like");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#120912]">
        <div className="flex flex-col items-center gap-2">
          <span className="animate-pulse text-pink-500">Cargando panel...</span>
        </div>
      </div>
    );
  }

  return (
    // 1. AJUSTE PRINCIPAL: w-full y flex-1 para ocupar el espacio junto al sidebar
    // pt-24 en móvil para bajar el contenido y que no choque con el header del menú
    // lg:pt-8 en escritorio porque ahí no hay header superior
    <main className="flex-1 w-full bg-[#120912] min-h-screen p-4 pt-24 lg:p-10 text-white font-montserrat">
      
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="border-b border-[#3b1027] pb-6">
          <p className="text-sm uppercase text-pink-400 font-bold tracking-wider">Mi cuenta</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">Panel de Cliente</h1>
          <p className="text-pink-100/80 mt-2 text-sm sm:text-base max-w-2xl">
            Gestiona tu información personal y revisa a las modelos que has guardado en tus favoritos.
          </p>
        </header>

        <section className="grid gap-8 lg:grid-cols-12 items-start">
          
          {/* COLUMNA 1: DATOS (Ocupa 5 columnas en desktop) */}
          <div className="lg:col-span-5 rounded-3xl bg-[#1b0d18] p-6 lg:p-8 border border-[#3b1027] shadow-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-pink-500">person</span>
              Datos Personales
            </h2>
            
            <form className="space-y-5" onSubmit={handleSave}>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300">Nombre de usuario</label>
                <input
                  name="username"
                  value={form.username}
                  disabled 
                  className="w-full rounded-xl border border-[#3b1027] px-4 h-12 bg-[#2a1425] text-white/50 cursor-not-allowed font-medium"
                />
                <p className="text-[10px] text-pink-200/50 uppercase tracking-wide">No editable</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300">Correo electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#3b1027] px-4 h-12 bg-[#120912] text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition-all placeholder:text-gray-600"
                  required
                />
              </div>

              <div className="pt-2">
                {error && <div className="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-800 text-red-200 text-sm">{error}</div>}
                {message && <div className="mb-4 p-3 rounded-lg bg-green-900/30 border border-green-800 text-green-200 text-sm">{message}</div>}
                
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-xl bg-[#ff007f] h-12 text-white font-bold hover:bg-[#d9006c] disabled:opacity-60 transition-all shadow-lg shadow-pink-900/20"
                >
                  {saving ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>

          {/* COLUMNA 2: LIKES (Ocupa 7 columnas en desktop) */}
          <div className="lg:col-span-7 rounded-3xl bg-[#1b0d18] p-6 lg:p-8 border border-[#3b1027] shadow-xl flex flex-col h-full min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-pink-500">favorite</span>
                Mis Favoritos
              </h2>
              <span className="text-xs font-semibold bg-[#3b1027] text-pink-200 px-3 py-1 rounded-full">
                {likes.length} guardados
              </span>
            </div>

            {likes.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-[#3b1027] rounded-2xl">
                <span className="material-symbols-outlined text-6xl text-[#3b1027] mb-4">heart_broken</span>
                <p className="text-gray-400 font-medium">Aún no tienes favoritos.</p>
                <a href="/busqueda" className="mt-4 text-pink-500 hover:text-pink-400 text-sm font-semibold hover:underline">
                  Explorar modelos
                </a>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                {likes.map((like) => (
                  <div
                    key={like.perfil_id}
                    className="group flex items-center justify-between rounded-xl bg-[#120912] border border-[#3b1027] p-3 hover:border-pink-500/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {like.foto_perfil ? (
                        <img
                          src={like.foto_perfil}
                          alt={like.nombre_artistico}
                          className="h-12 w-12 rounded-full object-cover ring-2 ring-[#3b1027]"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-pink-600 flex items-center justify-center text-sm font-bold">
                          {(like.nombre_artistico || "U").slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-white group-hover:text-pink-400 transition-colors">
                            {like.nombre_artistico || "Modelo"}
                        </p>
                        <a
                          href={`/perfil/${like.perfil_id}`}
                          className="text-xs text-gray-500 hover:text-white flex items-center gap-1 mt-0.5"
                        >
                          Ver perfil completo <span className="material-symbols-outlined text-[10px]">arrow_outward</span>
                        </a>
                      </div>
                    </div>
                    <button
                      onClick={() => handleUnlike(like.perfil_id)}
                      className="p-2 text-pink-500 hover:bg-pink-900/20 rounded-lg transition-colors"
                      title="Quitar de favoritos"
                    >
                      <span className="material-symbols-outlined text-xl">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}