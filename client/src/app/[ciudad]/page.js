import Link from "next/link";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import { MapPin, ChevronRight, Sparkles, Navigation } from "lucide-react";
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
// 2. COMPONENTE TARJETA
// ============================================================
function ProfileCard({ profile }) {
  if (!profile) return null;

  const rawImage = profile.foto_principal || profile.foto_perfil;
  const finalImage = getImageUrl(rawImage);

  return (
    <Link href={`/perfil/${profile.slug || profile.id}`} className="group relative block h-full">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#120912] border border-white/5 transition-all duration-500 group-hover:border-pink-500/50 group-hover:shadow-[0_0_30px_-5px_rgba(236,72,153,0.3)] group-hover:-translate-y-2">
        <Image
          src={finalImage} 
          alt={`Escort ${profile.nombre_fantasia} en ${profile.ciudad_nombre || "Chile"} - xscort`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#050205] via-[#050205]/80 to-transparent opacity-90" />
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 group-hover:border-pink-500/30 transition-colors">
            <MapPin className="w-3 h-3 text-pink-500" />
            <span className="text-[10px] font-bold uppercase text-white tracking-wider">
                {profile.ciudad_nombre || "Chile"}
            </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-white font-fancy leading-none tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-pink-400 transition-all">
                {profile.nombre_fantasia || profile.nombre_artistico}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-400 font-light">
                <span>{profile.edad ? `${profile.edad} años` : "Consultar"}</span>
                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                <span className="text-pink-500/80 text-xs uppercase tracking-wide">Disponible</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm group-hover:bg-pink-600 group-hover:text-white transition-colors duration-300">
               <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ============================================================
// 3. FUNCIONES DE DATOS
// ============================================================

async function getPerfilesPorCiudad(slug) {
  try {
    const url = `${API_URL}/api/profiles/?ciudad=${slug}`;
    console.log("Buscando en:", url); 
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
// 4. METADATA
// ============================================================
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const ciudadSlug = resolvedParams.ciudad;
  const ciudadNombre = capitalizeCity(ciudadSlug);
  const currentYear = new Date().getFullYear();

  return {
    title: `Escorts en ${ciudadNombre} - Fotos Reales ${currentYear} | xscort`,
    description: `Directorio de Escorts y Modelos independientes en ${ciudadNombre}. Perfiles verificados.`,
    alternates: { canonical: `https://xscort.cl/${ciudadSlug}` },
  };
}

// ============================================================
// 5. PÁGINA PRINCIPAL
// ============================================================
export default async function CiudadPage({ params }) {
  const resolvedParams = await params;
  const ciudadSlug = resolvedParams.ciudad;
  
  let perfiles = [];
  let ciudades = [];
  let ciudadActual = null;

  try {
      [ciudades, perfiles] = await Promise.all([
        getCiudadesInterno(),
        getPerfilesPorCiudad(ciudadSlug)
      ]);
      
      // Buscamos los datos completos de la ciudad actual para sacar la descripción
      ciudadActual = ciudades.find(c => String(c.slug) === String(ciudadSlug) || String(c.id) === String(ciudadSlug));
  } catch (error) { console.error("Error cargando datos:", error); }

  const ciudadNombre = ciudadActual ? ciudadActual.nombre : capitalizeCity(ciudadSlug);
  
  // Descripción con Fallback
  const descripcionTexto = ciudadActual?.descripcion || 
    `Selección exclusiva de modelos verificadas en ${ciudadNombre}. Fotos reales, trato de pareja y contacto directo por WhatsApp.`;

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
      "name": ciudadNombre,
      "item": `https://xscort.cl/${ciudadSlug}`
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
        {/* HEADER (Título Limpio) */}
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
              {/* Aquí borramos la descripción que estaba antes */}
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
        {perfiles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-24">
                {perfiles.map(perfil => (
                    <ProfileCard key={perfil.id} profile={perfil} />
                ))}
            </div>
        ) : (
            <div className="py-24 px-8 text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.02] mb-24">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-xl font-bold text-white font-fancy mb-2">Sin resultados en esta zona</h3>
                <p className="text-gray-400 mb-6 font-light">
                    No encontramos modelos activas en {ciudadNombre} en este momento.
                </p>
                <Link href="/busqueda" className="inline-flex items-center gap-2 bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-full font-bold text-sm transition-colors">
                    Explorar todo Chile <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
        )}

        {/* NAVEGACIÓN OTRAS CIUDADES */}
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
                        href={`/${c.slug || c.id}`} 
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

        {/* NUEVA SECCIÓN: DESCRIPCIÓN SEO (AL FINAL) */}
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