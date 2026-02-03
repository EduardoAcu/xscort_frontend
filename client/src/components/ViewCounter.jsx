'use client';

import { useEffect } from 'react';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");

export default function ViewCounter({ slug }) {
  useEffect(() => {
    if (!slug) return;

    // "Fire and forget": Enviamos la señal y no esperamos respuesta
    const registrarVisita = async () => {
      try {
        await fetch(`${API_URL}/api/profiles/stats/registrar/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug: slug, tipo: 'vista' })
        });
        console.log("👁️ Visita registrada");
      } catch (error) {
        console.error("Error registrando visita", error);
      }
    };

    registrarVisita();
  }, [slug]);

  return null; // Este componente no renderiza nada visualmente
}