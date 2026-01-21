const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function getTerms() {
  try {
    const res = await fetch(`${API_URL}/api/legal/terms/latest/`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export const metadata = {
  title: "Términos y Condiciones | xscort.cl",
};

export default async function TerminosPage() {
  const doc = await getTerms();
  return (
    <div className="min-h-screen bg-[#120912] text-white px-3 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-10 md:py-12">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">Términos y Condiciones</h1>
        <p className="text-xs sm:text-sm text-pink-200">
          Versión: {doc?.version || "no disponible"}
        </p>
        <div className="rounded-lg sm:rounded-xl lg:rounded-2xl bg-[#1b0d18] border border-white/10 p-4 sm:p-5 md:p-6 whitespace-pre-wrap leading-relaxed text-xs sm:text-sm md:text-base text-pink-50">
          {doc?.body || "Aún no se ha publicado el documento de Términos y Condiciones."}
        </div>
      </div>
    </div>
  );
}
