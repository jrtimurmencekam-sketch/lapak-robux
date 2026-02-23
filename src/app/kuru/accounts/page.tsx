'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, ShieldCheck, X, Upload } from 'lucide-react';

interface MlbbAccount {
  id: string;
  title: string;
  description: string;
  price: number;
  rank: string;
  winrate: string;
  hero_count: number;
  skin_count: number;
  legend_skins: number;
  collector_skins: number;
  status: string;
  cover_image_url: string;
  gallery_urls: string[];
  whatsapp_contact: string;
  created_at: string;
}

const defaultForm = {
  title: '',
  description: '',
  price: 0,
  rank: '',
  winrate: '',
  hero_count: 0,
  skin_count: 0,
  legend_skins: 0,
  collector_skins: 0,
  cover_image_url: '',
  gallery_urls: [] as string[],
  whatsapp_contact: '',
};

export default function AdminAccountsPage() {
  const [accounts, setAccounts] = useState<MlbbAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('mlbb_accounts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) toast.error(error.message);
      else setAccounts(data || []);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  // Standalone fetch for re-use after mutations
  const fetchAccounts = async () => {
    const { data, error } = await supabase
      .from('mlbb_accounts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) toast.error(error.message);
    else setAccounts(data || []);
  };

  const openModal = (account?: MlbbAccount) => {
    if (account) {
      setEditingId(account.id);
      setForm({
        title: account.title,
        description: account.description || '',
        price: account.price,
        rank: account.rank || '',
        winrate: account.winrate || '',
        hero_count: account.hero_count,
        skin_count: account.skin_count,
        legend_skins: account.legend_skins,
        collector_skins: account.collector_skins,
        cover_image_url: account.cover_image_url || '',
        gallery_urls: account.gallery_urls || [],
        whatsapp_contact: account.whatsapp_contact || '',
      });
    } else {
      setEditingId(null);
      setForm(defaultForm);
    }
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'gallery') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) return toast.error('Ukuran file maks 5MB');
    if (!file.type.startsWith('image/')) return toast.error('Hanya file gambar yang diperbolehkan');

    setUploading(true);
    const fileName = `accounts/acc_${Date.now()}_${Math.random().toString(36).substring(7)}.${file.name.split('.').pop()}`;

    const { error: uploadError } = await supabase.storage
      .from('payment_proofs')
      .upload(fileName, file);

    if (uploadError) {
      toast.error('Gagal upload: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from('payment_proofs')
      .getPublicUrl(fileName);

    const url = urlData.publicUrl;

    if (type === 'cover') {
      setForm(prev => ({ ...prev, cover_image_url: url }));
    } else {
      setForm(prev => ({ ...prev, gallery_urls: [...prev.gallery_urls, url] }));
    }

    toast.success('Gambar berhasil diupload!');
    setUploading(false);
    e.target.value = '';
  };

  const removeGalleryImage = (index: number) => {
    setForm(prev => ({
      ...prev,
      gallery_urls: prev.gallery_urls.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price) return toast.error('Nama dan harga wajib diisi');

    const payload = {
      title: form.title,
      description: form.description,
      price: form.price,
      rank: form.rank,
      winrate: form.winrate,
      hero_count: form.hero_count,
      skin_count: form.skin_count,
      legend_skins: form.legend_skins,
      collector_skins: form.collector_skins,
      cover_image_url: form.cover_image_url,
      gallery_urls: form.gallery_urls,
      whatsapp_contact: form.whatsapp_contact,
    };

    if (editingId) {
      const { error } = await supabase.from('mlbb_accounts').update(payload).eq('id', editingId);
      if (error) return toast.error(error.message);
      toast.success('Akun berhasil diupdate!');
    } else {
      const { error } = await supabase.from('mlbb_accounts').insert([payload]);
      if (error) return toast.error(error.message);
      toast.success('Akun berhasil ditambahkan!');
    }

    setShowModal(false);
    fetchAccounts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin hapus akun ini?')) return;
    const { error } = await supabase.from('mlbb_accounts').delete().eq('id', id);
    if (error) return toast.error(error.message);
    toast.success('Akun dihapus');
    fetchAccounts();
  };

  const toggleStatus = async (id: string, current: string) => {
    const next = current === 'available' ? 'sold' : 'available';
    const { error } = await supabase.from('mlbb_accounts').update({ status: next }).eq('id', id);
    if (error) return toast.error(error.message);
    toast.success(next === 'sold' ? 'Ditandai SOLD' : 'Dikembalikan ke Available');
    fetchAccounts();
  };

  const statusBadge = (status: string) => {
    if (status === 'sold') return <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold">SOLD</span>;
    if (status === 'reserved') return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-bold">RESERVED</span>;
    return <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold">AVAILABLE</span>;
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <ShieldCheck className="w-7 h-7 text-primary" /> Manajemen Akun MLBB
        </h1>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-bold hover:bg-primary/90 transition-all text-sm">
          <Plus className="w-4 h-4" /> Tambah Akun
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-64 bg-white/5 rounded-2xl animate-pulse" />)}
        </div>
      ) : accounts.length === 0 ? (
        <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10 text-white/50">
          Belum ada akun MLBB yang terdaftar.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((acc) => (
            <div key={acc.id} className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden group hover:border-primary/30 transition-all">
              {acc.cover_image_url ? (
                <div className="h-40 relative overflow-hidden">
                  <img src={acc.cover_image_url} alt={acc.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2">{statusBadge(acc.status)}</div>
                </div>
              ) : (
                <div className="h-40 bg-white/5 flex items-center justify-center">
                  <ShieldCheck className="w-12 h-12 text-white/20" />
                  <div className="absolute top-2 right-2">{statusBadge(acc.status)}</div>
                </div>
              )}

              <div className="p-4">
                <h3 className="font-bold text-white text-lg mb-1 truncate">{acc.title}</h3>
                <p className="text-primary font-black text-xl mb-2">Rp {acc.price.toLocaleString('id-ID')}</p>

                <div className="grid grid-cols-2 gap-1 text-xs text-white/50 mb-3">
                  <span>🏅 Rank: {acc.rank || '-'}</span>
                  <span>📊 WR: {acc.winrate || '-'}</span>
                  <span>🦸 Hero: {acc.hero_count}</span>
                  <span>🎨 Skin: {acc.skin_count}</span>
                  <span>⭐ Legend: {acc.legend_skins}</span>
                  <span>💎 Collector: {acc.collector_skins}</span>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => openModal(acc)} className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm text-white font-medium flex items-center justify-center gap-1 transition-colors">
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => toggleStatus(acc.id, acc.status)} className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${acc.status === 'available' ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'}`}>
                    {acc.status === 'available' ? 'Tandai SOLD' : 'Buka Kembali'}
                  </button>
                  <button onClick={() => handleDelete(acc.id)} className="py-2 px-3 bg-white/5 hover:bg-red-500/20 rounded-xl text-white/50 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-white">{editingId ? 'Edit Akun' : 'Tambah Akun Baru'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X className="w-5 h-5 text-white/50" /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-sm text-white/70 mb-1 block">Judul Akun *</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="Akun Sultan Mythic Glory" />
              </div>

              <div>
                <label className="text-sm text-white/70 mb-1 block">Deskripsi</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none" placeholder="Full skin legend, collector lengkap..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/70 mb-1 block">Harga (Rp) *</label>
                  <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: Number(e.target.value) }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="text-sm text-white/70 mb-1 block">Rank</label>
                  <select value={form.rank} onChange={e => setForm(p => ({ ...p, rank: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none">
                    <option value="">Pilih Rank</option>
                    <option value="Warrior">Warrior</option>
                    <option value="Elite">Elite</option>
                    <option value="Master">Master</option>
                    <option value="Grandmaster">Grandmaster</option>
                    <option value="Epic">Epic</option>
                    <option value="Legend">Legend</option>
                    <option value="Mythic">Mythic</option>
                    <option value="Mythical Honor">Mythical Honor</option>
                    <option value="Mythical Glory">Mythical Glory</option>
                    <option value="Immortal">Immortal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm text-white/70 mb-1 block">Winrate (%)</label>
                  <input value={form.winrate} onChange={e => setForm(p => ({ ...p, winrate: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" placeholder="65.5%" />
                </div>
                <div>
                  <label className="text-sm text-white/70 mb-1 block">Hero</label>
                  <input type="number" value={form.hero_count} onChange={e => setForm(p => ({ ...p, hero_count: Number(e.target.value) }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="text-sm text-white/70 mb-1 block">Total Skin</label>
                  <input type="number" value={form.skin_count} onChange={e => setForm(p => ({ ...p, skin_count: Number(e.target.value) }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="text-sm text-white/70 mb-1 block">Legend Skin</label>
                  <input type="number" value={form.legend_skins} onChange={e => setForm(p => ({ ...p, legend_skins: Number(e.target.value) }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/70 mb-1 block">Collector Skin</label>
                  <input type="number" value={form.collector_skins} onChange={e => setForm(p => ({ ...p, collector_skins: Number(e.target.value) }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="text-sm text-white/70 mb-1 block">WA Penjual</label>
                  <input value={form.whatsapp_contact} onChange={e => setForm(p => ({ ...p, whatsapp_contact: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" placeholder="08123456789" />
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className="text-sm text-white/70 mb-2 block">Cover Image</label>
                {form.cover_image_url && (
                  <div className="mb-2 rounded-xl overflow-hidden h-40">
                    <img src={form.cover_image_url} alt="Cover" className="w-full h-full object-cover" />
                  </div>
                )}
                <label className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-dashed border-white/20 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                  <Upload className="w-4 h-4 text-primary" />
                  <span className="text-sm text-white/70">{uploading ? 'Uploading...' : 'Upload Cover'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'cover')} disabled={uploading} />
                </label>
              </div>

              {/* Gallery */}
              <div>
                <label className="text-sm text-white/70 mb-2 block">Gallery Screenshots</label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {form.gallery_urls.map((url, i) => (
                    <div key={i} className="relative rounded-xl overflow-hidden h-24 group/img">
                      <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeGalleryImage(i)} className="absolute top-1 right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity">
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
                <label className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-dashed border-white/20 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                  <Upload className="w-4 h-4 text-primary" />
                  <span className="text-sm text-white/70">{uploading ? 'Uploading...' : 'Tambah Screenshot'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'gallery')} disabled={uploading} />
                </label>
              </div>

              <button type="submit" className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all text-lg">
                {editingId ? 'Update Akun' : 'Simpan Akun'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
