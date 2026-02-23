'use client';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Plus, Edit2, Trash2, X, Image as ImageIcon, ToggleLeft, ToggleRight, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

interface Banner {
  id: string;
  image_url: string;
  alt_text: string | null;
  is_active: boolean;
  order_index: number;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Banner>>({
    image_url: '',
    alt_text: '',
    is_active: true,
    order_index: 0,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  async function fetchBanners() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('promo_banners')
        .select('*')
        .order('order_index', { ascending: true });
      if (error) throw error;
      setBanners(data || []);
    } catch (e: any) {
      toast.error('Gagal mengambil data banner: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleOpenModal = (banner?: Banner) => {
    if (banner) {
      setIsEditMode(true);
      setFormData(banner);
    } else {
      setIsEditMode(false);
      setFormData({
        image_url: '',
        alt_text: '',
        is_active: true,
        order_index: banners.length > 0 ? Math.max(...banners.map(b => b.order_index)) + 1 : 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({});
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    // Validasi tipe file
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar');
      return;
    }

    // Validasi ukuran (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran gambar maksimal 5MB');
      return;
    }

    setUploadingImage(true);
    const toastId = toast.loading('Mengunggah gambar...');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `banner_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `banners/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('payment_proofs')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('payment_proofs')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrlData.publicUrl }));
      toast.success('Gambar berhasil diunggah!', { id: toastId });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error('Gagal mengunggah gambar: ' + error.message, { id: toastId });
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url) {
      toast.error('Gambar banner wajib diisi!');
      return;
    }

    setSaving(true);
    const toastId = toast.loading('Menyimpan banner...');
    
