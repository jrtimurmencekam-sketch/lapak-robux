import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/kuru/', '/api/', '/checkout'],
      },
    ],
    sitemap: 'https://lapakrobux.com/sitemap.xml',
  };
}
