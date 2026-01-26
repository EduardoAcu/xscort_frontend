import { getCiudades } from "@/lib/api";
import NavAuthCta from "@/components/NavAuthCta";
import MobileMenu from "@/components/MobileMenu";
import Link from "next/link";
import Image from "next/image";
// IMPORTANTE: Importamos el componente que acabamos de crear
import ProfileCard from "@/components/ProfileCard";

// ============================================================
// 1. FUNCIÓN PARA BUSCAR PERFILES (BLINDADA)
// ============================================================
async function getPerfilesPorCiudad(slug) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    // Nota: Ajusta '?ciudad=' según como lo reciba tu Django backend (puede ser ?city= o ?location=)
    const res = await fetch(`${apiUrl}/api/profiles/public/?ciudad=${slug}`, {
      cache: 'no-store', // Para que siempre muestre las nuevas modelos al instante
    });

    if (!res.ok) {
        console.warn(`Error ${res.status} al buscar perfiles en ${slug}`);
        return [];
    }
    
    const data = await res.json();
    // Protección anti-caídas (Maneja arrays directos o paginación de Django)
    if (Array.isArray(data)) return data;
    if (data.results) return data.results;
    return [];
  } catch (error) {
    console.error("Error fetching perfiles:", error);
    return [];
  }
}

// Función auxiliar
const capitalizeCity = (str) => {
  if (!str) return "";
  const map = { 'chillan': 'Chillán', 'concepcion': 'Concepción', 'valparaiso': 'Valparaíso' };
  return map[str.toLowerCase()] || str.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// ============================================================
// 2. METADATA
// ============================================================
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const ciudadSlug = resolvedParams.ciudad;
  const ciudadNombre = capitalizeCity(ciudadSlug);

  return {
    title: `Escorts en ${ciudadNombre} - Modelos Verificadas | xscort`,
    description: `Directorio de escorts y modelos independientes en ${ciudadNombre}. Fotos reales, trato directo y perfiles verificados.`,
    alternates: { canonical: `https://xscort.cl/${ciudadSlug}` },
  };
}

// ============================================================
// 3. PÁGINA VISUAL
// ============================================================
export default async function CiudadPage({ params }) {
  const resolvedParams = await params;
  const ciudadSlug = resolvedParams.ciudad;
  const ciudadNombre = capitalizeCity(ciudadSlug);
  
  // Ejecutamos las dos peticiones a la vez (Ciudades + Perfiles)
  const [ciudades, perfiles] = await Promise.all([
    getCiudades(),
    getPerfilesPorCiudad(ciudadSlug)
  ]);

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
            Encuentra las mejores <strong>modelos y escorts en {ciudadNombre}</strong>. 
            En xscort verificamos los perfiles para garantizarte seguridad. 
            Actualmente mostrando <strong>{perfiles.length} perfiles verificados</strong> en esta zona.
          </p>
        </div>

        {/* === GRID DE PERFILES (Aquí está el cambio clave) === */}
        {perfiles.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
                {perfiles.map(perfil => (
                    <ProfileCard key={perfil.id} profile={perfil} />
                ))}
            </div>
        ) : (
            <div className="p-12 text-center border border-dashed border-gray-800 rounded-2xl bg-white/5 mb-16">
                <p className="text-gray-400 text-xl mb-4">
                    No encontramos modelos disponibles en <strong className="text-white">{ciudadNombre}</strong> por el momento.
                </p>
                <Link href="/busqueda" className="text-pink-500 hover:underline font-bold">
                    Ver modelos en todo Chile
                </Link>
            </div>
        )}

        {/* BOTONES DE OTRAS CIUDADES */}
        <div>
             <h3 className="text-xl font-bold mb-6 text-white font-fancy text-center md:text-left">Ver en otras ciudades</h3>
             <div className="flex flex-wrap gap-3 justify-center md:justify-start">
               {ciudades.map(c => {
                 if((c.slug || c.id) === ciudadSlug) return null;
                 return (
                    <Link 
                        key={c.slug || c.id}
                        href={`/${c.slug || c.id}`} 
                        className="
                            bg-zinc-800 text-white
                            font-montserrat font-bold text-xs tracking-wide
                            px-5 py-2
                            rounded-full
                            border border-white/10
                            hover:bg-pink-600 hover:scale-105 transition-all
                        "
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