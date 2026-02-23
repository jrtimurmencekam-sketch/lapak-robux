'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Edit2, Trash2, XCircle, CreditCard, QrCode, Building2, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface PaymentMethod {
  id: string;
  type: 'qris' | 'transfer';
  label: string;
  account_name: string | null;
  account_number: string | null;
  qris_image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export default function AdminPaymentMethodsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [qrisFile, setQrisFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    type: 'qris' as 'qris' | 'transfer',
    label: '',
    account_name: '',
    account_number: '',
    qris_image_url: '',
    is_active: true
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setMethods(data || []);
    } catch (error) {
      console.error(error);
      toast.error('Gagal memuat data pembayaran.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (item?: PaymentMethod) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        type: item.type,
        label: item.label,
        account_name: item.account_name || '',
        account_number: item.account_number || '',
        qris_image_url: item.qris_image_url || '',
        is_active: item.is_active
      });
    } else {
      setEditingId(null);
      setFormData({
        type: 'qris',
        label: '',
        account_name: '',
        account_number: '',
        qris_image_url: '',
        is_active: true
      });
    }
    setQrisFile(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.type === 'qris' && !formData.qris_image_url && !qrisFile) {
      toast.error('Harap isi URL gambar atau upload file QRIS!');
      return;
    }

    const loadingToast = toast.loading(editingId ? 'Menyimpan...' : 'Menambahkan...');
    try {
      let finalQrisUrl = formData.qris_image_url;

      // Handle file upload
      if (formData.type === 'qris' && qrisFile) {
        setIsUploading(true);
        toast.loading('Mengunggah gambar QRIS...', { id: loadingToast });
        
        const fileExt = qrisFile.name.split('.').pop();
        const fileName = `qris_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `qris/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('payment_proofs')
          .upload(filePath, qrisFile);
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('payment_proofs')
          .getPublicUrl(filePath);
          
        finalQrisUrl = publicUrl;
      }

      const payload: any = {
        type: formData.type,
        label: formData.label,
        account_name: formData.account_name || null,
        account_number: formData.type === 'transfer' ? formData.account_number : null,
        qris_image_url: formData.type === 'qris' ? finalQrisUrl : null,
        is_active: formData.is_active
      };

      if (editingId) {
        const { error } = await supabase.from('payment_methods').update(payload).eq('id', editingId);
        if (error) throw error;
        toast.success('Metode pembayaran berhasil diupdate!', { id: loadingToast });
      } else {
        const { error } = await supabase.from('payment_methods').insert([payload]);
        if (error) throw error;
        toast.success('Metode pembayaran berhasil ditambahkan!', { id: loadingToast });
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

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus metode pembayaran ini?')) return;
    const loadingToast = toast.loading('Menghapus...');
    try {
      const { error } = await supabase.from('payment_methods').delete().eq('id', id);
      if (error) throw error;
      toast.success('Berhasil dihapus!', { id: loadingToast });
      fetchData();
    } catch (error: any) {
      toast.error(`Gagal menghapus: ${error.message}`, { id: loadingToast });
    }
  };

  const handleToggle = async (id: string, current: boolean) => {
    try {
      const { error } = await supabase.from('payment_methods').update({ is_active: !current }).eq('id', id);
      if (error) throw error;
      toast.success(`Metode ${!current ? 'diaktifkan' : 'dinonaktifkan'}!`);
      fetchData();
    } catch (error: any) {
      toast.error(`Gagal mengubah status: ${error.message}`);
    }
  };

  if (isLoading) {
    return <div className="animate-pulse text-white/50 p-6">Memuat data pembayaran...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-primary" />
            Metode Pembayaran
          </h1>
          <p className="text-white/40 mt-1 text-sm">Kelola QRIS dan rekening transfer manual Anda.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20 text-sm"
        >
          <Plus className="w-5 h-5" /> Tambah Metode
        </button>
      </div>

      {/* Cards Grid */}
      {methods.length === 0 ? (
        <div className="text-center py-20 text-white/40">
          <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-semibold">Belum ada metode pembayaran.</p>
          <p className="text-sm">Klik "Tambah Metode" untuk menambahkan QRIS atau rekening bank.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {methods.map((m) => (
            <div
              key={m.id}
              className={`bg-white/[0.03] border rounded-2xl p-6 relative overflow-hidden transition-all duration-300 ${
                m.is_active ? 'border-white/10 hover:border-primary/30' : 'border-white/5 opacity-50'
              }`}
            >
              {/* Type badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                  m.type === 'qris'
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {m.type === 'qris' ? <QrCode className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
                  {m.type === 'qris' ? 'QRIS' : 'TRANSFER'}
                </span>
                <button
                  onClick={() => handleToggle(m.id, m.is_active)}
                  className="text-white/50 hover:text-white transition-colors"
                  title={m.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                >
                  {m.is_active ? (
                    <ToggleRight className="w-8 h-8 text-green-400" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-white/30" />
                  )}
                </button>
              </div>

              {/* Label */}
              <h3 className="text-xl font-black text-white mb-2">{m.label}</h3>

              {/* Details */}
              {m.type === 'qris' && m.qris_image_url && (
                <div className="w-full bg-white rounded-xl p-3 mb-3">
                  <img
                    src={m.qris_image_url}
                    alt="QRIS"
                    className="w-full max-h-48 object-contain mx-auto"
                  />
                </div>
              )}
              {m.type === 'transfer' && (
                <div className="space-y-1 mb-3">
                  <p className="text-sm text-white/50">
                    A/N: <span className="text-white font-semibold">{m.account_name || '-'}</span>
                  </p>
                  <p className="text-sm text-white/50">
                    No. Rek: <span className="text-primary font-bold">{m.account_number || '-'}</span>
                  </p>
                </div>
              )}
              {m.type === 'qris' && m.account_name && (
                <p className="text-sm text-white/50 mb-3">
                  A/N: <span className="text-white font-semibold">{m.account_name}</span>
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-white/5">
                <button
                  onClick={() => handleOpenModal(m)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className="bg-[#0f1115] border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-black text-white mb-6">
              {editingId ? 'Edit Metode Pembayaran' : 'Tambah Metode Pembayaran'}
            </h2>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Type Selector */}
              <div>
                <label className="block text-sm font-semibold text-white/70 mb-2">Tipe</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['qris', 'transfer'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: t })}
                      className={`p-4 rounded-xl border text-center transition-all ${
                        formData.type === t
                          ? 'bg-primary/20 border-primary text-primary ring-1 ring-primary'
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {t === 'qris' ? <QrCode className="w-6 h-6 mx-auto mb-1" /> : <Building2 className="w-6 h-6 mx-auto mb-1" />}
                      <span className="text-sm font-bold">{t === 'qris' ? 'QRIS' : 'Transfer'}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Label */}
              <div>
                <label className="block text-sm font-semibold text-white/70 mb-2">Label / Nama</label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder={formData.type === 'qris' ? 'Contoh: QRIS Lapak Robux' : 'Contoh: BCA'}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>

              {/* Account Name */}
              <div>
                <label className="block text-sm font-semibold text-white/70 mb-2">Nama Pemilik Rekening</label>
                <input
                  type="text"
                  value={formData.account_name}
                  onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                  placeholder="Contoh: LAPAK ROBUX"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Conditional Fields */}
              {formData.type === 'transfer' && (
                <div>
                  <label className="block text-sm font-semibold text-white/70 mb-2">Nomor Rekening</label>
                  <input
                    type="text"
                    value={formData.account_number}
                    onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                    placeholder="Contoh: 8765432109"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>
              )}

              {formData.type === 'qris' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-white/70 mb-2">Upload Gambar QRIS (PC/HP)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setQrisFile(e.target.files[0]);
                          // Clear the URL input if they select a file
                          setFormData({ ...formData, qris_image_url: '' });
                        }
                      }}
                      className="block w-full text-sm text-white/50
                        file:mr-4 file:py-2.5 file:px-4
                        file:rounded-xl file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary/20 file:text-primary
                        hover:file:bg-primary/30 file:transition-colors file:cursor-pointer
                        cursor-pointer border border-white/10 rounded-xl bg-white/5 p-1"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="h-px bg-white/10 flex-1"></div>
                    <span className="text-xs text-white/30 uppercase font-bold tracking-wider">ATAU MASUKKAN URL</span>
                    <div className="h-px bg-white/10 flex-1"></div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white/70 mb-2">URL Gambar QRIS</label>
                    <input
                      type="text"
                      value={formData.qris_image_url}
                      onChange={(e) => {
                        setFormData({ ...formData, qris_image_url: e.target.value });
                        // Clear the file input if they type a URL
                        if (e.target.value) setQrisFile(null);
                      }}
                      placeholder="https://... atau /nama-file.png"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  {/* Preview Section */}
                  {(formData.qris_image_url || qrisFile) && (
                    <div className="mt-3 bg-[#0a0a0a] rounded-xl p-4 border border-white/5 max-w-[200px] mx-auto relative group">
                      <p className="text-xs text-white/40 text-center mb-2 font-medium">Preview QRIS</p>
                      <img
                        src={qrisFile ? URL.createObjectURL(qrisFile) : formData.qris_image_url}
                        alt="Preview QRIS"
                        className="w-full object-contain rounded-lg bg-white p-2"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl flex justify-center items-center gap-2 hover:bg-primary/90 transition-all hover:scale-[1.01] active:scale-95 shadow-lg shadow-primary/20 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isUploading ? (
                  <><span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></span> Mengunggah...</>
                ) : (
                  editingId ? 'Simpan Perubahan' : 'Tambah Metode'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
