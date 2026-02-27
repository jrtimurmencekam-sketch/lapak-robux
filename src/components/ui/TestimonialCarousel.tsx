'use client';

import { useEffect, useRef, useState } from 'react';
import { Star, MessageCircle, ShieldCheck } from 'lucide-react';

interface Testimonial {
  name: string;
  game: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  // Mobile Legends
  { name: "Rizky A.", game: "Mobile Legends", rating: 5, comment: "Top up diamond ML cepet banget, belum 1 menit udah masuk!", date: "27 Feb 2026", avatar: "🎮" },
  { name: "Dinda S.", game: "Mobile Legends", rating: 5, comment: "Harganya paling murah dibanding toko lain, langganan sini terus 🔥", date: "26 Feb 2026", avatar: "💎" },
  { name: "Farel P.", game: "Mobile Legends", rating: 5, comment: "Baru pertama top up disini, ternyata beneran amanah. Recommended!", date: "25 Feb 2026", avatar: "⭐" },
  { name: "Ayu M.", game: "Mobile Legends", rating: 4, comment: "Proses cepat, admin ramah. Cuma harus upload bukti dulu ya, tapi aman kok", date: "24 Feb 2026", avatar: "🌸" },
  { name: "Bagas R.", game: "Mobile Legends", rating: 5, comment: "Udah 5x top up disini, ga pernah kecewa. Mantap!", date: "23 Feb 2026", avatar: "🏆" },
  { name: "Nisa W.", game: "Mobile Legends", rating: 5, comment: "Harga weekly diamond murah banget disini, jadi langganan", date: "22 Feb 2026", avatar: "💖" },
  { name: "Aldi K.", game: "Mobile Legends", rating: 5, comment: "Starlight bulanan selalu top up disini, fast respond admin", date: "21 Feb 2026", avatar: "🌟" },
  { name: "Putri L.", game: "Mobile Legends", rating: 4, comment: "Awalnya ragu, tapi ternyata beneran masuk diamond-nya!", date: "20 Feb 2026", avatar: "🎀" },
  { name: "Rendi J.", game: "Mobile Legends", rating: 5, comment: "Top up buat push rank, diamond langsung masuk. GG!", date: "19 Feb 2026", avatar: "⚔️" },
  { name: "Siti H.", game: "Mobile Legends", rating: 5, comment: "Beli skin collector pake diamond dari sini, murah pol!", date: "18 Feb 2026", avatar: "👑" },

  // Free Fire
  { name: "Dimas F.", game: "Free Fire", rating: 5, comment: "Top up FF murah, diamond langsung masuk ke akun!", date: "27 Feb 2026", avatar: "🔫" },
  { name: "Rina A.", game: "Free Fire", rating: 5, comment: "Beli diamond buat beli bundle, harganya bersahabat banget", date: "26 Feb 2026", avatar: "💐" },
  { name: "Kevin T.", game: "Free Fire", rating: 5, comment: "Proses gak sampe 5 menit, top up FF paling cepet!", date: "25 Feb 2026", avatar: "🎯" },
  { name: "Lina D.", game: "Free Fire", rating: 4, comment: "Murah dan cepet, next time pasti top up disini lagi", date: "24 Feb 2026", avatar: "🌺" },
  { name: "Arief N.", game: "Free Fire", rating: 5, comment: "Udah 3x transaksi, semuanya lancar jaya!", date: "22 Feb 2026", avatar: "💪" },

  // Roblox / Robux
  { name: "Zahra K.", game: "Roblox", rating: 5, comment: "Beli robux buat anak, delivery cepet dan aman!", date: "27 Feb 2026", avatar: "🧸" },
  { name: "Rangga S.", game: "Roblox", rating: 5, comment: "Robux murah banget disini, udah langganan dari lama", date: "26 Feb 2026", avatar: "🎲" },
  { name: "Anisa R.", game: "Roblox", rating: 5, comment: "Anak saya seneng banget dapet robux cepet, thx Lapak Robux!", date: "25 Feb 2026", avatar: "🎈" },
  { name: "Budi P.", game: "Roblox", rating: 4, comment: "Pertama kali beli disini, prosesnya gampang dan aman", date: "24 Feb 2026", avatar: "🎪" },
  { name: "Mega V.", game: "Roblox", rating: 5, comment: "Harga robux paling murah se-Indonesia! Top banget", date: "23 Feb 2026", avatar: "🌈" },
  { name: "Hafiz M.", game: "Roblox", rating: 5, comment: "Robux langsung masuk, bisa beli gamepass favorit!", date: "22 Feb 2026", avatar: "🎮" },
  { name: "Tari J.", game: "Roblox", rating: 5, comment: "Trusted seller! Udah belasan kali beli robux disini", date: "20 Feb 2026", avatar: "⭐" },
  { name: "Galih W.", game: "Roblox", rating: 5, comment: "Beli robux buat main Blox Fruits, cepet masuknya!", date: "19 Feb 2026", avatar: "🍊" },

