import Link from 'next/link';
import { Gamepad2, CreditCard, Ticket, Smartphone, ShieldCheck } from 'lucide-react';

export default function CategoryNav() {
  const categories = [
    { name: 'Top Up Game', icon: <Gamepad2 className="w-5 h-5 mb-1 text-primary" />, href: '/#games' },
    { name: 'Voucher', icon: <Ticket className="w-5 h-5 mb-1 text-white/70" />, href: '/voucher' },
    { name: 'Pulsa & Data', icon: <Smartphone className="w-5 h-5 mb-1 text-white/70" />, href: '/pulsa-data' },
    { name: 'Tagihan PLN', icon: <CreditCard className="w-5 h-5 mb-1 text-white/70" />, href: '/pln' },
    { name: 'Beli Akun', icon: <ShieldCheck className="w-5 h-5 mb-1 text-white/70" />, href: '/accounts' },
  ];

  return (
    <nav className="w-full border-b border-white/5 bg-accent/30 py-4 px-2 overflow-x-auto scrollbar-hide">
      <div className="container mx-auto flex sm:justify-center gap-6 sm:gap-12 min-w-max px-4">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={category.href}
            className="flex flex-col items-center justify-center group opacity-80 hover:opacity-100 transition-opacity min-w-[80px]"
          >
            <div className="p-3 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors">
              {category.icon}
            </div>
            <span className="text-xs font-medium text-white/80 mt-2 whitespace-nowrap">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

