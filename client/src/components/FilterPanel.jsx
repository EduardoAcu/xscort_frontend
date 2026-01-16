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

  useEffect(() => {
    // hidratar desde query
    setCiudad(searchParams.get("ciudad") || "");
    setServicio(searchParams.get("servicio") || "");
  }, [searchParams]);

  useEffect(() => {
    const cargarCiudades = async () => {
      try {
        const res = await fetch(`${API_URL}/api/profiles/ciudades/`, { next: { revalidate: 300 } });
        if (!res.ok) throw new Error("error ciudades");
        const data = await res.json();
        setCiudades(data);
      } catch {
        // fallback a choices del backend
        setCiudades([
          { value: "Rancagua", label: "Rancagua" },
          { value: "Curico", label: "Curicó" },
          { value: "Talca", label: "Talca" },
          { value: "Linares", label: "Linares" },
          { value: "Chillan", label: "Chillán" },
          { value: "Los Angeles", label: "Los Ángeles" },
          { value: "Concepcion", label: "Concepción" },
          { value: "Temuco", label: "Temuco" },
          { value: "Pucon", label: "Pucón" },
          { value: "Valdivia", label: "Valdivia" },
          { value: "Osorno", label: "Osorno" },
          { value: "Puerto Montt", label: "Puerto Montt" },
        ]);
      }
    };
    cargarCiudades();
    const cargarServicios = async () => {
      try {
        const res = await fetch(`${API_URL}/api/profiles/servicios-catalogo/`, { next: { revalidate: 300 } });
        if (!res.ok) throw new Error("error servicios");
        const data = await res.json();
        setServiciosCatalogo(data);
      } catch {
        setServiciosCatalogo([]);
      }
    };
    cargarServicios();
  }, [API_URL]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (ciudad) params.set("ciudad", ciudad);
    if (servicio) params.set("servicio", servicio);

    router.push(`/busqueda${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const clearFilters = () => {
    setCiudad("");
    setServicio("");
    router.push("/busqueda");
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#1b101a] p-4 text-white shadow-lg">
      <h3 className="text-lg font-bold mb-2">Filtros</h3>
      <p className="text-xs text-pink-200 mb-4">Refina tu búsqueda</p>

      <div className="space-y-4 text-sm">
        <Select
          label="Ubicación"
          value={ciudad}
          onChange={setCiudad}
          options={ciudades}
        />


        <div className="space-y-2">
          <p className="font-semibold text-pink-100">Tipo de Servicio</p>
          <div className="space-y-1 text-pink-50">
            {serviciosCatalogo.map((s) => (
              <label key={s.id} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="servicio"
                  value={s.id}
                  checked={servicio === String(s.id)}
                  onChange={(e) => setServicio(e.target.value)}
                  className="accent-pink-500"
                />
                {s.nombre}
              </label>
            ))}
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="servicio"
                value=""
                checked={servicio === ""}
                onChange={() => setServicio("")}
                className="accent-pink-500"
              />
              Todos
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={applyFilters}
            className="w-full rounded-full bg-pink-600 py-2 font-semibold text-white hover:bg-pink-700 transition"
          >
            Aplicar filtros
          </button>
          <button
            onClick={clearFilters}
            className="w-full rounded-full border border-white/20 py-2 font-semibold text-pink-50 hover:bg-[color:var(--color-card)/0.05] transition"
          >
            Limpiar
          </button>
        </div>
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div className="space-y-2">
      <p className="font-semibold text-pink-100">{label}</p>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg bg-[#2a1827] border border-white/10 px-3 py-2 pr-8 text-white focus:outline-none"
        >
          <option value="">Todas</option>
          {options.map((opt) => {
            const val = typeof opt === "string" ? opt : opt.value;
            const label = typeof opt === "string" ? opt : opt.label;
            return (
              <option key={val} value={val}>
                {label}
              </option>
            );
          })}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-pink-200">▾</span>
      </div>
    </div>
  );
}
