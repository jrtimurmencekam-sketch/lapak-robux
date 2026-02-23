'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, Menu, X, Layers, ChevronRight, CreditCard, ImageIcon, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', href: '/kuru', icon: LayoutDashboard },
    { label: 'Manajemen Banner', href: '/kuru/banners', icon: ImageIcon },
    { label: 'Akun MLBB', href: '/kuru/accounts', icon: ShieldCheck },
    { label: 'Produk Game', href: '/kuru/products', icon: Package },
    { label: 'Kategori', href: '/kuru/categories', icon: Layers },
    { label: 'Data Pesanan', href: '/kuru/orders', icon: ShoppingCart },
    { label: 'Pembayaran', href: '/kuru/payment-methods', icon: CreditCard },
    { label: 'Manajemen User', href: '/kuru/users', icon: Users },
    { label: 'Pengaturan', href: '/kuru/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Header Bar - More Premium */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-background/60 backdrop-blur-xl border-b border-white/5 z-[60] flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <img src="/logo_no_background.png" alt="Lapak Robux" className="w-8 h-8 object-contain" />
          <span className="font-bold text-white tracking-tight">ADMIN PANEL</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2.5 text-white/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all active:scale-90"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/80 z-[70] backdrop-blur-md"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile Drawer */}
      <aside className={`
        fixed top-0 left-0 h-screen w-72 bg-[#0a0a0a]/80 backdrop-blur-2xl border-r border-white/5 z-[80] flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand/Logo Section */}
        <div className="p-8 pb-10">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/logo_no_background.png" alt="Lapak Robux" className="w-14 h-14 object-contain drop-shadow-[0_0_15px_rgba(255,215,0,0.4)]" />
            <div className="flex flex-col">
              <span className="font-black text-white leading-none tracking-tighter text-xl">LAPAK ROBUX</span>
              <span className="text-[10px] font-bold text-primary tracking-[0.2em] mt-1 opacity-80">ADMINISTRATOR</span>
            </div>
          </Link>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 px-4 overflow-y-auto custom-scrollbar">
          <div className="mb-4 px-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Navigasi Utama</div>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between group px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary text-primary-foreground font-bold shadow-2xl shadow-primary/20' 
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-primary-foreground' : 'text-primary/70'}`} />
                    <span className="text-sm tracking-tight">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User/Account Section at Bottom */}
        <div className="p-6 mt-auto border-t border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white/40">
              <Users className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white leading-none">Admin</span>
              <span className="text-[10px] text-white/40 mt-1">Super Admin</span>
            </div>
          </div>
          <button 
            onClick={async () => {
              await supabase.auth.signOut();
              // The AdminAuthProxy will auto-redirect us to /kuru/login
            }}
            className="flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-red-500 text-white font-bold bg-red-500/10 w-full transition-all duration-300 group active:scale-95"
          >
            <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm">Keluar Sesi</span>
          </button>
        </div>
      </aside>
    </>
  );
}
