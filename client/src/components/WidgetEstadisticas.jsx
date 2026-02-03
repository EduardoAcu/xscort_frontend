"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import api from "@/lib/api";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Eye, MousePointerClick, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Activity 
} from "lucide-react";

// --- CONSTANTES DE DISEÑO ---
const COLORS = {
  pink: "#ec4899",     // Color Primario (Vistas)
  pinkFade: "#ec4899", 
  green: "#22c55e",    // Color Secundario (WhatsApp)
  greenFade: "#22c55e",
  grid: "#333333",
  text: "#9ca3af"
};

// --- HELPERS ---
function formatNumber(n) {
  return new Intl.NumberFormat('es-CL').format(n);
}

function formatDateFull(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString('es-CL', { 
    weekday: 'long', day: 'numeric', month: 'long' 
  });
}

// Hook de animación de números (CountUp)
function useCountUp(value, duration = 800) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef();
  
  useEffect(() => {
    let start;
    const from = display; // Animar desde el valor actual
    const to = value;
    
    if (from === to) return;

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // Easing function: easeOutQuart
      const ease = 1 - Math.pow(1 - progress, 4); 
      
      setDisplay(Math.round(from + (to - from) * ease));
      
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]); // eslint-disable-line react-hooks/exhaustive-deps

  return display;
}

// --- SUB-COMPONENTES ---

