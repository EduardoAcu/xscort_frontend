import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#140411] via-[#1f0f1a] to-[#140411] text-white px-6">
      <div className="max-w-md text-center space-y-6">
        {/* Error Code */}
        <div className="space-y-2">
          <h1 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            404
          </h1>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Página no encontrada</h2>
          <p className="text-gray-300">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-3 font-semibold text-white hover:from-pink-600 hover:to-pink-700 transition-all transform hover:scale-105"
          >
            <span className="material-symbols-outlined text-base">home</span>
            <span>Ir al Inicio</span>
          </Link>

          <Link
            href="/busqueda"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-pink-500 px-6 py-3 font-semibold text-pink-500 hover:bg-pink-500 hover:text-white transition-all"
          >
            <span className="material-symbols-outlined text-base">search</span>
            <span>Buscar Perfiles</span>
          </Link>
        </div>

        {/* Additional help */}
        <div className="pt-6 text-sm text-gray-400">
          <p>¿Necesitas ayuda? <Link href="#" className="text-pink-400 hover:text-pink-300 underline">Contacta con soporte</Link></p>
        </div>
      </div>
    </div>
  );
}
