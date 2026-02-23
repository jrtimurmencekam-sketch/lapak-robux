import Link from 'next/link';
import { ArrowLeft, ShieldCheck, AlertTriangle, RefreshCcw, CreditCard, Scale, Clock } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan | LAPAK ROBUX',
  description: 'Syarat dan ketentuan penggunaan layanan top up game di Lapak Robux.',
};

const sections = [
  {
    icon: ShieldCheck,
    title: '1. Ketentuan Umum',
    items: [
      'Dengan menggunakan layanan Lapak Robux, Anda menyetujui dan terikat pada seluruh syarat dan ketentuan yang berlaku di platform ini.',
      'Lapak Robux adalah platform penyedia layanan top up (pengisian saldo/diamond/item) untuk berbagai game online.',
      'Pengguna wajib berusia minimal 13 tahun atau mendapat persetujuan dari orang tua/wali.',
      'Lapak Robux berhak mengubah syarat dan ketentuan ini sewaktu-waktu tanpa pemberitahuan terlebih dahulu.',
    ],
  },
  {
    icon: CreditCard,
    title: '2. Transaksi & Pembayaran',
    items: [
      'Seluruh harga yang tercantum sudah dalam mata uang Rupiah (IDR) dan bersifat final.',
      'Pembayaran harus dilakukan sesuai dengan metode yang tersedia dan dalam batas waktu yang ditentukan.',
      'Pesanan yang tidak dibayar dalam batas waktu akan otomatis dibatalkan oleh sistem.',
      'Bukti pembayaran (screenshot transfer) wajib dikirimkan melalui formulir konfirmasi atau WhatsApp admin.',
      'Proses top up akan dimulai setelah pembayaran terverifikasi oleh admin.',
    ],
  },
  {
    icon: Clock,
    title: '3. Waktu Proses',
    items: [
      'Proses top up umumnya memakan waktu 1–15 menit setelah pembayaran dikonfirmasi.',
      'Pada jam sibuk atau maintenance server game, waktu proses bisa lebih lama (hingga 1x24 jam).',
      'Status pesanan dapat dilacak melalui halaman "Cek Pesanan" di website.',
    ],
  },
  {
    icon: RefreshCcw,
    title: '4. Kebijakan Pengembalian Dana (Refund)',
    items: [
      'Pengembalian dana hanya berlaku jika top up gagal diproses karena kesalahan dari pihak Lapak Robux.',
      'Refund TIDAK berlaku jika kegagalan disebabkan oleh kesalahan input data dari pihak pembeli (User ID, Server ID, Zone ID salah).',
      'Pengajuan refund harus dilakukan dalam waktu maksimal 1x24 jam setelah transaksi.',
      'Proses refund memerlukan waktu 1–3 hari kerja dan akan dikembalikan ke rekening asal pengguna.',
      'Lapak Robux berhak menolak permohonan refund jika ditemukan indikasi penyalahgunaan.',
    ],
  },
  {
    icon: AlertTriangle,
    title: '5. Larangan Pengguna',
    items: [
      'Dilarang menggunakan layanan untuk tujuan penipuan, pencucian uang, atau aktivitas ilegal lainnya.',
      'Dilarang melakukan chargeback secara sepihak tanpa konfirmasi admin.',
      'Dilarang menyebarkan informasi palsu mengenai layanan Lapak Robux.',
      'Pelanggaran terhadap ketentuan ini dapat mengakibatkan pemblokiran akun tanpa pengembalian dana.',
    ],
  },
  {
    icon: Scale,
    title: '6. Batasan Tanggung Jawab',
    items: [
      'Lapak Robux tidak bertanggung jawab atas kerugian yang timbul akibat kesalahan input data oleh pengguna.',
      'Lapak Robux tidak bertanggung jawab atas gangguan layanan yang disebabkan oleh pihak ketiga (server game, jaringan, dsb).',
      'Lapak Robux tidak berafiliasi secara resmi dengan developer game manapun.',
    ],
  },
];

export default function SyaratKetentuan() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Back Button */}
      <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-primary transition-colors mb-8 group text-sm font-medium">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Kembali ke Beranda
      </Link>

      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">Syarat & Ketentuan</h1>
        <p className="text-white/40 text-sm">Terakhir diperbarui: Februari 2026</p>
      </div>

      {/* Intro */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-8">
        <p className="text-white/60 text-sm leading-relaxed">
          Selamat datang di <span className="text-primary font-semibold">Lapak Robux</span>. Silakan baca dengan seksama syarat dan ketentuan berikut sebelum menggunakan layanan kami. Dengan melakukan transaksi di platform ini, Anda dianggap telah membaca, memahami, dan menyetujui seluruh ketentuan di bawah ini.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-primary/20 transition-colors">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-bold text-white">{section.title}</h2>
              </div>
              <ul className="space-y-3 pl-1">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/60 text-sm leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0 mt-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Contact */}
      <div className="mt-12 bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
        <p className="text-white/70 text-sm">
          Jika Anda memiliki pertanyaan mengenai Syarat & Ketentuan ini, silakan hubungi kami melalui <span className="text-primary font-semibold">support@lapakrobux.com</span>
        </p>
      </div>
    </div>
  );
}
