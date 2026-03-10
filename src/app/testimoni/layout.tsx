import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Testimoni Pelanggan - Lapak Robux',
  description:
    'Baca testimoni pelanggan Lapak Robux! Rating 4.9/5 dari 50+ ulasan. Top up game termurah, tercepat, dan terpercaya se-Indonesia. Mobile Legends, Free Fire, Roblox, PUBG, Genshin Impact.',
  openGraph: {
    title: '⭐ Testimoni Pelanggan Lapak Robux - Rating 4.9/5',
    description:
      '50+ ulasan pelanggan puas! Top up game termurah & tercepat. Lihat sendiri bukti kepuasan pelanggan kami.',
    url: 'https://lapakrobux.com/testimoni',
    siteName: 'Lapak Robux',
    images: [
      {
        url: '/logo_no_background.png',
        width: 512,
        height: 512,
        alt: 'Lapak Robux - Testimoni Pelanggan',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '⭐ Testimoni Pelanggan Lapak Robux - Rating 4.9/5',
    description:
      '50+ ulasan pelanggan puas! Top up game termurah & tercepat.',
    images: ['/logo_no_background.png'],
  },
};

export default function TestimoniLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
