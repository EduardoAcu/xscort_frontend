"use client";
import Link from "next/link";
import Image from "next/image";

/**
 * Componente que muestra grid de modelos destacadas.
 * Recibe los datos como props (pre-fetched en el servidor).
 */
export default function GridModelosDestacadas({ perfiles = [] }) {
  if (!perfiles || perfiles.length === 0) {
    return <div className="py-8 text-center text-gray-500">No hay modelos disponibles</div>;
  }
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  return (
    <div className="py-12">
      <h2 className="mb-8 text-3xl font-bold">Modelos destacadas</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {perfiles.map((perfil) => (
          <Link key={perfil.id} href={`/perfil/${perfil.id}`}>
            <div className="group overflow-hidden rounded-lg border shadow-md transition-transform hover:shadow-lg hover:scale-105">
              <div className="relative h-64 w-full bg-gradient-to-br from-gray-900 to-gray-700">
                {perfil.foto_perfil ? (
                  <Image
                    src={
                      perfil.foto_perfil.startsWith("http")
                        ? perfil.foto_perfil
                        : `${API_URL}${perfil.foto_perfil}`
                    }
                    alt={perfil.nombre_artistico || "Modelo"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white/70 text-sm">
                    Sin foto
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{perfil.nombre_artistico || "Modelo"}</h3>
                <p className="text-sm text-[color:var(--color-muted-foreground)]">{perfil.ciudad}</p>
                {perfil.tags && perfil.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {perfil.tags.slice(0, 3).map((tag, idx) => {
                      const tagName = typeof tag === 'object' ? tag.nombre || tag.name || '' : tag;
                      return (
                        <span key={idx} className="inline-block bg-[color:var(--color-primary)/0.12] px-2 py-1 text-xs text-[color:var(--color-primary)] rounded">
                          {tagName}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
