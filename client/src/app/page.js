import Link from "next/link";
import Image from "next/image";
import NavAuthCta from "@/components/NavAuthCta";
import MobileMenu from "@/components/MobileMenu";
import { Heart, Flame, Feather, MapPin, Search } from "lucide-react";
import NavBar from "@/components/NavBar";

// ============================================================
// 1. CONFIGURACIÓN NEXT.JS (ESTO SOLUCIONA EL ERROR DE BUILD)
// ============================================================
// Le decimos a Next.js: "Esta página cambia siempre, no la congeles".
export const dynamic = 'force-dynamic'; 

// ============================================================
// 2. CONSTANTES DE RESPALDO (ESTO SOLUCIONA EL REFERENCE ERROR)
// ============================================================
const CURRENT_YEAR = new Date().getFullYear();

const CIUDADES_DEFAULT = [
  { id: 1, nombre: "Santiago", slug: "santiago" },
  { id: 2, nombre: "Viña del Mar", slug: "vina-del-mar" },
  { id: 3, nombre: "Concepción", slug: "concepcion" },
  { id: 4, nombre: "Antofagasta", slug: "antofagasta" },
  { id: 5, nombre: "Iquique", slug: "iquique" },
  { id: 6, nombre: "Temuco", slug: "temuco" },
  { id: 7, nombre: "La Serena", slug: "la-serena" },
  { id: 8, nombre: "Valparaíso", slug: "valparaiso" },
  { id: 9, nombre: "Puerto Montt", slug: "puerto-montt" },
];

// ============================================================
// 3. METADATA SEO
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
// 4. API FETCHING
// ============================================================
async function getCiudades() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  
  try {
    const res = await fetch(`${apiUrl}/api/profiles/ciudades/`, {
      cache: 'no-store', // Datos frescos siempre
      headers: {
        "User-Agent": "Mozilla/5.0 (Next.js Build)",
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    });
    
    if (res.ok) {
        const data = await res.json();
        const lista = Array.isArray(data) ? data : (data.results || []);
        if (lista.length > 0) return lista;
    } 
  } catch (error) {
    console.error("[Server] Error de conexión:", error.message);
  }

  // Si falla, devolvemos la constante definida arriba
  return CIUDADES_DEFAULT;
}

// ============================================================
// 5. COMPONENTES UI
// ============================================================

function Navigation() {
  return (
      <div className="flex justify-between items-center h-16 sm:h-20">
        <NavBar/>
      </div>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
            <Image 
                src="/banner01.png"
                alt="Fondo Home Escorts Chile"
                fill
                className="object-cover opacity-50"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050205] via-[#050205]/40 to-black/60"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-10">
            <h1 className="text-5xl md:text-7xl font-bold font-fancy mb-6 leading-tight text-white drop-shadow-2xl">
                Descubre la <br/> <span className="text-pink-500 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Exclusividad.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10 font-light max-w-2xl mx-auto font-montserrat drop-shadow-lg">
                El directorio más confiable de Chile. Conecta directamente por WhatsApp con modelos verificadas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                    href="/busqueda"
                    className="group bg-pink-600 hover:bg-pink-500 text-white px-8 py-4 rounded-full font-montserrat font-bold uppercase tracking-widest transition-all shadow-lg shadow-pink-900/40 hover:scale-105 flex items-center gap-2"
                >
                    <Search className="w-4 h-4" /> Explorar Modelos
                </Link>
                <Link 
                    href="/register"
                    className="text-white border border-white/30 hover:bg-white/10 px-8 py-4 rounded-full font-montserrat font-bold uppercase tracking-widest transition-all"
                >
                    Publicar Aviso
                </Link>
            </div>
        </div>
    </section>
  );
}

function CiudadesSection({ ciudades }) {
  // Aseguramos que siempre haya datos
  const displayCities = (ciudades && Array.isArray(ciudades) && ciudades.length > 0) 
    ? ciudades 
    : CIUDADES_DEFAULT;

  return (
    <section className="px-4 py-20 bg-black/20 border-b border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-fancy text-white mb-4">
              Destinos Populares
          </h2>
          <p className="text-gray-400 font-montserrat font-light">
              Selecciona tu ciudad para ver modelos disponibles.
          </p>
        </div>

        {/* DISEÑO PIRAMIDAL / CENTRADO */}
        <div className="flex flex-wrap justify-center gap-4">
            {displayCities.map((c, index) => (
              <Link
                key={c.slug || c.id || index}
                href={`/${c.slug || c.id}`}
                className="
                  group relative 
                  flex items-center gap-3
                  px-8 py-4 
                  rounded-full
                  bg-[#150d15] 
                  border border-white/10 
                  transition-all duration-300
                  hover:border-pink-500 
                  hover:shadow-[0_0_20px_-5px_rgba(236,72,153,0.5)]
                  hover:-translate-y-1
                  active:scale-95
                "
              >
                <MapPin className="w-5 h-5 text-pink-600 group-hover:text-pink-400 group-hover:animate-bounce transition-colors" />
                <span className="font-bold text-base text-gray-200 group-hover:text-white font-fancy tracking-wide">
                  {c.nombre}
                </span>
                
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500/0 via-pink-500/5 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ icon: Icon, title, description, accentColor }) {
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
          className="inline-flex bg-white text-black px-10 py-4 rounded-full font-montserrat font-bold uppercase tracking-widest hover:bg-pink-500 hover:text-white transition-all transform hover:scale-105 shadow-xl"
        >
          Crear Perfil
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