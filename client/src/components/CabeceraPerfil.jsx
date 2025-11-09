"use client";

export default function CabeceraPerfil({ perfil }) {
  const rating = perfil?.rating || 0;
  const edad = perfil?.edad || "N/A";

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
        <span className="ml-2 text-sm text-gray-600">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <div className="rounded-lg border bg-white p-6 shadow-md">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Foto */}
        <div className="md:col-span-1">
          {perfil?.foto_perfil ? (
            <img
              src={perfil.foto_perfil}
              alt={perfil.nombre_publico}
              className="h-96 w-full rounded-lg object-cover"
            />
          ) : (
            <div className="h-96 w-full rounded-lg bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Sin foto</span>
            </div>
          )}
        </div>

        {/* Información */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <h1 className="text-4xl font-bold">{perfil?.nombre_publico}</h1>
            <p className="text-xl text-gray-600">{edad} años</p>
          </div>

          <div className="space-y-2 border-b pb-4">
            <p className="text-lg">
              <span className="font-semibold">Ciudad:</span> {perfil?.ciudad}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Calificación:</span>
            </p>
            {renderStars(rating)}
          </div>

          {perfil?.descripcion && (
            <div className="space-y-2">
              <p className="font-semibold">Acerca de:</p>
              <p className="text-gray-700">{perfil.descripcion}</p>
            </div>
          )}

          {perfil?.tags && perfil.tags.length > 0 && (
            <div className="space-y-2">
              <p className="font-semibold">Características:</p>
              <div className="flex flex-wrap gap-2">
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
