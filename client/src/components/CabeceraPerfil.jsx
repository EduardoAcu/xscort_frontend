"use client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function CabeceraPerfil({ perfil }) {
  const rating = perfil?.rating || 0;
  const edad = perfil?.edad || "N/A";

  const nombrePublico = perfil?.nombre_artistico || "Modelo";
  const descripcion = perfil?.biografia;
  const fotoPerfil = perfil?.foto_perfil
    ? perfil.foto_perfil.startsWith("http")
      ? perfil.foto_perfil
      : `${API_BASE_URL}${perfil.foto_perfil}`
    : null;

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-xl ${
              i < Math.round(rating) ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
        <span className="ml-2 text-sm text-[color:var(--color-muted-foreground)]">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <div className="rounded-lg sm:rounded-xl border bg-[var(--color-card)] p-4 sm:p-5 md:p-6 shadow-md">
      <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 md:grid-cols-3">
        {/* Foto */}
        <div className="md:col-span-1">
          {fotoPerfil ? (
            <img
              src={fotoPerfil}
              alt={nombrePublico}
              className="h-56 sm:h-72 md:h-96 w-full rounded-lg sm:rounded-xl object-cover"
            />
          ) : (
            <div className="h-56 sm:h-72 md:h-96 w-full rounded-lg sm:rounded-xl bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-sm sm:text-base">Sin foto</span>
            </div>
          )}
        </div>

        {/* Información */}
        <div className="md:col-span-2 space-y-3 sm:space-y-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">{nombrePublico}</h1>
            <p className="text-base sm:text-lg md:text-xl text-[color:var(--color-muted-foreground)]">{edad} años</p>
          </div>

          <div className="space-y-2 sm:space-y-3 border-b pb-3 sm:pb-4">
            <p className="text-sm sm:text-base md:text-lg">
              <span className="font-semibold">Ciudad:</span> {perfil?.ciudad}
            </p>
            <p className="text-sm sm:text-base md:text-lg font-semibold">Calificación:</p>
            {renderStars(rating)}
          </div>

          {descripcion && (
            <div className="space-y-2">
              <p className="text-sm sm:text-base md:text-lg font-semibold">Acerca de:</p>
              <p className="text-xs sm:text-sm md:text-base text-gray-700">{descripcion}</p>
            </div>
          )}

          {perfil?.tags && perfil.tags.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm sm:text-base md:text-lg font-semibold">Características:</p>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {perfil.tags.map((tag, idx) => {
                  const tagName = typeof tag === 'object' ? tag.nombre || tag.name || JSON.stringify(tag) : tag;
                  return (
                    <span key={idx} className="inline-block bg-blue-100 px-3 py-1 text-blue-700 rounded-full text-sm">
                      {tagName}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
