'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import AccountInput from '@/components/ui/AccountInput';
import NominalSelection from '@/components/ui/NominalSelection';
import PaymentSelection from '@/components/ui/PaymentSelection';
import PaymentProofUpload from '@/components/ui/PaymentProofUpload';
import PaymentInstructions from '@/components/ui/PaymentInstructions';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { Star, Headphones } from 'lucide-react';

interface ProductData {
  id: string;
  title: string;
  slug: string;
  description: string;
  image_url: string;
  game_id_type: string;
  nominals: { id: string; name: string; price: number }[];
}

export default function ProductCheckoutPage() {
  const params = useParams();
  const slug = params?.id as string;

  const [product, setProduct] = useState<ProductData | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [accountData, setAccountData] = useState<any>({});
  const [selectedNominal, setSelectedNominal] = useState<{ id: string, price: number } | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch product from Supabase
  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;

        // Parse nominals if it's a string
        const nominals = typeof data.nominals === 'string' 
          ? JSON.parse(data.nominals) 
          : data.nominals || [];

        setProduct({
          ...data,
          nominals,
        });
      } catch (err) {
        console.error('Error fetching product:', err);
        toast.error('Produk tidak ditemukan');
      } finally {
        setIsPageLoading(false);
      }
    }

    if (slug) fetchProduct();
  }, [slug]);

  const handleSubmit = async () => {
    if (!product) return;
    if (!accountData || (Object.keys(accountData).length === 0 && product.game_id_type !== 'voucher')) return toast.error('Silakan isi data akun');
    if (!accountData.whatsapp) return toast.error('Nomor WhatsApp wajib diisi');
    if (!selectedNominal) return toast.error('Silakan pilih nominal top up');
    if (!selectedPayment) return toast.error('Silakan pilih metode pembayaran');

    const isManualBank = ['bca', 'mandiri'].includes(selectedPayment);
    if (isManualBank && !paymentProof) return toast.error('Upload bukti transfer wajib untuk Bank Manual');

    setIsLoading(true);
    const loadingToast = toast.loading('Memproses pesanan...');
    
    try {
      const nominalData = product.nominals.find(n => n.id === selectedNominal.id);

      const formPayload = new FormData();
      formPayload.append('gameTitle', product.title);
      formPayload.append('accountData', JSON.stringify(accountData));
      formPayload.append('nominalName', nominalData?.name || '-');
      formPayload.append('totalAmount', selectedNominal.price.toString());
      formPayload.append('paymentMethod', selectedPayment.label);

      // Determine order type for Telegram formatting
      const typeMap: Record<string, string> = { 'phone': 'phone', 'pln': 'pln', 'voucher': 'voucher' };
      formPayload.append('orderType', typeMap[product.game_id_type] || 'game');
      
      if (paymentProof) {
        formPayload.append('paymentProof', paymentProof);
      }

      const res = await fetch('/api/order', {
        method: 'POST',
        body: formPayload,
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Gagal memproses pesanan');
      }

      toast.success('Pesanan berhasil dibuat! Admin akan segera memproses.', { id: loadingToast });

    } catch (error: any) {
      console.error(error);
      toast.error(`Terjadi kesalahan: ${error.message}`, { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  // Loading skeleton
  if (isPageLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl animate-pulse">
        <div className="h-48 md:h-64 bg-white/5 rounded-2xl mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-48 bg-white/5 rounded-2xl" />
            <div className="h-64 bg-white/5 rounded-2xl" />
          </div>
          <div className="h-80 bg-white/5 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Produk Tidak Ditemukan</h1>
        <p className="text-white/50">Game yang Anda cari tidak tersedia atau telah dihapus.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Product Banner & Info — Using real game image */}
      <div className="relative rounded-2xl overflow-hidden mb-8 shadow-xl border border-white/10">
        <div className="relative h-48 md:h-64 w-full">
          <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
        <div className="absolute bottom-6 left-6 flex items-end gap-4">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-xl shrink-0 bg-background/80 backdrop-blur-sm">
            <img src={product.image_url} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div className="mb-1">
            <h1 className="text-2xl md:text-3xl font-black text-white drop-shadow-lg tracking-tight">{product.title}</h1>
            <p className="text-white/60 text-sm font-medium drop-shadow mt-1">{product.description}</p>
          </div>
        </div>
      </div>

      {/* Main Checkout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          <AccountInput 
            gameIdType={product.game_id_type} 
            onChange={(data) => setAccountData((prev: any) => ({ ...prev, ...data }))} 
          />
          <NominalSelection 
            nominals={product.nominals}
            onSelect={(id, price) => setSelectedNominal({ id, price })}
          />
          <PaymentSelection 
            onSelect={(method) => setSelectedPayment(method)}
          />
        </div>

        {/* Right Column: Upload & Summary */}
        <div className="space-y-6">
          
          {/* Ulasan dan Rating Block */}
          <div className="bg-[#242526]/80 border border-white/5 rounded-[1.5rem] p-6 shadow-xl backdrop-blur-sm">
            <h3 className="text-sm font-bold text-white mb-3">Ulasan dan rating</h3>
            <div className="flex items-end gap-3 mb-2">
              <span className="text-5xl font-black text-white leading-none tracking-tighter">4.99</span>
              <div className="flex text-[#FFD700] pb-1 gap-0.5">
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
              </div>
            </div>
            <p className="text-xs text-white/60 font-medium">Berdasarkan total 7.62jt rating</p>
          </div>

          {/* Butuh Bantuan Block */}
          <div className="bg-[#242526]/80 border border-white/5 rounded-2xl p-5 shadow-xl backdrop-blur-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
              <Headphones className="w-5 h-5 text-white/60" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-0.5">Butuh Bantuan?</h3>
              <p className="text-xs text-white/50">Kamu bisa hubungi admin disini.</p>
            </div>
          </div>
          {/* Show Payment Instructions when a method is selected */}
          {selectedPayment && (
            <>
              <PaymentInstructions 
                method={selectedPayment} 
                totalAmount={selectedNominal?.price || 0} 
              />
              {selectedPayment.type === 'transfer' && (
                <PaymentProofUpload onUpload={(file) => setPaymentProof(file)} />
              )}
            </>
          )}

          {/* Sticky Summary */}
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 shadow-xl sticky top-24 backdrop-blur-sm">
            <h3 className="text-xl font-black text-white mb-4">Ringkasan Pesanan</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Produk</span>
                <span className="text-white font-medium text-right">{product.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Nominal</span>
                <span className="text-white font-medium text-right">
                  {selectedNominal ? product.nominals.find(n => n.id === selectedNominal.id)?.name : '-'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Metode</span>
                <span className="text-primary font-bold text-right uppercase">
                  {selectedPayment?.label || '-'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 mb-6">
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold text-white">Total</span>
                <span className="font-black text-primary text-xl">
                  {selectedNominal ? `Rp ${selectedNominal.price.toLocaleString('id-ID')}` : 'Rp 0'}
                </span>
              </div>
            </div>

            <button 
              onClick={handleSubmit}
              disabled={isLoading || !selectedNominal || !selectedPayment}
              className={`w-full py-4 rounded-2xl flex justify-center items-center gap-2 font-black transition-all shadow-lg text-lg ${
                isLoading || !selectedNominal || !selectedPayment 
                  ? 'bg-white/10 text-white/40 cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] active:scale-95 shadow-primary/20'
              }`}
            >
              {isLoading ? 'Memproses...' : 'Beli Sekarang 🚀'}
            </button>
            <p className="text-xs text-center text-white/30 mt-4">
              Pembayaran aman dengan enkripsi SSL.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
