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
// METADATA
// ============================================================
export const metadata = {
  title: "xscort Chile - El Directorio Más Completo",
  description: "Avisos por ciudad y contacto directo.", 
  keywords: ['chile', 'servicios', 'anuncios','escort','acompañantes','modelos','seguridad','discreción','xscort',' escorts','scort','sur','putas'],
  authors: [{ name: "xscort.cl", url: "https://xscort.cl" }],
  openGraph: {
    title: "xscort Chile - El Directorio Más Completo",
    description: "Encuentra los mejores servicios en Chile. Búsqueda rápida, segura y confiable en xscort.",
    url: "https://xscort.cl",
    siteName: "xscort",
    images: [
      {
        url: "https://xscort.cl/logo.png",
        width: 1200,
        height: 630,
        alt: "xscort Chile - El Directorio Más Completo",
      },
    ],
    locale: "es_CL",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// ============================================================
// API FUNCTIONS
// ============================================================

/**
 * Obtiene ciudades disponibles del API
 */
async function getCiudades() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const res = await fetch(`${apiUrl}/api/profiles/ciudades/`, {
      next: { revalidate: 300 },
    });
    return res.ok ? await res.json() : [];
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
    <nav className="fixed top-0 w-full bg-black bg-opacity-95 backdrop-blur px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 z-50 border-b border-gray-800">
      <div className="flex justify-between items-center h-16 sm:h-20">
        <Link href="/" className="flex-shrink-0 w-20 sm:w-24 md:w-28">
          <Image src="/logo.png" alt="xscort.cl" width={100} height={100} className="w-full h-auto" />
        </Link>
        <div className="hidden sm:flex gap-6 lg:gap-8 text-xs sm:text-sm md:text-base items-center ml-auto">
          <Link href="/" className="hover:text-pink-500 transition text-gray-300 font-montserrat font-semibold">
            Inicio
          </Link>
          <Link href="/busqueda" className="hover:text-pink-500 transition text-gray-300 font-montserrat font-semibold">
            Modelos
          </Link>
          <Link href="#servicios" className="hover:text-pink-500 transition text-gray-300 font-montserrat font-semibold">
            Servicios
          </Link>
          <div className="h-6 w-px bg-gray-700"></div>
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
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 md:space-y-8 relative z-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-fancy leading-tight">
          La Plataforma Exclusiva de Modelos Verificadas en Chile.
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 font-montserrat max-w-2xl mx-auto">
          Explora perfiles y contacta directamente por WhatsApp o Telegram. Seguro y discreto.
        </p>
        <Link
          href="/busqueda"
          className="inline-block bg-pink-500 text-white px-6 sm:px-8 py-2 sm:py-3 md:py-4 text-sm sm:text-base font-bold font-montserrat hover:bg-pink-600 transition rounded-lg mt-4 sm:mt-6"
        >
          Ver Perfiles Verificados
        </Link>
      </div>
    </div>
  );
}

function TrustSection() {
  return (
    <div className="px-6 py-16 sm:px-12 lg:px-24 bg-gray-950 text-center space-y-4">
      <h2 className="text-3xl font-bold font-fancy">Confianza y Contacto Directo.</h2>
      <p className="text-gray-300 max-w-2xl mx-auto font-montserrat">
        xscort.cl te conecta con modelos de compañía verificadas. Explora perfiles auténticos y
        contacta directamente a través de WhatsApp o Telegram para coordinar encuentros. Garantizamos
        seguridad, discreción y una experiencia exclusiva sin intermediarios.
      </p>
    </div>
  );
}

