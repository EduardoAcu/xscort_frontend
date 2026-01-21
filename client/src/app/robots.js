export default function robots() {
  return {
    // rules es un array para soportar múltiples userAgents si hace falta
    rules: [
      {
        userAgent: '*',
        // Permitir el contenido público
        allow: '/',
        // Bloquear recursos internos, APIs y paneles/protected
        disallow: [
          '/api/',      // endpoints REST
          '/_next/',    // assets y runtime de Next.js
          '/static/',   // assets estáticos
          '/panel/',    // paneles de usuario (protegidos)
          '/admin/',    // admin del backend
          '/private/',  // carpeta de ejemplo privada
        ],
      },
    ],
    sitemap: 'https://xscort.cl/sitemap.xml',
  }
}