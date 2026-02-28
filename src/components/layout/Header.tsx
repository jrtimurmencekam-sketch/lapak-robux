'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, Menu, X, UserCircle, ClipboardList, HelpCircle, MessageCircle, Home } from 'lucide-react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navLinks = [
    { label: 'Beranda', href: '/', icon: <Home className="w-4 h-4" /> },
    { label: 'Cari Pesanan', href: '/cek-pesanan', icon: <ClipboardList className="w-4 h-4" /> },
    { label: 'Panduan & FAQ', href: '/panduan-faq', icon: <HelpCircle className="w-4 h-4" /> },
    { label: 'Jual Beli Akun', href: '/accounts', icon: <UserCircle className="w-4 h-4" /> },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-xl border-b border-white/5">
        {/* Row 1: Logo + Search + Actions */}
        <div className="container mx-auto flex items-center justify-between px-4 h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <img src="/logo-lapak-robux.png" alt="Lapak Robux" className="h-10 sm:h-12 w-auto object-contain" />
          </Link>

          {/* Search Bar — Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Cari game atau voucher..."
                className="w-full rounded-xl border border-white/10 bg-surface px-4 py-2.5 pl-11 text-sm text-white placeholder-white/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Toggle */}
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Row 2: Navigation — Desktop */}
        <nav className="hidden lg:block border-t border-white/5 bg-accent/50">
          <div className="container mx-auto px-4 flex items-center justify-between h-10">
            <div className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white/60 hover:text-primary rounded-lg hover:bg-white/5 transition-all"
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Mobile Search Dropdown */}
        {isSearchOpen && (
          <div className="md:hidden px-4 pb-3 border-t border-white/5 bg-background/95">
            <div className="relative mt-3">
              <input
                type="text"
                placeholder="Cari game atau voucher..."
                autoFocus
                className="w-full rounded-xl border border-white/10 bg-surface px-4 py-2.5 pl-11 text-sm text-white placeholder-white/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" 
            onClick={() => setIsMobileMenuOpen(false)} 
          />
          <div className="fixed top-0 right-0 h-full w-72 bg-background border-l border-white/10 z-50 shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <span className="text-sm font-bold text-white">Menu</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="text-white/60 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white/70 hover:text-primary hover:bg-white/5 rounded-xl transition-all"
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </>
  );
}
