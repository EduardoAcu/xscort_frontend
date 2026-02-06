"use client";
import { useState, useMemo, useEffect } from "react";
import { PlayCircle } from "lucide-react"; // Necesitas importar el icono

/**
 * Galería con soporte para VIDEO y FOTOS.
 * - Grid de 2 columnas en móvil.
 * - Lightbox con soporte para reproductor de video.
 */
export default function GaleriaPublica({ fotos = [] }) {
  const items = useMemo(
    () =>
      (fotos || []).map((f) => ({
        id: f.id || f, // Manejo robusto si f es string u objeto
        src: typeof f === 'string' ? f : f.url || f.src,
      })),
    [fotos]
  );

  const [openIndex, setOpenIndex] = useState(null);
  const [touchStart, setTouchStart] = useState(null);

  // Detectar si es video por la extensión
  const isVideo = (src) => {
    if (!src) return false;
    return src.toLowerCase().match(/\.(mp4|webm|mov)$/);
  };

  const open = (idx) => setOpenIndex(idx);
  const close = () => setOpenIndex(null);
  
  const prev = () =>
    setOpenIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length));
    
  const next = () =>
    setOpenIndex((i) => (i === null ? null : (i + 1) % items.length));

  // --- Lógica de Teclado ---
  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, items.length]);

  // --- Lógica Touch (Swipe) ---
  const onTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touchStart === null) return;
    const delta = e.changedTouches[0].clientX - touchStart;
    const threshold = 40;
    if (delta > threshold) prev();
    if (delta < -threshold) next();
    setTouchStart(null);
  };

  if (!items.length) {
    return (
        <div className="text-center py-10 border border-dashed border-white/10 rounded-xl">
            <p className="text-gray-500 text-sm">Aún no hay fotos públicas.</p>
        </div>
    );
  }

  return (
    <>
      {/* CAMBIO REALIZADO AQUÍ: 
        grid-cols-2 (Móvil) -> md:grid-cols-3 (Tablet) -> lg:grid-cols-4 (PC)
      */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
        {items.map((f, idx) => {
          const esVideo = isVideo(f.src);

          return (
            <button
              key={f.id ?? idx}
              onClick={() => open(idx)}
              className="relative overflow-hidden border border-white/10 bg-white/5 aspect-[3/4] group rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              {esVideo ? (
                // MINIATURA DE VIDEO
                <div className="relative w-full h-full">
                    <video
                        src={f.src}
                        className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition duration-300"
                        muted
                        loop
                        playsInline
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <PlayCircle className="w-10 h-10 text-white/90 drop-shadow-lg" />
                    </div>
                </div>
              ) : (
                // MINIATURA DE FOTO
                <img
                    src={f.src}
                    alt={`Foto ${idx + 1}`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                />
              )}
              
              {/* Overlay hover */}
              <span className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition" />
            </button>
          );
        })}
      </div>

      {/* LIGHTBOX (PANTALLA COMPLETA) */}
      {openIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center px-4"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          {/* Botón Cerrar */}
          <button
            onClick={close}
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 rounded-full p-2 transition z-50"
            aria-label="Cerrar"
          >
            <span className="text-2xl leading-none">×</span>
          </button>

          {/* Flecha Izquierda */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-2 md:left-4 text-white/70 hover:text-white text-3xl p-2 rounded-full hover:bg-white/10 transition z-50"
          >
            ‹
          </button>

          {/* CONTENIDO PRINCIPAL (VIDEO O FOTO) */}
          <div className="relative max-h-[90vh] max-w-[95vw] w-full flex justify-center">
              {isVideo(items[openIndex].src) ? (
                  <video
                    src={items[openIndex].src}
                    controls
                    autoPlay
                    playsInline
                    className="max-h-[85vh] max-w-full rounded shadow-2xl border border-white/10 bg-black"
                  />
              ) : (
                  <img
                    src={items[openIndex].src}
                    alt={`Foto ${openIndex + 1}`}
                    className="max-h-[85vh] max-w-full object-contain rounded shadow-2xl"
                  />
              )}
          </div>

          {/* Flecha Derecha */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-2 md:right-4 text-white/70 hover:text-white text-3xl p-2 rounded-full hover:bg-white/10 transition z-50"
          >
            ›
          </button>
          
          {/* Contador (Opcional) */}
          <div className="absolute bottom-5 text-white/50 text-xs font-mono tracking-widest">
            {openIndex + 1} / {items.length}
          </div>
        </div>
      )}
    </>
  );
}