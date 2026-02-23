import Link from 'next/link';
import { Home, Search, ArrowLeft, Gamepad2 } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        {/* Icon */}
        <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-8 shadow-[0_0_60px_rgba(255,215,0,0.1)]">
          <Gamepad2 className="w-12 h-12 text-primary" />
        </div>

        {/* Error Code */}
        <h1 className="text-8xl md:text-9xl font-black text-white/10 leading-none tracking-tighter select-none mb-2">
          404
        </h1>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-3">
          Halaman Tidak Ditemukan
        </h2>

        {/* Description */}
        <p className="text-white/40 text-sm leading-relaxed mb-10 max-w-sm">
          Yahhh, sepertinya halaman yang Anda cari sudah pindah server, atau mungkin belum pernah ada. Jangan khawatir, diamond Anda tetap aman! 💎
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-2xl font-bold text-sm hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
          >
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
          <Link
            href="/cek-pesanan"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white px-8 py-3.5 rounded-2xl font-bold text-sm hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
          >
            <Search className="w-4 h-4" />
            Cek Pesanan
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-white/10 w-full">
          <p className="text-white/30 text-xs uppercase tracking-widest font-medium mb-4">Mungkin Anda mencari...</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: 'Top Up Game', href: '/' },
              { label: 'Panduan & FAQ', href: '/panduan-faq' },
              { label: 'Lacak Pesanan', href: '/cek-pesanan' },
              { label: 'Jual Beli Akun', href: '/accounts' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white/50 hover:text-primary hover:border-primary/30 transition-all font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
