'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import CategoryNav from "@/components/layout/CategoryNav";
import { supabase } from '@/lib/supabase';
import { motion, Variants } from 'framer-motion';
import { ShieldCheck, Crown } from 'lucide-react';

interface MlbbAccount {
  id: string;
  title: string;
  price: number;
  rank: string;
  winrate: string;
  hero_count: number;
  skin_count: number;
  legend_skins: number;
  collector_skins: number;
  status: string;
  cover_image_url: string;
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<MlbbAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data, error } = await supabase
        .from('mlbb_accounts')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) setAccounts(data || []);
      setIsLoading(false);
    }
    fetch();
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <>
      <CategoryNav />
      <div className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Crown className="w-6 h-6 text-primary" /> Beli Akun MLBB Sultan
            </h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => <div key={i} className="h-72 bg-white/5 rounded-2xl animate-pulse" />)}
            </div>
          ) : accounts.length === 0 ? (
            <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10 text-white/50">
              <ShieldCheck className="w-12 h-12 mx-auto mb-4 text-white/20" />
              Belum ada akun MLBB yang tersedia. Segera hadir!
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {accounts.map((acc) => (
                <motion.div key={acc.id} variants={itemVariants}>
                  <Link href={`/accounts/${acc.id}`}>
                    <div className={`bg-white/[0.03] border rounded-2xl overflow-hidden group hover:scale-[1.02] transition-all duration-300 cursor-pointer ${acc.status === 'sold' ? 'border-red-500/30 opacity-70' : 'border-white/10 hover:border-primary/40'}`}>
                      {/* Cover Image */}
                      <div className="h-48 relative overflow-hidden">
                        {acc.cover_image_url ? (
                          <img src={acc.cover_image_url} alt={acc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                            <ShieldCheck className="w-16 h-16 text-white/20" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                        {/* Status Badge */}
                        {acc.status === 'sold' ? (
                          <div className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white rounded-full text-xs font-black tracking-wider">SOLD OUT</div>
                        ) : (
                          <div className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold">AVAILABLE</div>
                        )}

                        {/* Price */}
                        <div className="absolute bottom-3 left-3">
                          <p className="text-primary font-black text-2xl drop-shadow-lg">Rp {acc.price.toLocaleString('id-ID')}</p>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <h3 className="font-bold text-white text-lg mb-2 truncate">{acc.title}</h3>

                        <div className="grid grid-cols-3 gap-2 text-center mb-3">
                          <div className="bg-white/5 rounded-xl py-2">
                            <p className="text-xs text-white/40">Rank</p>
                            <p className="text-sm font-bold text-white">{acc.rank || '-'}</p>
                          </div>
                          <div className="bg-white/5 rounded-xl py-2">
                            <p className="text-xs text-white/40">WR</p>
                            <p className="text-sm font-bold text-white">{acc.winrate || '-'}</p>
                          </div>
                          <div className="bg-white/5 rounded-xl py-2">
                            <p className="text-xs text-white/40">Hero</p>
                            <p className="text-sm font-bold text-white">{acc.hero_count}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-white/50">
                          <span>🎨 {acc.skin_count} Skin</span>
                          <span>⭐ {acc.legend_skins} Legend</span>
                          <span>💎 {acc.collector_skins} Collector</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </div>
    </>
  );
}
