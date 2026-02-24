import Link from 'next/link';
import { Search, Menu, UserCircle } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
            <img src="/logo-lapak-robux.png" alt="Lapak Robux" className="h-10 sm:h-12 w-auto object-contain drop-shadow-[0_0_10px_rgba(255,215,0,0.4)]" />
          </Link>
        </div>

        {/* Search Bar (Hidden on very small screens) */}
        <div className="hidden md:flex flex-1 max-w-sm mx-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Cari game atau voucher..."
              className="w-full rounded-full border border-white/20 bg-white/5 px-4 py-2 pl-10 text-sm text-white placeholder-white/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <button className="md:hidden text-white/80 hover:text-white p-2">
            <Search className="h-5 w-5" />
          </button>
          
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
          >
            <UserCircle className="h-5 w-5" />
            <span className="hidden sm:block">Masuk</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button className="sm:hidden text-white/80 hover:text-white p-2">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
