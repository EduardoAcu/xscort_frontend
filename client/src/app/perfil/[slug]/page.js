import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  MapPin, Calendar, Phone, Share2, 
  CheckCircle2, Star, ArrowLeft, Heart, 
  Ruler, Weight, User, Globe, Camera
} from "lucide-react";

import GaleriaPublica from "@/components/GaleriaPublica";

// URL Base
const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");

// Helper de Imágenes
const getImageUrl = (path) => {
  if (!path) return null;
  return path.startsWith("http") ? path : `${API_URL}${path}`;
};

// ============================================================
// 1. DATA FETCHING
// ============================================================
async function getPerfilData(slug) {
  try {
    const res = await fetch(`${API_URL}/api/profiles/public/${slug}/`, { 
      next: { revalidate: 0 }, 
      headers: { "Content-Type": "application/json" }
    });

    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Error API: ${res.status}`);
    
    return await res.json();
  } catch (error) {
    console.error("❌ Error fetching perfil:", error.message);
    return null; 
  }
}

// ============================================================
// 2. METADATA
// ============================================================
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

// ============================================================
// 3. COMPONENTE UI
// ============================================================
export default async function PerfilPage({ params }) {
  const resolvedParams = await params;
  const perfil = await getPerfilData(resolvedParams.slug);

  if (!perfil) notFound();

  // --- PREPARACIÓN DE DATOS ---
  const fotoPrincipal = getImageUrl(perfil.foto_perfil);
  
  // Procesamos la galería para asegurarnos de que sean URLs completas antes de pasarlas al componente
  const galeriaRaw = perfil.galeria || [];
  const galeriaProcesada = galeriaRaw.map(img => {
      const src = typeof img === 'string' ? img : img.imagen;
      return getImageUrl(src);
  }).filter(Boolean); // Eliminamos nulos

  const isVerified = perfil.verificacion_estado === "aprobado";
  const ciudadNombre = perfil.ciudad?.nombre || "Chile";
  const ciudadSlug = perfil.ciudad?.slug || "busqueda";
  const whatsappLimpio = perfil.telefono_contacto?.replace(/[^0-9]/g, "");

  // --- LÓGICA DE DETALLES ---
  const rawStats = [
    { icon: Globe, label: perfil.nacionalidad, show: !!perfil.nacionalidad },
    { icon: Ruler, label: perfil.altura ? `${perfil.altura} cm` : null, show: !!perfil.altura },
    { icon: Weight, label: perfil.peso ? `${perfil.peso} kg` : null, show: !!perfil.peso },
    { icon: User, label: perfil.medidas, show: !!perfil.medidas },
    { 
        icon: User, 
        label: perfil.genero === "M" ? "Hombre" : perfil.genero === "F" ? "Mujer" : "Trans", 
        show: true 
    }
  ];
  
  const stats = rawStats.filter(s => s.show && s.label && s.label !== "0 cm" && s.label !== "0 kg");

  return (
    <div className="min-h-screen bg-[#050205] text-gray-200 font-montserrat pb-20 selection:bg-pink-500 selection:text-white">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full bg-[#050205]/80 backdrop-blur-xl z-50 border-b border-white/5 h-16 flex items-center justify-between px-4 sm:px-8">
        <Link href={`/${ciudadSlug}`} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-bold uppercase hidden sm:inline">Volver</span>
        </Link>
        <Link href="/" className="font-bold text-xl tracking-widest text-pink-500 font-fancy">
            XSCORT
        </Link>
        <div className="w-8"></div>
      </nav>

      {/* PORTADA HERO */}
      <div className="pt-16 w-full max-w-4xl mx-auto">
        <div className="relative aspect-[3/4] md:aspect-[16/9] w-full bg-zinc-900 overflow-hidden md:rounded-b-3xl shadow-2xl">
            {fotoPrincipal ? (
                <Image 
                    src={fotoPrincipal} 
                    alt={perfil.nombre_artistico}
                    fill
                    className="object-cover"
                    priority
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-700">
                    <Camera className="w-12 h-12 opacity-50" />
                </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-[#050205] via-[#050205]/60 to-transparent opacity-100"></div>

            <div className="absolute bottom-0 left-0 w-full p-5 sm:p-10 z-10">
                <div className="flex flex-col gap-2">
                    {/* Badges */}
                    <div className="flex gap-2 mb-1">
                        {isVerified && (
                            <span className="inline-flex items-center gap-1 bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide backdrop-blur-md">
                                <CheckCircle2 className="w-3 h-3" /> Verificada
                            </span>
                        )}
                        <span className="inline-flex items-center gap-1 bg-pink-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-lg shadow-pink-900/40">
                            <Star className="w-3 h-3 fill-current" /> Premium
                        </span>
                    </div>

                    {/* Nombre */}
                    <h1 className="text-4xl sm:text-6xl font-black text-white font-fancy drop-shadow-lg leading-none">
                        {perfil.nombre_artistico}
                    </h1>
                    
                    {/* Línea 1: Ubicación y Edad */}
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

                    {/* Línea 2: DETALLES */}
                    {stats.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {stats.map((stat, idx) => (
                                <div 
                                    key={idx} 
                                    className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-semibold text-gray-200 uppercase tracking-wide shadow-sm hover:bg-white/20 transition-colors"
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

      {/* CONTENIDO */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 mt-6 space-y-10">
        
        {/* BOTONES */}
        <div className="grid grid-cols-2 gap-4">
            {whatsappLimpio ? (
                <a 
                    href={`https://wa.me/${whatsappLimpio}?text=Hola ${perfil.nombre_artistico}, te vi en xscort.cl`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebc57] text-black py-3.5 rounded-xl font-bold transition-transform active:scale-95 shadow-lg shadow-green-900/20 text-sm sm:text-base"
                >
                    <Phone className="w-5 h-5" /> WhatsApp
                </a>
            ) : (
                <button disabled className="flex items-center justify-center gap-2 bg-gray-800 text-gray-500 py-3.5 rounded-xl font-bold cursor-not-allowed text-sm sm:text-base">
                    <Phone className="w-5 h-5" /> No disponible
                </button>
            )}
            
            <button className="flex items-center justify-center gap-2 bg-[#1a1018] border border-white/10 hover:bg-white/5 text-white py-3.5 rounded-xl font-bold transition-transform active:scale-95 text-sm sm:text-base">
                <Share2 className="w-5 h-5 text-pink-500" /> Compartir
            </button>
        </div>

        {/* Sobre Mí */}
        <section>
            <h3 className="text-sm font-bold uppercase tracking-widest text-pink-500 mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                <Heart className="w-4 h-4" /> Sobre Mí
            </h3>
            <div className="bg-[#120912] p-5 rounded-2xl border border-white/5 text-gray-300 leading-relaxed font-light whitespace-pre-wrap shadow-lg text-sm sm:text-base">
                {perfil.biografia || "Esta modelo aún no ha agregado una descripción detallada."}
            </div>
        </section>

        {/* Galería Pública con Lightbox */}
        {galeriaProcesada.length > 0 && (
            <section>
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                     <h3 className="text-sm font-bold uppercase tracking-widest text-pink-500 flex items-center gap-2">
                        <Camera className="w-4 h-4" /> Galería
                    </h3>
                    <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-gray-400">
                        {galeriaProcesada.length} Fotos
                    </span>
                </div>
                <GaleriaPublica fotos={galeriaProcesada} />
            </section>
        )}

      </div>
    </div>
  );
}