  // PUBG Mobile
  { name: "Fajar D.", game: "PUBG Mobile", rating: 5, comment: "UC PUBG murah! Bisa beli Royale Pass sekarang 🔥", date: "27 Feb 2026", avatar: "🔥" },
  { name: "Devi S.", game: "PUBG Mobile", rating: 5, comment: "Top up UC cepet, admin fast respond banget", date: "26 Feb 2026", avatar: "🎖️" },
  { name: "Ahmad B.", game: "PUBG Mobile", rating: 4, comment: "Pertama beli UC disini, beneran masuk dan aman", date: "24 Feb 2026", avatar: "🛡️" },
  { name: "Wulan C.", game: "PUBG Mobile", rating: 5, comment: "Harga UC paling worth it, udah compare sama yang lain", date: "23 Feb 2026", avatar: "💜" },
  { name: "Eko P.", game: "PUBG Mobile", rating: 5, comment: "Fast delivery! UC langsung masuk, mantap!", date: "21 Feb 2026", avatar: "🏅" },

  // Genshin Impact
  { name: "Yuki N.", game: "Genshin Impact", rating: 5, comment: "Top up Genesis Crystal murah, bisa gacha banyak!", date: "27 Feb 2026", avatar: "⚡" },
  { name: "Sarah L.", game: "Genshin Impact", rating: 5, comment: "Welkin Moon selalu beli disini, harga paling oke!", date: "26 Feb 2026", avatar: "🌙" },
  { name: "Rio G.", game: "Genshin Impact", rating: 5, comment: "Beli blessing of welkin moon, proses instan!", date: "25 Feb 2026", avatar: "🌊" },
  { name: "Mira T.", game: "Genshin Impact", rating: 4, comment: "Genesis crystal langsung masuk, bisa pull character baru", date: "23 Feb 2026", avatar: "🦋" },
  { name: "Hendra K.", game: "Genshin Impact", rating: 5, comment: "Trusted! Udah berkali-kali top up crystal disini", date: "21 Feb 2026", avatar: "🗡️" },

