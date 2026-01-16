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
    <div className="min-h-screen bg-[#120912] text-white px-6 sm:px-10 lg:px-16 py-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold">Términos y Condiciones</h1>
        <p className="text-sm text-pink-200">
          Versión: {doc?.version || "no disponible"}
        </p>
        <div className="rounded-2xl bg-[#1b0d18] border border-white/10 p-6 whitespace-pre-wrap leading-relaxed text-pink-50">
          {doc?.body || "Aún no se ha publicado el documento de Términos y Condiciones."}
        </div>
      </div>
    </div>
  );
}
