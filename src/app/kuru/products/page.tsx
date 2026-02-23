'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Edit2, Trash2, XCircle, Gamepad2, ToggleLeft, ToggleRight, FolderTree } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    image_url: '',
    game_id_type: 'ID & Server',
    price: 0,
    is_active: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        supabase.from('products').select(`*, categories (id, name)`).order('created_at', { ascending: false }),
        supabase.from('categories').select('id, name').order('name')
      ]);
      
      if (prodRes.error) throw prodRes.error;
      if (catRes.error) throw catRes.error;
      
      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
    } catch (error: any) {
      console.error(error);
      toast.error('Gagal memuat produk: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (prod?: any) => {
    if (prod) {
      setEditingId(prod.id);
      setFormData({
        title: prod.title,
        category_id: prod.category_id,
        image_url: prod.image_url || '',
        game_id_type: prod.game_id_type,
        price: prod.price,
        is_active: prod.is_active
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        category_id: categories.length > 0 ? categories[0].id : '',
        image_url: '',
        game_id_type: 'ID & Server',
        price: 0,
        is_active: true
      });
    }
    setImageFile(null); // Reset file input when opening modal
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading(editingId ? 'Menyimpan...' : 'Menambahkan...');
    try {
      let finalImageUrl = formData.image_url;

      // Handle Image Upload First
      if (imageFile) {
        setIsUploading(true);
        toast.loading('Mengunggah gambar...', { id: loadingToast });
        
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `product_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `products/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('payment_proofs') // Reusing the public bucket
          .upload(filePath, imageFile);
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('payment_proofs')
          .getPublicUrl(filePath);
          
        finalImageUrl = publicUrl;
      }

      const payload = {
        title: formData.title,
        category_id: formData.category_id,
        image_url: finalImageUrl,
        game_id_type: formData.game_id_type,
        price: formData.price,
        is_active: formData.is_active
      };

      if (editingId) {
        const { error } = await supabase.from('products').update(payload).eq('id', editingId);
        if (error) throw error;
        toast.success('Produk berhasil diupdate!', { id: loadingToast });
      } else {
        const { error } = await supabase.from('products').insert([payload]);
        if (error) throw error;
        toast.success('Produk berhasil ditambahkan!', { id: loadingToast });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      console.error(error);
      toast.error(`Gagal menyimpan: ${error.message}`, { id: loadingToast });
    } finally {
      setIsUploading(false);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from('products').update({ is_active: !currentStatus }).eq('id', id);
      if (error) throw error;
      setProducts(products.map(p => p.id === id ? { ...p, is_active: !currentStatus } : p));
      toast.success(`Produk ${!currentStatus ? 'diaktifkan' : 'dinonaktifkan'}.`);
    } catch (error: any) {
      toast.error('Gagal mengubah status: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus produk ini? Semua pesanan terkait mungkin kehilangan referensi.')) return;
    const loadingToast = toast.loading('Menghapus...');
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      toast.success('Produk berhasil dihapus', { id: loadingToast });
      fetchData();
    } catch (error: any) {
      console.error(error);
      toast.error(`Gagal menghapus: ${error.message}`, { id: loadingToast });
    }
  };

  if (isLoading) {
    return <div className="animate-pulse text-white/50 p-6">Memuat data produk...</div>;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Gamepad2 className="w-8 h-8 text-primary" />
            Produk Game
          </h1>
          <p className="text-white/40 mt-1 text-sm">Kelola daftar game, status aktif, dan harganya.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20 text-sm w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" /> Tambah Produk
        </button>
      </div>

      {/* Cards Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20 text-white/40 bg-white/[0.02] border border-white/5 rounded-3xl">
          <Gamepad2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-semibold">Belum ada produk game.</p>
          <p className="text-sm">Klik "Tambah Produk" untuk menampilkan game pertama Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {products.map((prod) => (
            <div 
              key={prod.id} 
              className={`bg-white/[0.03] border rounded-2xl p-5 sm:p-6 relative overflow-hidden transition-all duration-300 flex flex-col justify-between ${
                prod.is_active ? 'border-white/10 hover:border-primary/30' : 'border-white/5 opacity-50'
              }`}
            >
              <div>
                {/* Header: Label & Toggle */}
                <div className="flex items-start justify-between mb-4 gap-2">
                  <div className="flex bg-white/5 border border-white/10 rounded-lg px-2 py-1 items-center gap-1.5 flex-1 overflow-hidden">
                    <FolderTree className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="text-xs font-semibold text-white/70 truncate">{prod.categories?.name || 'Uncategorized'}</span>
                  </div>
                  <button
                    onClick={() => toggleActive(prod.id, prod.is_active)}
                    className="text-white/50 hover:text-white transition-colors shrink-0"
                    title={prod.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                  >
                    {prod.is_active ? (
                      <ToggleRight className="w-7 h-7 text-green-400" />
                    ) : (
                      <ToggleLeft className="w-7 h-7 text-white/30" />
                    )}
                  </button>
                </div>

                {/* Banner/Image */}
                <div className="w-full h-32 bg-white/5 rounded-xl mb-4 relative overflow-hidden border border-white/5">
                  {prod.image_url ? (
                    <Image src={prod.image_url} alt={prod.title} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/20 text-xs font-medium">No Image</div>
                  )}
                </div>

                {/* Info */}
                <h3 className="text-lg font-bold text-white leading-tight mb-2">{prod.title}</h3>
                <div className="space-y-1.5 mb-2 relative z-10">
                  <p className="text-sm text-white/50 flex justify-between">
                    <span>Base Price</span>
                    <span className="font-mono text-white">Rp {Number(prod.price).toLocaleString('id-ID')}</span>
                  </p>
                  <p className="text-sm text-white/50 flex justify-between">
                    <span>Form ID</span>
                    <span className="text-white bg-white/10 px-1.5 rounded">{prod.game_id_type}</span>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 mt-4 border-t border-white/5 relative z-10">
                <button 
                  onClick={() => handleOpenModal(prod)} 
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(prod.id)} 
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 overflow-y-auto">
          <div className="bg-[#0f1115] border border-white/10 p-6 sm:p-8 rounded-3xl max-w-2xl w-full relative shadow-2xl my-auto transition-all">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-xl"
            >
              <XCircle className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-black text-white mb-2 leading-tight">
              {editingId ? 'Edit Game' : 'Tambah Game Baru'}
            </h2>
            <p className="text-white/40 text-sm mb-6 font-medium border-b border-white/10 pb-6">Lengkapi detail informasi produk game di bawah ini.</p>
            
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-white/70 mb-2">Nama Produk / Game</label>
                    <input 
                      type="text" required value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                      placeholder="Contoh: Mobile Legends"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white/70 mb-2">Kategori</label>
                    <div className="relative">
                      <select 
                        required value={formData.category_id}
                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none appearance-none font-medium"
                      >
                        <option value="" disabled>Pilih Kategori</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id} className="bg-[#0f1115] text-white py-2">{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white/70 mb-2">Tipe Form ID</label>
                    <select 
                      value={formData.game_id_type}
                      onChange={(e) => setFormData({ ...formData, game_id_type: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none appearance-none"
                    >
                      <option value="ID & Server" className="bg-[#0f1115] text-white">ID & Server (Contoh: MLBB)</option>
                      <option value="Player ID" className="bg-[#0f1115] text-white">Player ID Saja (Contoh: Free Fire)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-white/70 mb-2">Harga Dasar (Rp)</label>
                    <input 
                      type="number" required min="0" value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none font-mono"
                    />
                  </div>
                  
                  <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                    <label className="block text-sm font-semibold text-white/70 mb-2">Banner Game (PC/HP)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setImageFile(e.target.files[0]);
                          setFormData({ ...formData, image_url: '' }); // Clear URL if file selected
                        }
                      }}
                      className="block w-full text-xs text-white/50
                        file:mr-3 file:py-2 file:px-3
                        file:rounded-lg file:border-0
                        file:text-xs file:font-semibold
                        file:bg-primary/20 file:text-primary
                        hover:file:bg-primary/30 file:transition-colors file:cursor-pointer
                        cursor-pointer border border-white/10 rounded-xl bg-white/5 p-1 mb-3"
                    />

                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-px bg-white/10 flex-1"></div>
                      <span className="text-[10px] text-white/30 uppercase font-bold tracking-wider">ATAU URL</span>
                      <div className="h-px bg-white/10 flex-1"></div>
                    </div>

                    <input 
                      type="url" value={formData.image_url}
                      onChange={(e) => {
                        setFormData({ ...formData, image_url: e.target.value });
                        if (e.target.value) setImageFile(null); // Clear file if URL typed
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/60 focus:border-primary focus:text-white focus:outline-none text-xs"
                      placeholder="https://images.unsplash.com/..."
                    />
                    
                    {(formData.image_url || imageFile) && (
                      <div className="mt-3 h-24 w-full rounded-lg overflow-hidden border border-white/10 relative bg-[#0a0a0a] p-1">
                         <img 
                           src={imageFile ? URL.createObjectURL(imageFile) : formData.image_url} 
                           alt="Preview" 
                           className="w-full h-full object-contain rounded-md" 
                           onError={(e) => e.currentTarget.style.display='none'} 
                          />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 bg-white/5 p-4 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                  className="shrink-0"
                >
                  {formData.is_active ? (
                    <ToggleRight className="w-8 h-8 text-green-400" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-white/30" />
                  )}
                </button>
                <div onClick={() => setFormData({ ...formData, is_active: !formData.is_active })} className="cursor-pointer select-none">
                  <p className="text-sm font-bold text-white leading-tight mb-0.5">Produk Aktif</p>
                  <p className="text-xs text-white/50">Tampilkan game ini di halaman utama (Beranda).</p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="w-full py-3.5 font-semibold text-white/60 hover:text-white hover:bg-white/5 rounded-2xl transition-colors order-2 sm:order-1"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isUploading}
                  className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-2xl flex justify-center items-center gap-2 hover:bg-primary/90 transition-all hover:scale-[1.01] active:scale-95 shadow-lg shadow-primary/20 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 order-1 sm:order-2"
                >
                  {isUploading ? (
                    <><span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></span> Mengunggah...</>
                  ) : (
                    editingId ? 'Simpan Perubahan' : 'Tambah Game'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
