import { notFound } from "next/navigation";
import Link from "next/link";
import NavBar from "@/components/NavBar";
// Componentes internos
import CabeceraPerfil from "@/components/CabeceraPerfil"; 
import BotonesContacto from "@/components/BotonesContacto";
import FormularioResenaWrapper from "@/components/FormularioResenaWrapper";
import GaleriaPublica from "@/components/GaleriaPublica";
// Iconos
import { ChevronRight, MapPin } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Función auxiliar para URLs de imágenes
const getImageUrl = (path) => {
  if (!path) return "/placeholder.jpg"; 
  return path.startsWith("http") ? path : `${API_URL}${path}`;
};

// ============================================================
// 1. DATA FETCHING
// ============================================================
async function getPerfilData(slug) {
  try {
    const res = await fetch(`${API_URL}/api/profiles/public/${slug}/`, { 
      next: { revalidate: 60 }, 
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error fetching perfil:", error);
    return null; 
  }
}

// ============================================================
// 2. METADATA DINÁMICA
// ============================================================
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || resolvedParams.id;
  const perfil = await getPerfilData(slug);

  if (!perfil) {
    return { title: "Perfil no encontrado | xscort.cl" };
  }

  const nombre = perfil.nombre_artistico || perfil.nombre_fantasia;
  const ciudad = perfil.ciudad_nombre || "Chile";
  const titulo = `${nombre} - Escort en ${ciudad} | Fotos Reales y WhatsApp`;
  const descripcion = perfil.biografia 
    ? perfil.biografia.substring(0, 160) 
    : `Contacta a ${nombre}, ${perfil.edad} años en ${ciudad}. Servicios exclusivos, fotos verificadas y trato directo.`;

  return {
    title: titulo,
    description: descripcion,
    alternates: {
      canonical: `https://xscort.cl/perfil/${slug}`,
    },
    openGraph: {
      title: titulo,
      description: descripcion,
      url: `https://xscort.cl/perfil/${slug}`,
      siteName: "xscort.cl",
      locale: "es_CL",
      type: "profile",
      images: [
        {
          url: getImageUrl(perfil.foto_principal),
          width: 800,
          height: 800,
          alt: `Escort ${nombre} en ${ciudad}`,
        },
      ],
    },
  };
}

// ============================================================
// 3. PÁGINA DE PERFIL
// ============================================================
export default async function PerfilPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || resolvedParams.id;
  const perfil = await getPerfilData(slug);

  if (!perfil) notFound();

  // Datos seguros
  const galeria = perfil.galeria_fotos || [];
  const resenas = perfil.resenas || [];
  const servicios = perfil.servicios || [];
  const fotoPerfilUrl = getImageUrl(perfil.foto_principal);
  const nombre = perfil.nombre_artistico || perfil.nombre_fantasia;
  const ciudad = perfil.ciudad_nombre || "Chile";
  const ciudadSlug = perfil.ciudad_slug || "busqueda"; // Fallback si la API no manda slug de ciudad

  // SCHEMA 1: PERSONA (Para datos ricos)
  const schemaPerson = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": nombre,
    "image": fotoPerfilUrl,
    "description": perfil.biografia,
    "jobTitle": "Escort",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": ciudad,
      "addressCountry": "CL"
    },
    "url": `https://xscort.cl/perfil/${slug}`
  };

  // SCHEMA 2: BREADCRUMB (Para navegación en Google)
  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": "https://xscort.cl"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": ciudad,
        "item": `https://xscort.cl/${ciudadSlug}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": nombre,
        "item": `https://xscort.cl/perfil/${slug}`
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#050205] text-gray-300 font-montserrat pb-20 selection:bg-pink-500 selection:text-white">
      <NavBar />
      
      {/* Schema Injections */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaPerson) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />

      {/* FONDO SPOTLIGHT (Efecto Premium) */}
      <div className="fixed top-0 left-0 right-0 h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-900/20 via-[#050205] to-[#050205] -z-10 pointer-events-none" />
      
      {/* Contenedor Principal */}
      <div className="pt-24 md:pt-28">
        
        {/* BREADCRUMBS VISUALES (Navegación) */}
        <div className="max-w-5xl mx-auto px-4 md:px-0 mb-6">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-montserrat">
                <Link href="/" className="hover:text-pink-500 transition-colors">Chile</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href={`/${ciudadSlug}`} className="hover:text-pink-500 transition-colors">{ciudad}</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-pink-500 font-bold">{nombre}</span>
            </div>
        </div>

        {/* 1. HEADER DEL PERFIL */}
        <CabeceraPerfil perfil={perfil} />

        {/* 2. BOTONES DE ACCIÓN */}
        <BotonesContacto perfil={perfil} />

        {/* Contenedor centralizado */}
        <div className="max-w-5xl mx-auto px-4 md:px-0 mt-12 space-y-16">

            {/* 3. GALERÍA */}
            {galeria.length > 0 && (
                <section>
                    <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-2">
                        <h2 className="text-sm font-semibold uppercase tracking-widest text-white flex items-center gap-2">
                           <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span> Galería de Fotos
                        </h2>
                        <span className="text-[10px] text-gray-500">{galeria.length} FOTOS</span>
                    </div>
                    {/* Pasamos URLs limpias y ALT text para SEO de imágenes */}
                    <GaleriaPublica 
                        fotos={galeria.map((f) => getImageUrl(f.imagen || f.url))} 
                    />
                </section>
            )}

            {/* 4. SERVICIOS */}
            {servicios.length > 0 && (
                <section>
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-white mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span> Servicios
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {servicios.map((srv, idx) => (
                             <div key={idx} className="text-xs text-gray-300 border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] py-2 px-4 rounded-full transition-colors cursor-default">
                                {typeof srv === 'object' ? srv.nombre : srv}
                             </div>
                        ))}
                    </div>
                </section>
            )}

            {/* 5. RESEÑAS & FEEDBACK */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/5 pt-12">
                
                {/* Listado */}
                <div>
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-white mb-6">
                        Opiniones Reales ({resenas.length})
                    </h2>
                    {resenas.length > 0 ? (
                        <div className="space-y-8">
                            {resenas.slice(0, 5).map((r) => ( 
                                <div key={r.id} className="pb-6 border-b border-white/5 last:border-0">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-pink-500/10 flex items-center justify-center text-[10px] text-pink-500 font-bold">
                                                {(r.usuario_nombre || "A")[0].toUpperCase()}
                                            </div>
                                            <span className="text-xs font-bold text-white uppercase">{r.usuario_nombre || "Anónimo"}</span>
                                        </div>
                                        <div className="flex text-pink-500 text-[10px]">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={i < (r.rating || r.puntuacion) ? "opacity-100" : "opacity-30"}>★</span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-400 font-light italic leading-relaxed pl-8">
                                        "{r.comentario}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-8 border border-dashed border-white/10 rounded-lg bg-white/[0.02]">
                            <p className="text-xs text-gray-500 mb-2">Este perfil aún no tiene reseñas.</p>
                            <p className="text-sm text-pink-500 font-bold">¡Sé el primero en contar tu experiencia!</p>
                        </div>
                    )}
                </div>

                {/* Formulario */}
                <div>
                    <div className="bg-[#120912] border border-white/10 p-8 rounded-2xl sticky top-24 shadow-2xl shadow-black/50">
                        <h3 className="text-sm font-bold text-white uppercase mb-2">Escribir Reseña</h3>
                        <p className="text-xs text-gray-500 mb-6">Comparte tu experiencia de forma anónima y segura.</p>
                        <FormularioResenaWrapper perfilId={perfil.id} />
                    </div>
                </div>

            </section>
            
            {/* BOTÓN VOLVER (UX) */}
            <div className="pt-12 text-center">
                 <Link href={`/${ciudadSlug}`} className="inline-flex items-center gap-2 text-pink-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
                    <ChevronRight className="w-4 h-4 rotate-180" /> Volver a {ciudad}
                 </Link>
            </div>
        </div>
      </div>
    </div>
  );
}