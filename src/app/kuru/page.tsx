'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { 
  TrendingUp, ShoppingCart, Clock,
  ArrowUpRight, Package, Layers
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalProducts: 0,
    totalCategories: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        // Fetch all orders
        const { data: orders, error: ordersErr } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        // Fetch product count
        const { count: prodCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        // Fetch category count
        const { count: catCount } = await supabase
          .from('categories')
          .select('*', { count: 'exact', head: true });

        if (ordersErr) throw ordersErr;

        const allOrders = orders || [];
        let totalSales = 0;
        let pending = 0, processing = 0, completed = 0, cancelled = 0;

        allOrders.forEach(order => {
          if (order.status === 'completed') {
            totalSales += Number(order.total_amount);
            completed++;
          } else if (order.status === 'pending') {
            pending++;
          } else if (order.status === 'processing') {
            processing++;
          } else if (order.status === 'cancelled') {
            cancelled++;
          }
        });

        setStats({
          totalSales,
          totalOrders: allOrders.length,
          pendingOrders: pending,
          processingOrders: processing,
          completedOrders: completed,
          cancelledOrders: cancelled,
          totalProducts: prodCount || 0,
          totalCategories: catCount || 0,
        });

        setRecentOrders(allOrders.slice(0, 7));
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; cls: string }> = {
      completed: { label: 'SUKSES', cls: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
      processing: { label: 'DIPROSES', cls: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      cancelled: { label: 'BATAL', cls: 'bg-red-500/20 text-red-400 border-red-500/30' },
      pending: { label: 'PENDING', cls: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    };
    const s = map[status] || map.pending;
    return <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${s.cls}`}>{s.label}</span>;
  };

  // Skeleton loader
  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 bg-white/5 rounded-2xl w-72" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-white/5 rounded-3xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-white/5 rounded-3xl" />
          <div className="h-80 bg-white/5 rounded-3xl" />
        </div>
      </div>
    );
  }

  const orderTotal = stats.totalOrders || 1; // prevent division by zero
  const statusBreakdown = [
    { label: 'Sukses', count: stats.completedOrders, color: 'bg-emerald-500', pct: Math.round((stats.completedOrders / orderTotal) * 100) },
    { label: 'Diproses', count: stats.processingOrders, color: 'bg-blue-500', pct: Math.round((stats.processingOrders / orderTotal) * 100) },
    { label: 'Pending', count: stats.pendingOrders, color: 'bg-amber-500', pct: Math.round((stats.pendingOrders / orderTotal) * 100) },
    { label: 'Batal', count: stats.cancelledOrders, color: 'bg-red-500', pct: Math.round((stats.cancelledOrders / orderTotal) * 100) },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-white tracking-tight leading-none">
          Selamat Datang! 👋
        </h1>
        <p className="text-white/40 mt-2 text-sm font-medium">
          Berikut ringkasan performa toko Lapak Robux Anda hari ini.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue Card - Featured */}
        <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/20 rounded-3xl p-6 relative overflow-hidden group hover:border-primary/40 transition-all duration-500">
          <div className="absolute -top-8 -right-8 w-28 h-28 bg-primary/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Total Pendapatan</p>
            <h3 className="text-2xl lg:text-3xl font-black text-white tracking-tight break-all">{formatCurrency(stats.totalSales)}</h3>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-all duration-500 group">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Total Pesanan</p>
          <h3 className="text-3xl font-black text-white">{stats.totalOrders}</h3>
        </div>

        {/* Products */}
        <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-all duration-500 group">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-400">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Produk Aktif</p>
          <h3 className="text-3xl font-black text-white">{stats.totalProducts}</h3>
        </div>

        {/* Categories */}
        <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-all duration-500 group">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Kategori</p>
          <h3 className="text-3xl font-black text-white">{stats.totalCategories}</h3>
        </div>
      </div>

      {/* Main Grid: Recent Orders + Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white/[0.03] border border-white/5 rounded-3xl overflow-hidden">
          <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
            <div>
              <h3 className="text-lg font-black text-white">Pesanan Terbaru</h3>
              <p className="text-white/30 text-xs mt-1">7 transaksi terakhir masuk.</p>
            </div>
            <Link href="/kuru/orders" className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-xl">
              Lihat Semua <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          
          {recentOrders.length === 0 ? (
            <div className="px-8 py-16 text-center text-white/20 text-sm">
              Belum ada transaksi masuk.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] text-white/30 uppercase tracking-wider">
                    <th className="text-left px-8 py-4 font-bold">ID Pesanan</th>
                    <th className="text-left px-4 py-4 font-bold">Waktu</th>
                    <th className="text-right px-4 py-4 font-bold">Jumlah</th>
                    <th className="text-center px-8 py-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-4">
                        <span className="font-mono text-xs text-white/50">{order.id.substring(0, 8)}...</span>
                      </td>
                      <td className="px-4 py-4 text-white/40 text-xs">
                        {new Date(order.created_at).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 py-4 text-right font-mono font-bold text-white">
                        {formatCurrency(Number(order.total_amount))}
                      </td>
                      <td className="px-8 py-4 text-center">
                        {getStatusBadge(order.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Status Breakdown Panel */}
        <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8">
          <h3 className="text-lg font-black text-white mb-2">Status Pesanan</h3>
          <p className="text-white/30 text-xs mb-8">Distribusi status dari seluruh pesanan.</p>

          {/* Visual Bar */}
          <div className="w-full h-4 rounded-full bg-white/5 overflow-hidden flex mb-8">
            {statusBreakdown.map((s, i) => (
              s.pct > 0 && <div key={i} className={`${s.color} h-full transition-all duration-1000`} style={{ width: `${s.pct}%` }} />
            ))}
          </div>

          {/* Legend */}
          <div className="space-y-5">
            {statusBreakdown.map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${s.color}`} />
                  <span className="text-sm font-medium text-white/70">{s.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-white">{s.count}</span>
                  <span className="text-[10px] font-bold text-white/30 w-10 text-right">{s.pct}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-10 pt-8 border-t border-white/5 space-y-3">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4">Aksi Cepat</p>
            <Link href="/kuru/orders" className="flex items-center justify-between w-full px-5 py-3.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-2xl transition-all text-sm font-medium text-white/60 hover:text-white group">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Lihat Pesanan Pending</span>
              </div>
              <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link href="/kuru/products" className="flex items-center justify-between w-full px-5 py-3.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-2xl transition-all text-sm font-medium text-white/60 hover:text-white group">
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-violet-400" />
                <span>Kelola Produk</span>
              </div>
              <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
