export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/panel/',
          '/admin/',
          '/private/',
          '/_next/',
        ],
      },
      {
        userAgent: ['GPTBot', 'Google-Extended', 'CCBot', 'ClaudeBot'],
        disallow: '/',
      },
    ],
    sitemap: 'https://xscort.cl/sitemap.xml',
    host: 'https://xscort.cl',
  }
}