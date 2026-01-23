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
      // 1. CAMBIO: Solo enviamos el email en el PATCH.
      // El username no se envía porque no permitimos cambiarlo.
      const res = await api.patch("/api/me/", {
        email: form.email,
      });
      
      // Actualizamos el estado con la respuesta (por si el backend normalizó el email)
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
      <div className="min-h-[60vh] flex items-center justify-center text-white">
        Cargando panel...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 lg:px-6 space-y-8 text-white">
      <header>
        <p className="text-sm uppercase text-pink-200 font-semibold">Mi panel</p>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Panel de cliente</h1>
        <p className="text-pink-100 mt-1 text-sm sm:text-base">Actualiza tus datos y gestiona tus likes.</p>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-[#1b0d18] p-6 shadow-md space-y-4">
          <h2 className="text-xl font-semibold">Datos de la cuenta</h2>
          <form className="space-y-4" onSubmit={handleSave}>
            <div className="space-y-2">
              <label className="block font-semibold">Nombre de usuario</label>
              <input
                name="username"
                value={form.username}
                // 2. CAMBIO: Input deshabilitado (disabled) y sin onChange
                disabled 
                className="w-full rounded-md border border-[#3b1027] px-4 py-2 bg-[#2a1425] text-white/50 cursor-not-allowed"
                title="El nombre de usuario no se puede cambiar"
              />
              <p className="text-xs text-pink-200/60">El nombre de usuario no es editable.</p>
            </div>
            <div className="space-y-2">
              <label className="block font-semibold">Correo electrónico</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-md border border-[#3b1027] px-4 py-2 bg-transparent text-white focus:border-pink-500 focus:outline-none"
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            {message && <p className="text-sm text-green-500">{message}</p>}
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#ff007f] px-4 py-2 text-white font-semibold hover:bg-pink-500 disabled:opacity-60 transition-colors"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>
        </div>

        <div className="rounded-2xl bg-[#1b0d18] p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Mis likes</h2>
            <p className="text-sm text-pink-100">{likes.length} guardados</p>
          </div>
          {likes.length === 0 ? (
            <p className="text-sm text-pink-100">Aún no has dado like a ninguna modelo.</p>
          ) : (
            <div className="space-y-3">
              {likes.map((like) => (
                <div
                  key={like.perfil_id}
                  className="flex items-center justify-between rounded-lg border border-[#3b1027] p-3"
                >
                  <div className="flex items-center gap-3">
                    {like.foto_perfil ? (
                      <img
                        src={like.foto_perfil}
                        alt={like.nombre_artistico || "Perfil"}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-pink-500 flex items-center justify-center text-sm font-bold">
                        {(like.nombre_artistico || "P").slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{like.nombre_artistico || "Perfil"}</p>
                      <a
                        href={`/perfil/${like.perfil_id}`}
                        className="text-xs text-pink-300 hover:text-pink-200"
                      >
                        Ver perfil
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUnlike(like.perfil_id)}
                    className="text-sm text-pink-200 hover:text-white underline"
                  >
                    Quitar like
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}