'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import PaymentSelection from '@/components/ui/PaymentSelection';
import PaymentProofUpload from '@/components/ui/PaymentProofUpload';
import PaymentInstructions from '@/components/ui/PaymentInstructions';
import toast from 'react-hot-toast';
import { ShieldCheck, ChevronLeft, ChevronRight, Crown, MessageCircle } from 'lucide-react';
import Link from 'next/link';

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
}

export default function AccountDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [account, setAccount] = useState<MlbbAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchAccount() {
      const { data, error } = await supabase
        .from('mlbb_accounts')
        .select('*')
        .eq('id', id)
        .single();
      if (error) toast.error('Akun tidak ditemukan');
      else setAccount(data);
      setIsLoading(false);
    }
    if (id) fetchAccount();
  }, [id]);

  const allImages = account ? [account.cover_image_url, ...(account.gallery_urls || [])].filter(Boolean) : [];

  const handleSubmit = async () => {
    if (!account) return;
    if (account.status === 'sold') return toast.error('Akun ini sudah terjual');
    if (!whatsappNumber) return toast.error('Masukkan nomor WhatsApp Anda');
    if (!selectedPayment) return toast.error('Pilih metode pembayaran');

    const isManualBank = selectedPayment.type === 'transfer';
    if (isManualBank && !paymentProof) return toast.error('Upload bukti transfer wajib untuk Bank Manual');

    setIsSubmitting(true);
    const loadingToast = toast.loading('Memproses pembelian akun...');

    try {
      const formPayload = new FormData();
      formPayload.append('gameTitle', `[BELI AKUN] ${account.title}`);
      formPayload.append('accountData', JSON.stringify({ whatsapp: whatsappNumber, accountId: account.id }));
      formPayload.append('nominalName', `Akun ${account.rank} - ${account.hero_count} Hero, ${account.skin_count} Skin`);
      formPayload.append('totalAmount', account.price.toString());
      formPayload.append('paymentMethod', selectedPayment.label);
      formPayload.append('orderType', 'account');

      if (paymentProof) {
        formPayload.append('paymentProof', paymentProof);
      }

      const res = await fetch('/api/order', { method: 'POST', body: formPayload });
      const result = await res.json();

      if (!res.ok || !result.success) throw new Error(result.message || 'Gagal');

      toast.success('Pembelian akun berhasil dikirim! Admin akan menghubungi Anda via WhatsApp.', { id: loadingToast, duration: 5000 });
    } catch (error: any) {
      toast.error(`Error: ${error.message}`, { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl animate-pulse">
        <div className="h-64 bg-white/5 rounded-2xl mb-6" />
        <div className="h-40 bg-white/5 rounded-2xl" />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Akun Tidak Ditemukan</h1>
        <Link href="/accounts" className="text-primary hover:underline">← Kembali ke Etalase</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back link */}
      <Link href="/accounts" className="text-white/50 hover:text-primary text-sm mb-4 inline-flex items-center gap-1 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Kembali ke Etalase Akun
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-4">
        {/* Left: Gallery */}
        <div className="lg:col-span-3 space-y-4">
          {/* Main Image */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10 h-72 md:h-96">
            {allImages.length > 0 ? (
              <img src={allImages[currentImage]} alt={account.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                <ShieldCheck className="w-20 h-20 text-white/20" />
              </div>
            )}

            {account.status === 'sold' && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-4xl font-black text-red-500 tracking-widest rotate-[-15deg]">SOLD OUT</span>
              </div>
            )}

            {/* Nav arrows */}
            {allImages.length > 1 && (
              <>
                <button onClick={() => setCurrentImage(i => i === 0 ? allImages.length - 1 : i - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors">
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button onClick={() => setCurrentImage(i => i === allImages.length - 1 ? 0 : i + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors">
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {allImages.map((url, i) => (
                <button key={i} onClick={() => setCurrentImage(i)} className={`w-20 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${currentImage === i ? 'border-primary' : 'border-white/10 opacity-60 hover:opacity-100'}`}>
                  <img src={url} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Specs */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Crown className="w-5 h-5 text-primary" /> Spesifikasi Akun
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-xs text-white/40 mb-1">Rank</p>
                <p className="text-white font-bold">{account.rank || '-'}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-xs text-white/40 mb-1">Winrate</p>
                <p className="text-white font-bold">{account.winrate || '-'}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-xs text-white/40 mb-1">Hero</p>
                <p className="text-white font-bold">{account.hero_count}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-xs text-white/40 mb-1">Total Skin</p>
                <p className="text-white font-bold">{account.skin_count}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-xs text-white/40 mb-1">Legend Skin</p>
                <p className="text-primary font-bold">⭐ {account.legend_skins}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-xs text-white/40 mb-1">Collector Skin</p>
                <p className="text-primary font-bold">💎 {account.collector_skins}</p>
              </div>
            </div>

            {account.description && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-sm text-white/60 leading-relaxed">{account.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Checkout */}
        <div className="lg:col-span-2 space-y-4">
          {/* Title & Price */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h1 className="text-2xl font-black text-white mb-2">{account.title}</h1>
            <p className="text-3xl font-black text-primary">Rp {account.price.toLocaleString('id-ID')}</p>
            <p className="text-xs text-white/40 mt-2">Stok: 1 (Item Unik)</p>
          </div>

          {/* WhatsApp Input */}
          <div className="bg-accent/30 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">1</div>
              <h2 className="text-lg font-bold text-white">Nomor WhatsApp Anda</h2>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-green-400 shrink-0" />
              <input
                type="tel"
                placeholder="08123456789"
                value={whatsappNumber}
                onChange={e => setWhatsappNumber(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
            <p className="text-xs text-white/40 mt-2">Admin akan menghubungi via WA untuk penyerahan data login akun.</p>
          </div>

          {/* Payment */}
          {account.status !== 'sold' && (
            <>
              <PaymentSelection onSelect={(method) => setSelectedPayment(method)} />

              {selectedPayment && (
                <>
                  <PaymentInstructions method={selectedPayment} totalAmount={account.price} />
                  {selectedPayment.type === 'transfer' && (
                    <PaymentProofUpload onUpload={(file) => setPaymentProof(file)} />
                  )}
                </>
              )}

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !whatsappNumber || !selectedPayment}
                className={`w-full py-4 rounded-2xl flex justify-center items-center gap-2 font-black transition-all shadow-lg text-lg ${
                  isSubmitting || !whatsappNumber || !selectedPayment
                    ? 'bg-white/10 text-white/40 cursor-not-allowed'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] active:scale-95 shadow-primary/20'
                }`}
              >
                {isSubmitting ? 'Memproses...' : 'Beli Akun Ini 🛒'}
              </button>
            </>
          )}

          {account.status === 'sold' && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center">
              <p className="text-red-400 font-bold text-lg">Akun ini sudah SOLD OUT</p>
              <p className="text-white/40 text-sm mt-2">Silakan lihat akun lain yang tersedia.</p>
              <Link href="/accounts" className="inline-block mt-4 text-primary hover:underline text-sm">← Kembali ke Etalase</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
