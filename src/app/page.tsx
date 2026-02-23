'use client';

import { useEffect, useState } from 'react';
import CategoryNav from "@/components/layout/CategoryNav";
import PromoCarousel from "@/components/ui/PromoCarousel";
import GameCard from "@/components/ui/GameCard";
import GameCardSkeleton from "@/components/ui/GameCardSkeleton";
import { supabase } from '@/lib/supabase';
import { motion, Variants } from 'framer-motion';

export default function Home() {
  const [games, setGames] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchActiveGames() {
      try {
        // Get the 'top-up-game' category ID first
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
        
        // Custom sort to prioritize Mobile Legends products
        sortedData.sort((a, b) => {
          const aIsML = a.title.toLowerCase().includes('mobile legends');
          const bIsML = b.title.toLowerCase().includes('mobile legends');
          
          if (aIsML && !bIsML) return -1;
          if (!aIsML && bIsML) return 1;
          return 0; // Keep original order for the rest
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

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <>
      <CategoryNav />
      <div className="container mx-auto px-4 py-8">
        <motion.section 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <PromoCarousel />
        </motion.section>

        <section id="games" className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-primary">🔥</span> Populer Sekarang!
            </h2>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <GameCardSkeleton key={i} />
              ))}
            </div>
          ) : games.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10 text-white/50">
              Belum ada produk aktif saat ini.
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
            >
              {games.map((game) => (
                <motion.div key={game.id} variants={itemVariants}>
                <GameCard 
                    id={game.slug || game.id}
                    title={game.title}
                    developer="Top Up Cepat"
                    imageUrl={game.image_url || ''}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </div>
    </>
  );
}
