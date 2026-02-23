'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Eye, XCircle, Clock, CheckSquare } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Gagal memuat pesanan.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state without refetching fully if we want, or just refetch
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
      alert(`Status berhasil diubah menjadi ${newStatus}`);
    } catch (error: any) {
      console.error('Error updating status:', error);
      alert(`Gagal mengubah status: ${error.message}`);
    }
  };

  const filteredOrders = orders.filter(o => filter === 'all' || o.status === filter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold">SUKSES</span>;
      case 'processing': return <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-bold">DIPROSES</span>;
      case 'cancelled': return <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-bold">BATAL</span>;
      default: return <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs font-bold">PENDING</span>;
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Manajemen Pesanan</h1>
          <p className="text-white/60 text-sm">Kelola semua transaksi yang masuk.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-accent/50 p-1 rounded-xl border border-white/10">
          {['all', 'pending', 'processing', 'completed', 'cancelled'].map((f) => (
             <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f ? 'bg-primary text-primary-foreground shadow-sm' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
             >
               {f.charAt(0).toUpperCase() + f.slice(1)}
             </button>
          ))}
        </div>
      </div>

      <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden">
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-left text-white/80 border-collapse">
            <thead className="text-xs text-white/50 uppercase bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-semibold">Waktu & ID</th>
                <th className="px-6 py-4 font-semibold">Data Akun</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Bukti Bayar</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-white/40">Memuat data...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-white/40">Tidak ada pesanan ditemukan.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs text-white/50 mb-1" title={order.id}>
                        {order.id.split('-')[0]}...
                      </div>
                      <div className="text-xs">
                        {new Date(order.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-[200px]">
                      <div className="truncate text-xs font-mono font-medium text-white/90">
                        {JSON.stringify(order.game_id_input).replace(/["{}]/g, '')}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-primary">
                      Rp {Number(order.total_amount).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4">
                      {order.payment_proof_url ? (
                        <button 
                          onClick={() => setSelectedProof(order.payment_proof_url)}
                          className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 font-medium bg-blue-500/10 px-3 py-1.5 rounded-lg transition-colors border border-blue-500/20"
                        >
                          <Eye className="w-3 h-3" /> Lihat Info
                        </button>
                      ) : (
                        <span className="text-xs text-white/30 italic">Tidak ada (Otomatis)</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.status === 'pending' && (
                          <button 
                            onClick={() => updateStatus(order.id, 'processing')}
                            className="p-1.5 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors" title="Proses"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        )}
                        {(order.status === 'pending' || order.status === 'processing') && (
                          <button 
                            onClick={() => updateStatus(order.id, 'completed')}
                            className="p-1.5 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors" title="Selesaikan"
                          >
                            <CheckSquare className="w-4 h-4" />
                          </button>
                        )}
                        {order.status !== 'cancelled' && order.status !== 'completed' && (
                          <button 
                            onClick={() => {
                              if(confirm('Yakin ingin membatalkan pesanan ini?')) updateStatus(order.id, 'cancelled');
                            }}
                            className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors" title="Batal"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Proof Modal - Premium Design */}
      {selectedProof && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
          <div className="bg-[#0c0c0c]/80 border border-white/10 p-6 md:p-10 rounded-[3rem] max-w-2xl w-full relative shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in duration-300">
            <h3 className="text-2xl font-black text-white mb-6 leading-tight">Bukti Pembayaran</h3>
            <div className="absolute top-0 right-0 p-8">
               <button 
                onClick={() => setSelectedProof(null)}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-white/40 hover:text-white"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-black/40 border border-white/5 flex items-center justify-center p-2">
              <img src={selectedProof} alt="Bukti Transfer" className="max-w-full max-h-[60vh] object-contain rounded-2xl shadow-2xl" />
            </div>
            <div className="mt-8 flex justify-center">
              <a 
                href={selectedProof} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-black rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-primary/20"
              >
                <span>Unduh Gambar</span>
                <Eye className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
