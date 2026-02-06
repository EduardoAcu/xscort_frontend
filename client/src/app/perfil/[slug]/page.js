import { notFound } from "next/navigation";
import Image from "next/image";
import { 
  MapPin, Calendar, 
  Heart, 
  Ruler, Weight, User, Camera, BadgeCheck, PlayCircle, Globe,
  Star, MessageSquare, Quote, Sparkles // <--- AGREGADO SPARKLES
} from "lucide-react";

// COMPONENTES
import GaleriaPublica from "@/components/GaleriaPublica";
import BotonesContacto from "@/components/BotonesContacto";
import Navbar from "@/components/NavBar";
import ViewCounter from "@/components/ViewCounter"; 
import FormularioResenaWrapper from "@/components/FormularioResenaWrapper";

export const dynamic = 'force-dynamic';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");

const getImageUrl = (path) => {
  if (!path) return null;
  return path.startsWith("http") ? path : `${API_URL}${path}`;
};

async function getPerfilData(slug) {
  try {
    const res = await fetch(`${API_URL}/api/profiles/public/${slug}/`, { 
      cache: 'no-store', 
      headers: { "Content-Type": "application/json" }
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Error API: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching perfil:", error.message);
    return null; 
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const perfil = await getPerfilData(resolvedParams.slug);
  if (!perfil) return { title: "Perfil no encontrado" };
  return {
    title: `${perfil.nombre_artistico} - Escort en ${perfil.ciudad?.nombre || "Chile"}`,
    description: perfil.biografia?.substring(0, 160),
    openGraph: {
      images: [getImageUrl(perfil.foto_perfil) || "/banner-social.jpg"],
    },
  };
}

const StarRating = ({ rating }) => {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`w-3 h-3 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`} 
        />
      ))}
    </div>
  );
};

