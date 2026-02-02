// src/app/sitemap.js

const baseUrl = 'https://xscort.cl'

// ============================================================
// 1. CONFIGURACIÓN DE RUTAS FIJAS
// ============================================================
const publicRoutes = [
  { path: '/', changeFrequency: 'daily', priority: 1 },
  { path: '/busqueda', changeFrequency: 'daily', priority: 0.8 }, // Bajamos un poco la prioridad de la búsqueda genérica
  { path: '/login', changeFrequency: 'monthly', priority: 0.3 },
  { path: '/register', changeFrequency: 'monthly', priority: 0.3 },
  { path: '/terminos', changeFrequency: 'yearly', priority: 0.1 },
  { path: '/privacidad', changeFrequency: 'yearly', priority: 0.1 },
  { path: '/forgot-password', changeFrequency: 'monthly', priority: 0.2 },
]

// ============================================================
// 2. FUNCIÓN PARA OBTENER DATOS (Copia local para sitemap)
// ============================================================
async function getCiudadesSitemap() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    // Usamos revalidate: 0 aquí para asegurarnos que el sitemap siempre tenga lo último al generarse
    const res = await fetch(`${apiUrl}/api/profiles/ciudades/`, {
      next: { revalidate: 60 }, 
    });
    
    if (!res.ok) return [];
    
    const data = await res.json();
    
    // Protección contra paginación (Igual que en tu page.js)
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.results)) return data.results;
    
    return [];
  } catch (error) {
    console.error("Error sitemap ciudades:", error);
    return [];
  }
}

// ============================================================
// 3. GENERACIÓN DEL SITEMAP
// ============================================================
export default async function sitemap() {
  // A. Generar URLs estáticas
  const staticMap = publicRoutes.map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))

  // B. Generar URLs dinámicas por Ciudad (SEO Local)
  let cityRoutes = [];
  
  try {
    const ciudades = await getCiudadesSitemap();

    cityRoutes = ciudades.map((c) => ({
      // CAMBIO CLAVE PARA SEO: URL LIMPIA
      // Antes: .../busqueda?ciudad=chillan
      // Ahora: .../chillan
      url: `${baseUrl}/${c.slug || c.id}`,
      
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9, // Alta prioridad: Estas son tus páginas de venta principales
    }));
    
  } catch (error) {
    console.error("Error generando rutas de ciudades:", error);
  }

  // C. Unir todo
  return [...staticMap, ...cityRoutes]
}