function CiudadesSection({ ciudades }) {
  return (
    <div className="px-6 py-16 sm:px-12 lg:px-24 bg-gray-950">
      <h2 className="text-3xl font-bold text-center mb-4 font-fancy">Ciudades</h2>
      <p className="text-center text-gray-300 mb-10 font-montserrat">
        Selecciona una ciudad para ver modelos disponibles
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {ciudades.map((c) => (
          <Link
            key={c.value}
            href={`/busqueda?ciudad=${c.value}`}
            className="bg-pink-500 px-4 py-2 rounded-full border border-white/15 text-sm text-pink-100 hover:bg-pink-600 font-montserrat font-semibold"
          >
            {c.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function ServiceCard({ icon: Icon, title, description, accentColor }) {
  const borderClass = accentColor === "red" ? "hover:border-red-500/50" : accentColor === "orange" ? "hover:border-orange-500/50" : "hover:border-teal-500/50";
  const bgClass = accentColor === "red" ? "group-hover:bg-red-500/10" : accentColor === "orange" ? "group-hover:bg-orange-500/10" : "group-hover:bg-teal-500/10";
  const textClass = accentColor === "red" ? "group-hover:text-red-400" : accentColor === "orange" ? "group-hover:text-orange-400" : "group-hover:text-teal-400";
  const iconClass = accentColor === "red" ? "text-red-500" : accentColor === "orange" ? "text-orange-500" : "text-teal-500";
  const gradientClass = accentColor === "red" ? "from-red-500/5" : accentColor === "orange" ? "from-orange-500/5" : "from-teal-500/5";

  return (
    <div className={`group relative p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 ${borderClass} transition-all duration-300 hover:-translate-y-1`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
      <div className="flex flex-col items-center text-center space-y-4 relative z-10">
        <div className={`p-3 bg-zinc-800 rounded-full ${bgClass} transition-colors`}>
          <Icon className={`w-8 h-8 ${iconClass}`} />
        </div>
        <h3 className={`text-xl font-bold font-fancy text-white ${textClass} transition-colors`}>
          {title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed font-montserrat">{description}</p>
      </div>
    </div>
  );
}

function ServicesSection() {
  const services = [
    {
      icon: Heart,
      title: "Experiencia GFE",
      description:
        'Más que una cita. Disfruta de un trato de novios ("Girlfriend Experience") con conexión real, besos y caricias sin prisas.',
      color: "red",
    },
    {
      icon: Flame,
      title: "Encuentros Íntimos",
      description:
        "Momentos de pasión absoluta en la privacidad de un hotel o domicilio. Discreción garantizada y servicios a tu medida.",
      color: "orange",
    },
    {
      icon: Feather,
      title: "Masajes & Relax",
      description:
        "Deja que las manos expertas y los aceites despierten cada centímetro de tu piel. Disfruta de terapias eróticas y tántricas que suben la temperatura progresivamente hasta alcanzar un desenlace intenso e inolvidable.",
      color: "teal",
    },
  ];

  return (
    <div className="px-6 py-16 sm:px-12 lg:px-24 bg-gray-950" id="servicios">
      <h2 className="text-3xl font-bold text-center mb-4 font-fancy">
        Servicios Exclusivos y Contacto Directo
      </h2>
      <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto font-montserrat">
        Encuentra la compañía perfecta para cualquier ocasión. Contacta directamente con las modelos
        para escuchar los detalles.
      </p>
      <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto px-4">
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
    <div className="px-6 py-16 sm:px-12 lg:px-24 bg-gradient-to-r from-pink-900 to-pink-700 text-center space-y-4">
      <h2 className="text-3xl font-bold font-fancy">¿Eres Modelo? Únete a Nuestra Plataforma</h2>
      <p className="text-gray-100 max-w-2xl mx-auto font-montserrat">
        Publica tu perfil verificado en nuestra plataforma y conecta directamente con clientes. Ofrece
        tus servicios y maneja tu negocio de forma segura y discreta.
      </p>
      <Link
        href="/register"
        className="inline-block bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold font-montserrat hover:bg-gray-100 transition"
      >
        Publica tu Perfil Aquí
      </Link>
    </div>
  );
}
function Footer() {
  return (
    <footer className="bg-zinc-950 text-gray-400 py-12 border-t border-zinc-900 mt-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Sección Superior: Logo y Enlaces */}        
        <Link href="/" className="flex-shrink-0">
          <Image src="/logo.png" alt="xscort.cl" width={150} height={150} />
        </Link>
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <p className="text-sm max-w-sm font-montserrat">
              La guía definitiva de avisos clasificados para adultos en Chile. Encuentra y publica
              anuncios con seguridad y discreción.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 font-fancy">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terminos" className="hover:text-pink-500 transition font-montserrat">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="hover:text-pink-500 transition font-montserrat">
                  Políticas de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-pink-500 transition font-montserrat">
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold font-fancy mb-4">Anunciantes</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/login" className="hover:text-pink-500 transition font-montserrat">
                  Acceso Socias
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Separador */}
        <div className="border-t border-zinc-900 my-8"></div>

        {/* Descargo Legal */}
        <div className="bg-zinc-900/50 p-6 rounded-lg text-xs text-justify text-gray-500 leading-relaxed mb-8 border border-zinc-800">
          <p className="mb-2 font-bold font-montserrat text-gray-400 uppercase">Descargo de Responsabilidad Legal:</p>
          <p>
            xscort.cl actúa única y exclusivamente como un portal de avisos publicitarios para
            mayores de 18 años.
            <strong>
              {" "}
              NO somos una agencia de modelos, NO poseemos vínculo laboral, subordinación ni
              dependencia con las personas anunciantes.
            </strong>{" "}
            El Sitio no organiza citas, no fija tarifas, ni participa en modo alguno en los acuerdos
            privados entre usuarios y anunciantes. Nos reservamos el derecho a retirar cualquier
            anuncio que presuntamente vulnere la legalidad vigente o nuestras normas de publicación,
            sin que esto implique responsabilidad solidaria sobre los hechos de terceros. Todas las
            personas que aparecen en este sitio han declarado ser mayores de edad y han contratado el
            servicio de publicación por voluntad propia.
          </p>
        </div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <p>© {CURRENT_YEAR} xscort.cl - Todos los derechos reservados.</p>
          <p className="mt-2 md:mt-0 text-xs">Solo mayores de 18 años (+18)</p>
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
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <HeroSection />
      <TrustSection />
      <CiudadesSection ciudades={ciudades} />
      <ServicesSection />
      <CTASection />
      <Footer />
    </div>
  );
}
