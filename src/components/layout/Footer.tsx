import Link from 'next/link';
import { Instagram, Facebook, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-[#0a0a0a] pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-x-8 gap-y-12 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2 xl:pr-12">
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo_no_background.png" alt="Lapak Robux" className="w-14 h-14 object-contain drop-shadow-[0_0_15px_rgba(255,215,0,0.4)]" />
              <div className="flex flex-col">
                <h2 className="text-2xl font-black text-white leading-none tracking-tight">LAPAK ROBUX</h2>
                <span className="text-[10px] text-primary font-bold tracking-[0.2em] uppercase mt-1">Sultan Gaming Store</span>
              </div>
            </div>
            <p className="text-white/50 text-sm mb-8 leading-relaxed max-w-sm">
              Platform top up game termurah, tercepat, dan terpercaya se-Indonesia. Penuhi kebutuhan gaming Anda dalam hitungan detik dengan proses otomatis.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/70 hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/70 hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/70 hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Navigasi</h3>
            <ul className="space-y-4">
              <li><Link href="/" className="text-white/50 hover:text-primary hover:translate-x-1 inline-block transition-all text-sm font-medium">Beranda</Link></li>
              <li><Link href="/cek-pesanan" className="text-white/50 hover:text-primary hover:translate-x-1 inline-block transition-all text-sm font-medium">Lacak Pesanan</Link></li>
              <li><Link href="/accounts" className="text-white/50 hover:text-primary hover:translate-x-1 inline-block transition-all text-sm font-medium">Jual Beli Akun VVIP</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Dukungan</h3>
            <ul className="space-y-4">
              <li><Link href="/panduan-faq" className="text-white/50 hover:text-primary hover:translate-x-1 inline-block transition-all text-sm font-medium">Panduan & FAQ</Link></li>
              <li><Link href="/syarat-ketentuan" className="text-white/50 hover:text-primary hover:translate-x-1 inline-block transition-all text-sm font-medium">Syarat & Ketentuan</Link></li>
              <li><Link href="/kebijakan-privasi" className="text-white/50 hover:text-primary hover:translate-x-1 inline-block transition-all text-sm font-medium">Kebijakan Privasi</Link></li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Pembayaran</h3>
            <div className="flex flex-wrap gap-2">
              {['BCA', 'MANDIRI', 'QRIS', 'DANA', 'OVO', 'GOPAY', 'SHOPEE', 'ALFAMART', 'INDOMARET'].map((pm) => (
                <span key={pm} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] sm:text-xs font-bold text-white/70 tracking-wider hover:bg-white/10 transition-colors cursor-default">
                  {pm}
                </span>
              ))}
            </div>
            
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mt-8 mb-4">Kontak</h3>
            <div className="space-y-3">
               <div className="flex items-center gap-3 text-white/50 text-sm">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>support@lapakrobux.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm text-center md:text-left font-medium">
            &copy; {new Date().getFullYear()} Lapak Robux. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               <span className="text-white/40 text-xs font-medium uppercase tracking-wider">Sistem Online 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