    try {
      if (isEditMode && formData.id) {
        const { error } = await supabase
          .from('promo_banners')
          .update({
            image_url: formData.image_url,
            alt_text: formData.alt_text,
            is_active: formData.is_active,
            order_index: formData.order_index,
          })
          .eq('id', formData.id);
        if (error) throw error;
        toast.success('Banner berhasil diperbarui!', { id: toastId });
      } else {
        const { error } = await supabase
          .from('promo_banners')
          .insert([{
            image_url: formData.image_url,
            alt_text: formData.alt_text,
            is_active: formData.is_active,
            order_index: formData.order_index,
          }]);
        if (error) throw error;
        toast.success('Banner berhasil ditambahkan!', { id: toastId });
      }
      handleCloseModal();
      fetchBanners();
    } catch (err: any) {
      toast.error('Gagal menyimpan banner: ' + err.message, { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus banner ini?')) return;
    
    const toastId = toast.loading('Menghapus banner...');
    try {
      const { error } = await supabase.from('promo_banners').delete().eq('id', id);
      if (error) throw error;
      
      // Attempt to delete from storage if it's stored in our bucket
      if (imageUrl.includes('supabase.co/storage/v1/object/public/payment_proofs/banners/')) {
        const filePath = imageUrl.split('payment_proofs/')[1];
        if (filePath) {
           await supabase.storage.from('payment_proofs').remove([filePath]);
        }
      }

      toast.success('Banner berhasil dihapus', { id: toastId });
      fetchBanners();
    } catch (err: any) {
      toast.error('Gagal menghapus banner: ' + err.message, { id: toastId });
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('promo_banners')
        .update({ is_active: !currentStatus })
        .eq('id', id);
      if (error) throw error;
      fetchBanners();
      toast.success(`Banner ${!currentStatus ? 'diaktifkan' : 'dinonaktifkan'}`);
    } catch (error: any) {
      toast.error('Gagal mengubah status: ' + error.message);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <ImageIcon className="w-8 h-8 text-primary" />
            Promo Banner
          </h1>
          <p className="text-white/40 mt-1 text-sm">Kelola gambar carousel promosi di halaman utama.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20 text-sm w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" /> Tambah Banner
        </button>
      </div>

      {/* Grid List */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center">
          <ImageIcon className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Belum Ada Banner</h3>
          <p className="text-white/50 mb-6 max-w-md mx-auto">Tambahkan banner promosi pertama Anda untuk meramaikan halaman utama website.</p>
          <button 
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-medium transition-all"
          >
            <Plus className="w-5 h-5" /> Tambah Sekarang
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((banner) => (
             <div 
             key={banner.id} 
             className={`bg-white/[0.03] border rounded-2xl p-4 sm:p-5 relative overflow-hidden transition-all duration-300 flex flex-col justify-between ${banner.is_active ? 'border-white/10 hover:border-primary/30' : 'border-white/5 opacity-50'}`}
           >
              {/* Image Preview */}
              <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden mb-4 bg-black/50 border border-white/5">
                <Image src={banner.image_url} alt={banner.alt_text || 'Banner'} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold text-white bg-black/50 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
                      Urutan: {banner.order_index}
                    </span>
                    <button
                      onClick={() => toggleActive(banner.id, banner.is_active)}
                      className="text-white hover:scale-110 transition-transform bg-black/50 rounded-full p-1 border border-white/10"
                      title={banner.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                    >
                      {banner.is_active ? (
                        <ToggleRight className="w-6 h-6 text-green-400" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-white/50" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Info & Actions */}
              <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
                 <div className="text-sm text-white/70 truncate flex-1 min-w-0 pr-4">
                    {banner.alt_text || <span className="italic opacity-50">Tanpa Deskripsi</span>}
                 </div>
                 <div className="flex gap-2 shrink-0">
                    <button 
                      onClick={() => handleOpenModal(banner)}
                      className="p-2 sm:px-4 sm:py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg sm:rounded-xl text-sm font-medium transition-colors border border-white/5 flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" /> <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(banner.id, banner.image_url)}
                      className="p-2 sm:px-4 sm:py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg sm:rounded-xl text-sm font-medium transition-colors border border-red-500/20 flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Hapus</span>
                    </button>
                 </div>
              </div>
           </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 overflow-y-auto">
          <div className="bg-[#0f1115] border border-white/10 p-6 sm:p-8 rounded-3xl max-w-xl w-full relative shadow-2xl my-auto transition-all">
            <button 
              onClick={handleCloseModal}
              className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-2">
              {isEditMode ? 'Edit Banner' : 'Tambah Banner'}
            </h2>
            <p className="text-white/40 mb-6 text-sm">Unggah gambar dengan rasio memanjang (panoramic) untuk hasil terbaik.</p>

            <form onSubmit={handleSave} className="space-y-5">
              
              {/* Image Upload Area */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Gambar Banner <span className="text-red-400">*</span></label>
                <div className="flex flex-col gap-3">
                  {formData.image_url && (
                    <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden border border-white/10 group">
                      <Image src={formData.image_url} alt="Preview" fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm font-medium">Gambar Saat Ini</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      ref={fileInputRef}
                      className="hidden" 
                      id="bannerImageUpload"
                      disabled={uploadingImage}
                    />
                    <label 
                      htmlFor="bannerImageUpload"
                      className={`flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed ${uploadingImage ? 'border-primary/50 text-primary/50 cursor-not-allowed bg-primary/5' : 'border-white/20 text-white/70 hover:border-primary hover:text-primary cursor-pointer hover:bg-white/5'} rounded-xl transition-all`}
                    >
                      {uploadingImage ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Mengunggah...</>
                      ) : (
                        <><Upload className="w-5 h-5" /> Pilih File Gambar (Maks 5MB)</>
                      )}
                    </label>
                  </div>
                  <div className="text-xs text-white/40 mt-1">Atau masukkan URL gambar secara manual:</div>
                  <input 
                    type="url" 
                    placeholder="https://contoh.com/gambar.jpg"
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                  />
                </div>
              </div>

               <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Teks Alternatif / Deskripsi Singkat</label>
                <input 
                  type="text" 
                  value={formData.alt_text || ''}
                  onChange={(e) => setFormData({...formData, alt_text: e.target.value})}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                  placeholder="Misal: Promo Akhir Tahun"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Urutan Tampil (Lebih kecil tampil duluan)</label>
                    <input 
                      type="number" 
                      value={formData.order_index}
                      onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value) || 0})}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                    />
                  </div>
                  
                  <div className="space-y-2 flex flex-col justify-end">
                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={formData.is_active}
                        onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                        className="w-5 h-5 rounded border-white/20 bg-black/30 text-primary focus:ring-primary focus:ring-offset-background"
                      />
                      <span className="text-sm font-medium text-white">Banner Aktif</span>
                    </label>
                  </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={saving || uploadingImage}
                  className="flex-[2] flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Simpan Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
