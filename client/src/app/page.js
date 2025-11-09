"use client";
import Link from "next/link";
import GridModelosDestacadas from "@/components/GridModelosDestacadas";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black bg-opacity-95 px-6 py-4 sm:px-12 lg:px-24 z-50 flex justify-between items-center">
        <div className="text-2xl font-bold text-pink-500">✦ xscort.cl</div>
        <div className="hidden sm:flex gap-6 text-sm">
          <Link href="#" className="hover:text-pink-500 transition">Modelos</Link>
          <Link href="#" className="hover:text-pink-500 transition">Servicios</Link>
          <Link href="#" className="hover:text-pink-500 transition">FAQ</Link>
          <Link href="/login" className="hover:text-pink-500 transition">Login</Link>
          <Link href="/register" className="bg-pink-500 text-white px-4 py-2 rounded font-semibold hover:bg-pink-600 transition">
            Regístrate como Modelo
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-20 px-6 py-20 sm:px-12 lg:px-24 bg-gradient-to-b from-gray-900 to-black min-h-screen flex flex-col justify-center">
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

      {/* Featured Models Section */}
      <div className="px-6 py-16 sm:px-12 lg:px-24">
        <h2 className="text-4xl font-bold text-center mb-12">Modelos Destacadas de la Semana</h2>
        <GridModelosDestacadas />
      </div>

      {/* Services Section */}
      <div className="px-6 py-16 sm:px-12 lg:px-24 bg-gray-950">
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
        <p>© 2024 xscort.cl. Todos los derechos reservados.</p>
        <div className="flex justify-center gap-6 text-xs">
          <Link href="#" className="hover:text-pink-500">Términos y Condiciones</Link>
          <Link href="#" className="hover:text-pink-500">Política de Privacidad</Link>
          <Link href="#" className="hover:text-pink-500">Contacto</Link>
        </div>
      </footer>
    </div>
  );
}
