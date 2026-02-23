/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  // Next 15+ no longer supports eslint in next.config.ts, handled natively
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['192.168.1.5:3000', 'localhost:3000'],
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'zgwlnyjbgkmbfnoaprtc.supabase.co',
      },
    ],
  },
} as const;

export default nextConfig;
