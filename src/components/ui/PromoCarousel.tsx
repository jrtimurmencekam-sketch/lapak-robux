'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Banner {
  id: string;
  image_url: string;
  alt_text: string | null;
  order_index: number;
}

export default function PromoCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBanners() {
      try {
        const { data, error } = await supabase
          .from('promo_banners')
          .select('*')
          .eq('is_active', true)
          .order('order_index', { ascending: true });

        if (error) throw error;
        setBanners(data || []);
      } catch (error) {
        console.error('Error fetching banners:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  if (isLoading) {
    return (
      <div className="relative w-full aspect-[21/9] md:aspect-[32/9] overflow-hidden rounded-2xl bg-white/5 animate-pulse flex items-center justify-center">
        <ImageIcon className="w-12 h-12 text-white/10" />
      </div>
    );
  }

  if (banners.length === 0) {
    // Fallback static banners if DB is empty
    return (
      <div className="relative w-full aspect-[21/9] md:aspect-[32/9] overflow-hidden rounded-2xl">
        <Image
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop"
          alt="Default Promo"
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <h2 className="text-2xl md:text-4xl font-black text-white mb-2 drop-shadow-lg">Promo Menarik Menanti!</h2>
          <p className="text-white/80 max-w-lg drop-shadow text-sm md:text-base">Top up game favorit Anda sekarang dengan harga paling murah.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[21/9] md:aspect-[32/9] overflow-hidden rounded-2xl group">
      {/* Images */}
      <div 
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner, idx) => (
          <div key={banner.id} className="min-w-full h-full relative">
            <Image
              src={banner.image_url}
              alt={banner.alt_text || `Promo ${idx}`}
              fill
              className="object-cover"
              priority={idx === 0}
            />
            {/* Overlay gradient for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>
        ))}
      </div>

      {/* Navigation Buttons (hanya jika banner > 1) */}
      {banners.length > 1 && (
        <>
          <button 
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentIndex === idx ? 'w-6 bg-primary' : 'w-2 bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
