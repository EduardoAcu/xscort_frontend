import { notFound } from "next/navigation";
import NavBar from "@/components/NavBar";
import CabeceraPerfil from "@/components/CabeceraPerfil";
import BotonesContacto from "@/components/BotonesContacto";
import FormularioResenaWrapper from "@/components/FormularioResenaWrapper";
import GaleriaPublica from "@/components/GaleriaPublica";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const getImageUrl = (path) => path ? (path.startsWith("http") ? path : `${API_URL}${path}`) : null;

async function getPerfilData(slug) {
  try {
    const res = await fetch(`${API_URL}/api/profiles/${slug}/`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const perfil = await getPerfilData(id);
  if (!perfil) return { title: "Perfil no encontrado" };
  return {
    title: `${perfil.nombre_artistico} | xscort.cl`,
    description: perfil.biografia?.substring(0, 160),
  };
}

export default async function PerfilPage({ params }) {
  const { id } = await params;
  const perfil = await getPerfilData(id);
  if (!perfil) notFound();

  const galeria = perfil.galeria_fotos || [];
  const resenas = perfil.resenas || [];
  const servicios = perfil.servicios || [];

  return (
    <div className="min-h-screen bg-[#120912] text-gray-300 font-montserrat">
      <NavBar />
      
      {/* Contenedor Principal (Sin padding top excesivo) */}
      <div className="pt-20 pb-20">
        
        {/* 1. HEADER INTEGRADO (Full Width visualmente, contenido centrado) */}
        <CabeceraPerfil perfil={perfil} />

        {/* 2. ACTIONS */}
        <BotonesContacto perfil={perfil} />

        {/* Contenedor centralizado para el resto */}
        <div className="max-w-5xl mx-auto px-4 md:px-0 mt-12 space-y-16">

            {/* 3. GALERÍA (Grilla fina) */}
            {galeria.length > 0 && (
                <section>
                    <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-2">
                        <h2 className="text-sm font-semibold uppercase tracking-widest text-white">Galería</h2>
                        <span className="text-[10px] text-gray-600">{galeria.length} FOTOS</span>
                    </div>
                    <GaleriaPublica fotos={galeria.map((f) => getImageUrl(f.imagen))} />
                </section>
            )}

            {/* 4. SERVICIOS (Lista compacta) */}
            {servicios.length > 0 && (
                <section>
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-white mb-4">Servicios</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {servicios.map((srv, idx) => (
                             <div key={idx} className="text-xs text-gray-400 border border-white/5 bg-white/[0.02] py-2 px-3 text-center">
                                {typeof srv === 'object' ? srv.nombre : srv}
                             </div>
                        ))}
                    </div>
                </section>
            )}

            {/* 5. RESEÑAS + FORMULARIO (Layout limpio) */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/5 pt-12">
                
                {/* Listado Reseñas */}
                <div>
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-white mb-6">Últimas Reseñas</h2>
                    {resenas.length > 0 ? (
                        <div className="space-y-6">
                            {resenas.map((r) => (
                                <div key={r.id} className="pb-6 border-b border-white/5 last:border-0">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-xs font-bold text-white uppercase">{r.usuario_nombre || "Anónimo"}</span>
                                        <span className="text-[10px] text-pink-500 font-mono">
                                            {[...Array(r.rating || r.puntuacion || 5)].map(()=>'★').join('')}
                                        </span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-400 font-light italic leading-relaxed">
                                        "{r.comentario}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-gray-600 italic">Sin reseñas disponibles.</p>
                    )}
                </div>

                {/* Formulario (Minimalista) */}
                <div>
                    <div className="bg-[#181018] border border-white/5 p-6">
                        <h3 className="text-sm font-bold text-white uppercase mb-1">Escribir Reseña</h3>
                        <p className="text-xs text-gray-500 mb-4">Comparte tu experiencia de forma anónima.</p>
                        <FormularioResenaWrapper perfilId={perfil.id} />
                    </div>
                </div>

            </section>
        </div>
      </div>
    </div>
  );
}