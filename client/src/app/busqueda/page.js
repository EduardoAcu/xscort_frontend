import BusquedaContent from "@/components/BusquedaContent";
import NavBar from "@/components/NavBar";

// Forzar renderizado dinámico porque depende de searchParams
export const dynamic = 'force-dynamic';

// ============================================================
// 1. METADATA (SEO PARA EL BUSCADOR)
// ============================================================
export async function generateMetadata({ searchParams }) {
  // Resolvemos los params (Next.js 15)
  const params = await searchParams;
  
  // Título base
  let title = "Buscador de Escorts y Modelos en Chile | xscort";
  let description = "Utiliza nuestros filtros avanzados para encontrar modelos por edad, servicios, tarifas y características. El directorio más completo de Chile.";

  // Si hay filtros activos, personalizamos un poco (Opcional, pero ayuda al UX en la pestaña)
  if (params.edad) title = `Escorts de ${params.edad} años - Búsqueda | xscort`;
  if (params.servicios) title = `Escorts con servicio de ${params.servicios} | xscort`;

  return {
    title: title,
    description: description,
    // CANONICAL: Vital para que Google no indexe 1000 versiones de filtros (?edad=18, ?edad=19...)
    // Le decimos: "Todas estas variantes son en realidad la página /busqueda"
    alternates: {
      canonical: 'https://xscort.cl/busqueda',
    },
    robots: {
      index: true, // Queremos indexar la raíz del buscador
      follow: true,
    },
    openGraph: {
      title: "Catálogo de Modelos VIP - xscort Chile",
      description: "Encuentra tu compañía ideal usando nuestros filtros verificados.",
      url: "https://xscort.cl/busqueda",
    }
  };
}

// ============================================================
// 2. DATA FETCHING
// ============================================================
async function getPerfiles(params) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  
  const cleanParams = new URLSearchParams();
  if (params) {
    Object.keys(params).forEach(key => {
      // Filtramos parámetros vacíos
      if (params[key] && params[key] !== 'undefined') {
        cleanParams.append(key, String(params[key]));
      }
    });
  }

  try {
    const res = await fetch(`${API_URL}/api/profiles/?${cleanParams.toString()}`, { 
      cache: 'no-store' // Datos frescos siempre
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || data || [];
  } catch (error) {
    console.error("Error backend:", error);
    return [];
  }
}

// ============================================================
// 3. PÁGINA PRINCIPAL
// ============================================================
export default async function BusquedaPage(props) {
  const searchParams = await props.searchParams; 
  const perfilesIniciales = await getPerfiles(searchParams);

  // SCHEMA.ORG: CollectionPage (Para catálogos)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Catálogo de Escorts xscort",
    "description": "Buscador avanzado de modelos y acompañantes en Chile.",
    "url": "https://xscort.cl/busqueda",
    "hasPart": perfilesIniciales.slice(0, 10).map(p => ({
        "@type": "Person",
        "name": p.nombre_fantasia,
        "url": `https://xscort.cl/perfil/${p.slug || p.id}`
    }))
  };

  return (
    <div className="min-h-screen bg-[#120912] text-white font-montserrat">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <NavBar/>
      
      <main className="pt-24 px-4 max-w-7xl mx-auto pb-12">
        {/* Encabezado SEO H1 */}
        <div className="mb-8 border-b border-white/10 pb-6">
          <h1 className="text-3xl md:text-4xl font-black mb-2 font-fancy">
            Catálogo de <span className="text-pink-500">Modelos</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl">
            Explora todas las opciones disponibles. Usa los filtros para afinar tu búsqueda por ciudad, servicios, edad o características físicas.
          </p>
        </div>

        {/* Pasamos los perfiles ya cargados al cliente */}
        <BusquedaContent perfiles={perfilesIniciales} />
      </main>
    </div>
  );
}