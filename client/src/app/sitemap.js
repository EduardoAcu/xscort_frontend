const baseUrl = 'https://xscort.cl'

// Rutas públicas y de interés para crawlers
const publicRoutes = [
  { path: '/', changeFrequency: 'daily', priority: 1 },
  { path: '/busqueda', changeFrequency: 'daily', priority: 0.9 },
  { path: '/login', changeFrequency: 'monthly', priority: 0.3 },
  { path: '/register', changeFrequency: 'monthly', priority: 0.3 },
  { path: '/terminos', changeFrequency: 'yearly', priority: 0.1 },
  { path: '/privacidad', changeFrequency: 'yearly', priority: 0.1 },
  { path: '/forgot-password', changeFrequency: 'monthly', priority: 0.2 },
]

const routes = [...publicRoutes, ...panelRoutes]

export default function sitemap() {
  return routes.map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))
}


