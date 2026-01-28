import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  MapPin, Calendar, Phone, MessageCircle, 
  CheckCircle2, ChevronRight, Star, Share2, 
  ArrowLeft, Camera, Heart 
} from "lucide-react";

// URL Base (Asegura que no tenga slash final extra)
const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");

// Función auxiliar para URLs de imágenes
const getImageUrl = (path) => {
  if (!path) return null;
  return path.startsWith("http") ? path : `${API_URL}${path}`;
};

// ============================================================
// 1. DATA FETCHING (Servidor)
// ============================================================
async function getPerfilData(slug) {
  try {
    // Importante: El slash final es vital para Django
    const url = `${API_URL}/api/profiles/public/${slug}/`;
    console.log("📡 Fetching Perfil:", url); // Esto aparecerá en la terminal de tu servidor (Coolify/Local)

    const res = await fetch(url, { 
      next: { revalidate: 0 }, // 0 para datos siempre frescos
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
// 2. METADATA SEO
// ============================================================
export async function generateMetadata({ params }) {
  // En Next.js 15, params es una promesa
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const perfil = await getPerfilData(slug);

  if (!perfil) return { title: "Perfil no encontrado | xscort.cl" };

  const nombre = perfil.nombre_artistico || "Modelo";
  const ciudad = perfil.ciudad?.nombre || "Chile";
  
  return {
    title: `${nombre} - Escort en ${ciudad} | xscort.cl`,
    description: perfil.biografia?.substring(0, 160) || `Contacta a ${nombre}. Fotos reales y trato directo.`,
    openGraph: {
      images: [getImageUrl(perfil.foto_perfil) || "/banner-social.jpg"],
    },
  };
}

// ============================================================
// 3. COMPONENTE DE PÁGINA (UI)
// ============================================================
export default async function PerfilPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const perfil = await getPerfilData(slug);

  // Si la API devuelve null (404), mostramos la página de error de Next.js
  if (!perfil) {
    notFound();
  }

  // --- PREPARACIÓN DE DATOS ---
  const fotoPrincipal = getImageUrl(perfil.foto_perfil);
  const galeria = perfil.galeria || []; // Ajusta según tu API (puede ser perfil.images)
  const isVerified = perfil.verificacion_estado === "aprobado";
  const ciudadNombre = perfil.ciudad?.nombre || "Chile";
  const ciudadSlug = perfil.ciudad?.slug || "busqueda";
  const whatsappLimpio = perfil.telefono_contacto?.replace(/[^0-9]/g, "");

  return (
    <div className="min-h-screen bg-[#050205] text-gray-200 font-montserrat pb-20 selection:bg-pink-500 selection:text-white">
      
      {/* 1. NAVBAR FLOTANTE */}
      <nav className="fixed top-0 w-full bg-[#050205]/80 backdrop-blur-xl z-50 border-b border-white/5 h-16 flex items-center justify-between px-4 sm:px-8">
        <Link href={`/${ciudadSlug}`} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-bold uppercase hidden sm:inline">Volver</span>
        </Link>
        <Link href="/" className="font-bold text-xl tracking-widest text-pink-500 font-fancy">
            XSCORT
        </Link>
        <div className="w-8"></div> {/* Espaciador para centrar logo */}
      </nav>

      {/* 2. PORTADA HERO */}
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
            
            {/* Gradiente Oscuro Inferior */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050205] via-transparent to-transparent opacity-90"></div>

            {/* Información sobre la foto */}
            <div className="absolute bottom-0 left-0 w-full p-6 sm:p-10 z-10">
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2 mb-1">
                        {isVerified && (
                            <span className="inline-flex items-center gap-1 bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide backdrop-blur-md">
                                <CheckCircle2 className="w-3 h-3" /> Verificada
                            </span>
                        )}
                        <span className="inline-flex items-center gap-1 bg-pink-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-lg shadow-pink-900/40">
                            <Star className="w-3 h-3 fill-current" /> Premium
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-black text-white font-fancy drop-shadow-lg leading-none">
                        {perfil.nombre_artistico}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-4 text-gray-200 text-sm sm:text-base font-light mt-2">
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-pink-500" />
                            {ciudadNombre}
                        </div>
                        {perfil.edad && (
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-pink-500" />
                                {perfil.edad} años
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* 3. CONTENIDO PRINCIPAL */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 mt-8 space-y-12">
        
        {/* Botones de Acción */}
        <div className="grid grid-cols-2 gap-4">
            {whatsappLimpio ? (
                <a 
                    href={`https://wa.me/${whatsappLimpio}?text=Hola ${perfil.nombre_artistico}, te vi en xscort.cl`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebc57] text-black py-4 rounded-xl font-bold transition-transform active:scale-95 shadow-lg shadow-green-900/20"
                >
                    <Phone className="w-5 h-5" /> WhatsApp
                </a>
            ) : (
                <button disabled className="flex items-center justify-center gap-2 bg-gray-800 text-gray-500 py-4 rounded-xl font-bold cursor-not-allowed">
                    <Phone className="w-5 h-5" /> No disponible
                </button>
            )}
            
            <button className="flex items-center justify-center gap-2 bg-[#1a1018] border border-white/10 hover:bg-white/5 text-white py-4 rounded-xl font-bold transition-transform active:scale-95">
                <Share2 className="w-5 h-5 text-pink-500" /> Compartir
            </button>
        </div>

        {/* Sobre Mí */}
        <section>
            <h3 className="text-sm font-bold uppercase tracking-widest text-pink-500 mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4" /> Sobre Mí
            </h3>
            <div className="bg-[#120912] p-6 rounded-2xl border border-white/5 text-gray-300 leading-relaxed font-light whitespace-pre-wrap shadow-lg">
                {perfil.biografia || "Esta modelo aún no ha agregado una descripción detallada."}
            </div>
        </section>

        {/* Detalles Físicos (Grid) */}
        <section>
            <h3 className="text-sm font-bold uppercase tracking-widest text-pink-500 mb-4 flex items-center gap-2">
                 <CheckCircle2 className="w-4 h-4" /> Detalles
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <DetailCard label="Altura" value={perfil.altura ? `${perfil.altura} cm` : "--"} />
                <DetailCard label="Peso" value={perfil.peso ? `${perfil.peso} kg` : "--"} />
                <DetailCard label="Medidas" value={perfil.medidas || "--"} />
                <DetailCard label="Nacionalidad" value={perfil.nacionalidad || "--"} />
                <DetailCard label="Género" value={perfil.genero === "M" ? "Hombre" : perfil.genero === "F" ? "Mujer" : "Trans"} />
                <DetailCard label="Atención" value="Consultar" />
            </div>
        </section>

        {/* Galería (Si existe) */}
        {galeria.length > 0 && (
            <section>
                <div className="flex items-center justify-between mb-4">
                     <h3 className="text-sm font-bold uppercase tracking-widest text-pink-500 flex items-center gap-2">
                        <Camera className="w-4 h-4" /> Galería
                    </h3>
                    <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-gray-400">
                        {galeria.length} Fotos
                    </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {galeria.map((img, idx) => {
                        const url = getImageUrl(typeof img === 'string' ? img : img.imagen);
                        return (
                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-zinc-900 border border-white/5 group">
                                <Image
                                    src={url}
                                    alt={`Foto ${idx + 1}`}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                        );
                    })}
                </div>
            </section>
        )}

      </div>
    </div>
  );
}

// Subcomponente pequeño para tarjetas de detalles
function DetailCard({ label, value }) {
    return (
        <div className="bg-[#120912] border border-white/5 p-4 rounded-xl text-center hover:border-pink-500/30 transition-colors">
            <span className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">{label}</span>
            <span className="block text-white font-bold text-sm">{value}</span>
        </div>
    );
}