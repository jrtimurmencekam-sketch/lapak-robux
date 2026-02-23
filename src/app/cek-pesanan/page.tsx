'use client';
import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function CekPesananPage() {
  const [invoiceId, setInvoiceId] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceId.trim()) return;

    setIsLoading(true);
    setError('');
    setOrder(null);

    try {
      // Assuming 'id' in orders table is used as invoice ID for MVP
      const { data, error: dbError } = await supabase
        .from('orders')
        .select('*, products(title, image_url)')
        .eq('id', invoiceId.trim())
        .single();

      if (dbError) {
        if (dbError.code === 'PGRST116') {
          setError('Pesanan tidak ditemukan. Pastikan Nomor Invoice / ID Pesanan benar.');
        } else {
          throw dbError;
        }
      } else {
        setOrder(data);
      }
    } catch (err: any) {
      console.error(err);
      setError('Terjadi kesalahan saat mencari pesanan.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-xs font-bold">SUKSES</span>;
      case 'processing': return <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold">DIPROSES</span>;
      case 'cancelled': return <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-bold">DIBATALKAN</span>;
      default: return <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-3 py-1 rounded-full text-xs font-bold">MENUNGGU PEMBAYARAN</span>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl flex-1 flex flex-col">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-3">Cek Pesanan</h1>
        <p className="text-white/60">Lacak status pesanan Anda dengan memasukkan Nomor Invoice.</p>
      </div>

      <div className="bg-accent/30 border border-white/10 rounded-2xl p-6 shadow-xl mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={invoiceId}
              onChange={(e) => setInvoiceId(e.target.value)}
              placeholder="Masukkan Nomor Invoice (Contoh: 123e4567-e89...)"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white placeholder-white/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          </div>
          <button
            type="submit"
            disabled={isLoading || !invoiceId.trim()}
            className="bg-primary text-primary-foreground font-bold px-8 py-3 rounded-xl hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center min-w-[120px]"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Cek Status'}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center text-red-400 text-sm">
          {error}
        </div>
      )}

      {order && (
        <div className="bg-accent/40 border border-white/10 rounded-2xl p-6 lg:p-8 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-white/10 pb-6">
            <div>
              <p className="text-xs text-white/50 mb-1">Nomor Invoice</p>
              <h2 className="text-lg font-mono text-white break-all">{order.id}</h2>
              <p className="text-xs text-white/40 mt-1">
                {new Date(order.created_at).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}
              </p>
            </div>
            <div className="shrink-0">{getStatusBadge(order.status)}</div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-white/60 text-sm">Produk</span>
              <span className="text-white font-medium text-right text-sm">
                {order.products?.title || 'Game Product'} 
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-white/60 text-sm">Data Akun</span>
              <span className="text-white font-medium text-right text-sm max-w-[50%] truncate">
                {JSON.stringify(order.game_id_input).replace(/["{}]/g, '').replace(/:/g, ': ')}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-t border-white/5 pt-4 mt-2">
              <span className="text-white font-medium">Total Harga</span>
              <span className="text-primary font-bold text-lg">
                Rp {Number(order.total_amount).toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
