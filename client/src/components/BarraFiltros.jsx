"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import {ListFilter,ChevronDown } from "lucide-react";

// NOMBRE CORRECTO Y EXPORT DEFAULT
export default function BarraFiltros() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const [ciudad, setCiudad] = useState("");
  const [ciudades, setCiudades] = useState([]);
  
  const [servicio, setServicio] = useState("");
  const [serviciosCatalogo, setServiciosCatalogo] = useState([]);
  
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // 1. Sincronizar estado con URL
  useEffect(() => {
    setCiudad(searchParams.get("ciudad") || "");
    setServicio(searchParams.get("servicio") || "");
  }, [searchParams]);

  // 2. Cargar Datos del Backend
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Ciudades
        const resC = await fetch(`${API_URL}/api/profiles/ciudades/`, { next: { revalidate: 300 }});
        if (resC.ok) {
            const data = await resC.json();
            setCiudades(Array.isArray(data) ? data : (data.results || []));
        }
        // Servicios
        const resS = await fetch(`${API_URL}/api/profiles/servicios-catalogo/`, { next: { revalidate: 300 }});
        if (resS.ok) {
            const data = await resS.json();
            setServiciosCatalogo(Array.isArray(data) ? data : (data.results || []));
        }
      } catch (err) {
        console.error("Error cargando filtros:", err);
      }
    };
    cargarDatos();
  }, [API_URL]);

  // 3. AUTO-CORRECTOR (ID -> Slug)
  useEffect(() => {
    if (ciudades.length > 0 && ciudad) {
        const match = ciudades.find(c => String(c.id) === String(ciudad));
        // Si el usuario tiene el ID "1" pero el slug es "chillan", corregimos.
        if (match && match.slug && match.slug !== ciudad) {
            setCiudad(match.slug);
        }
    }
  }, [ciudades, ciudad]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (ciudad) params.set("ciudad", ciudad);
    if (servicio) params.set("servicio", servicio);
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
      {/* Header Móvil */}
      <div 
        className="lg:hidden p-4 flex items-center justify-between cursor-pointer active:bg-white/5"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <div className="flex items-center gap-2">
            <ListFilter className="w-5 h-5 text-pink-500" />
            <span className="font-bold text-sm">Filtrar</span>
            {filtrosActivos > 0 && <span className="bg-pink-600 text-[10px] px-2 py-0.5 rounded-full">{filtrosActivos}</span>}
        </div>
        <ChevronDown className="w-5 h-5 text-gray-400" />
      </div>

      {/* Contenido */}
      <div className={`px-4 pb-4 sm:p-5 ${isMobileOpen ? 'block pt-4' : 'hidden'} lg:block lg:pt-5`}>
        <div className="flex flex-col lg:flex-row lg:items-end gap-4">
          {/* Select Ciudad */}
          <div className="flex-1">
             <label className="block text-xs font-bold text-pink-200 uppercase mb-1">Ubicación</label>
             <select value={ciudad} onChange={(e) => setCiudad(e.target.value)} className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white">
                <option value="">Todas</option>
                {ciudades.map((c, i) => <option key={i} value={c.slug || c.id} className="text-black">{c.nombre}</option>)}
             </select>
          </div>
          {/* Select Servicio */}
          <div className="flex-1">
             <label className="block text-xs font-bold text-pink-200 uppercase mb-1">Servicio</label>
             <select value={servicio} onChange={(e) => setServicio(e.target.value)} className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white">
                <option value="">Todos</option>
                {serviciosCatalogo.map((s, i) => <option key={i} value={s.slug || s.id} className="text-black">{s.nombre}</option>)}
             </select>
          </div>
          {/* Botones */}
          <div className="flex gap-2 w-full lg:w-auto">
            <button onClick={clearFilters} className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-sm">Limpiar</button>
            <button onClick={applyFilters} className="flex-1 px-6 py-3 rounded-xl bg-pink-600 text-sm font-bold">Buscar</button>
          </div>
        </div>
      </div>
    </div>
  );
}