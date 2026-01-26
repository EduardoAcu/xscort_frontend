import { notFound } from "next/navigation";
import NavBar from "@/components/NavBar";
// Asegúrate de que estos componentes existan y reciban la prop 'perfil'
import CabeceraPerfil from "@/components/CabeceraPerfil"; 
import BotonesContacto from "@/components/BotonesContacto";
import FormularioResenaWrapper from "@/components/FormularioResenaWrapper";
import GaleriaPublica from "@/components/GaleriaPublica";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Función auxiliar para URLs de imágenes
const getImageUrl = (path) => {
  if (!path) return "/placeholder.jpg"; // Imagen por defecto si falla
  return path.startsWith("http") ? path : `${API_URL}${path}`;
};

// ============================================================
// 1. DATA FETCHING (Blindado)
// ============================================================
async function getPerfilData(slug) {
  try {
    // Usamos el endpoint público que filtra por slug
    const res = await fetch(`${API_URL}/api/profiles/public/${slug}/`, { 
      next: { revalidate: 60 }, // Cache de 60 segundos
    });
    
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error fetching perfil:", error);
    return null; 
  }
}

// ============================================================
// 2. METADATA DINÁMICA (El corazón del SEO)
// ============================================================
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || resolvedParams.id; // Soporte para ambos nombres de carpeta
  const perfil = await getPerfilData(slug);

  if (!perfil) {
    return { title: "Perfil no encontrado | xscort.cl" };
  }

  const titulo = `${perfil.nombre_artistico || perfil.nombre_fantasia} - Escort en ${perfil.ciudad_nombre || "Chile"} | xscort`;
  const descripcion = perfil.biografia 
    ? perfil.biografia.substring(0, 160) 
    : `Contacta a ${perfil.nombre_artistico}, ${perfil.edad} años. Servicios exclusivos en ${perfil.ciudad_nombre}. Fotos reales.`;

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
          alt: `Foto de ${perfil.nombre_artistico}`,
        },
      ],
    },
  };
}

// ============================================================
// 3. COMPONENTE DE PÁGINA
// ============================================================
export default async function PerfilPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || resolvedParams.id;
  const perfil = await getPerfilData(slug);

  if (!perfil) notFound();

  // Datos seguros (Arrays vacíos si es null)
  const galeria = perfil.galeria_fotos || [];
  const resenas = perfil.resenas || [];
  const servicios = perfil.servicios || [];
  const fotoPerfilUrl = getImageUrl(perfil.foto_principal);

  // SCHEMA.ORG (JSON-LD): Para que Google muestre estrellitas y datos ricos
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person", // O "Product" si prefieres enfocarlo como servicio
    "name": perfil.nombre_artistico || perfil.nombre_fantasia,
    "image": fotoPerfilUrl,
    "description": perfil.biografia,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": perfil.ciudad_nombre,
      "addressCountry": "CL"
    },
    "url": `https://xscort.cl/perfil/${slug}`
  };

  return (
    <div className="min-h-screen bg-[#120912] text-gray-300 font-montserrat pb-20">
      <NavBar />
      
      {/* Inyectamos el Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Contenedor Principal */}
      <div className="pt-20">
        
        {/* 1. HEADER & HERO */}
        {/* Pasamos el objeto perfil completo a tus componentes */}
        <CabeceraPerfil perfil={perfil} />

        {/* 2. BOTONES DE ACCIÓN (WhatsApp / Llamar) */}
        <BotonesContacto perfil={perfil} />

        {/* Contenedor centralizado */}
        <div className="max-w-5xl mx-auto px-4 md:px-0 mt-12 space-y-16">

            {/* 3. GALERÍA */}
            {galeria.length > 0 && (
                <section>
                    <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-2">
                        <h2 className="text-sm font-semibold uppercase tracking-widest text-white">Galería</h2>
                        <span className="text-[10px] text-gray-500">{galeria.length} FOTOS</span>
                    </div>
                    {/* Aseguramos que GaleriaPublica reciba URLs limpias */}
                    <GaleriaPublica fotos={galeria.map((f) => getImageUrl(f.imagen || f.url))} />
                </section>
            )}

            {/* 4. SERVICIOS */}
            {servicios.length > 0 && (
                <section>
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-white mb-4">Servicios</h3>
                    <div className="flex flex-wrap gap-3">
                        {servicios.map((srv, idx) => (
                             <div key={idx} className="text-xs text-gray-300 border border-white/10 bg-white/[0.03] py-2 px-4 rounded-full">
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
                        Opiniones ({resenas.length})
                    </h2>
                    {resenas.length > 0 ? (
                        <div className="space-y-8">
                            {resenas.slice(0, 5).map((r) => ( // Limitamos a 5 para no saturar
                                <div key={r.id} className="pb-6 border-b border-white/5 last:border-0">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-white uppercase">{r.usuario_nombre || "Anónimo"}</span>
                                        <div className="flex text-pink-500 text-[10px]">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={i < (r.rating || r.puntuacion) ? "opacity-100" : "opacity-30"}>★</span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-400 font-light italic leading-relaxed">
                                        "{r.comentario}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-8 border border-dashed border-white/10 rounded-lg">
                            <p className="text-xs text-gray-500 mb-2">Aún no hay reseñas.</p>
                            <p className="text-sm text-pink-500">¡Sé el primero en comentar!</p>
                        </div>
                    )}
                </div>

                {/* Formulario */}
                <div>
                    <div className="bg-[#181018] border border-white/5 p-8 rounded-xl sticky top-24">
                        <h3 className="text-sm font-bold text-white uppercase mb-2">Deja tu Opinión</h3>
                        <p className="text-xs text-gray-500 mb-6">Tu valoración ayuda a la comunidad. Es anónimo y seguro.</p>
                        <FormularioResenaWrapper perfilId={perfil.id} />
                    </div>
                </div>

            </section>
        </div>
      </div>
    </div>
  );
}