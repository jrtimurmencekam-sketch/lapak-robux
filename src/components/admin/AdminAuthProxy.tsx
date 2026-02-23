'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminAuthProxy({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      // Allow access to login page
      if (pathname === '/kuru/login') {
        setIsLoading(false);
        return;
      }

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          // No active session, proxy redirect to login
          router.replace('/kuru/login');
        } else {
          // Success
          if (mounted) setIsLoading(false);
        }
      } catch (_) {
        router.replace('/kuru/login');
      }
    }

    checkAuth();

    // Listen to auth changes (e.g., logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, _session) => {
        if (event === 'SIGNED_OUT' && pathname !== '/kuru/login') {
          router.replace('/kuru/login');
        } else if (event === 'SIGNED_IN' && pathname === '/kuru/login') {
          router.replace('/kuru');
        }
      }
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#050505] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-white/50 animate-pulse font-medium text-sm tracking-wider">MENGOTENTIKASI...</p>
      </div>
    );
  }

  if (pathname === '/kuru/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen w-full bg-[#050505]">
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-72 p-4 md:p-10 pt-24 md:pt-10 w-full min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
