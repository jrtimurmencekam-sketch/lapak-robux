'use client';

import { useState } from 'react';
import { Star, MessageCircle, ShieldCheck } from 'lucide-react';
import { testimonials, totalReviews, avgRating, type Testimonial } from '@/lib/testimonials';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="flex-shrink-0 w-[280px] bg-accent/40 border border-white/10 rounded-2xl p-4 hover:border-primary/30 transition-all duration-300">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg">
          {testimonial.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white truncate">{testimonial.name}</p>
          <p className="text-xs text-primary/80">{testimonial.game}</p>
        </div>
        <ShieldCheck className="w-4 h-4 text-green-400 shrink-0" />
      </div>
      <StarRating rating={testimonial.rating} />
      <p className="text-sm text-white/70 mt-2 line-clamp-2 leading-relaxed">{testimonial.comment}</p>
      <p className="text-[10px] text-white/30 mt-2">{testimonial.date}</p>
    </div>
  );
}

export default function TestimonialCarousel() {
  const row1 = testimonials.slice(0, 25);
  const row2 = testimonials.slice(25);

  // CSS animation duration based on item count
  const row1Duration = row1.length * 4; // ~4s per card
  const row2Duration = row2.length * 4;

  return (
    <section className="mb-12">
      {/* Inline CSS keyframes for the marquee */}
      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .marquee-row-1 {
          animation: marquee-left ${row1Duration}s linear infinite;
        }
        .marquee-row-2 {
          animation: marquee-right ${row2Duration}s linear infinite;
        }
        .marquee-row-1:hover,
        .marquee-row-2:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-primary"><MessageCircle className="w-6 h-6 inline" /></span> Apa Kata Mereka?
          </h2>
          <p className="text-white/50 text-sm mt-1">Testimoni pelanggan setia Lapak Robux</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-400 px-3 py-1.5 rounded-full text-sm font-bold">
            <Star className="w-4 h-4 fill-yellow-400" />
            {avgRating}/5
          </div>
          <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-bold">
            {totalReviews}+ Ulasan
          </div>
        </div>
      </div>

      {/* Row 1 - scrolls left (CSS animation) */}
      <div className="overflow-hidden mb-4">
        <div className="flex gap-4 marquee-row-1" style={{ width: 'max-content' }}>
          {[...row1, ...row1].map((t, i) => (
            <TestimonialCard key={`r1-${i}`} testimonial={t} />
          ))}
        </div>
      </div>

      {/* Row 2 - scrolls right (CSS animation) */}
      <div className="overflow-hidden">
        <div className="flex gap-4 marquee-row-2" style={{ width: 'max-content' }}>
          {[...row2, ...row2].map((t, i) => (
            <TestimonialCard key={`r2-${i}`} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
