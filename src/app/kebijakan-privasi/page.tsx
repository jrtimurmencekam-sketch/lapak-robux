import Link from 'next/link';
import { ArrowLeft, Eye, Database, Lock, Share2, UserCheck, Bell } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi | LAPAK ROBUX',
  description: 'Kebijakan privasi mengenai pengumpulan dan pengelolaan data pengguna di Lapak Robux.',
};

const sections = [
  {
    icon: Eye,
    title: '1. Informasi yang Kami Kumpulkan',
    items: [
      'Nomor WhatsApp / Telepon yang digunakan saat melakukan pemesanan.',
      'User ID, Server ID, atau Zone ID akun game Anda (hanya untuk keperluan proses top up).',
      'Detail transaksi termasuk jenis produk, nominal, dan metode pembayaran.',
      'Alamat IP dan jenis perangkat yang digunakan saat mengakses website (secara otomatis oleh server).',
    ],
  },
  {
    icon: Database,
    title: '2. Penggunaan Informasi',
    items: [
      'Memproses pesanan top up sesuai permintaan Anda.',
      'Mengirimkan konfirmasi dan notifikasi status pesanan melalui WhatsApp atau Telegram.',
      'Meningkatkan kualitas layanan dan pengalaman pengguna di platform Lapak Robux.',
      'Melakukan analisis internal untuk keperluan pengelolaan bisnis (tanpa mengidentifikasi pengguna secara personal).',
    ],
  },
  {
    icon: Lock,
    title: '3. Perlindungan Data',
    items: [
      'Seluruh data transaksi disimpan dengan enkripsi standar industri melalui infrastruktur Supabase (PostgreSQL dengan Row Level Security).',
      'Akses ke database dibatasi hanya untuk admin yang berwenang.',
      'Kami tidak menyimpan informasi sensitif seperti nomor kartu kredit atau kata sandi rekening bank Anda.',
      'Data User ID game Anda hanya digunakan untuk keperluan proses top up dan tidak akan disalahgunakan.',
    ],
  },
  {
    icon: Share2,
    title: '4. Pembagian Data ke Pihak Ketiga',
    items: [
      'Lapak Robux TIDAK menjual, menyewakan, atau membagikan data pribadi Anda kepada pihak ketiga untuk tujuan pemasaran.',
      'Data hanya dapat dibagikan jika diwajibkan oleh hukum yang berlaku di Indonesia.',
      'Kami menggunakan layanan pihak ketiga terpercaya (seperti Supabase untuk database dan Telegram Bot untuk notifikasi) yang memiliki kebijakan privasi tersendiri.',
    ],
  },
  {
    icon: UserCheck,
    title: '5. Hak Pengguna',
    items: [
      'Anda berhak meminta informasi lengkap mengenai data pribadi Anda yang kami simpan.',
      'Anda berhak meminta penghapusan data pribadi Anda dari sistem kami (kecuali data yang diperlukan untuk keperluan hukum/audit).',
      'Anda berhak menolak penggunaan data Anda untuk keperluan analisis internal.',
      'Permintaan terkait hak di atas dapat diajukan melalui email support@lapakrobux.com.',
    ],
  },
  {
    icon: Bell,
    title: '6. Perubahan Kebijakan',
    items: [
      'Lapak Robux berhak memperbarui kebijakan privasi ini sewaktu-waktu.',
      'Perubahan signifikan akan diumumkan melalui website atau kanal komunikasi resmi kami.',
      'Penggunaan layanan setelah perubahan kebijakan dianggap sebagai persetujuan Anda terhadap kebijakan yang baru.',
    ],
  },
];

export default function KebijakanPrivasi() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Back Button */}
      <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-primary transition-colors mb-8 group text-sm font-medium">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Kembali ke Beranda
      </Link>

      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">Kebijakan Privasi</h1>
        <p className="text-white/40 text-sm">Terakhir diperbarui: Februari 2026</p>
      </div>

      {/* Intro */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-8">
        <p className="text-white/60 text-sm leading-relaxed">
          <span className="text-primary font-semibold">Lapak Robux</span> menghormati dan melindungi privasi setiap pengguna. Kebijakan ini menjelaskan jenis data apa saja yang kami kumpulkan, bagaimana kami menggunakannya, serta langkah-langkah yang kami ambil untuk melindungi data Anda.
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
          Untuk pertanyaan atau permintaan terkait data pribadi Anda, silakan hubungi kami melalui <span className="text-primary font-semibold">support@lapakrobux.com</span>
        </p>
      </div>
    </div>
  );
}
