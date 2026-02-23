import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import ToasterProvider from "@/components/ui/ToasterProvider";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

export const metadata: Metadata = {
  title: {
    default: 'LAPAK ROBUX - Top Up Game Termurah & Tercepat',
    template: '%s | LAPAK ROBUX',
  },
  description:
    'Platform top up game termurah, tercepat, dan terpercaya se-Indonesia. Top up Mobile Legends, Free Fire, PUBG Mobile, Genshin Impact & Roblox dalam hitungan detik.',
  keywords: [
    'top up game',
    'top up murah',
    'diamond mobile legends',
    'diamond ml murah',
    'top up free fire',
    'top up pubg',
    'top up genshin impact',
    'robux murah',
    'lapak robux',
    'top up game indonesia',
  ],
  authors: [{ name: 'Lapak Robux', url: 'https://lapakrobux.com' }],
  creator: 'Lapak Robux',
  metadataBase: new URL('https://lapakrobux.com'),
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://lapakrobux.com',
    siteName: 'Lapak Robux',
    title: 'LAPAK ROBUX - Top Up Game Termurah & Tercepat',
    description:
      'Platform top up game termurah, tercepat, dan terpercaya se-Indonesia. Proses otomatis dalam hitungan detik!',
    images: [
      {
        url: '/logo_no_background.png',
        width: 512,
        height: 512,
        alt: 'Lapak Robux Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LAPAK ROBUX - Top Up Game Termurah & Tercepat',
    description:
      'Platform top up game termurah, tercepat, dan terpercaya se-Indonesia.',
    images: ['/logo_no_background.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/logo_head.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ToasterProvider />
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
