// src/components/ProfileCard.js
import Link from "next/link";
import Image from "next/image";
import { MapPin, Star } from "lucide-react";

export default function ProfileCard({ profile }) {
  if (!profile) return null;

  return (
    <Link href={`/perfil/${profile.slug || profile.id}`} className="group relative block h-full">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 transition-all duration-300 group-hover:border-pink-500/50 group-hover:shadow-lg group-hover:shadow-pink-500/20">
        
        {/* FOTO PRINCIPAL */}
        <Image
          src={profile.foto_principal || "/placeholder.jpg"} 
          alt={profile.nombre_fantasia || "Modelo"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        
        {/* DEGRADADO PARA TEXTO */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/60 to-transparent" />
        
        {/* ETIQUETA CIUDAD */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
            <MapPin className="w-3 h-3 text-pink-500" />
            <span className="text-[10px] font-bold uppercase text-white tracking-wider">
                {profile.ciudad_nombre || "Chile"}
            </span>
        </div>

        {/* INFO */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-xl font-bold text-white font-fancy leading-tight group-hover:text-pink-500 transition-colors">
                {profile.nombre_fantasia}
              </h3>
              <p className="text-sm text-gray-300 font-light">
                {profile.edad} años
              </p>
            </div>
            {/* ÍCONO */}
            <div className="bg-pink-600 p-2 rounded-full text-white shadow-lg">
               <Star className="w-4 h-4 fill-current" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}