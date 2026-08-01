# 📋 Progres Proyek Bakso Pak Mul — Ghilbran
> **Terakhir Diperbarui:** 31 Juli 2026  
> **Branch:** `master` | **Stack:** Next.js 15, Prisma, Supabase, Midtrans, Tailwind CSS

---

## ✅ SUDAH SELESAI

### 🏗️ Fondasi & Infrastruktur
- [x] **Setup Project Next.js 15** — Struktur folder, konfigurasi TypeScript, ESLint
- [x] **Database Prisma + Supabase** — Schema lengkap (User, Product, Order, OrderItem, Cart), migrasi, seed data
- [x] **Autentikasi Supabase** — Login, Register, Verify OTP, Logout, Middleware proteksi rute
- [x] **Context API** — `CartContext` untuk manajemen keranjang belanja global
- [x] **Prisma Client Singleton** — `src/lib/prisma.ts` untuk koneksi DB yang efisien

---

### 🎨 Halaman Customer (Frontend)

| Halaman | URL | Status |
|---------|-----|--------|
| Beranda / Hero | `/` | ✅ Selesai |
| Katalog Produk | `/produk` | ✅ Selesai |
| Keranjang Belanja (Sidebar) | — | ✅ Selesai |
| Checkout & Pembayaran | `/checkout` | ✅ Selesai |
| Lacak Pesanan Live | `/lacak` | ✅ Selesai |
| Detail Pesanan | `/transaksi/[id]` | ✅ Selesai |
| Riwayat Transaksi | `/transaksi` | ✅ Selesai |
| Profil Pengguna | `/profil` | ✅ Selesai |
| Login | `/login` | ✅ Selesai |
| Register | `/register` | ✅ Selesai |
| Verify OTP | `/verify-otp` | ✅ Selesai |
| Tentang / About | `/tentang` | ✅ Selesai |

---

### 🛒 Fitur Checkout & Pembayaran
- [x] **Form Checkout** — Nama, email, telepon, alamat lengkap (provinsi, kota, detail)
- [x] **Kalkulasi Ongkir** — Gratis ongkir jika total ≥ Rp 200.000, jika tidak Rp 15.000
- [x] **Simpan Order ke DB** — Order dibuat di Prisma dengan format nomor `BPM-YYYYMMDD-XXXX`
- [x] **Integrasi Midtrans Snap** — Pembayaran via Midtrans (sandbox mode)
- [x] **Modal Pembayaran Kustom** — Modal maroon Bakso Pak Mul dengan 2 tab:
  - Tab **QRIS** — QR Code standar EMVCo QRIS Nasional (bisa discan aplikasi bank/e-wallet)
  - Tab **Virtual Account** — BCA, Mandiri, BNI, BRI dengan tombol salin nomor VA
- [x] **Metode COD** — Cash On Delivery (bayar di tempat)
- [x] **Hapus Transfer Manual** — Atas permintaan user, opsi transfer manual dihapus

---

### 🔁 Fitur Bayar Ulang (Transaksi Pending)
- [x] **Banner Peringatan Belum Dibayar** — Tampil otomatis jika status pesanan `PENDING`
- [x] **Tombol Bayar Sekarang / Bayar Ulang** — Membuka modal pembayaran langsung dari halaman `/transaksi/[id]`
- [x] **Indikator Status** — Banner hijau jika PAID/COMPLETED, merah jika CANCELED

---

### 🛠️ Panel Admin

| Halaman | URL | Status |
|---------|-----|--------|
| Dashboard Admin | `/admin` | ✅ Selesai |
| Manajemen Produk | `/admin/inventory` | ✅ Selesai |
| Manajemen Pesanan | `/admin/orders` | ✅ Selesai |
| Manajemen Promosi | `/admin/promotions` | ✅ Selesai (dinonaktifkan di customer) |
| Pengaturan Toko | `/admin/settings` | ✅ Selesai |

#### Fitur Admin Orders:
- [x] **Tabel Pesanan** — Daftar semua pesanan dengan filter & sort
- [x] **Ubah Status Pesanan** — Dari PENDING → PROCESSING → SHIPPED → COMPLETED
- [x] **Cetak Invoice / Struk PDF** — Tombol 🖨️ di setiap baris pesanan
- [x] **Batalkan Pesanan** — Tombol ❌ + modal konfirmasi, mengubah status ke `CANCELED`

---

### 🔌 API Endpoints

| Endpoint | Method | Fungsi | Status |
|----------|--------|--------|--------|
| `/api/products` | GET | Ambil semua produk | ✅ |
| `/api/products` | POST | Tambah produk baru | ✅ |
| `/api/products/[id]` | PUT | Update produk | ✅ |
| `/api/products/[id]` | DELETE | Hapus produk | ✅ |
| `/api/orders` | GET | Ambil semua pesanan | ✅ |
| `/api/orders/[id]` | GET | Detail satu pesanan | ✅ |
| `/api/orders/[id]` | PATCH | Update status pesanan | ✅ |
| `/api/checkout` | POST | Buat pesanan baru | ✅ |
| `/api/cart` | GET/POST/DELETE | Manajemen keranjang | ✅ |
| `/api/images` | GET | Daftar gambar produk | ✅ |
| `/api/tokenizer` | POST | Token Midtrans | ✅ |
| `/auth/callback` | GET | Callback OAuth Supabase | ✅ |

