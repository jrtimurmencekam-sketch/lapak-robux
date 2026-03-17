'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, MessageCircle, ShieldCheck, ArrowLeft, Share2, CheckCircle2, Filter } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { testimonials, totalReviews, avgRating, gameFilters, type Testimonial } from '@/lib/testimonials';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, delay: index * 0.03, type: "spring", stiffness: 300, damping: 30 }}
      className="group bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-primary/30 hover:bg-white/[0.05] transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/30 to-secondary/20 flex items-center justify-center text-lg border border-white/10 group-hover:scale-110 transition-transform duration-300">
          {testimonial.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white truncate">{testimonial.name}</p>
          <p className="text-xs text-primary/80 font-medium">{testimonial.game}</p>
        </div>
        <div className="flex items-center gap-1 bg-green-500/10 text-green-400 px-2 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold">Verified</span>
        </div>
      </div>

      {/* Rating */}
      <StarRating rating={testimonial.rating} />

      {/* Comment */}
      <p className="text-sm text-white/70 mt-3 leading-relaxed">
        &ldquo;{testimonial.comment}&rdquo;
      </p>

      {/* Date */}
      <p className="text-[11px] text-white/30 mt-3 font-medium">{testimonial.date}</p>
    </motion.div>
  );
}

export default function TestimoniPage() {
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [showShareToast, setShowShareToast] = useState(false);

  const filteredTestimonials = activeFilter === 'Semua'
    ? testimonials
    : testimonials.filter(t => t.game === activeFilter);

  // Count per game
  const gameCounts: Record<string, number> = {};
  testimonials.forEach(t => {
    gameCounts[t.game] = (gameCounts[t.game] || 0) + 1;
  });

  const handleShare = () => {
    const shareText = `🎮 Lihat testimoni pelanggan Lapak Robux! ⭐ Rating ${avgRating}/5 dari ${totalReviews}+ ulasan.\n\nTop up game termurah & terpercaya!\n\nhttps://lapakrobux.com/testimoni`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.04 }
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Back Button */}
      <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-primary transition-colors mb-8 group text-sm font-medium">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Kembali ke Beranda
      </Link>

      {/* Hero Section */}
      <div className="relative mb-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 rounded-3xl blur-3xl -z-10" />
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-2xl bg-primary/10 border border-primary/20">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                  Testimoni Pelanggan
                </h1>
              </div>
              <p className="text-white/50 text-sm md:text-base max-w-xl">
                Bukti nyata kepuasan pelanggan Lapak Robux. Ribuan gamer Indonesia sudah merasakan layanan top up tercepat & termurah!
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl px-5 py-3 text-center">
                <div className="flex items-center gap-1.5 justify-center mb-0.5">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-2xl font-black text-yellow-400">{avgRating}</span>
                </div>
                <p className="text-[11px] text-yellow-400/60 font-medium">Rating</p>
              </div>
              <div className="bg-primary/10 border border-primary/20 rounded-2xl px-5 py-3 text-center">
                <p className="text-2xl font-black text-primary">Ribuan</p>
                <p className="text-[11px] text-primary/60 font-medium">Ulasan</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs + Share Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide w-full sm:w-auto pb-2 sm:pb-0">
          <Filter className="w-4 h-4 text-white/30 shrink-0" />
          {gameFilters.map(filter => {
            const count = filter === 'Semua' ? totalReviews : (gameCounts[filter] || 0);
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                    : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80 border border-white/5'
                }`}
              >
                {filter}
                <span className={`ml-1.5 text-xs ${isActive ? 'text-primary-foreground/60' : 'text-white/30'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleShare}
          className="shrink-0 flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#20bd5a] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#25D366]/20"
        >
          <Share2 className="w-4 h-4" />
          Bagikan ke WhatsApp
        </button>
      </div>

      {/* Testimonial Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredTestimonials.map((t, i) => (
            <TestimonialCard key={`${t.name}-${t.game}`} testimonial={t} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Empty state */}
      {filteredTestimonials.length === 0 && (
        <div className="text-center py-16 text-white/40">
          Belum ada testimoni untuk game ini.
        </div>
      )}

      {/* Bottom CTA */}
      <div className="mt-16 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/20 rounded-3xl p-8 md:p-10 text-center">
        <h3 className="text-xl md:text-2xl font-black text-white mb-3">
          Mau Jadi Bagian Dari Mereka? 🎮
        </h3>
        <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
          Top up game favoritmu sekarang dan rasakan sendiri layanan tercepat & termurah se-Indonesia!
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-black text-sm hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
        >
          Top Up Sekarang
        </Link>
      </div>

      {/* Share Toast */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1a1b1e] border border-green-500/30 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 z-50"
          >
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span className="text-sm font-medium">Membuka WhatsApp...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
