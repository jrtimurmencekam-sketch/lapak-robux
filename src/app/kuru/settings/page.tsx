'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Settings, Save, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [waNumber, setWaNumber] = useState('6281234567890');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'whatsapp_number')
        .single();
        
      if (error && error.code !== 'PGRST116') throw error; // ignore no rows error
      
      if (data) {
        setWaNumber(data.value);
      }
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      toast.error('Gagal memuat pengaturan: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waNumber) return toast.error('Nomor WA tidak boleh kosong');
    
    // Validasi awalan 62
    if (!waNumber.startsWith('62')) {
      return toast.error('Nomor WA harus dimulai dengan 62 (contoh: 62812...)');
    }

    setIsSaving(true);
    const toastId = toast.loading('Menyimpan pengaturan...');
    
    try {
      // Upsert karena row mungkin belum ada
      const { error } = await supabase
        .from('site_settings')
        .upsert({ 
          key: 'whatsapp_number', 
          value: waNumber,
          description: 'Nomor WhatsApp Admin untuk tombol floating chat'
        }, { onConflict: 'key' });
        
      if (error) throw error;
      toast.success('Pengaturan berhasil disimpan!', { id: toastId });
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error('Gagal menyimpan: ' + error.message, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-6 text-white/50 animate-pulse">Memuat pengaturan...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">
          <Settings className="w-8 h-8 text-primary" /> Pengaturan Website
        </h1>
        <p className="text-white/40 mt-1 text-sm">Kelola pengaturan umum, kontak admin, dan preferensi toko.</p>
      </div>

      <div className="bg-white/[0.03] border border-white/5 p-6 md:p-8 rounded-3xl shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Info Kontak & Bantuan</h2>
        
        <form onSubmit={handleSave} className="space-y-6 max-w-lg">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">WhatsApp Admin (Tombol Floating)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="h-4 w-4 text-white/40" />
              </div>
              <input
                type="text"
                value={waNumber}
                onChange={(e) => setWaNumber(e.target.value)}
                placeholder="6281234567890"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono"
              />
            </div>
            <p className="text-xs text-white/40 mt-2 ml-1">Gunakan format <strong className="text-white/60">62</strong> sebagai pengganti 0. Contoh: 628123456789</p>
          </div>

          <button 
            type="submit" 
            disabled={isSaving}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 rounded-2xl font-bold hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
               <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
               <Save className="w-5 h-5" />
            )}
            Simpan Pengaturan
          </button>
        </form>
      </div>
    </div>
  );
}
