'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Edit2, Trash2, XCircle, LayoutGrid, LayoutList } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ name: '', slug: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      console.error(error);
      toast.error('Gagal memuat kategori: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (cat?: any) => {
    if (cat) {
      setEditingId(cat.id);
      setFormData({ name: cat.name, slug: cat.slug });
    } else {
      setEditingId(null);
      setFormData({ name: '', slug: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading(editingId ? 'Menyimpan...' : 'Menambahkan...');
    try {
      if (editingId) {
        const { error } = await supabase.from('categories').update(formData).eq('id', editingId);
        if (error) throw error;
        toast.success('Kategori berhasil diupdate!', { id: loadingToast });
      } else {
        const { error } = await supabase.from('categories').insert([formData]);
        if (error) throw error;
        toast.success('Kategori berhasil ditambahkan!', { id: loadingToast });
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error: any) {
      console.error(error);
      toast.error(`Gagal menyimpan: ${error.message}`, { id: loadingToast });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus kategori ini? Semua produk di dalamnya mungkin akan terpengaruh.')) return;
    const loadingToast = toast.loading('Menghapus...');
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      toast.success('Kategori berhasil dihapus', { id: loadingToast });
      fetchCategories();
    } catch (error: any) {
      console.error(error);
      toast.error(`Gagal menghapus: ${error.message}`, { id: loadingToast });
    }
  };

  if (isLoading) {
    return <div className="animate-pulse text-white/50 p-6">Memuat data kategori...</div>;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <LayoutGrid className="w-8 h-8 text-primary" />
            Kategori Produk
          </h1>
          <p className="text-white/40 mt-1 text-sm">Atur pengelompokan produk dan game Anda.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20 text-sm w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" /> Tambah Kategori
        </button>
      </div>

      {/* Cards Grid */}
      {categories.length === 0 ? (
        <div className="text-center py-20 text-white/40 bg-white/[0.02] border border-white/5 rounded-3xl">
          <LayoutList className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-semibold">Belum ada kategori.</p>
          <p className="text-sm">Klik "Tambah Kategori" untuk membuat grup produk pertama Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 sm:p-6 relative overflow-hidden transition-all duration-300 hover:border-primary/30 group flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-black text-white mb-2 line-clamp-2">{cat.name}</h3>
                <div className="text-xs font-mono text-primary bg-primary/10 inline-block px-2.5 py-1 rounded-md border border-primary/20 break-all">
                  /{cat.slug}
                </div>
              </div>

              <div className="flex gap-2 pt-5 mt-5 border-t border-white/5">
                <button 
                  onClick={() => handleOpenModal(cat)} 
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(cat.id)} 
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0f1115] border border-white/10 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative my-auto">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-xl"
            >
              <XCircle className="w-5 h-5" />
            </button>
            
            <h2 className="text-2xl font-black text-white mb-2">
              {editingId ? 'Edit Kategori' : 'Tambah Kategori'}
            </h2>
            <p className="text-white/40 text-sm mb-6 font-medium border-b border-white/10 pb-6">Buat pengelompokan produk yang lebih rapi.</p>
            
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-white/70 mb-2">Nama Kategori</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                    setFormData({ name, slug });
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/30 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                  placeholder="Contoh: Mobile Legends"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-white/70 mb-2">Slug (URL)</label>
                <input 
                  type="text" 
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white/60 font-mono text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                  placeholder="contoh: mobile-legends"
                />
              </div>
              
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="w-full py-3.5 font-semibold text-white/60 hover:text-white hover:bg-white/5 rounded-2xl transition-colors order-2 sm:order-1"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 transition-all hover:scale-[1.01] active:scale-95 shadow-lg shadow-primary/20 text-sm order-1 sm:order-2"
                >
                  {editingId ? 'Simpan Perubahan' : 'Tambah Kategori'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
