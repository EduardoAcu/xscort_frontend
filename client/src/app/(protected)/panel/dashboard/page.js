"use client";
import { useState } from "react";
import WidgetSuscripcion from "@/components/WidgetSuscripcion";

export default function DashboardPage() {
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const handleSuscripcionUpdate = () => {
    setUpdateTrigger((prev) => prev + 1);
  };

  return (
    <div className="space-y-8">
      <header className="mb-2">
        <h1 className="text-4xl font-extrabold tracking-tight font-fancy">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-300 font-montserrat">
          Bienvenida de nuevo. Aquí tienes un resumen de tu actividad.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <WidgetSuscripcion key={updateTrigger} onUpdate={handleSuscripcionUpdate} />
      </section>
    </div>
  );
}
