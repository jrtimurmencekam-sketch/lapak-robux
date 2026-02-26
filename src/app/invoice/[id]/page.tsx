'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import PaymentProofUpload from '@/components/ui/PaymentProofUpload';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { 
  CheckCircle2, Clock, CreditCard, Loader2, Copy, 
  CircleDot, Circle, ShieldCheck, AlertTriangle 
} from 'lucide-react';

interface OrderData {
  id: string;
  game_title: string;
  nominal_name: string;
  total_amount: number;
  payment_method: string;
  payment_method_id: string;
  product_slug: string;
  nickname: string | null;
  game_id_input: any;
  status: string;
  created_at: string;
}

interface PaymentMethodData {
  id: string;
  type: 'qris' | 'transfer';
  label: string;
  account_name: string | null;
  account_number: string | null;
  qris_image_url: string | null;
}

const EXPIRY_HOURS = 3;

export default function InvoicePage() {
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<OrderData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodData | null>(null);
  const [productImage, setProductImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExpired, setIsExpired] = useState(false);
  const [proofUploaded, setProofUploaded] = useState(false);
  const [isUploadingProof, setIsUploadingProof] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch order + payment method + product image
  useEffect(() => {
    async function fetchOrder() {
      try {
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (orderError || !orderData) {
          toast.error('Pesanan tidak ditemukan');
          return;
        }

        setOrder(orderData);

        // Fetch payment method details
        if (orderData.payment_method_id) {
          const { data: pmData } = await supabase
            .from('payment_methods')
            .select('*')
            .eq('id', orderData.payment_method_id)
            .single();
          if (pmData) setPaymentMethod(pmData);
        }

        // Fetch product image
        if (orderData.product_slug) {
          const { data: prodData } = await supabase
            .from('products')
            .select('image_url')
            .eq('slug', orderData.product_slug)
            .single();
          if (prodData) setProductImage(prodData.image_url);
        }

      } catch (err) {
        console.error('Error fetching order:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (orderId) fetchOrder();
  }, [orderId]);

  // Countdown timer
  useEffect(() => {
    if (!order) return;

    const updateTimer = () => {
      const created = new Date(order.created_at).getTime();
      const expiry = created + EXPIRY_HOURS * 60 * 60 * 1000;
      const now = Date.now();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft('00:00:00');
        setIsExpired(true);
        if (timerRef.current) clearInterval(timerRef.current);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    updateTimer();
    timerRef.current = setInterval(updateTimer, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [order]);

  const handleCopy = async (text: string, type: 'account' | 'amount') => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      if (type === 'account') { setCopiedAccount(true); setTimeout(() => setCopiedAccount(false), 2000); }
      else { setCopiedAmount(true); setTimeout(() => setCopiedAmount(false), 2000); }
    } catch (err) { console.error('Copy failed:', err); }
  };

  const handleProofUpload = async (file: File | null) => {
    if (!file || !order) return;

    setIsUploadingProof(true);
    const loadingToast = toast.loading('Mengupload bukti bayar...');

    try {
      const formData = new FormData();
      formData.append('orderId', order.id);
      formData.append('paymentProof', file);

      const res = await fetch('/api/order/proof', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message);

      toast.success('Bukti pembayaran berhasil dikirim! Admin akan memproses.', { id: loadingToast });
      setProofUploaded(true);
      setOrder(prev => prev ? { ...prev, status: 'processing' } : prev);
    } catch (error: any) {
      toast.error(`Gagal: ${error.message}`, { id: loadingToast });
    } finally {
      setIsUploadingProof(false);
    }
  };

  // Current step
  const getStep = () => {
    if (!order) return 0;
    if (order.status === 'completed') return 4;
    if (order.status === 'processing' || proofUploaded) return 3;
    return 2; // pending = awaiting payment
  };

  const steps = [
    { label: 'Transaksi Dibuat', desc: 'Pesanan berhasil dibuat' },
    { label: 'Pembayaran', desc: 'Silakan melakukan pembayaran' },
    { label: 'Proses', desc: 'Dalam proses' },
    { label: 'Transaksi Selesai', desc: 'Transaksi selesai' },
  ];
  const currentStep = getStep();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="animate-pulse space-y-6">
          <div className="h-20 bg-white/5 rounded-2xl" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-white/5 rounded-2xl" />
            <div className="h-96 bg-white/5 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Pesanan Tidak Ditemukan</h1>
        <p className="text-white/50 mb-8">Pesanan yang Anda cari tidak tersedia.</p>
        <Link href="/" className="text-primary hover:underline">Kembali ke Beranda</Link>
      </div>
    );
  }

  const accountDataStr = (() => {
    if (!order.game_id_input) return '-';
    if (typeof order.game_id_input === 'string') return order.game_id_input;
    const { whatsapp, nickname: _n, ...rest } = order.game_id_input;
    return Object.entries(rest).map(([k, v]) => `${k}: ${v}`).join(' | ');
  })();

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">

      {/* ════════════ Progress Stepper ════════════ */}
      <div className="bg-accent/30 border border-white/10 rounded-2xl p-6 mb-8 shadow-xl">
        <div className="flex items-center justify-between">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center flex-1 relative">
              {/* Connector line */}
              {i > 0 && (
                <div className={`absolute top-4 -left-1/2 w-full h-0.5 ${
                  i < currentStep ? 'bg-primary' : 'bg-white/10'
                }`} />
              )}
              {/* Icon */}
              <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                i < currentStep 
                  ? 'bg-primary text-primary-foreground' 
                  : i === currentStep 
                    ? 'bg-primary/20 border-2 border-primary text-primary' 
                    : 'bg-white/5 border border-white/20 text-white/30'
              }`}>
                {i < currentStep ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : i === currentStep ? (
                  <CircleDot className="w-5 h-5" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
              </div>
              {/* Labels */}
              <p className={`text-xs font-bold mt-2 text-center ${
                i <= currentStep ? 'text-primary' : 'text-white/30'
              }`}>
                {step.label}
              </p>
              <p className="text-[10px] text-white/40 text-center hidden sm:block">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════ Timer ════════════ */}
      {order.status === 'pending' && !isExpired && (
        <div className="flex justify-center mb-8">
          <div className="bg-primary/10 border border-primary/20 rounded-full px-6 py-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-primary font-black text-lg tracking-widest">{timeLeft}</span>
          </div>
        </div>
      )}

      {isExpired && order.status === 'pending' && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-8 text-center">
          <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-2" />
          <p className="text-red-400 font-bold">Waktu pembayaran telah habis!</p>
          <p className="text-red-400/70 text-sm">Silakan buat pesanan baru.</p>
        </div>
      )}

      {/* ════════════ Main Grid ════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Left: Order Info ── */}
        <div className="space-y-6">
          {/* Product Info Card */}
          <div className="bg-accent/30 border border-white/10 rounded-2xl p-6 shadow-xl">
            <div className="flex gap-4">
              {productImage && (
                <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/10 shrink-0">
                  <img src={productImage} alt={order.game_title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-black text-white mb-1">{order.game_title}</h3>
                {order.nickname && (
                  <p className="text-sm text-white/70">
                    Nickname: <span className="text-green-400 font-bold">{order.nickname}</span>
                  </p>
                )}
                <p className="text-sm text-white/50 truncate">{accountDataStr}</p>
                <p className="text-sm text-white/70 mt-1">
                  <span className="font-bold">{order.nominal_name}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Payment Details Card */}
          <div className="bg-accent/30 border border-white/10 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" /> Detail Pembayaran
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Metode</span>
                <span className="text-white font-bold uppercase">{order.payment_method}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Nomor Invoice</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-mono text-xs">{order.id.substring(0, 8)}...</span>
                  <button onClick={() => handleCopy(order.id, 'account')} className="text-primary hover:text-primary/80">
                    {copiedAccount ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Status Pembayaran</span>
                {order.status === 'pending' ? (
                  <span className="bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded text-xs font-bold">UNPAID</span>
                ) : order.status === 'processing' ? (
                  <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-xs font-bold">PROCESSING</span>
                ) : order.status === 'completed' ? (
                  <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-xs font-bold">PAID</span>
                ) : (
                  <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-xs font-bold">CANCELLED</span>
                )}
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Status Transaksi</span>
                <span className="bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded text-xs font-bold">PENDING</span>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-accent/30 border border-white/10 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4">Rincian Pembayaran</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Harga</span>
                <span className="text-white font-medium">Rp {Number(order.total_amount).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Subtotal</span>
                <span className="text-white font-medium">Rp {Number(order.total_amount).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Biaya</span>
                <span className="text-white font-medium">Rp 0</span>
              </div>
              <div className="pt-3 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold text-lg">Total Pembayaran</span>
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-black text-xl">Rp {Number(order.total_amount).toLocaleString('id-ID')}</span>
                    <button onClick={() => handleCopy(order.total_amount.toString(), 'amount')} className="text-primary hover:text-primary/80">
                      {copiedAmount ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Payment Instructions + Proof Upload ── */}
        <div className="space-y-6">
          
          {/* Payment Instructions */}
          {paymentMethod && (
            <div className="bg-accent/30 border border-primary/20 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4">
                Instruksi Pembayaran — {paymentMethod.label}
              </h3>

              <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                {paymentMethod.type === 'qris' && paymentMethod.qris_image_url && (
                  <div className="space-y-4">
                    <p className="text-white/60 text-sm">Scan QRIS di bawah ini menggunakan aplikasi e-wallet atau m-banking:</p>
                    <div className="bg-white rounded-xl p-4 mx-auto max-w-[260px]">
                      <img src={paymentMethod.qris_image_url} alt="QRIS" className="w-full object-contain" />
                    </div>
                    {paymentMethod.account_name && (
                      <p className="text-center text-white/50 text-sm">
                        A/N: <span className="text-white font-semibold">{paymentMethod.account_name}</span>
                      </p>
                    )}
                    <p className="text-xs text-white/40 text-center">Screenshot jika QR Code tidak bisa di-download.</p>
                  </div>
                )}

                {paymentMethod.type === 'transfer' && (
                  <div className="space-y-4">
                    <p className="text-white/60 text-sm">Silakan transfer ke rekening berikut:</p>
                    <div>
                      <p className="text-xs text-white/50 mb-1">Bank Tujuan</p>
                      <p className="font-bold text-white text-lg">{paymentMethod.label}</p>
                    </div>
                    {paymentMethod.account_name && (
                      <div>
                        <p className="text-xs text-white/50 mb-1">Nama Rekening</p>
                        <p className="font-bold text-white">{paymentMethod.account_name}</p>
                      </div>
                    )}
                    {paymentMethod.account_number && (
                      <div>
                        <p className="text-xs text-white/50 mb-1">Nomor Rekening</p>
                        <div className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/10">
                          <span className="font-black text-primary text-xl tracking-wider">{paymentMethod.account_number}</span>
                          <button
                            onClick={() => handleCopy(paymentMethod.account_number!, 'account')}
                            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-white"
                          >
                            {copiedAccount ? <><CheckCircle2 className="w-4 h-4 text-green-400" /> Disalin</> : <><Copy className="w-4 h-4" /> Salin</>}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Total to pay */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-white/50 mb-1">Nominal yang harus dibayar:</p>
                  <div className="flex items-center justify-between bg-primary/10 rounded-lg p-3 border border-primary/20">
                    <span className="font-black text-white text-xl">Rp {Number(order.total_amount).toLocaleString('id-ID')}</span>
                    <button
                      onClick={() => handleCopy(order.total_amount.toString(), 'amount')}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-primary/20 hover:bg-primary/30 text-primary transition-colors"
                    >
                      {copiedAmount ? <><CheckCircle2 className="w-4 h-4 text-green-400" /> Disalin</> : <><Copy className="w-4 h-4" /> Salin</>}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upload Proof — Only show when pending */}
          {order.status === 'pending' && !isExpired && !proofUploaded && (
            <PaymentProofUpload
              onUpload={handleProofUpload}
              selectedPayment={paymentMethod || undefined}
              totalAmount={order.total_amount}
            />
          )}

          {/* Success message after upload */}
          {(proofUploaded || order.status === 'processing') && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center">
              <ShieldCheck className="w-10 h-10 text-green-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">Bukti Pembayaran Terkirim!</h3>
              <p className="text-sm text-white/60">Admin sedang memproses pesanan Anda. Silakan tunggu konfirmasi.</p>
            </div>
          )}

          {order.status === 'completed' && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center">
              <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">Transaksi Selesai!</h3>
              <p className="text-sm text-white/60">Terima kasih atas pembelian Anda. Top up telah berhasil diproses.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
