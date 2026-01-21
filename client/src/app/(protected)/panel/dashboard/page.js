"use client";
import { useState } from "react";
import WidgetSuscripcion from "@/components/WidgetSuscripcion";

export default function DashboardPage() {
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const handleSuscripcionUpdate = () => {
    setUpdateTrigger((prev) => prev + 1);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="mb-2 sm:mb-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight font-fancy">Dashboard</h1>
        <p className="mt-1 sm:mt-2 text-xs sm:text-sm md:text-base text-gray-300 font-montserrat">
          Bienvenida de nuevo. Aquí tienes un resumen de tu actividad.
        </p>
      </header>

      <section className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <WidgetSuscripcion key={updateTrigger} onUpdate={handleSuscripcionUpdate} />
      </section>
    </div>
  );
}
