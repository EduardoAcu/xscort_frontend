"use client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function CabeceraPerfil({ perfil }) {
  const rating = perfil?.rating || 0;
  const edad = perfil?.edad ? `${perfil.edad} Años` : "";
  const nombrePublico = perfil?.nombre_artistico || "Modelo";
  const descripcion = perfil?.biografia;
  const ciudadNombre = perfil?.ciudad?.nombre || perfil?.ciudad || "Ubicación no especificada";

  const fotoPerfil = perfil?.foto_perfil
    ? perfil.foto_perfil.startsWith("http")
      ? perfil.foto_perfil
      : `${API_BASE_URL}${perfil.foto_perfil}`
    : null;

  return (
    // Fondo con gradiente suave
    <div className="w-full bg-gradient-to-b from-[#1b101a] to-[#120912] border-b border-white/5 py-10 md:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Layout: Centrado en Móvil, Fila en Desktop */}
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 text-center md:text-left">
          
          {/* --- FOTO REDONDA (Avatar Premium) --- */}
          <div className="relative flex-shrink-0 group">
             {/* Aro de brillo decorativo detrás */}
             <div className="absolute -inset-0.5 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
             
             {/* Contenedor de la imagen */}
             <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-2 border-white/10 shadow-2xl bg-black">
                {fotoPerfil ? (
                  <img
                    src={fotoPerfil}
                    alt={nombrePublico}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white/5 text-xs text-gray-500 uppercase">
                    Sin Foto
                  </div>
                )}
             </div>
          </div>

          {/* --- INFORMACIÓN --- */}
          <div className="flex-1 flex flex-col justify-center">
            
            {/* Meta-datos (Ubicación • Edad) */}
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold text-pink-400 uppercase tracking-widest mb-2">
               <span>{ciudadNombre}</span>
               {edad && <span className="text-gray-700">•</span>}
               <span>{edad}</span>
            </div>
            
            {/* Nombre: Elegante y legible */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl text-white font-medium tracking-tight mb-3">
              {nombrePublico}
            </h1>

            {/* Rating Estrellas */}
            <div className="flex items-center justify-center md:justify-start gap-1 mb-5">
               {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-sm ${i < Math.round(rating) ? "text-pink-500" : "text-gray-800"}`}>★</span>
               ))}
               {rating > 0 && <span className="ml-2 text-xs text-gray-500 font-mono">({rating.toFixed(1)})</span>}
            </div>

            {/* Biografía Corta */}
            {descripcion && (
              <p className="text-gray-400 text-sm leading-relaxed max-w-xl mx-auto md:mx-0 font-light mb-6">
                {descripcion}
              </p>
            )}

            {/* Tags (Versión Píldora Minimalista) */}
            {perfil?.tags && perfil.tags.length > 0 && (
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {perfil.tags.map((tag, idx) => {
                  const tagName = typeof tag === 'object' ? tag.nombre : tag;
                  return (
                    <span key={idx} className="text-[10px] uppercase tracking-wide text-gray-400 border border-white/10 rounded-full px-3 py-1 bg-white/[0.02]">
                      {tagName}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}