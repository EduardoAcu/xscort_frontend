"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function FilterPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const [ciudad, setCiudad] = useState("");
  const [ciudades, setCiudades] = useState([]);
  
  const [servicio, setServicio] = useState("");
  const [serviciosCatalogo, setServiciosCatalogo] = useState([]);
  
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // 1. Cargar estado inicial desde URL
  useEffect(() => {
    setCiudad(searchParams.get("ciudad") || "");
    setServicio(searchParams.get("servicio") || "");
  }, [searchParams]);

  // 2. Cargar datos API (Blindado contra formatos de lista/paginación)
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // --- CIUDADES ---
        // Usamos 'no-store' para evitar cachés fantasmas de Next.js
        const resC = await fetch(`${API_URL}/api/profiles/ciudades/`, { cache: 'no-store' });
        if (resC.ok) {
            const data = await resC.json();
            // Detectamos si viene como array puro [..] o objeto paginado { results: [..] }
            setCiudades(Array.isArray(data) ? data : (data.results || []));
        }

        // --- SERVICIOS ---
        const resS = await fetch(`${API_URL}/api/profiles/servicios-catalogo/`, { cache: 'no-store' });
        if (resS.ok) {
            const data = await resS.json();
            setServiciosCatalogo(Array.isArray(data) ? data : (data.results || []));
        }
      } catch (err) {
        console.error("Error cargando filtros:", err);
        setCiudades([]);
        setServiciosCatalogo([]);
      }
    };
    cargarDatos();
  }, [API_URL]);

  useEffect(() => {
    if (ciudades.length > 0 && ciudad) {
        // Buscamos coincidencia por ID (convirtiendo ambos a string para seguridad)
        const match = ciudades.find(c => String(c.id) === String(ciudad));
        
        // Si encontramos el objeto y tiene slug, pero nosotros tenemos el ID... ¡Cambiamos!
        if (match && match.slug && match.slug !== ciudad) {
            console.log(`🔧 Auto-corrigiendo URL: ${ciudad} -> ${match.slug}`);
            setCiudad(match.slug);
        }
    }
  }, [ciudades, ciudad]);


  const applyFilters = () => {
    const params = new URLSearchParams();
    if (ciudad) params.set("ciudad", ciudad);
    if (servicio) params.set("servicio", servicio);
    
    // Empujamos la nueva URL
    router.push(`/busqueda${params.toString() ? `?${params.toString()}` : ""}`);
    setIsMobileOpen(false); 
  };

  const clearFilters = () => {
    setCiudad("");
    setServicio("");
    router.push("/busqueda");
    setIsMobileOpen(false);
  };

  const filtrosActivos = (ciudad ? 1 : 0) + (servicio ? 1 : 0);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#1b101a] text-white shadow-xl font-montserrat w-full overflow-hidden transition-all duration-300">
      
      {/* HEADER MÓVIL */}
      <div 
        className="lg:hidden p-4 flex items-center justify-between cursor-pointer active:bg-white/5 select-none"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-pink-500">tune</span>
            <span className="font-bold text-sm">Filtrar Resultados</span>
            {filtrosActivos > 0 && (
                <span className="bg-pink-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {filtrosActivos}
                </span>
            )}
        </div>
        <span className={`material-symbols-outlined text-gray-400 transition-transform duration-300 ${isMobileOpen ? 'rotate-180' : ''}`}>
            expand_more
        </span>
      </div>

      {/* CONTENIDO DESPLEGABLE */}
      <div className={`
          px-4 pb-4 sm:p-5 
          ${isMobileOpen ? 'block border-t border-white/5 pt-4' : 'hidden'} 
          lg:block lg:border-none lg:pt-5
      `}>
        <div className="flex flex-col lg:flex-row lg:items-end gap-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-1 gap-4 w-full">
            
            {/* SELECT CIUDAD */}
            <div className="flex-1 min-w-[200px]">
               <label className="block text-xs font-bold text-pink-200 uppercase mb-1.5 ml-1">Ubicación</label>
               <div className="relative">
                  <select
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                    className="w-full appearance-none rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition cursor-pointer text-sm"
                  >
                    <option value="">Todas las ciudades</option>
                    {ciudades.map((c, idx) => {
                       // 🔥 CAMBIO CRÍTICO: Priorizamos SLUG
                       const val = c.slug || c.id || idx;
                       return <option key={val} value={val} className="text-black">{c.nombre}</option>;
                    })}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-pink-500 font-bold">▾</span>
               </div>
            </div>

            {/* SELECT SERVICIO */}
            <div className="flex-1 min-w-[200px]">
               <label className="block text-xs font-bold text-pink-200 uppercase mb-1.5 ml-1">Servicio</label>
               <div className="relative">
                  <select
                    value={servicio}
                    onChange={(e) => setServicio(e.target.value)}
                    className="w-full appearance-none rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition cursor-pointer text-sm"
                  >
                    <option value="">Todos los servicios</option>
                    {serviciosCatalogo.map((s, idx) => {
                       // 🔥 CAMBIO CRÍTICO: Priorizamos SLUG
                       const val = s.slug || s.id || idx;
                       return <option key={val} value={val} className="text-black">{s.nombre}</option>;
                    })}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-pink-500 font-bold">▾</span>
               </div>
            </div>
          </div>

          {/* BOTONES */}
          <div className="flex items-center gap-3 mt-2 lg:mt-0 lg:w-auto w-full">
            <button
              onClick={clearFilters}
              className="flex-1 lg:flex-none px-6 py-3 rounded-xl border border-white/10 text-sm font-semibold text-gray-300 hover:bg-white/5 transition"
            >
              Limpiar
            </button>
            <button
              onClick={applyFilters}
              className="flex-1 lg:flex-none px-8 py-3 rounded-xl bg-pink-600 text-sm font-bold text-white hover:bg-pink-500 shadow-lg shadow-pink-600/20 transition flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">search</span>
              Buscar
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}