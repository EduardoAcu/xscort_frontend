// src/app/sitemap.js

const baseUrl = 'https://xscort.cl'
// CAMBIO AQUÍ: Pon tu dominio real de la API como fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.xscort.cl";

// 1. RUTAS FIJAS
const publicRoutes = [
  { path: '/', changeFrequency: 'daily', priority: 1.0 },
  { path: '/busqueda', changeFrequency: 'daily', priority: 0.8 },
  { path: '/login', changeFrequency: 'monthly', priority: 0.3 },
  { path: '/register', changeFrequency: 'monthly', priority: 0.3 }, 
  { path: '/terminos', changeFrequency: 'yearly', priority: 0.1 },
  { path: '/privacidad', changeFrequency: 'yearly', priority: 0.1 },
]

// 2. FETCH CIUDADES (Tu código)
async function getCiudadesSitemap() {
  try {
    const res = await fetch(`${API_URL}/api/profiles/ciudades/`, {
      next: { revalidate: 3600 }, // Cache 1 hora
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.results)) return data.results;
    return [];
  } catch (error) {
    console.error("Error sitemap ciudades:", error);
    return [];
  }
}

// 3. FETCH PERFILES (¡Nuevo y Crítico!)
async function getPerfilesSitemap() {
  try {
    // Este es el endpoint ligero que creamos en el paso anterior
    const res = await fetch(`${API_URL}/api/profiles/sitemap/`, {
      next: { revalidate: 600 }, // Cache 10 min (para indexar rápido a las nuevas)
    });
    
    if (!res.ok) return [];
    
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error sitemap perfiles:", error);
    return [];
  }
}

// 4. GENERACIÓN MAESTRA
export default async function sitemap() {
  // A. Estáticas
  const staticMap = publicRoutes.map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))

  // B. Ciudades
  let cityRoutes = [];
  try {
    const ciudades = await getCiudadesSitemap();
    cityRoutes = ciudades.map((c) => ({
      // Asegúrate de que esta URL exista en tu front (ej: src/app/[ciudad]/page.js)
      url: `${baseUrl}/${c.slug || c.nombre.toLowerCase().replace(/ /g, '-')}`, 
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    }));
  } catch (e) { console.error(e) }

  // C. Perfiles (Lo que te faltaba)
  let profileRoutes = [];
  try {
    const perfiles = await getPerfilesSitemap();
    profileRoutes = perfiles.map((p) => ({
      url: `${baseUrl}/perfil/${p.slug}`, // La URL donde vive el perfil
      lastModified: new Date(p.updated_at || new Date()),
      changeFrequency: 'daily',
      priority: 1.0, // Máxima prioridad, esto es lo que vende
    }));
  } catch (e) { console.error(e) }

  // D. Retornar TODO junto
  return [...staticMap, ...cityRoutes, ...profileRoutes];
}