  // General / Mixed
  { name: "Yoga A.", game: "Mobile Legends", rating: 5, comment: "Admin response cepet, diamond masuk kurang dari 3 menit", date: "18 Feb 2026", avatar: "⚡" },
  { name: "Indah M.", game: "Free Fire", rating: 5, comment: "Temen yang rekomendasiin, ternyata beneran murah!", date: "17 Feb 2026", avatar: "🌻" },
  { name: "Joko S.", game: "Roblox", rating: 5, comment: "Anak minta top up robux, disini paling murah!", date: "17 Feb 2026", avatar: "👨" },
  { name: "Dewi P.", game: "Mobile Legends", rating: 5, comment: "Bayar pake QRIS gampang banget, diamond instan!", date: "16 Feb 2026", avatar: "💳" },
  { name: "Raka H.", game: "PUBG Mobile", rating: 5, comment: "Selalu puas top up disini, ga pernah mengecewakan", date: "16 Feb 2026", avatar: "🎖️" },
  { name: "Tiara W.", game: "Genshin Impact", rating: 5, comment: "Top up crystal cepet, bisa gacha banner baru!", date: "15 Feb 2026", avatar: "✨" },
  { name: "Ilham R.", game: "Mobile Legends", rating: 5, comment: "Transfer bank juga bisa, proses tetep cepet!", date: "15 Feb 2026", avatar: "🏦" },
  { name: "Sari N.", game: "Roblox", rating: 4, comment: "Beli robux pertama kali, prosesnya mudah banget", date: "14 Feb 2026", avatar: "🎁" },
  { name: "Fikri Z.", game: "Free Fire", rating: 5, comment: "Top up diamond FF buat event, murah dan cepet!", date: "14 Feb 2026", avatar: "🎉" },
  { name: "Laras B.", game: "Mobile Legends", rating: 5, comment: "Beli starlight tiap bulan disini, harga stabil murah", date: "13 Feb 2026", avatar: "🌟" },
  { name: "Dani O.", game: "PUBG Mobile", rating: 5, comment: "UC murah, bisa beli semua skin incaran!", date: "13 Feb 2026", avatar: "🔫" },
  { name: "Citra A.", game: "Mobile Legends", rating: 5, comment: "Recommended banget! Udah 10x lebih top up disini", date: "12 Feb 2026", avatar: "❤️" },
  { name: "Wahyu D.", game: "Roblox", rating: 5, comment: "Lapak Robux emang paling oke buat beli robux!", date: "12 Feb 2026", avatar: "👍" },
  { name: "Karina F.", game: "Genshin Impact", rating: 5, comment: "Crystal murah, CS ramah, proses cepat. 10/10!", date: "11 Feb 2026", avatar: "💯" },
  { name: "Agus M.", game: "Free Fire", rating: 5, comment: "Top up lancar, harga bersaing, pokoknya the best!", date: "11 Feb 2026", avatar: "🏆" },
  { name: "Nadia S.", game: "Mobile Legends", rating: 5, comment: "Harga diamond termurah yang pernah saya temuin!", date: "10 Feb 2026", avatar: "💰" },
];

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
  const scrollRef1 = useRef<HTMLDivElement>(null);
  const scrollRef2 = useRef<HTMLDivElement>(null);
  const [isPaused1, setIsPaused1] = useState(false);
  const [isPaused2, setIsPaused2] = useState(false);

  const row1 = testimonials.slice(0, 25);
  const row2 = testimonials.slice(25);

  // Auto-scroll row 1 (left to right)
  useEffect(() => {
    const el = scrollRef1.current;
    if (!el) return;
    let animationId: number;
    const speed = 0.5;

    const scroll = () => {
      if (!isPaused1 && el) {
        el.scrollLeft += speed;
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused1]);

  // Auto-scroll row 2 (right to left)
  useEffect(() => {
    const el = scrollRef2.current;
    if (!el) return;
    let animationId: number;
    const speed = 0.5;

    // Start from middle
    el.scrollLeft = el.scrollWidth / 2;

    const scroll = () => {
      if (!isPaused2 && el) {
        el.scrollLeft -= speed;
        if (el.scrollLeft <= 0) {
          el.scrollLeft = el.scrollWidth / 2;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused2]);

  const totalReviews = testimonials.length;
  const avgRating = (testimonials.reduce((sum, t) => sum + t.rating, 0) / totalReviews).toFixed(1);

  return (
    <section className="mb-12">
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

      {/* Row 1 - scrolls left */}
      <div
        ref={scrollRef1}
        className="flex gap-4 overflow-x-hidden mb-4"
        onMouseEnter={() => setIsPaused1(true)}
        onMouseLeave={() => setIsPaused1(false)}
        onTouchStart={() => setIsPaused1(true)}
        onTouchEnd={() => setIsPaused1(false)}
      >
        {/* Duplicate for infinite scroll effect */}
        {[...row1, ...row1].map((t, i) => (
          <TestimonialCard key={`r1-${i}`} testimonial={t} />
        ))}
      </div>

      {/* Row 2 - scrolls right */}
      <div
        ref={scrollRef2}
        className="flex gap-4 overflow-x-hidden"
        onMouseEnter={() => setIsPaused2(true)}
        onMouseLeave={() => setIsPaused2(false)}
        onTouchStart={() => setIsPaused2(true)}
        onTouchEnd={() => setIsPaused2(false)}
      >
        {/* Duplicate for infinite scroll effect */}
        {[...row2, ...row2].map((t, i) => (
          <TestimonialCard key={`r2-${i}`} testimonial={t} />
        ))}
      </div>
    </section>
  );
}
