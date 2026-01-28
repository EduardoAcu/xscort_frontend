/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración de headers de seguridad
  async headers() {
    return [
      {
        // Aplicar headers a todas las rutas
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // HSTS solo en producción
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          // CSP básico
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // AGREGADO: images.unsplash.com a la CSP para permitir la carga
              "img-src 'self' data: https: http: https://images.unsplash.com", 
              "font-src 'self' https://fonts.gstatic.com data:",
              "connect-src 'self' http://localhost:8000 http://127.0.0.1:8000 https:",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },

  // Configuración de Next/Image
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.26',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        pathname: '/**',
      },
      {
       protocol: 'https',
       hostname: 'api.xscort.cl',
       pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'media.xscort.cl',
        port: '',
        pathname: '/**',
      },
      // --- NUEVO: Permitir Unsplash (Soluciona el Error 400) ---
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**', 
      },
    ],
  },
};

export default nextConfig;