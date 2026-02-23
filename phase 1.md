Lapak Robux: Phase 1 Walkthrough 🚀
Dokumen ini merangkum seluruh fitur, teknologi, dan progres yang telah berhasil diselesaikan pada Fase 1 untuk proyek Website E-Commerce Top-Up Game & Pulsa.

🎨 Design & UI/UX (Frontend)
Tampilan dibuat 100% responsif (Mobile-First) dengan estetika Premium Dark-Gold (Glassmorphism), cocok untuk audiens gamers yang terbiasa dengan desain dinamis ala VCGamers/Codashop.

Theme Utama: Background hitam/gelap (#050505) dengan aksen Gold/Yellow neon (#FFD700).
Komponen Kunci:
Hero Section: Slider/Carousel promo dinamis.
Category Nav: Tombol kategori horizontal-scrollable (Game, Voucher, Pulsa).
Game Cards: Kotak produk estetik dengan label Promo Dinamis (-30%).
Checkout Flow: Desain form pembelian (Masukkan ID, Pilih Nominal, Pilih Pembayaran) 1 halaman penuh ala One-Page Checkout.
Toast Notifications: Alert elegan saat pengguna klik Beli, Salin Nomor, atau terjadi Error.
⚙️ Core System & Database (Supabase)
Sistem backend menggunakan arsitektur modern Serverless (Supabase + Next.js App Router).

Tabel Relasional yang Dibangun:
users: Sistem autentikasi admin.
categories: Kategori utama produk.
products: Katalog game/pulsa (termasuk slug URL SEO-friendly & gambar katalog).
orders: Pencatatan transaksi, bukti TRF, status Pending, Processing, Completed, Failed.
payment_methods: Pengaturan Bank/E-Wallet dinamis lengkap dengan panduan bayar.
promo_banners: Pengaturan gambar slider dinamis untuk Homepage.
Keamanan: Menerapkan Row Level Security (RLS). Hanya Admin ber-otoritas yang bisa Create/Update/Delete data. Publik hanya mode Read.
Storage: Pembuatan sistem "Brankas Digital" payment_proofs ber-URL Publik untuk menyimpan aset gambar admin (Gambar Produk, QRIS, Banner).
🛒 Order Automation (Telegram Bot)
Alih-alih menyuruh pembeli Upload bukti transfer secara rumit dan membebani memori database website:

Website menggunakan API Route khusus (/api/order).
Semua data pesanan (Nomor Invoice, Data Akun, Total Harga, Metode Pilihan) dan Foto Bukti Transfer (dikirim via formData) langsung di-tembak secara rahasia ke Server Telegram Bot milik Owner.
Website tetap ringan, Admin seketika mendapat Notifikasi "Buzzer" di HP.
👑 Admin Panel (Premium Dashboard)
Panel "Dapur Lapak" khusus Owner yang anti-ribet, didesain semudah aplikasi mobile. Seluruh menu dibuat model Grid Glassmorphism ketimbang Tabel kaku.

Dashboard Utama (/admin): Menampilkan ringkasan total pesanan terbaru, order tunda, dan status toko.
Manajemen Pesanan (/admin/orders):
Melihat Invoice masuk.
Membuka gambar bukti transfer via pop-up.
Mengubah Status pengiriman Diamond ke pembeli (Approve/Reject).
Manajemen Katalog (/admin/categories & /admin/products):
Tombol ON/OFF (Toggle) sekali klik untuk menonaktifkan game yang maintenance atau mematikan harga receh di bawah Rp.70.000.
Modul otomatis Price-Multiplier yang mengkalkulasi nominal hingga harga Rp. 3.000.000 otomatis 30% lebih murah dari pasar, tanpa perlu input manual.
Direct File Upload: Admin bisa jepret foto game / upload gambar langsung tanpa ngetik URL panjang.
Manajemen Pembayaran (/admin/payment-methods):
Tambah/Hapus opsi Bank, E-Wallet, atau QRIS dinamis.
Pembeli otomatis mendapat pilihan Transfer sesuai Bank yang Admin aktifkan di menu ini.
Manajemen Promosi (/admin/banners):
Upload gambar Landscape untuk menyapa pembeli di halaman paling depan (Carousel Banner).
🛠️ Testing & Quality Assurance
Seluruh logic dan skenario penggunaan ekstrim sudah diuji coba:

Auto Out-of-Stock: Item < Rp.70.000 langsung dilabeli "HABIS" otomatis di semua Game.
Hitung Cepat: Label promo "30% Lebih Murah" menempel sempurna di daftar nominal pembeli.
Responsive Breakpoints: Menu Samping (Sidebar) Admin bisa disembunyikan / dibuka (Drawer) pakai tombol Hamburger dari layar iPhone sekecil apa pun.
Error Handling: Pembeli tidak bisa spam klik Beli kalau kolom ID Game atau Bukti Transfer kosong.
🔜 Next Steps / Rekomendasi (Phase 2)
Deployment Publik (Vercel): Website sudah kuat secara lokal. Siap dibungkus (Build) dan ditayangkan ke domain .com.
Integrasi Check-Payment Otomatis: Menyambungkan mutasi saldo (Payment Gateway seperti Tripay/Midtrans) sehingga pesanan bisa Auto-Process detik itu juga.
Database Caching: Mengoptimalkan fetching Supabase agar UI bisa me-load gambar Katalog di bawah 1 detik (Edge Network).
