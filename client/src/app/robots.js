// src/app/robots.js (o .ts)

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',      // Ahorra recursos, Google no necesita JSON
          '/panel/',    // Evita errores 403/401 en Search Console
          '/admin/',    // Seguridad básica
          '/private/',
          '/_next/',    // Opcional: A veces se bloquea la caché interna de Next
        ],
      },
    ],
    sitemap: 'https://xscort.cl/sitemap.xml',
    host: 'https://xscort.cl', // Ayuda a consolidar la autoridad del dominio
  }
}