import Link from "next/link";
import Image from "next/image";
import GridModelosDestacadas from "@/components/GridModelosDestacadas";
import NavAuthCta from "@/components/NavAuthCta";


export const metadata = {
  title: "xscort.cl - Plataforma de Modelos Verificadas en Chile",
  description: "Conecta con modelos de compañía verificadas en Chile. Contacta directamente por WhatsApp o Telegram. Seguro y discreto.",
};

// Función para obtener modelos destacadas en el servidor
async function getModelosDestacadas() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/profiles/?page_size=8`,
      {
        next: { revalidate: 300 }, // ISR: revalidar cada 5 minutos
      }
    );
    
    if (!res.ok) {
      console.error('Error fetching modelos:', res.status);
      return [];
    }
    
    const data = await res.json();
    return data.results || data;
  } catch (error) {
    console.error('Error fetching modelos destacadas:', error);
    return [];
  }
}

export default async function HomePage() {
  // Fetch de datos en el servidor
  const modelosDestacadas = await getModelosDestacadas();
  const ciudadesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/profiles/ciudades/`, { next: { revalidate: 300 } });
  const ciudades = ciudadesRes.ok ? await ciudadesRes.json() : [];
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black bg-opacity-95 backdrop-blur px-6 py-3 sm:px-12 lg:px-24 z-50 border-b border-gray-800">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex-shrink-0">
            <Image src="/logo.svg" alt="xscort.cl" width={120} height={120} />
          </Link>
          <div className="hidden sm:flex gap-8 text-sm items-center ml-auto">
            <Link href="/busqueda" className="hover:text-pink-500 transition text-gray-300">Modelos</Link>
            <Link href="#servicios" className="hover:text-pink-500 transition text-gray-300">Servicios</Link>
            <Link href="#faq" className="hover:text-pink-500 transition text-gray-300">FAQ</Link>
            <div className="h-6 w-px bg-gray-700"></div>
            <NavAuthCta />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-24 px-6 py-20 sm:px-12 lg:px-24 bg-gradient-to-b from-gray-900 to-black min-h-screen flex flex-col justify-center">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
            La Plataforma Exclusiva de Modelos Verificadas en Chile.
          </h1>
          <p className="text-lg text-gray-300">
            Explora perfiles y contacta directamente por WhatsApp o Telegram. Seguro y discreto.
          </p>
          <Link href="/busqueda" className="inline-block bg-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-600 transition">
            Explorar Perfiles Verificados
          </Link>
        </div>
      </div>

      {/* Trust Section */}
      <div className="px-6 py-16 sm:px-12 lg:px-24 bg-gray-950 text-center space-y-4">
        <h2 className="text-3xl font-bold">Confianza y Contacto Directo.</h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          xscort.cl te conecta con modelos de compañía verificadas. Explora perfiles auténticos y contacta directamente a través de WhatsApp o Telegram para coordinar encuentros. Garantizamos seguridad, discreción y una experiencia exclusiva sin intermediarios.
        </p>
      </div>

      {/* Ciudades Section */}
      <div className="px-6 py-16 sm:px-12 lg:px-24 bg-gray-950">
        <h2 className="text-3xl font-bold text-center mb-4">Ciudades</h2>
        <p className="text-center text-gray-300 mb-10">Selecciona una ciudad para ver modelos disponibles</p>
        <div className="flex flex-wrap justify-center gap-3">
          {ciudades.map((c) => (
            <Link key={c.value} href={`/busqueda?ciudad=${c.value}`} className="px-4 py-2 rounded-full border border-white/15 text-sm text-pink-100 hover:bg-white/5">
              {c.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Models Section */}
      <div className="px-6 py-16 sm:px-12 lg:px-24">
        <h2 className="text-4xl font-bold text-center mb-12">Modelos Destacadas de la Semana</h2>
        <GridModelosDestacadas perfiles={modelosDestacadas} />
      </div>

      {/* Services Section */}
      <div className="px-6 py-16 sm:px-12 lg:px-24 bg-gray-950" id="servicios">
        <h2 className="text-3xl font-bold text-center mb-4">Servicios Exclusivos y Contacto Directo</h2>
        <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
          Encuentra la compañía perfecta para cualquier ocasión. Contacta directamente con las modelos para escuchar los detalles.
        </p>
        
        <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center space-y-4">
            <div className="text-4xl">💑</div>
            <h3 className="text-xl font-bold">Acompañamiento a Eventos</h3>
            <p className="text-gray-400 text-sm">
              Asistencia a eventos sociales, corporativos o salidas con una compañía elegante y distinguida.
            </p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="text-4xl">🍷</div>
            <h3 className="text-xl font-bold">Cenas y Reuniones</h3>
            <p className="text-gray-400 text-sm">
              Disfruta de una velada inolvidable en los mejores restaurantes o reuniones privadas.
            </p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="text-4xl">✈️</div>
            <h3 className="text-xl font-bold">Viajes y Turismo</h3>
            <p className="text-gray-400 text-sm">
              Explora nuevos destinos nacionales e internacionales con acompañante de lujo.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 py-16 sm:px-12 lg:px-24 bg-gradient-to-r from-pink-900 to-pink-700 text-center space-y-4">
        <h2 className="text-3xl font-bold">¿Eres Modelo? Únete a Nuestra Plataforma</h2>
        <p className="text-gray-100 max-w-2xl mx-auto">
          Publica tu perfil verificado en nuestra plataforma y conecta directamente con clientes. Ofrece tus servicios y maneja tu negocio de forma segura y discreta.
        </p>
        <Link href="/register" className="inline-block bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
          Publica tu Perfil Aquí
        </Link>
      </div>

      {/* Footer */}
      <footer className="px-6 py-8 sm:px-12 lg:px-24 bg-black border-t border-gray-800 text-center text-sm text-gray-500 space-y-4">
        <p>© 2026 xscort.cl. Todos los derechos reservados.</p>
        <div className="flex justify-center gap-6 text-xs">
          <Link href="/terminos" className="hover:text-pink-500">Términos y Condiciones</Link>
          <Link href="/privacidad" className="hover:text-pink-500">Política de Privacidad</Link>
          <Link href="#" className="hover:text-pink-500">Contacto</Link>
        </div>
      </footer>
    </div>
  );
}
