import Link from "next/link";
import NavBar from "@/components/NavBar";
import { Scale, FileText, ChevronLeft, Calendar } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ============================================================
// 1. DATA FETCHING
// ============================================================
async function getTerms() {
  try {
    const res = await fetch(`${API_URL}/api/legal/terms/latest/`, {
      next: { revalidate: 300 }, // Cache de 5 minutos
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// ============================================================
// 2. METADATA (SEO DE CONFIANZA)
// ============================================================
export const metadata = {
  title: "Términos y Condiciones de Uso | xscort.cl",
  description: "Reglas de uso, derechos y obligaciones de los usuarios y modelos en xscort.cl. Lee nuestros términos para una experiencia segura.",
  robots: {
    index: true, // Google ama las páginas legales claras
    follow: true,
  },
  alternates: {
    canonical: "https://xscort.cl/terminos",
  },
};

// ============================================================
// 3. PÁGINA VISUAL
// ============================================================
export default async function TerminosPage() {
  const doc = await getTerms();
  
  // Fecha para mostrar vigencia si la API no trae fecha exacta
  const today = new Date().toLocaleDateString('es-CL', { year: 'numeric', month: 'long' });

  return (
    <div className="min-h-screen bg-[#050205] text-white font-montserrat selection:bg-pink-500 selection:text-white">
      
      {/* FONDO SPOTLIGHT */}
      <div className="fixed top-0 left-0 right-0 h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-900/20 via-[#050205] to-[#050205] -z-10 pointer-events-none" />

      {/* NAVBAR (Para mantener la navegación) */}
      <NavBar />

      <main className="pt-32 pb-24 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto">
            
            {/* BOTÓN VOLVER */}
            <div className="mb-8">
                <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
                    <ChevronLeft className="w-4 h-4" /> Volver al Inicio
                </Link>
            </div>

            {/* ENCABEZADO */}
            <div className="mb-12 border-b border-white/10 pb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-bold uppercase tracking-wide mb-4">
                    <Scale className="w-3 h-3" /> Marco Legal
                </div>
                <h1 className="text-4xl md:text-5xl font-bold font-fancy mb-4">
                    Términos y Condiciones
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>Versión: <span className="text-white">{doc?.version || "1.0"}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Actualizado: <span className="text-white">{today}</span></span>
                    </div>
                </div>
            </div>

            {/* CONTENIDO DEL DOCUMENTO */}
            <article className="
                relative overflow-hidden
                bg-[#120912] 
                rounded-2xl 
                border border-white/10 
                p-8 md:p-12
                shadow-2xl shadow-black/50
            ">
                {/* Decoración de fondo */}
                <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-pink-600/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10 prose prose-invert prose-pink max-w-none">
                    <div className="whitespace-pre-wrap leading-relaxed text-gray-300 font-light text-base md:text-lg space-y-4">
                        {doc?.body || (
                            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                                <Scale className="w-12 h-12 mb-4 opacity-20" />
                                <p>Cargando términos de servicio...</p>
                            </div>
                        )}
                    </div>
                </div>
            </article>

            {/* FOOTER DEL DOCUMENTO */}
            <div className="mt-8 text-center">
                <p className="text-xs text-gray-600">
                    xscort.cl actúa únicamente como plataforma de publicidad. No somos agencia ni empleador.
                </p>
            </div>

        </div>
      </main>
    </div>
  );
}