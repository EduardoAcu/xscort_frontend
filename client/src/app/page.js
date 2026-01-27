import Link from "next/link";
import Image from "next/image";
import NavAuthCta from "@/components/NavAuthCta";
import MobileMenu from "@/components/MobileMenu";
import { Heart, Flame, Feather, MapPin, Search } from "lucide-react";

// ============================================================
// CONSTANTS
// ============================================================
const CURRENT_YEAR = new Date().getFullYear();

// ============================================================
// METADATA (SEO PRINCIPAL)
// ============================================================
export const metadata = {
  title: "Escorts en Chile - Directorio Premium y Seguro | xscort",
  description: "Encuentra modelos independientes y verificadas en Chile. Santiago, Viña, Concepción y más. Trato directo, sin intermediarios y fotos reales.", 
  keywords: ['escorts chile', 'acompañantes', 'modelos vip', 'xscort', 'chillan', 'concepcion', 'viña del mar', 'mujeres independientes', 'trato directo'],
  alternates: {
    canonical: "https://xscort.cl",
  },
  openGraph: {
    title: "Escorts y Acompañantes VIP en Chile - xscort",
    description: "La guía más segura de modelos verificadas en Chile.",
    url: "https://xscort.cl",
    siteName: "xscort",
    images: [{ url: "https://xscort.cl/banner-social.jpg", width: 1200, height: 630 }],
    locale: "es_CL",
    type: "website",
  },
};

// ============================================================
// API DATA FETCHING
// ============================================================
async function getCiudades() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const res = await fetch(`${apiUrl}/api/profiles/ciudades/`, {
      next: { revalidate: 3600 }, // Caché de 1 hora para que la home vuele
    });
    
    if (!res.ok) return [];
    
    const data = await res.json();
    
    // Normalización de datos (Django a veces devuelve paginación, a veces lista)
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.results)) return data.results;
    
    return [];
  } catch (error) {
    console.error("Error fetching ciudades:", error);
    return [];
  }
}

// ============================================================
// COMPONENTES DE SECCIÓN
// ============================================================

