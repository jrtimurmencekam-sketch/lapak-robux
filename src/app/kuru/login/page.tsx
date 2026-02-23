'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Email dan kata sandi wajib diisi');

    setIsLoading(true);
    const toastId = toast.loading('Mengautentikasi...');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        toast.success('Login berhasil! Mengalihkan...', { id: toastId });
        router.replace('/kuru');
      }
    } catch (error: any) {
      console.error('Login error:', error.message);
      toast.error('Gagal login: Periksa kembali kredensial Anda', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-4 border border-primary/30 shadow-[0_0_30px_rgba(255,215,0,0.15)]">
            <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">AREA TERLARANG</h1>
          <p className="text-white/40 text-sm mt-1 text-center">Silakan login untuk mengakses panel kontrol Administrator.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Email Admin</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-white/40" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@lapakrobux.com"
                className="w-full bg-black/50 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-white/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Kata Sandi</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-white/40" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/50 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-white/20"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {isLoading ? (
               <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
               'Masuk ke Panel'
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center border-t border-white/10 pt-6">
          <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-medium">Lapak Robux System</p>
        </div>
      </div>
    </div>
  );
}
