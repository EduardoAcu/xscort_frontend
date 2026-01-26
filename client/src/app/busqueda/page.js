import BusquedaContent from "@/components/BusquedaContent";
import NavBar from "@/components/NavBar";

export const dynamic = 'force-dynamic';

async function getPerfiles(params) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  
  const cleanParams = new URLSearchParams();
  if (params) {
    Object.keys(params).forEach(key => {
      if (params[key]) cleanParams.append(key, String(params[key]));
    });
  }

  try {
    const res = await fetch(`${API_URL}/api/profiles/?${cleanParams.toString()}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || data || [];
  } catch (error) {
    console.error("Error backend:", error);
    return [];
  }
}

// ✅ CORRECCIÓN CRÍTICA: async function + await props.searchParams
export default async function BusquedaPage(props) {
  const searchParams = await props.searchParams; 
  const perfilesIniciales = await getPerfiles(searchParams);

  return (
    <div className="min-h-screen bg-[#120912] text-white font-montserrat">
      <NavBar/>
      <main className="pt-24 px-4 max-w-7xl mx-auto pb-12">
        <h1 className="text-3xl font-black mb-6">Explora Modelos</h1>
        {/* Pasamos los perfiles ya cargados al cliente */}
        <BusquedaContent perfiles={perfilesIniciales} />
      </main>
    </div>
  );
}