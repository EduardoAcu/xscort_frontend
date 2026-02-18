import Link from "next/link";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import { notFound } from "next/navigation"; // <-- IMPORTANTE: Agregamos esto
import { MapPin, ChevronRight, Sparkles, Navigation, UserRoundSearch } from "lucide-react";

// ============================================================
// 0. CONFIGURACIÓN
// ============================================================
const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");

// Helper para Imágenes
const getImageUrl = (path) => {
  if (!path) return "/placeholder.jpg";
  if (path.startsWith("http") || path.startsWith("https")) {
    return path;
  }
  return `${API_URL}${path}`;
};

// ============================================================
// 1. FUNCIONES DE DATOS
// ============================================================

async function getPerfilesPorCiudad(slug) {
  try {
    const url = `${API_URL}/api/profiles/?ciudad=${slug}`;
    const res = await fetch(url, { cache: 'no-store', headers: { "Content-Type": "application/json" } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data.results || []);
  } catch (error) { 
    console.error("Error API:", error);
    return []; 
  }
}

async function getCiudadesInterno() {
    try {
        const res = await fetch(`${API_URL}/api/profiles/ciudades/`, { next: { revalidate: 3600 } });
        if(!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : (data.results || []);
    } catch (e) { return []; }
}

const capitalizeCity = (str) => {
  if (!str) return "";
  const map = { 'chillan': 'Chillán', 'concepcion': 'Concepción', 'valparaiso': 'Valparaíso', 'vina-del-mar': 'Viña del Mar' };
  return map[str.toLowerCase()] || str.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// ============================================================
// 2. METADATA (ADAPTADO A LA NUEVA URL)
// ============================================================
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // 1. Validamos que tenga el formato correcto
  if (!slug?.startsWith("escort-en-")) return {};

  // 2. Extraemos la ciudad limpia para el título
  const ciudadSlug = slug.replace("escort-en-", "");
  const ciudadNombre = capitalizeCity(ciudadSlug);
  const currentYear = new Date().getFullYear();

  return {
    title: `Escorts en ${ciudadNombre} - Fotos Reales ${currentYear} | xscort`,
    description: `Directorio de Escorts y Modelos independientes en ${ciudadNombre}. Perfiles verificados.`,
    alternates: { 
        canonical: `https://xscort.cl/${slug}` // <-- Google indexará /escort-en-santiago
    },
  };
}

// ============================================================
// 3. PÁGINA PRINCIPAL
// ============================================================
export default async function CiudadPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  // --- ESCUDO ANTI 404 ---
  // Si alguien intenta entrar a /santiago (sin el escort-en-), lo bloqueamos o redirigimos.
  if (!slug?.startsWith("escort-en-")) {
    notFound(); 
  }

  // --- EXTRAEMOS LA CIUDAD LIMPIA PARA MANDAR A DJANGO ---
  const ciudadSlug = slug.replace("escort-en-", "");

  let perfiles = [];
  let ciudades = [];
  let ciudadActual = null;

  try {
      [ciudades, perfiles] = await Promise.all([
        getCiudadesInterno(),
        getPerfilesPorCiudad(ciudadSlug) // <-- Buscamos "santiago", no "escort-en-santiago"
      ]);
      
      ciudadActual = ciudades.find(c => String(c.slug) === String(ciudadSlug) || String(c.id) === String(ciudadSlug));
  } catch (error) { console.error("Error cargando datos:", error); }

  const ciudadNombre = ciudadActual ? ciudadActual.nombre : capitalizeCity(ciudadSlug);
  
  const descripcionTexto = ciudadActual?.descripcion || 
    `Selección exclusiva de modelos verificadas en ${ciudadNombre}. Fotos reales, trato de pareja y contacto directo por WhatsApp.`;

  // --- JSON-LD DE BREADCRUMBS ACTUALIZADO ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Chile",
      "item": "https://xscort.cl"
    },{
      "@type": "ListItem",
      "position": 2,
      "name": `Escorts en ${ciudadNombre}`, // Texto visible para Google
      "item": `https://xscort.cl/${slug}`   // URL oficial con "escort-en-"
    }]
  };

  return (
    <div className="min-h-screen bg-[#050205] text-white selection:bg-pink-500 selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="fixed top-0 left-0 right-0 h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-900/20 via-[#050205] to-[#050205] -z-10 pointer-events-none" />

      {/* NAVBAR */}
      <div className="flex justify-between items-center h-16 sm:h-20">
        <NavBar/>
      </div>

      <div className="pt-32 pb-24 px-4 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="relative mb-16">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-4 font-montserrat">
            <Link href="/" className="hover:text-pink-500 transition-colors">Ciudad</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-pink-500 font-bold">{ciudadNombre}</span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 font-fancy text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-500">
                Escorts en
                <span className="ml-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                  {ciudadNombre}
                </span>
              </h1>
            </div>

            <div className="flex-shrink-0 mb-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-bold uppercase tracking-wide animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                    {perfiles.length} Perfiles Disponibles
                </div>
            </div>
          </div>
        </div>

        {/* GRID DE PERFILES */}
        <div className="w-full min-h-[500px] mb-24">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {perfiles && perfiles.length > 0 ? (
              perfiles.map((perfil) => {
                const rawImage = perfil.foto_principal || perfil.foto_portada || perfil.foto_perfil;
                const imageUrl = getImageUrl(rawImage);

                return (
                  <Link key={perfil.id} href={`/perfil/${perfil.slug || perfil.id}`} className="group block h-full">
                    <div className="relative h-full overflow-hidden bg-[#1b101a] border border-white/10 transition-all duration-300 hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/10">
                      <div className="aspect-[3/4] w-full relative overflow-hidden">
                        <img src={imageUrl} alt={perfil.nombre_fantasia || perfil.nombre_artistico} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-90" />
                        <div className="absolute bottom-0 left-0 w-full p-3">
                          <div className="flex items-end justify-between gap-2">
                            <h3 className="text-sm sm:text-lg font-bold text-white leading-tight truncate group-hover:text-pink-500 transition-colors uppercase tracking-tight">
                              {perfil.nombre_fantasia || perfil.nombre_artistico}
                            </h3>
                            {perfil.edad && (
                              <span className="text-[10px] text-pink-400 font-mono border border-pink-500/30 px-1 bg-black/50">
                                {perfil.edad}
                              </span>
                            )}
                          </div>

                          {perfil.ciudad && (
                            <div className="flex items-center gap-1 mt-1 text-gray-400">
                              <MapPin className="w-3 h-3" />
                              <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wide truncate">{perfil.ciudad.nombre || perfil.ciudad_nombre}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-center border border-dashed border-white/10 bg-white/[0.02]">
                <UserRoundSearch className="w-12 h-12 text-gray-600 mb-2" />
                <p className="text-lg font-bold text-white">Sin resultados</p>
                <p className="text-sm text-gray-500">Prueba otros filtros o vuelve más tarde.</p>
              </div>
            )}
          </div>
        </div>

        {/* NAVEGACIÓN OTRAS CIUDADES (Botones actualizados con 'escort-en-') */}
        <div className="bg-[#0a060a] border border-white/5 rounded-3xl p-8 md:p-12 mb-16">
             <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-pink-600 rounded-lg">
                    <Navigation className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white font-fancy">Explorar otras ciudades</h3>
             </div>
             
             <div className="flex flex-wrap gap-3">
               {ciudades.map(c => {
                 if((c.slug || c.id) === ciudadSlug) return null;
                 return (
                    <Link 
                        key={c.slug || c.id}
                        // AQUI ESTÁ LA MAGIA PARA LOS LINKS INTERNOS
                        href={`/escort-en-${c.slug || c.id}`} 
                        className="
                            group relative overflow-hidden
                            bg-[#150d15] text-gray-400
                            font-montserrat font-semibold text-xs uppercase tracking-wider
                            px-6 py-3
                            rounded-xl
                            border border-white/5
                            transition-all duration-300
                            hover:text-white hover:border-pink-500/50 hover:bg-[#2a1525]
                        "
                    >
                        <span className="relative z-10">{c.nombre}</span>
                    </Link>
                 )
               })}
             </div>
        </div>

        {/* SECCIÓN: DESCRIPCIÓN SEO */}
        <div className="border-t border-white/5 pt-12 pb-8">
            <div className="flex items-start gap-4 max-w-4xl">
                 <div className="p-2 bg-yellow-500/10 rounded-lg flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                 </div>
                 <div className="space-y-4">
                     <h2 className="text-xl font-bold text-white font-fancy">
                        Sobre las acompañantes en {ciudadNombre}
                     </h2>
                     <p className="text-gray-400 text-sm leading-relaxed font-light font-montserrat whitespace-pre-line">
                        {descripcionTexto}
                     </p>
                 </div>
            </div>
        </div>

      </div>
    </div>
  );
}