const MiniSparkline = ({ data, dataKey, color }) => {
  if (!data || data.length === 0) return null;
  return (
    <div className="w-full h-12 mt-2 opacity-80 hover:opacity-100 transition-opacity">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`mini-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.4}/>
              <stop offset="100%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            strokeWidth={2} 
            fill={`url(#mini-${dataKey})`} 
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label, data }) => {
  if (!active || !payload || payload.length === 0) return null;

  // Encontrar el objeto de datos original para obtener la fecha completa
  const currentItem = data?.find(item => item.fechaCorta === label);
  const fullDate = currentItem ? formatDateFull(currentItem.fecha) : label;

  return (
    <div className="bg-[#0a0a0a]/90 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl min-w-[180px]">
      <div className="text-xs font-medium text-gray-400 mb-3 capitalize border-b border-white/5 pb-2">
        {fullDate}
      </div>
      <div className="flex flex-col gap-2">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span 
                className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" 
                style={{ backgroundColor: entry.color, color: entry.color }} 
              /> 
              <span className="text-sm text-gray-200 font-medium">{entry.name}</span>
            </div>
            <span className="text-sm font-bold text-white tabular-nums">
              {formatNumber(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---

export default function WidgetEstadisticas() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metric, setMetric] = useState('both'); // 'both' | 'vistas' | 'clicks'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/api/profiles/stats/mis-datos/");
        const stats = res.data || [];
        
        // Ordenar y Formatear
        const sortedData = stats.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
        const formatted = sortedData.map(item => ({
          ...item,
          // Usamos fechaCorta para el eje X
          fechaCorta: new Date(item.fecha).toLocaleDateString('es-CL', { day: '2-digit', month: 'short' }),
          fechaObj: new Date(item.fecha),
        }));
        
        setData(formatted);
      } catch (err) {
        console.error("Error cargando estadísticas", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Cálculos de Totales
  const totals = useMemo(() => {
    return data.reduce((acc, cur) => {
      acc.vistas += cur.vistas_perfil || 0;
      acc.clicks += cur.clicks_whatsapp || 0;
      return acc;
    }, { vistas: 0, clicks: 0 });
  }, [data]);

  // Cálculo de Tendencias (Comparativa Semanal)
  const changes = useMemo(() => {
    if (!data || data.length === 0) return { vistas: 0, clicks: 0 };
    
    // Si hay menos de 14 días, comparamos la primera mitad con la segunda
    const sliceSize = Math.min(7, Math.floor(data.length / 2));
    if (sliceSize === 0) return { vistas: 0, clicks: 0 };

    const lastPeriod = data.slice(-sliceSize);
    const prevPeriod = data.slice(-sliceSize * 2, -sliceSize);

    const sum = (arr, key) => arr.reduce((a, b) => a + (b[key] || 0), 0);
    
    const calcPct = (prev, curr) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return Math.round(((curr - prev) / prev) * 100);
    };

    return {
      vistas: calcPct(sum(prevPeriod, 'vistas_perfil'), sum(lastPeriod, 'vistas_perfil')),
      clicks: calcPct(sum(prevPeriod, 'clicks_whatsapp'), sum(lastPeriod, 'clicks_whatsapp'))
    };
  }, [data]);

  // Animación de números
  const vistasCount = useCountUp(totals.vistas);
  const clicksCount = useCountUp(totals.clicks);

  // --- ESTADOS DE CARGA / VACÍO ---
  
  if (loading) {
    return (
      <div className="bg-[#120912] border border-white/10 rounded-2xl p-6 h-[400px] animate-pulse relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-shimmer" />
        <div className="flex justify-between mb-8">
          <div className="h-8 w-48 bg-white/5 rounded-lg" />
          <div className="h-8 w-32 bg-white/5 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="h-24 bg-white/5 rounded-xl" />
          <div className="h-24 bg-white/5 rounded-xl" />
        </div>
        <div className="h-40 bg-white/5 rounded-xl w-full" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-[#120912] border border-white/10 rounded-2xl p-10 col-span-1 lg:col-span-2 text-center flex flex-col items-center justify-center h-[400px]">
         <div className="bg-white/5 p-4 rounded-full mb-4">
            <Activity className="w-8 h-8 text-gray-500" />
         </div>
         <h3 className="text-white font-bold text-xl mb-2">Sin actividad reciente</h3>
         <p className="text-gray-400 text-sm max-w-xs mx-auto">
            Tus estadísticas aparecerán aquí en cuanto los usuarios comiencen a interactuar con tu perfil.
         </p>
      </div>
    );
  }

  // --- RENDERIZADO PRINCIPAL ---

  return (
    <div className="bg-[#120912] border border-white/10 rounded-2xl p-6 lg:p-8 col-span-1 lg:col-span-2 shadow-2xl relative overflow-hidden">
      {/* Glow Effect Background */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-pink-600/5 blur-[100px] rounded-full pointer-events-none" />

      {/* HEADER: Título y Filtros */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 relative z-10">
        <div>
          <h3 className="text-pink-500 font-bold uppercase tracking-widest text-xs mb-1 flex items-center gap-2">
            <TrendingUp className="w-3 h-3" /> Rendimiento
          </h3>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-montserrat tracking-tight">
            Estadísticas
          </h2>
          <p className="text-gray-500 text-xs mt-1 font-medium">Últimos 30 días</p>
        </div>

        {/* Segmented Control (Tabs) */}
        <div className="bg-white/5 p-1 rounded-xl flex items-center self-start lg:self-auto border border-white/5">
          {[
            { id: 'both', label: 'General' },
            { id: 'vistas', label: 'Vistas' },
            { id: 'clicks', label: 'WhatsApp' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMetric(tab.id)}
              className={`
                px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300
                ${metric === tab.id 
                  ? 'bg-white/10 text-white shadow-sm border border-white/10' 
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* BODY: Tarjetas KPI y Gráfico */}
      <div className="flex flex-col lg:flex-row gap-6 relative z-10">
        
        {/* COLUMNA IZQUIERDA: Tarjetas de Resumen (KPIs) */}
        <div className="flex flex-row lg:flex-col gap-4 lg:w-[240px] shrink-0">
          
          {/* Tarjeta VISTAS */}
          <div className={`
            flex-1 bg-gradient-to-b from-white/5 to-transparent border border-white/5 rounded-2xl p-5 
            transition-all duration-300 group hover:border-pink-500/30
            ${metric === 'clicks' ? 'opacity-40 grayscale' : 'opacity-100'}
          `}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-pink-400 bg-pink-500/10 px-2 py-1 rounded-md">
                <Eye className="w-3 h-3" /> Vistas
              </div>
              <div className={`flex items-center gap-0.5 text-xs font-bold ${changes.vistas >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {changes.vistas >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(changes.vistas)}%
              </div>
            </div>
            <div className="text-3xl font-black text-white tracking-tight mb-1">
              {formatNumber(vistasCount)}
            </div>
            <MiniSparkline data={data.slice(-14)} dataKey="vistas_perfil" color={COLORS.pink} />
          </div>

          {/* Tarjeta WHATSAPP */}
          <div className={`
            flex-1 bg-gradient-to-b from-green-500/5 to-transparent border border-green-500/10 rounded-2xl p-5 
            transition-all duration-300 group hover:border-green-500/30
            ${metric === 'vistas' ? 'opacity-40 grayscale' : 'opacity-100'}
          `}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-green-400 bg-green-500/10 px-2 py-1 rounded-md">
                <MousePointerClick className="w-3 h-3" /> Whatsapp
              </div>
              <div className={`flex items-center gap-0.5 text-xs font-bold ${changes.clicks >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {changes.clicks >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(changes.clicks)}%
              </div>
            </div>
            <div className="text-3xl font-black text-white tracking-tight mb-1">
              {formatNumber(clicksCount)}
            </div>
            <MiniSparkline data={data.slice(-14)} dataKey="clicks_whatsapp" color={COLORS.green} />
          </div>
        </div>

        {/* COLUMNA DERECHA: Gráfico Principal */}
        <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-2xl p-4 min-h-[300px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVistas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.pink} stopOpacity={0.4}/>
                  <stop offset="100%" stopColor={COLORS.pink} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.green} stopOpacity={0.4}/>
                  <stop offset="100%" stopColor={COLORS.green} stopOpacity={0}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} opacity={0.5} />
              
              <XAxis 
                dataKey="fechaCorta" 
                stroke="transparent"
                tick={{fill: '#666', fontSize: 11, fontWeight: 600}} 
                tickMargin={10}
                minTickGap={30}
              />
              <YAxis 
                stroke="transparent"
                tick={{fill: '#666', fontSize: 11, fontWeight: 600}} 
                tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(1)}k` : val}
              />
              
              <Tooltip content={<CustomTooltip data={data} />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }} />

              {(metric === 'both' || metric === 'vistas') && (
                <Area 
                  type="monotone" 
                  dataKey="vistas_perfil" 
                  name="Visitas Perfil"
                  stroke={COLORS.pink} 
                  strokeWidth={3}
                  fill="url(#colorVistas)" 
                  animationDuration={1500}
                />
              )}

              {(metric === 'both' || metric === 'clicks') && (
                <Area 
                  type="monotone" 
                  dataKey="clicks_whatsapp" 
                  name="Clicks WhatsApp"
                  stroke={COLORS.green} 
                  strokeWidth={3}
                  fill="url(#colorClicks)" 
                  animationDuration={1500}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}