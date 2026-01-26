import Link from "next/link";
import Image from "next/image";
import NavAuthCta from "@/components/NavAuthCta";
import MobileMenu from "@/components/MobileMenu";
// ⚠️ NO importamos nada más externo para evitar errores 500
import { MapPin, Star } from "lucide-react"; 

// ============================================================
// 1. COMPONENTES INTERNOS (Para evitar "Module not found")
// ============================================================

// Tarjeta de Perfil definida aquí mismo
function ProfileCard({ profile }) {
  if (!profile) return null;

  return (
    <Link href={`/perfil/${profile.slug || profile.id}`} className="group relative block h-full">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 transition-all duration-300 group-hover:border-pink-500/50 group-hover:shadow-lg group-hover:shadow-pink-500/20">
        <Image
          src={profile.foto_principal || "/placeholder.jpg"} 
          alt={profile.nombre_fantasia || "Modelo"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
            <MapPin className="w-3 h-3 text-pink-500" />
            <span className="text-[10px] font-bold uppercase text-white tracking-wider">
                {profile.ciudad_nombre || "Chile"}
            </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-xl font-bold text-white font-fancy leading-tight group-hover:text-pink-500 transition-colors">
                {profile.nombre_fantasia}
              </h3>
              <p className="text-sm text-gray-300 font-light">
                {profile.edad ? `${profile.edad} años` : "Consultar"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ============================================================
// 2. FUNCIONES DE DATOS (Con logs de error)
// ============================================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function getPerfilesPorCiudad(slug) {
  console.log(`🔍 Buscando perfiles para: ${slug} en ${API_URL}`);
  try {
    // Probamos filtrar. Asegúrate que tu backend soporte ?ciudad=
    const res = await fetch(`${API_URL}/api/profiles/public/?ciudad=${slug}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
        console.error(`❌ Error API Perfiles: ${res.status} ${res.statusText}`);
        return [];
    }
    
    const data = await res.json();
    if (Array.isArray(data)) return data;
    if (data.results) return data.results;
    return [];
  } catch (error) {
    console.error("🔥 EXCEPCIÓN FETCH PERFILES:", error);
    return [];
  }
}

async function getCiudadesInterno() {
    try {
        const res = await fetch(`${API_URL}/api/profiles/ciudades/`, { next: { revalidate: 3600 } });
        if(!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : (data.results || []);
    } catch (e) { 
        console.error("Error ciudades:", e);
        return []; 
    }
}

const capitalizeCity = (str) => {
  if (!str) return "";
  const map = { 'chillan': 'Chillán', 'concepcion': 'Concepción', 'valparaiso': 'Valparaíso' };
  return map[str.toLowerCase()] || str.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// ============================================================
// 3. METADATA
// ============================================================
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const ciudadSlug = resolvedParams.ciudad;
  const ciudadNombre = capitalizeCity(ciudadSlug);

  return {
    title: `Escorts en ${ciudadNombre} | xscort`,
    description: `Encuentra modelos verificadas en ${ciudadNombre}.`,
    alternates: { canonical: `https://xscort.cl/${ciudadSlug}` },
  };
}

// ============================================================
// 4. PÁGINA PRINCIPAL
// ============================================================
export default async function CiudadPage({ params }) {
  const resolvedParams = await params;
  const ciudadSlug = resolvedParams.ciudad;
  const ciudadNombre = capitalizeCity(ciudadSlug);
  
  let perfiles = [];
  let ciudades = [];
  let errorMsg = null;

  try {
      // Cargamos datos
      [ciudades, perfiles] = await Promise.all([
        getCiudadesInterno(),
        getPerfilesPorCiudad(ciudadSlug)
      ]);
  } catch (error) {
      console.error("🔥 Error CRÍTICO en carga de página:", error);
      errorMsg = "Ocurrió un error cargando los datos.";
  }

  return (
    <main className="min-h-screen bg-[#050205] text-white">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full bg-[#120912]/95 backdrop-blur-md px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 z-50 border-b border-white/5">
        <div className="flex justify-between items-center h-16 sm:h-20">
            <Link href="/" className="flex-shrink-0 w-24 sm:w-28">
              <Image src="/logo.png" alt="xscort.cl" width={120} height={40} className="w-full h-auto object-contain" />
            </Link>
            <div className="hidden sm:flex gap-8 text-sm font-medium items-center ml-auto">
              <Link href="/" className="text-gray-300 hover:text-pink-500 transition-colors uppercase tracking-wide">Inicio</Link>
              <div className="h-4 w-px bg-white/10"></div>
              <NavAuthCta />
            </div>
            <MobileMenu />
        </div>
      </nav>

      <div className="pt-32 pb-16 px-4 max-w-7xl mx-auto">
        
        {/* ENCABEZADO */}
        <div className="mb-12 text-center md:text-left border-b border-white/10 pb-8">
          <span className="text-pink-500 text-xs font-bold tracking-widest uppercase mb-2 block">
            UBICACIÓN
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-fancy">
            Escorts en <span className="text-pink-500">{ciudadNombre}</span>
          </h1>
          
          <p className="text-gray-400 max-w-3xl text-lg leading-relaxed font-light">
             Directorio exclusivo en {ciudadNombre}.
             {errorMsg && <span className="text-red-500 block mt-2">({errorMsg})</span>}
          </p>
        </div>

        {/* GRID DE PERFILES */}
        {perfiles.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
                {perfiles.map(perfil => (
                    <ProfileCard key={perfil.id} profile={perfil} />
                ))}
            </div>
        ) : (
            <div className="p-12 text-center border border-dashed border-gray-800 rounded-2xl bg-white/5 mb-16">
                <p className="text-gray-400 text-xl mb-4">
                    No encontramos modelos disponibles en <strong className="text-white">{ciudadNombre}</strong>.
                </p>
                <Link href="/busqueda" className="text-pink-500 hover:underline font-bold">
                    Ver modelos en todo Chile
                </Link>
            </div>
        )}

        {/* BOTONES OTRAS CIUDADES */}
        <div>
             <h3 className="text-xl font-bold mb-6 text-white font-fancy text-center md:text-left">Ver en otras ciudades</h3>
             <div className="flex flex-wrap gap-3 justify-center md:justify-start">
               {ciudades.map(c => {
                 if((c.slug || c.id) === ciudadSlug) return null;
                 return (
                    <Link 
                        key={c.slug || c.id}
                        href={`/${c.slug || c.id}`} 
                        className="bg-zinc-800 text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-pink-600 transition-all"
                    >
                        {c.nombre}
                    </Link>
                 )
               })}
             </div>
        </div>

      </div>
    </main>
  );
}