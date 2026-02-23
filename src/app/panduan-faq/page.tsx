'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, ChevronDown, ShoppingCart, CreditCard, Truck, HelpCircle, MessageCircle, Gamepad2 } from 'lucide-react';

const guideSteps = [
  {
    step: 1,
    title: 'Pilih Game',
    description: 'Masuk ke halaman utama dan pilih game yang ingin Anda top up (Mobile Legends, Free Fire, PUBG Mobile, dll).',
  },
  {
    step: 2,
    title: 'Pilih Nominal',
    description: 'Pilih paket diamond/item yang sesuai dengan kebutuhan Anda. Harga sudah termasuk biaya layanan.',
  },
  {
    step: 3,
    title: 'Isi Data Akun',
    description: 'Masukkan User ID dan Server/Zone ID akun game Anda dengan benar. Pastikan data akun sudah sesuai agar proses top up berjalan lancar.',
  },
  {
    step: 4,
    title: 'Pilih Pembayaran',
    description: 'Pilih metode pembayaran yang tersedia (Transfer Bank, QRIS, E-Wallet, atau Minimarket).',
  },
  {
    step: 5,
    title: 'Bayar & Konfirmasi',
    description: 'Lakukan pembayaran sesuai nominal yang tertera dan kirimkan bukti transfer melalui WhatsApp admin atau formulir konfirmasi di website.',
  },
  {
    step: 6,
    title: 'Selesai! 🎉',
    description: 'Diamond/item akan masuk ke akun game Anda dalam hitungan menit setelah pembayaran dikonfirmasi oleh admin.',
  },
];

const faqItems = [
  {
    icon: Gamepad2,
    question: 'Game apa saja yang tersedia di Lapak Robux?',
    answer: 'Saat ini kami menyediakan top up untuk Mobile Legends, Free Fire, PUBG Mobile, Genshin Impact, Roblox, dan game lainnya. Daftar game terus kami perbarui setiap minggunya.',
  },
  {
    icon: CreditCard,
    question: 'Metode pembayaran apa saja yang diterima?',
    answer: 'Kami menerima pembayaran via Transfer Bank (BCA, Mandiri, BRI, BNI), QRIS, E-Wallet (DANA, OVO, GoPay, ShopeePay), dan minimarket (Alfamart, Indomaret).',
  },
  {
    icon: Truck,
    question: 'Berapa lama proses top up?',
    answer: 'Proses top up umumnya memakan waktu 1–15 menit setelah pembayaran dikonfirmasi. Pada jam sibuk atau saat server game sedang maintenance, prosesnya bisa lebih lama hingga maksimal 1x24 jam.',
  },
  {
    icon: ShoppingCart,
    question: 'Bagaimana cara melacak status pesanan saya?',
    answer: 'Anda dapat melacak status pesanan melalui halaman "Cek Pesanan" di website kami. Masukkan nomor WhatsApp yang Anda gunakan saat memesan untuk melihat semua riwayat transaksi.',
  },
  {
    icon: HelpCircle,
    question: 'Apa yang harus dilakukan jika top up gagal?',
    answer: 'Jika top up gagal, segera hubungi admin melalui WhatsApp. Jika kegagalan disebabkan oleh sistem kami, uang Anda akan dikembalikan (refund) dalam waktu 1–3 hari kerja.',
  },
  {
    icon: HelpCircle,
    question: 'Apakah aman bertransaksi di Lapak Robux?',
    answer: 'Ya, sangat aman. Data transaksi Anda dienkripsi dengan teknologi standar industri. Kami juga tidak menyimpan informasi sensitif seperti password akun game Anda.',
  },
  {
    icon: MessageCircle,
    question: 'Bagaimana cara menghubungi admin?',
    answer: 'Anda dapat menghubungi admin melalui WhatsApp yang tertera di website, atau melalui email support@lapakrobux.com. Respons admin tersedia setiap hari mulai pukul 08.00–23.00 WIB.',
  },
  {
    icon: HelpCircle,
    question: 'Apakah bisa refund jika salah memasukkan User ID?',
    answer: 'Mohon maaf, refund tidak berlaku jika kegagalan disebabkan oleh kesalahan input data (User ID, Server ID, Zone ID) dari pihak pembeli. Pastikan selalu mengecek ulang data Anda sebelum melanjutkan pembayaran.',
  },
];

function FaqAccordion({ item }: { item: typeof faqItems[number] }) {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = item.icon;

  return (
    <div className={`bg-white/[0.03] border rounded-2xl overflow-hidden transition-all ${isOpen ? 'border-primary/30 shadow-[0_0_20px_rgba(255,215,0,0.05)]' : 'border-white/10 hover:border-white/20'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-4 p-5 text-left cursor-pointer"
      >
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <span className="text-white font-semibold text-sm flex-1">{item.question}</span>
        <ChevronDown className={`w-5 h-5 text-white/40 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <p className="px-5 pb-5 pl-[4.5rem] text-white/50 text-sm leading-relaxed">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PanduanFaq() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Back Button */}
      <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-primary transition-colors mb-8 group text-sm font-medium">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Kembali ke Beranda
      </Link>

      {/* ===== PANDUAN SECTION ===== */}
      <div className="mb-16">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">Cara Top Up di Lapak Robux</h1>
          <p className="text-white/40 text-sm">Panduan lengkap cara melakukan pembelian diamond/item game</p>
        </div>

        <div className="grid gap-4">
          {guideSteps.map((s) => (
            <div key={s.step} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex items-start gap-5 hover:border-primary/20 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0 text-primary font-black text-lg border border-primary/20">
                {s.step}
              </div>
              <div>
                <h3 className="text-white font-bold text-base mb-1">{s.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== FAQ SECTION ===== */}
      <div>
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">Pertanyaan Umum (FAQ)</h2>
          <p className="text-white/40 text-sm">Temukan jawaban dari pertanyaan yang sering diajukan</p>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, i) => (
            <FaqAccordion key={i} item={item} />
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <div className="mt-12 bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
        <h3 className="text-white font-bold text-lg mb-2">Masih Ada Pertanyaan?</h3>
        <p className="text-white/50 text-sm mb-5">Tim kami siap membantu Anda setiap hari dari pukul 08.00–23.00 WIB</p>
        <a href="mailto:support@lapakrobux.com" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all hover:scale-105 active:scale-95">
          <MessageCircle className="w-4 h-4" />
          Hubungi Admin
        </a>
      </div>
    </div>
  );
}
