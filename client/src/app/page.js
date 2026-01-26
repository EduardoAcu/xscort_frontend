// ============================================================
// IMPORTS
// ============================================================
import Link from "next/link";
import Image from "next/image";
import NavAuthCta from "@/components/NavAuthCta";
import MobileMenu from "@/components/MobileMenu";
import { Heart, Flame, Feather } from "lucide-react";

// ============================================================
// CONSTANTS
// ============================================================
const CURRENT_YEAR = new Date().getFullYear();

// ============================================================
// METADATA (SEO PRINCIPAL)
// ============================================================
export const metadata = {
  title: "Escorts y Acompañantes VIP en Chile - xscort",
  description: "Directorio exclusivo de escorts y modelos independientes en Chile. Encuentra perfiles verificados por ciudad (Santiago, Viña, Concepción, etc) con contacto directo.", 
  keywords: ['escorts chile', 'acompañantes', 'modelos vip', 'trato de pololo', 'masajes eroticos', 'xscort', 'chillan', 'concepcion', 'viña del mar','escort','scort','escorts',],
  authors: [{ name: "xscort.cl", url: "https://xscort.cl" }],
  openGraph: {
    title: "Escorts y Acompañantes VIP en Chile - xscort",
    description: "Encuentra los mejores servicios en Chile. Búsqueda rápida, segura y confiable.",
    url: "https://xscort.cl",
    siteName: "xscort",
    images: [
      {
        url: "https://xscort.cl/logo.png",
        width: 1200,
        height: 630,
        alt: "Escorts y Acompañantes VIP en Chile - xscort",
      },
    ],
    locale: "es_CL",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// ============================================================
// API FUNCTIONS (BLINDADA)
// ============================================================

/**
 * Obtiene ciudades disponibles del API
 * Soporta respuestas directas [...] y paginadas { results: [...] }
 */
async function getCiudades() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const res = await fetch(`${apiUrl}/api/profiles/ciudades/`, {
      next: { revalidate: 300 }, // Caché de 5 minutos
    });
    
    if (!res.ok) return [];
    
    const data = await res.json();
    
    // 🛡️ Protección contra paginación de Django Rest Framework
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.results)) return data.results;
    
    return [];
  } catch (error) {
    console.error("Error fetching ciudades:", error);
    return [];
  }
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

