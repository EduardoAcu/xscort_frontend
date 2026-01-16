"use client";
import { useState, useMemo, useEffect } from "react";

/**
 * Galería con lightbox tipo fancybox para el perfil público.
 * - Miniaturas cuadradas.
 * - Al hacer click, muestra overlay a pantalla completa con navegación básica.
 */
export default function GaleriaPublica({ fotos = [] }) {
  const items = useMemo(
    () =>
      (fotos || []).map((f) => ({
        id: f.id,
        src: f,
      })),
    [fotos]
  );

  const [openIndex, setOpenIndex] = useState(null);
  const [touchStart, setTouchStart] = useState(null);

  const open = (idx) => setOpenIndex(idx);
  const close = () => setOpenIndex(null);
  const prev = () =>
    setOpenIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length));
  const next = () =>
    setOpenIndex((i) => (i === null ? null : (i + 1) % items.length));

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
    return <p className="text-pink-100/80">Aún no hay fotos públicas.</p>;
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((f, idx) => (
          <button
            key={f.id ?? idx}
            onClick={() => open(idx)}
            className="relative overflow-hidden border border-white/10 bg-[color:var(--color-card)/0.05] aspect-square group rounded-lg shadow-md hover:shadow-lg transition"
          >
            <img
              src={f.src}
              alt={`Foto ${idx + 1}`}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <span className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition" />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center px-4"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <button
            onClick={close}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl"
            aria-label="Cerrar"
          >
            ×
          </button>
          <button
            onClick={prev}
            className="absolute left-4 text-white/80 hover:text-white text-3xl px-3 py-2 rounded-full bg-[color:var(--color-card)/0.1] hover:bg-[color:var(--color-card)/0.2]"
            aria-label="Anterior"
          >
            ‹
          </button>
          <img
            src={items[openIndex].src}
            alt={`Foto ${openIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl"
          />
          <button
            onClick={next}
            className="absolute right-4 text-white/80 hover:text-white text-3xl px-3 py-2 rounded-full bg-[color:var(--color-card)/0.1] hover:bg-[color:var(--color-card)/0.2]"
            aria-label="Siguiente"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
