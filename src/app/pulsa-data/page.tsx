'use client';

import { useEffect, useState } from 'react';
import CategoryNav from "@/components/layout/CategoryNav";
import GameCard from "@/components/ui/GameCard";
import GameCardSkeleton from "@/components/ui/GameCardSkeleton";
import { supabase } from '@/lib/supabase';
import { motion, Variants } from 'framer-motion';
import { Smartphone } from 'lucide-react';

export default function PulsaDataPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data: catData } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', 'pulsa-data')
          .single();

        if (!catData) {
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', catData.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching pulsa products:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
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
              <Smartphone className="w-6 h-6 text-primary" /> Pulsa & Paket Data
            </h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(4)].map((_, i) => (
                <GameCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10 text-white/50">
              Belum ada produk pulsa & data saat ini. Segera hadir!
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
            >
              {products.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <GameCard
                    id={product.slug || product.id}
                    title={product.title}
                    developer="Pulsa & Data"
                    imageUrl={product.image_url || ''}
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
