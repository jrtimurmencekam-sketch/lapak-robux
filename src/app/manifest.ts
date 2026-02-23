import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Lapak Robux - Top Up Game Termurah',
    short_name: 'Lapak Robux',
    description:
      'Platform top up game termurah, tercepat, dan terpercaya se-Indonesia.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#050505',
    theme_color: '#FFD700',
    icons: [
      {
        src: '/logo_head.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo_no_background.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
