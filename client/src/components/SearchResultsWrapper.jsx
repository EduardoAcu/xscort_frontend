"use client";
import { Suspense } from "react";
import GridResultados from "./GridResultados";

export default function SearchResultsWrapper() {
  return (
    <Suspense fallback={<div className="text-center py-8 text-white">Cargando resultados...</div>}>
      <GridResultados />
    </Suspense>
  );
}
