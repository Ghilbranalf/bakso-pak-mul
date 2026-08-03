"use client";

import React, { useState } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminSettingsPage() {
  const [promoActive, setPromoActive] = useState(true);
  const [bannerActive, setBannerActive] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1a1c1c] font-sans antialiased flex flex-col lg:flex-row">
      {/* Shared Reusable Admin Sidebar */}
      <AdminSidebar activeMenu="settings" />

      {/* Main Content Area */}
      <main className="flex-1 w-full lg:ml-[260px] min-h-screen pb-24 lg:pb-8">
        {/* TopAppBar Shell */}
        <header className="sticky top-0 w-full z-30 h-20 bg-white/70 backdrop-blur-xl border-b border-gray-200 flex items-center justify-between px-6 md:px-12 shadow-sm">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 text-[#51000d]">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h2 className="text-xl md:text-2xl font-black text-[#51000d]">Bakso Pak Mul</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 text-gray-500 font-medium text-sm">
              <Link href="/" className="hover:text-[#51000d] transition-colors">Lihat Website</Link>
              <Link href="/produk" className="hover:text-[#51000d] transition-colors">Katalog Produk</Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#51000d] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="p-6 md:p-12 space-y-8 max-w-[1200px] mx-auto w-full">
          <header className="mb-8">
            <h1 className="text-3xl font-extrabold text-[#51000d] tracking-tight">Pengaturan Sistem Admin</h1>
            <p className="text-sm text-gray-500 font-medium mt-1">Kelola konfigurasi platform usaha dan keamanan sistem.</p>
          </header>

          {/* Settings Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Website General Settings */}
            <section className="lg:col-span-7 bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-[#51000d]">
                  <span className="material-symbols-outlined text-xl">public</span>
                </div>
                <h3 className="text-lg font-bold text-[#51000d]">Pengaturan Umum</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 px-1">Judul Website</label>
                  <input className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm font-semibold text-gray-900 focus:bg-white focus:border-[#51000d] transition-all outline-none" type="text" defaultValue="Bakso Pak Mul | Grosir & Eceran Premium" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 px-1">Email Utama</label>
                  <input className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm font-semibold text-gray-900 focus:bg-white focus:border-[#51000d] transition-all outline-none" type="email" defaultValue="sales@baksopakmul.com" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 px-1">Nomor WhatsApp Business</label>
                  <input className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm font-semibold text-gray-900 focus:bg-white focus:border-[#51000d] transition-all outline-none" type="text" defaultValue="+62 812-3456-7890" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 px-1">Alamat Utama Usaha</label>
                  <input className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm font-semibold text-gray-900 focus:bg-white focus:border-[#51000d] transition-all outline-none" type="text" defaultValue="Pasar Kramat Jati, Jakarta Timur" />
                </div>
              </div>

              <div className="pt-2">
                <label className="text-xs font-bold text-gray-500 px-1 mb-2 block">Logo Toko</label>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-[#51000d] transition-all cursor-pointer">
                  <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">upload_file</span>
                  <p className="text-sm font-bold text-gray-600">Tarik berkas logo ke sini atau klik untuk memilih</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">PNG, SVG atau WEBP (Maksimal 2MB)</p>
                </div>
              </div>
            </section>

            {/* Seasonal Promo Toggle & Landing Page */}
            <section className="lg:col-span-5 bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-[#7a0019]">
                  <span className="material-symbols-outlined text-xl">auto_awesome</span>
                </div>
                <h3 className="text-lg font-bold text-[#51000d]">Tampilan Beranda</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 px-1">Teks Banner Utama</label>
                  <textarea 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-semibold text-gray-900 focus:bg-white focus:border-[#51000d] transition-all outline-none resize-none" 
                    rows={3}
                    defaultValue="Cita rasa bakso & mie ayam autentik sejak 2000. Siap melayani pesanan keluarga dan mitra pedagang."
                  ></textarea>
                </div>

                <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${promoActive ? 'bg-red-50/50 border-[#51000d]/30' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#51000d]">Promo Musiman Ramadhan</span>
                    <span className="text-xs text-gray-500 font-medium">Aktifkan atau nonaktifkan banner promo khusus</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={promoActive} onChange={() => setPromoActive(!promoActive)} />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#51000d]"></div>
                  </label>
                </div>

                <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${bannerActive ? 'bg-red-50/50 border-[#51000d]/30' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#51000d]">Banner Produk Unggulan</span>
                    <span className="text-xs text-gray-500 font-medium">Tampilkan sorotan video Bakso Super</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={bannerActive} onChange={() => setBannerActive(!bannerActive)} />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#51000d]"></div>
                  </label>
                </div>
              </div>
            </section>

            {/* Business Rules */}
            <section className="lg:col-span-12 bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-[#51000d]">
                    <span className="material-symbols-outlined text-xl">gavel</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#51000d]">Aturan Pesanan &amp; Usaha</h3>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 border border-green-200 rounded-full text-[10px] font-extrabold uppercase tracking-wider hidden sm:block">
                  Konfigurasi Aktif
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3 p-5 bg-gray-50 rounded-2xl border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[#7a0019] text-lg">inventory</span>
                    <label className="text-sm font-bold text-[#51000d]">Min. Pesanan Grosir</label>
                  </div>
                  <div className="relative">
                    <input className="w-full h-12 bg-white border border-gray-300 rounded-xl px-4 pr-12 text-sm font-bold text-gray-900 focus:border-[#51000d] outline-none transition-all" type="number" defaultValue="50" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs">Bungkus</span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium">Jumlah minimal barang untuk harga grosir.</p>
                </div>

                <div className="space-y-3 p-5 bg-gray-50 rounded-2xl border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[#7a0019] text-lg">percent</span>
                    <label className="text-sm font-bold text-[#51000d]">Tarif Pajak (PPN)</label>
                  </div>
                  <div className="relative">
                    <input className="w-full h-12 bg-white border border-gray-300 rounded-xl px-4 pr-10 text-sm font-bold text-gray-900 focus:border-[#51000d] outline-none transition-all" type="number" defaultValue="0" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">%</span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium">Pajak standar yang diterapkan pada transaksi.</p>
                </div>

                <div className="space-y-3 p-5 bg-gray-50 rounded-2xl border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[#7a0019] text-lg">local_shipping</span>
                    <label className="text-sm font-bold text-[#51000d]">Zona Gratis Ongkir</label>
                  </div>
                  <select className="w-full h-12 bg-white border border-gray-300 rounded-xl px-4 text-sm font-bold text-gray-900 focus:border-[#51000d] outline-none transition-all cursor-pointer">
                    <option>Wilayah Jabodetabek</option>
                    <option>Wilayah Jawa Barat</option>
                    <option>Wilayah Jawa Tengah</option>
                    <option>Seluruh Jawa &amp; Bali</option>
                  </select>
                  <p className="text-[11px] text-gray-500 font-medium">Jangkauan gratis pengiriman logistik.</p>
                </div>
              </div>
            </section>

            {/* Security & API */}
            <section className="lg:col-span-12 bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                  <span className="material-symbols-outlined text-xl">security</span>
                </div>
                <h3 className="text-lg font-bold text-[#51000d]">Keamanan &amp; Akses Admin</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Nama Admin</th>
                      <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Peran</th>
                      <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Aktivitas Terakhir</th>
                      <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-100 text-[#7a0019] flex items-center justify-center font-bold text-[10px]">PM</div>
                        <span className="text-sm font-bold text-gray-900">Pak Mulyono (Pemilik)</span>
                      </td>
                      <td className="py-4"><span className="px-3 py-1 bg-red-50 border border-red-200 text-[#51000d] rounded-full text-[10px] font-extrabold uppercase">Super Admin</span></td>
                      <td className="py-4 text-xs font-medium text-green-600">Sedang Aktif</td>
                      <td className="py-4"><button className="text-xs font-bold text-[#7a0019] hover:underline cursor-pointer">Kelola</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Save Actions Bar */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <button className="px-6 py-3 text-xs font-bold text-gray-500 hover:text-gray-900 transition-all cursor-pointer">Batalkan Perubahan</button>
            <button className="px-8 py-3 bg-[#51000d] text-white rounded-xl text-xs font-bold hover:bg-[#7a0019] transition-all shadow-md active:scale-95 uppercase tracking-wider cursor-pointer">Simpan Konfigurasi Sistem</button>
          </div>
        </div>

        {/* Footer Shell */}
        <footer className="w-full py-10 px-6 md:px-12 bg-white grid grid-cols-1 md:grid-cols-4 gap-8 mt-auto border-t border-gray-200 text-xs font-medium text-gray-500">
          <div className="md:col-span-1">
            <h4 className="font-bold text-gray-900 text-sm mb-2">Bakso Pak Mul</h4>
            <p className="leading-relaxed">Sistem Manajemen &amp; Distribusi Produk Bakso Pak Mul.</p>
          </div>
          <div className="md:col-span-1 flex flex-col gap-2">
            <h5 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] mb-1">Tautan Cepat</h5>
            <Link href="/" className="hover:text-[#51000d] transition-colors">Beranda</Link>
            <Link href="/produk" className="hover:text-[#51000d] transition-colors">Katalog Produk</Link>
          </div>
          <div className="md:col-span-1 flex flex-col gap-2">
            <h5 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] mb-1">Bantuan &amp; Dukungan</h5>
            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="hover:text-[#51000d] transition-colors">Hubungi CS WhatsApp</a>
          </div>
          <div className="md:col-span-1 text-left md:text-right flex flex-col justify-between">
            <p>© 2024 Bakso Pak Mul. Hak Cipta Dilindungi.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
