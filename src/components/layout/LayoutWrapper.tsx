'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import FloatingWhatsApp from '../ui/FloatingWhatsApp';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/kuru');
  const isHideLayout = isAdminPage || pathname === '/cek' || pathname === '/aktivasi';

  return (
    <>
      {!isHideLayout && <Header />}
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>
      {!isHideLayout && (
        <>
          <Footer />
          <FloatingWhatsApp />
        </>
      )}
    </>
  );
}