export default async function PerfilPage({ params }) {
  const resolvedParams = await params;
  const perfil = await getPerfilData(resolvedParams.slug);

  if (!perfil) notFound();

  // --- DATOS ---
  const fotoPrincipal = getImageUrl(perfil.foto_perfil);
  const galeriaRaw = perfil.galeria || perfil.galeria_fotos || perfil.images || [];
  
  // Procesamiento de Servicios (Manejo defensivo por si viene como string u objeto)
  const servicios = perfil.servicios || [];
  
  // Procesamiento de Galería
  const galeriaProcesada = galeriaRaw.map(img => {
      const src = typeof img === 'string' ? img : (img.imagen || img.url);
      return getImageUrl(src);
  }).filter(Boolean);

  const isVerified = perfil.verificacion_estado === "aprobado";
  const ciudadNombre = perfil.ciudad?.nombre || "Chile";
  
  const reviews = perfil.reviews || perfil.resenas || []; 
  const tieneHistorias = perfil.historias && perfil.historias.length > 0;

  // --- STATS VISUALES ---
  const rawStats = [
    { icon: Globe, label: perfil.nacionalidad, show: !!perfil.nacionalidad },
    { icon: Ruler, label: perfil.altura ? `${perfil.altura} cm` : null, show: !!perfil.altura },
    { icon: Weight, label: perfil.peso ? `${perfil.peso} kg` : null, show: !!perfil.peso },
    { icon: User, label: perfil.medidas, show: !!perfil.medidas },
    { icon: User, label: perfil.genero === "M" ? "Hombre" : perfil.genero === "F" ? "Mujer" : "Trans", show: true }
  ];
  
  const stats = rawStats.filter(s => s.show && s.label && s.label !== "0 cm" && s.label !== "0 kg");

  return (
    <div className="min-h-screen bg-[#050205] text-gray-200 font-montserrat pb-20 selection:bg-pink-500 selection:text-white">
      
      <ViewCounter slug={perfil.slug} />

      {/* NAVBAR */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0a060a]/90 backdrop-blur-md border-b border-white/5 shadow-sm">
        <Navbar />
      </div>

      {/* PORTADA HERO */}
      <div className="pt-16 w-full max-w-4xl mx-auto">
        <div className="relative aspect-[3/4] md:aspect-[16/9] w-full bg-zinc-900 overflow-hidden md:rounded-b-3xl shadow-2xl">
            
            {fotoPrincipal ? (
                <div className={`relative w-full h-full ${tieneHistorias ? 'p-[3px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600' : ''}`}>
                    <div className="relative w-full h-full bg-black">
                        <Image 
                            src={fotoPrincipal} 
                            alt={perfil.nombre_artistico}
                            fill
                            className="object-cover"
                            priority
                        />
                        {tieneHistorias && (
                             <div className="absolute top-4 right-4 z-20 animate-pulse">
                                <div className="bg-pink-600/90 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg cursor-pointer backdrop-blur-sm border border-white/20">
                                    <PlayCircle className="w-3 h-3" /> VER HISTORIAS
                                </div>
                             </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-700">
                    <Camera className="w-12 h-12 opacity-50" />
                </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-[#050205] via-[#050205]/60 to-transparent opacity-100 pointer-events-none"></div>

            <div className="absolute bottom-0 left-0 w-full p-5 sm:p-10 z-10">
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2 mb-1">
                        {isVerified && (
                            <span className="inline-flex items-center gap-1 bg-pink-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-lg shadow-pink-900/40">
                                <BadgeCheck className="w-3 h-3 fill-current" /> Verificada
                            </span>
                        )}
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-black text-white font-fancy drop-shadow-lg leading-none">
                        {perfil.nombre_artistico}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-4 text-gray-200 text-sm font-medium mt-1">
                        <div className="flex items-center gap-1.5 bg-black/30 px-2 py-1 rounded-lg backdrop-blur-sm border border-white/5">
                            <MapPin className="w-4 h-4 text-pink-500" />
                            {ciudadNombre}
                        </div>
                        {perfil.edad && (
                            <div className="flex items-center gap-1.5 bg-black/30 px-2 py-1 rounded-lg backdrop-blur-sm border border-white/5">
                                <Calendar className="w-4 h-4 text-pink-500" />
                                {perfil.edad} años
                            </div>
                        )}
                    </div>

                    {stats.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {stats.map((stat, idx) => (
                                <div 
                                    key={idx} 
                                    className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-semibold text-gray-200 uppercase tracking-wide shadow-sm"
                                >
                                    <stat.icon className="w-3 h-3 text-pink-400" />
                                    <span>{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 mt-6 space-y-10">
        
        {/* BOTONES DE CONTACTO */}
        <div className="grid grid-cols-2 gap-4">
         <BotonesContacto perfil={perfil} />
        </div>

        {/* --- NUEVA SECCIÓN: SERVICIOS (CÁPSULAS) --- */}
        {servicios.length > 0 && (
            <section>
                <div className="flex flex-wrap gap-2">
                    {servicios.map((servicio, idx) => {
                        // Soporte tanto para array de strings como array de objetos
                        const nombreServicio = typeof servicio === 'string' ? servicio : servicio.nombre;
                        return (
                            <span 
                                key={idx} 
                                className="px-3 py-1.5 rounded-full bg-[#1a0f1a] border border-pink-500/20 text-xs sm:text-sm text-gray-200 font-medium shadow-sm flex items-center gap-2 hover:bg-pink-900/10 transition-colors cursor-default select-none"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                                {nombreServicio}
                            </span>
                        );
                    })}
                </div>
            </section>
        )}

        {/* SOBRE MÍ */}
        <section>
            <h3 className="text-sm font-bold uppercase tracking-widest text-pink-500 mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                <Heart className="w-4 h-4" /> Sobre Mí
            </h3>
            <div className="bg-[#120912] p-5 rounded-2xl border border-white/5 text-gray-300 leading-relaxed font-light whitespace-pre-wrap shadow-lg text-sm sm:text-base">
                {perfil.biografia || "Esta modelo aún no ha agregado una descripción detallada."}
            </div>
        </section>

        {/* GALERÍA */}
        <section>
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                <h3 className="text-sm font-bold uppercase tracking-widest text-pink-500 flex items-center gap-2">
                    <Camera className="w-4 h-4" /> Galería
                </h3>
                <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-gray-400">
                    {galeriaProcesada.length} Fotos
                </span>
            </div>
            
            {galeriaProcesada.length > 0 ? (
                <GaleriaPublica fotos={galeriaProcesada} />
            ) : (
                <div className="text-center py-10 bg-white/5 rounded-xl border border-dashed border-white/10">
                    <p className="text-xs text-gray-500">Este perfil aún no ha subido fotos a su galería.</p>
                </div>
            )}
        </section>

        {/* RESEÑAS */}
        <section className="space-y-6">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                <h3 className="text-sm font-bold uppercase tracking-widest text-pink-500 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Reseñas
                </h3>
                <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-gray-400">
                    {reviews.length} Opiniones
                </span>
            </div>

            <div className="mb-8">
                <FormularioResenaWrapper perfilId={perfil.id} />
            </div>

            {reviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {reviews.map((review, idx) => (
                        <div 
                            key={idx} 
                            className="bg-[#120912] border border-white/5 rounded-2xl p-5 flex flex-col gap-3 hover:border-pink-500/20 transition-all duration-300 group shadow-lg"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-700 to-purple-900 flex items-center justify-center text-xs font-bold text-white shadow-inner border border-white/10">
                                        {(review.usuario?.username || review.autor || "A").charAt(0).toUpperCase()}
                                    </div>
                                    
                                    <div>
                                        <p className="text-sm font-bold text-white leading-none">
                                            {review.usuario?.username || review.autor || "Anónimo"}
                                        </p>
                                        <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wide">
                                            {review.fecha ? new Date(review.fecha).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' }) : "Reciente"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-0.5 bg-black/20 px-2 py-1 rounded-lg border border-white/5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star 
                                            key={i} 
                                            className={`w-3 h-3 ${i < (review.rating || 5) ? "fill-yellow-400 text-yellow-400" : "text-gray-700 fill-gray-800"}`} 
                                        />
                                    ))}
                                </div>
                            </div>
                            
                            <div className="relative mt-1 pl-2">
                                <Quote className="w-5 h-5 text-pink-500/10 absolute -top-1 -left-2 transform -scale-x-100" />
                                <p className="text-sm text-gray-300 pl-4 leading-relaxed font-light italic relative z-10">
                                    "{review.comentario}"
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-white/[0.02] rounded-2xl border border-dashed border-white/10 flex flex-col items-center gap-3 mt-4">
                    <div className="bg-white/5 p-3 rounded-full">
                        <Star className="w-6 h-6 text-gray-600 opacity-50" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">Aún no hay reseñas</p>
                        <p className="text-xs text-gray-500 mt-1">Sé el primero en compartir tu experiencia con {perfil.nombre_artistico}.</p>
                    </div>
                </div>
            )}
        </section>

      </div>
    </div>
  );
}