---

### 🎨 UI / UX
- [x] **Design System** — Warna maroon `#51000d` sebagai brand color utama
- [x] **Google Fonts Inter** — Tipografi konsisten di seluruh aplikasi
- [x] **Navbar** — Logo, navigasi, tombol profil/login, ikon keranjang
- [x] **Bottom Nav Mobile** — Navigasi bawah untuk tampilan mobile
- [x] **Cart Sidebar** — Slide-in dari kanan, daftar item, total, tombol ke checkout
- [x] **Footer** — Informasi toko & tautan
- [x] **Produk Favorit** — 3 kartu acak di beranda (Bakso, Mie, Bumbu)
- [x] **Katalog Prioritas** — Bakso & Mie paling atas, Bumbu paling bawah

---

## ❌ BELUM SELESAI / TODO

### 🎟️ Fitur Promo / Kupon
- [ ] **Halaman Promo Customer** — Dinonaktifkan dari Navbar atas permintaan. Perlu diaktifkan kembali ketika siap launch.
- [ ] **Input Kode Kupon di Checkout** — Form input kupon belum diimplementasikan di halaman checkout
- [ ] **Validasi Kupon via API** — Endpoint `POST /api/coupons/validate` belum dibuat
- [ ] **Admin Kelola Kupon** — CRUD kupon di panel admin sudah ada UI-nya tapi belum terhubung ke backend

### 📦 Manajemen Stok
- [ ] **Tracking Stok Produk** — Kolom stok ada di schema tapi belum ada logika pengurangan stok saat order masuk
- [ ] **Notifikasi Stok Menipis** — Alert admin jika stok produk < X unit

### 💳 Pembayaran Production
- [ ] **Midtrans Production Keys** — Masih menggunakan Sandbox (`SB-Mid-server-...`). Perlu ganti ke Production key saat launch agar QRIS benar-benar bisa dibayar
- [ ] **Webhook Midtrans** — Endpoint `/api/payment/notification` untuk menerima notifikasi status pembayaran otomatis dari Midtrans (saat ini status masih diupdate manual)

### 📬 Notifikasi
- [ ] **Email Konfirmasi Pesanan** — Email otomatis ke customer setelah order berhasil dibuat
- [ ] **Email Notifikasi Admin** — Notifikasi email/WhatsApp ke admin jika ada pesanan baru
- [ ] **WhatsApp Notifikasi** — Integrasi dengan Fonnte/Wablas untuk notifikasi WA

### 🔍 Fitur Lanjutan Customer
- [ ] **Pencarian Produk** — Search bar di halaman `/produk` masih tampilan saja, belum fungsional
- [ ] **Filter Produk** — Filter per kategori di halaman produk belum terhubung ke API
- [ ] **Review / Rating Produk** — Belum ada fitur ulasan produk
- [ ] **Wishlist / Favorit** — Belum ada fitur simpan produk favorit

### 🚀 Deployment
- [ ] **Deploy ke Vercel** — Aplikasi belum di-deploy ke production (masih lokal `localhost:3000`)
- [ ] **Setup Environment Variables Production** — `.env` production di Vercel belum dikonfigurasi
- [ ] **Domain Custom** — Belum ada domain custom (misal: `baksopakmul.com`)
- [ ] **Optimasi Gambar** — Gambar produk di `public/images/` belum dioptimasi untuk web (WebP, kompresi)

### 📊 Laporan & Analitik
- [ ] **Laporan Penjualan** — Grafik/tabel pendapatan harian/bulanan di admin dashboard
- [ ] **Export Data Pesanan** — Export ke Excel/CSV dari panel admin
- [ ] **Analytics** — Integrasi Google Analytics atau Vercel Analytics

---

## 📝 Catatan Penting

> **⚠️ Midtrans Sandbox**: QRIS saat ini menggunakan payload EMVCo statis (bisa discan, tapi belum terhubung ke sistem pembayaran nyata). Untuk production, perlu Midtrans Production Key + Webhook.

> **🗄️ Database**: PostgreSQL di Supabase. Pastikan `DATABASE_URL` dan `DIRECT_URL` di `.env` selalu terupdate.

> **🔐 Environment Variables yang Diperlukan**:
> ```
> DATABASE_URL
> DIRECT_URL  
> NEXT_PUBLIC_SUPABASE_URL
> NEXT_PUBLIC_SUPABASE_ANON_KEY
> SUPABASE_SERVICE_ROLE_KEY
> MIDTRANS_SERVER_KEY
> NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
> ```

---

*Dibuat otomatis oleh Antigravity AI — 31 Juli 2026*
