import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin-dashboard/',
        '/dashboard/',
        '/api/',
        '/login',
        '/register',
        '/profile',
        '/admin-login',
      ],
    },
    sitemap: 'https://www.guyanahomehub.com/sitemap.xml',
  }
}