function Navigation() {
  return (
    <nav className="fixed top-0 w-full bg-[#050205]/90 backdrop-blur-md px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 z-50 border-b border-white/5">
      <div className="flex justify-between items-center h-16 sm:h-20">
        <Link href="/" className="flex-shrink-0 w-24 sm:w-28 opacity-90 hover:opacity-100 transition-opacity">
          <Image src="/logo.png" alt="xscort.cl" width={120} height={40} className="w-full h-auto object-contain" />
        </Link>
        <div className="hidden sm:flex gap-8 text-sm font-medium items-center ml-auto">
          <Link href="/" className="text-gray-300 hover:text-white transition-colors uppercase tracking-wide font-montserrat text-xs">
            Inicio
          </Link>
          <Link href="/busqueda" className="text-gray-300 hover:text-white transition-colors uppercase tracking-wide font-montserrat text-xs">
            Modelos
          </Link>
          <div className="h-4 w-px bg-white/10"></div>
          <NavAuthCta />
        </div>
        <MobileMenu />
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Imagen de Fondo Optimizada */}
        <div className="absolute inset-0 z-0">
            <Image 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1600&auto=format&fit=crop"
                alt="Fondo Home Escorts Chile"
                fill
                className="object-cover opacity-50"
                priority
            />
            {/* Degradados para legibilidad */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050205] via-[#050205]/40 to-black/60"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-10">
            <h1 className="text-5xl md:text-7xl font-bold font-fancy mb-6 leading-tight text-white drop-shadow-2xl">
                Descubre la <br/> <span className="text-pink-500 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Exclusividad.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10 font-light max-w-2xl mx-auto font-montserrat drop-shadow-lg">
                El directorio más confiable de Chile. Conecta directamente por WhatsApp con modelos verificadas.
            </p>

            {/* Botón de Acción Principal */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                    href="/busqueda"
                    className="group bg-pink-600 hover:bg-pink-500 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest transition-all shadow-lg shadow-pink-900/40 hover:scale-105 flex items-center gap-2"
                >
                    <Search className="w-4 h-4" /> Explorar Modelos
                </Link>
                <Link 
                    href="/register"
                    className="text-white border border-white/30 hover:bg-white/10 px-8 py-4 rounded-full font-bold uppercase tracking-widest transition-all"
                >
                    Publicar Aviso
                </Link>
            </div>
        </div>
    </section>
  );
}

function CiudadesSection({ ciudades }) {
  if (!ciudades || ciudades.length === 0) return null;

  // Separamos las ciudades principales para destacarlas (opcional, visual)
  const topCiudades = ciudades.slice(0, 4);
  const restoCiudades = ciudades.slice(4);

  return (
    <section className="px-4 py-20 max-w-7xl mx-auto border-b border-white/5">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold font-fancy text-white mb-4">
            Destinos Populares
        </h2>
        <p className="text-gray-400 font-montserrat font-light">
            Encuentra compañía cerca de ti.
        </p>
      </div>

      {/* Grid de Destinos Principales */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
          {topCiudades.map((c) => (
            <Link
              key={c.slug || c.id}
              href={`/${c.slug || c.id}`}
              className="
                group relative px-8 py-4 rounded-2xl
                bg-[#150d15] border border-white/10
                overflow-hidden transition-all duration-300
                hover:border-pink-500 hover:shadow-[0_0_30px_-10px_rgba(236,72,153,0.3)]
              "
            >
              <div className="flex items-center gap-3 relative z-10">
                 <MapPin className="w-5 h-5 text-pink-500 group-hover:animate-bounce" />
                 <span className="font-bold text-lg text-white font-fancy tracking-wide">{c.nombre}</span>
              </div>
              {/* Efecto hover fondo */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-900/20 to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
      </div>

      {/* Resto de ciudades (Tags) */}
      {restoCiudades.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
             {restoCiudades.map((c) => (
                <Link
                    key={c.slug || c.id}
                    href={`/${c.slug || c.id}`}
                    className="px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] text-xs text-gray-400 hover:text-white hover:bg-pink-600 hover:border-pink-500 transition-all uppercase tracking-wider"
                >
                    {c.nombre}
                </Link>
             ))}
          </div>
      )}
    </section>
  );
}

function ServiceCard({ icon: Icon, title, description, accentColor }) {
  // Mapeo de colores para bordes y brillos
  const colors = {
    red: "text-red-400 group-hover:text-red-300",
    orange: "text-orange-400 group-hover:text-orange-300",
    teal: "text-teal-400 group-hover:text-teal-300",
  };
  
  return (
    <div className="group p-8 rounded-3xl bg-[#120912] border border-white/5 transition-all duration-500 hover:-translate-y-2 hover:border-pink-500/30 hover:bg-[#1a0f1a]">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className={`p-4 rounded-2xl bg-white/[0.03] transition-transform group-hover:scale-110 duration-500`}>
          <Icon className={`w-8 h-8 ${colors[accentColor]}`} />
        </div>
        <h3 className="text-xl font-bold font-fancy text-white group-hover:text-pink-200 transition-colors">
          {title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed font-light font-montserrat">
            {description}
        </p>
      </div>
    </div>
  );
}

function ServicesSection() {
  const services = [
    {
      icon: Heart,
      title: "Experiencia de Pareja",
      description: "Conexión real, besos y caricias. Ideal para quienes buscan un trato cercano y sin prisas.",
      color: "red",
    },
    {
      icon: Flame,
      title: "Encuentros Íntimos",
      description: "Pasión y privacidad en hoteles o domicilio. Disfruta de momentos intensos con total discreción.",
      color: "orange",
    },
    {
      icon: Feather,
      title: "Masajes y Relax",
      description: "Terapias sensitivas y relajantes para desconectar del estrés diario. Déjate consentir.",
      color: "teal",
    },
  ];

  return (
    <section className="px-4 py-24 bg-black/40" id="servicios">
      <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-fancy text-white mb-4">
                Servicios Exclusivos
            </h2>
            <div className="w-20 h-1 bg-pink-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <ServiceCard
                key={idx}
                icon={service.icon}
                title={service.title}
                description={service.description}
                accentColor={service.color}
              />
            ))}
          </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-900/20 via-[#050205] to-[#050205] z-0"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto text-center bg-[#120912]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-12">
        <h2 className="text-3xl md:text-5xl font-bold font-fancy text-white mb-6">
            ¿Eres Modelo Independiente?
        </h2>
        <p className="text-gray-300 mb-10 font-light text-lg font-montserrat leading-relaxed">
          Únete a la plataforma más exclusiva de Chile. Sin comisiones por cita, tú controlas tus tarifas y horarios.
          Te ayudamos a destacar con un perfil profesional.
        </p>
        <Link
          href="/register"
          className="inline-flex bg-white text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-pink-500 hover:text-white transition-all transform hover:scale-105 shadow-xl"
        >
          Crear Perfil Gratis
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-black text-gray-500 py-16 border-t border-white/10 font-montserrat">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
             <Link href="/" className="inline-block mb-6 opacity-80 hover:opacity-100 transition-opacity">
               <Image src="/logo.png" alt="xscort.cl" width={140} height={40} />
             </Link>
            <p className="text-sm max-w-sm font-light leading-relaxed">
              La guía premium de avisos clasificados para adultos en Chile. Seguridad, discreción y calidad verificada.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Legal</h3>
            <ul className="space-y-3 text-sm font-light">
              <li><Link href="/terminos" className="hover:text-pink-500 transition-colors">Términos y Condiciones</Link></li>
              <li><Link href="/privacidad" className="hover:text-pink-500 transition-colors">Políticas de Privacidad</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Comunidad</h3>
            <ul className="space-y-3 text-sm font-light">
              <li><Link href="/register" className="hover:text-pink-500 transition-colors">Publicar Aviso</Link></li>
              <li><Link href="/login" className="hover:text-pink-500 transition-colors">Ingreso Socias</Link></li>
              <li><Link href="/busqueda" className="hover:text-pink-500 transition-colors">Buscar Modelos</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-xs opacity-60">
          <p>© {CURRENT_YEAR} xscort.cl - Todos los derechos reservados.</p>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
             <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
             <p className="font-bold text-white uppercase tracking-wider">Sitio Exclusivo +18</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// MAIN PAGE COMPONENT
// ============================================================
export default async function HomePage() {
  const ciudades = await getCiudades();

  // SCHEMA.ORG (JSON-LD) - Vital para SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "xscort",
    "url": "https://xscort.cl",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://xscort.cl/busqueda?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="min-h-screen bg-[#050205] text-white selection:bg-pink-500 selection:text-white">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navigation />
      <HeroSection />
      <CiudadesSection ciudades={ciudades} />
      <ServicesSection />
      <CTASection />
      <Footer />
    </div>
  );
}