function Navigation() {
  return (
    <nav className="fixed top-0 w-full bg-[#120912]/95 backdrop-blur-md px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 z-50 border-b border-white/5">
      <div className="flex justify-between items-center h-16 sm:h-20">
        <Link href="/" className="flex-shrink-0 w-24 sm:w-28 hover:opacity-80 transition-opacity">
          <Image src="/logo.png" alt="xscort.cl" width={120} height={40} className="w-full h-auto object-contain" />
        </Link>
        <div className="hidden sm:flex gap-8 text-sm font-medium items-center ml-auto">
          <Link href="/" className="text-gray-300 hover:text-pink-500 transition-colors uppercase tracking-wide">
            Inicio
          </Link>
          <Link href="/busqueda" className="text-gray-300 hover:text-pink-500 transition-colors uppercase tracking-wide">
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
    <div
      className="pt-20 sm:pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-12 sm:py-16 md:py-20 lg:py-32 min-h-screen flex flex-col justify-center relative"
      style={{
        backgroundImage: "url(/banner01.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-fancy leading-tight text-white drop-shadow-lg">
          Exclusividad y <br/> <span className="text-pink-500">Contacto Directo.</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-200 font-light max-w-2xl mx-auto drop-shadow-md">
          La plataforma de anuncios verificados más confiable de Chile. Conecta por WhatsApp sin intermediarios.
        </p>
        <div className="pt-4">
            <Link
            href="/busqueda"
            className="inline-block bg-pink-600 text-white px-8 py-4 text-base font-bold tracking-widest uppercase hover:bg-pink-500 transition-all rounded-full shadow-lg hover:shadow-pink-500/25 transform hover:-translate-y-1"
            >
            Ver Modelos Disponibles
            </Link>
        </div>
      </div>
    </div>
  );
}

function CiudadesSection({ ciudades }) {
  // Si no hay ciudades, no mostramos la sección vacía
  if (!ciudades || ciudades.length === 0) return null;

  return (
    <div className="px-6 py-16 sm:px-12 lg:px-24 bg-[#120912] border-b border-white/5">
      <h2 className="text-3xl font-bold text-center mb-4 font-fancy text-white">Encuentra en tu Ciudad</h2>
      <p className="text-center text-gray-400 mb-10 font-light">
        Selecciona tu ubicación para filtrar perfiles locales
      </p>
        <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
          {ciudades.map((c) => (
            <Link
              key={c.slug || c.id}
              href={`/busqueda?ciudad=${c.slug || c.id}`}
              className="
                /* ESTILO VIBRANTE: Botones tipo filtro llamativos (estilo Sexosur) */
                bg-pink-600 text-white
                font-montserrat font-bold text-sm tracking-wide
                px-6 py-3
                rounded-full
                border border-pink-400/30
                shadow-md shadow-pink-600/20
                
                /* Interacción */
                transition-all duration-300
                hover:bg-pink-500 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/40
              "
            >
              {c.nombre}
            </Link>
          ))}
        </div>
    </div>
  );
}

function ServiceCard({ icon: Icon, title, description, accentColor }) {
  const colorStyles = {
    red: "text-red-500 group-hover:bg-red-500/10 hover:border-red-500/30",
    orange: "text-orange-500 group-hover:bg-orange-500/10 hover:border-orange-500/30",
    teal: "text-teal-500 group-hover:bg-teal-500/10 hover:border-teal-500/30",
  };
  
  const activeStyle = colorStyles[accentColor] || colorStyles.red;

  return (
    <div className={`group p-8 rounded-2xl bg-white/[0.02] border border-white/5 transition-all duration-300 hover:-translate-y-1 ${activeStyle.split(' ').pop()}`}>
      <div className="flex flex-col items-center text-center space-y-4">
        <div className={`p-4 rounded-full bg-white/[0.03] transition-colors ${activeStyle.split(' ')[1]}`}>
          <Icon className={`w-8 h-8 ${activeStyle.split(' ')[0]}`} />
        </div>
        <h3 className="text-xl font-bold font-fancy text-white">
          {title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed font-light">{description}</p>
      </div>
    </div>
  );
}

function ServicesSection() {
  const services = [
    {
      icon: Heart,
      title: "Experiencia GFE",
      description: "Trato de novios real, conexión emocional y caricias sin prisas para quienes buscan algo más que lo físico.",
      color: "red",
    },
    {
      icon: Flame,
      title: "Encuentros Íntimos",
      description: "Pasión absoluta en la privacidad de un hotel o domicilio. Discreción total garantizada.",
      color: "orange",
    },
    {
      icon: Feather,
      title: "Masajes & Relax",
      description: "Terapias eróticas y tántricas que despiertan los sentidos y liberan el estrés acumulado.",
      color: "teal",
    },
  ];

  return (
    <div className="px-6 py-20 sm:px-12 lg:px-24 bg-[#0a050a]" id="servicios">
      <h2 className="text-3xl font-bold text-center mb-4 font-fancy text-white">
        Servicios Exclusivos
      </h2>
      <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto font-light">
        Cada perfil es único. Contacta para consultar disponibilidad de servicios específicos.
      </p>
      <div className="grid sm:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
  );
}

function CTASection() {
  return (
    <div className="py-24 px-6 text-center bg-gradient-to-b from-[#120912] to-black border-t border-white/5">
      <h2 className="text-3xl md:text-4xl font-bold font-fancy text-white mb-6">¿Eres Modelo Independiente?</h2>
      <p className="text-gray-400 max-w-2xl mx-auto mb-8 font-light text-lg">
        Únete a xscort y gestiona tu propia agenda. Sin comisiones por cita, trato directo con el cliente y perfil verificado.
      </p>
      <Link
        href="/register"
        className="inline-flex items-center justify-center bg-white text-black px-8 py-3 rounded-full font-bold uppercase tracking-wide hover:bg-gray-200 transition-colors"
      >
        Crear Perfil Ahora
      </Link>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-black text-gray-500 py-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
             <Link href="/" className="inline-block mb-6">
               <Image src="/logo.png" alt="xscort.cl" width={140} height={40} className="opacity-80 hover:opacity-100 transition" />
             </Link>
            <p className="text-sm max-w-sm font-light leading-relaxed">
              La guía premium de avisos clasificados para adultos en Chile. Seguridad, discreción y calidad.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6 uppercase tracking-widest text-xs">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/terminos" className="hover:text-white transition">Términos y Condiciones</Link></li>
              <li><Link href="/privacidad" className="hover:text-white transition">Políticas de Privacidad</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6 uppercase tracking-widest text-xs">Comunidad</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/register" className="hover:text-white transition">Publicar Aviso</Link></li>
              <li><Link href="/login" className="hover:text-white transition">Ingreso Socias</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 mt-8">
          <p className="text-[10px] text-justify leading-relaxed opacity-60 mb-6">
            xscort.cl es un portal de publicidad para mayores de 18 años. No somos agencia ni empleador. 
            No organizamos citas ni fijamos tarifas. Cada anunciante es responsable de su servicio.
          </p>
          <div className="flex flex-col md:flex-row justify-between items-center text-xs opacity-80">
            <p>© {CURRENT_YEAR} xscort.cl - Reservados todos los derechos.</p>
            <p className="mt-2 md:mt-0 font-bold text-pink-500">Exclusivo +18</p>
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

  return (
    <div className="min-h-screen bg-[#050205] text-white selection:bg-pink-500 selection:text-white">
      <Navigation />
      <HeroSection />
      {/* Pasamos las ciudades obtenidas al componente de lista */}
      <CiudadesSection ciudades={ciudades} />
      <ServicesSection />
      <CTASection />
      <Footer />
    </div>
  );
}