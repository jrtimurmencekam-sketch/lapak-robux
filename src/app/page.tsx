'use client';

import { useEffect, useState } from 'react';
import PromoCarousel from "@/components/ui/PromoCarousel";
import GameCard from "@/components/ui/GameCard";
import GameCardSkeleton from "@/components/ui/GameCardSkeleton";
import TestimonialCarousel from "@/components/ui/TestimonialCarousel";
import { supabase } from '@/lib/supabase';
import { motion, Variants } from 'framer-motion';
import { Flame, Gamepad2 } from 'lucide-react';

export default function Home() {
  const [games, setGames] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchActiveGames() {
      try {
        const { data: catData } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', 'top-up-game')
          .single();

        if (!catData) {
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .eq('category_id', catData.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const sortedData = data || [];
        sortedData.sort((a, b) => {
          const aIsML = a.title.toLowerCase().includes('mobile legends');
          const bIsML = b.title.toLowerCase().includes('mobile legends');
          if (aIsML && !bIsML) return -1;
          if (!aIsML && bIsML) return 1;
          return 0;
        });

        setGames(sortedData);
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchActiveGames();
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.07 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  // Split: first 6 for trending, all for games grid
  const trendingGames = games.slice(0, 6);

  return (
    <>
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Promo Banner */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <PromoCarousel />
        </motion.section>

        {/* ═══ TRENDING Section ═══ */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-extrabold text-white tracking-tight">TRENDING</h2>
          </div>
          <p className="text-white/40 text-sm mb-5">Berikut adalah beberapa produk paling populer saat ini.</p>

          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-20 bg-surface animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : trendingGames.length === 0 ? (
            <div className="text-center py-8 bg-surface rounded-2xl border border-white/5 text-white/40 text-sm">
              Belum ada produk aktif saat ini.
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 lg:grid-cols-3 gap-2.5"
            >
              {trendingGames.map((game) => (
                <motion.div key={`trending-${game.id}`} variants={itemVariants}>
                  <GameCard
                    id={game.slug || game.id}
                    title={game.title}
                    developer={game.developer || 'Top Up Cepat'}
                    imageUrl={game.image_url || ''}
                    variant="horizontal"
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* ═══ GAMES Grid Section ═══ */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-5">
            <Gamepad2 className="w-5 h-5 text-secondary" />
            <h2 className="text-xl font-extrabold text-white tracking-tight">Games</h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5">
              {[...Array(6)].map((_, i) => (
                <GameCardSkeleton key={i} />
              ))}
            </div>
          ) : games.length === 0 ? (
            <div className="text-center py-12 bg-surface rounded-2xl border border-white/5 text-white/40">
              Belum ada produk aktif saat ini.
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5"
            >
              {games.map((game) => (
                <motion.div key={game.id} variants={itemVariants}>
                  <GameCard
                    id={game.slug || game.id}
                    title={game.title}
                    developer={game.developer || 'Top Up Cepat'}
                    imageUrl={game.image_url || ''}
                    variant="vertical"
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* Testimonials */}
        <TestimonialCarousel />
      </div>
    </>
  );
}
