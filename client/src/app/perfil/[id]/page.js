import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import FormularioResenaWrapper from "@/components/FormularioResenaWrapper";
import GaleriaPublica from "@/components/GaleriaPublica";
import LikeButtonCliente from "@/components/LikeButtonCliente";
import NavAuthCta from "@/components/NavAuthCta";
import MobileMenu from "@/components/MobileMenu";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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

async function getPerfilData(id) {
  try {
    const res = await fetch(`${API_URL}/api/profiles/${id}/`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Error fetching perfil");
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching perfil:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const perfil = await getPerfilData(id);
  if (!perfil) {
    return { title: "Perfil no encontrado" };
  }
  return {
    title: `${perfil.nombre_artistico || "Modelo"} - ${perfil.ciudad} | xscort.cl`,
    description: perfil.biografia || `Perfil de ${perfil.nombre_artistico || "modelo"} en ${perfil.ciudad}`,
  };
}

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_URL}/api/profiles/?page_size=20`);
    const data = await res.json();
    const perfiles = data.results || data;
    return perfiles.map((perfil) => ({ id: perfil.id.toString() }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function PerfilPage({ params }) {
  const { id } = await params;
  const perfil = await getPerfilData(id);
  if (!perfil) notFound();

  const servicios = perfil.servicios || [];
  const galeria = perfil.galeria_fotos || [];
  const resenas = perfil.resenas || [];
  const disclaimer = perfil.disclaimer || "";
  const mainImage = perfil.foto_perfil
    ? perfil.foto_perfil.startsWith("http")
      ? perfil.foto_perfil
      : `${API_URL}${perfil.foto_perfil}`
    : galeria[0]?.imagen
    ? galeria[0].imagen.startsWith("http")
      ? galeria[0].imagen
      : `${API_URL}${galeria[0].imagen}`
    : null;
  const phone = perfil.telefono_contacto || perfil.whatsapp || perfil.telefono || perfil.phone;
  const telegram = perfil.telegram_contacto || perfil.telegram || perfil.contacto_telegram;
  const ciudad = perfil.ciudad || "";
  const edad = perfil.edad || perfil.user_edad || "";
  const nombre = perfil.nombre_artistico || perfil.nombre_publico || "Modelo";
  const biografia = perfil.biografia || perfil.descripcion || "";
  const tags = perfil.tags || [];
  const likes = perfil.likes_count || 0;
  const likedByMe = perfil.liked_by_me || false;

  
  return (
    <div className="min-h-screen bg-[#120912] text-white">
      <Navigation />
      <div className="pt-16 sm:pt-20 relative isolate overflow-hidden bg-gradient-to-br from-[#160d18] via-[#120912] to-[#1a0f1a]">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-10 md:py-12 lg:py-14">
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[280px_1fr] xl:grid-cols-[360px_1fr] items-start">
            <div className="rounded-full overflow-hidden border border-white/5 shadow-2xl h-40 w-40 sm:h-56 sm:w-56 lg:h-64 lg:w-64">
              {mainImage ? (
                <img src={mainImage} alt={nombre} className="w-full h-full object-cover block" />
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/60">Sin foto</div>
              )}
            </div>

            <div className="space-y-3 sm:space-y-4 lg:space-y-5">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight">{nombre}</h1>
                {edad && <span className="text-sm sm:text-base md:text-lg text-pink-200">{edad} años</span>}
              </div>
              <LikeButtonCliente perfilId={perfil.id} initialLiked={likedByMe} initialCount={likes} />
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm md:text-base text-pink-100/90">
                {ciudad && <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">{ciudad}</span>}
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">❤️ {likes} Me gusta</span>
              </div>

              {(phone || telegram) && (
                <div className="space-y-2 text-montserrat">
                  <p className="text-sm uppercase text-pink-200">Contacto</p>
                  <div className="flex flex-wrap gap-3">
                    {phone && (
                      <>
                        <a
                          href={`tel:${phone}`}
                          className="inline-flex items-center gap-2 rounded-full bg-pink-600 px-4 py-2 font-semibold text-white hover:bg-pink-700 transition"
                        >
                          Llamar
                        </a>
                        <a
                          href={`https://wa.me/${phone.replace(/\\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-600 transition"
                        >
                          WhatsApp
                        </a>
                      </>
                    )}
                    {telegram && (
                      <a
                        href={`https://t.me/${telegram.replace(/^@/, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600 transition"
                      >
                        Telegram
                      </a>
                    )}
                  </div>
                </div>
              )}

              {biografia && (
                <div className="space-y-2">
                  <p className="text-sm uppercase text-pink-200">Descripción</p>
                  <p className="text-pink-50 leading-relaxed">{biografia}</p>
                </div>
              )}

              {servicios.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm uppercase text-pink-200">Servicios</p>
                  <div className="flex flex-wrap gap-2">
                    {servicios.slice(0, 6).map((srv) => {
                      const nombreSrv =
                        typeof srv.nombre === "object"
                          ? srv.nombre?.nombre || srv.nombre?.categoria || JSON.stringify(srv.nombre)
                          : srv.nombre;
                      return (
                        <span key={srv.id} className="rounded-full bg-white/10 border border-white/10 px-3 py-1 text-sm">
                          {nombreSrv}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {tags.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm uppercase text-pink-200">Etiquetas</p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, idx) => {
                      const tagName = typeof tag === "object" ? tag.nombre || tag.name || JSON.stringify(tag) : tag;
                      return (
                        <span key={idx} className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-sm text-pink-50">
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
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-10 py-10 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Álbum Público</h2>
          <p className="text-sm text-pink-200">{galeria.length} fotos</p>
        </div>
        <GaleriaPublica
          fotos={galeria.map((f) =>
            f.imagen?.startsWith("http") ? f.imagen : `${API_URL}${f.imagen}`
          )}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-10 pb-12 grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4 bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold">Reseñas</h3>
          {resenas.length > 0 ? (
            <div className="space-y-4">
              {resenas.map((r) => (
                <div key={r.id} className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-white">{r.usuario_nombre || "Anónimo"}</p>
                    <div className="text-yellow-400 text-sm">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>{i < (r.puntuacion || r.rating || 0) ? "★" : "☆"}</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-pink-50 text-sm leading-relaxed">{r.comentario}</p>
                  {r.fecha && <p className="text-xs text-pink-200">{new Date(r.fecha).toLocaleDateString()}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-pink-100/80 text-sm">Aún no hay reseñas.</p>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 text-gray-900 shadow-lg">
          <FormularioResenaWrapper perfilId={id} />
        </div>
      </div>

      {disclaimer && (
        <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-10 pb-10">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-sm text-pink-100">
            {disclaimer}
          </div>
        </div>
      )}
    </div>
  );
}
