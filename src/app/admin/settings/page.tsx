"use client";

import React, { useState } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import { useAdminTheme } from "@/context/AdminThemeContext";

export default function AdminSettingsPage() {
  const { isDark } = useAdminTheme();
  const [promoActive, setPromoActive] = useState(true);
  const [bannerActive, setBannerActive] = useState(false);

  return (
    <div className={`min-h-screen font-sans antialiased flex transition-colors ${
      isDark ? "bg-[#0f0f0f] text-white" : "bg-[#f8f9fa] text-gray-900"
    }`}>
      {/* Shared Reusable Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 max-w-full overflow-x-hidden lg:ml-[240px] min-h-screen p-4 md:p-6 lg:p-8 pt-18 lg:pt-8 pb-32 lg:pb-8">
        <header className="mb-6">
          <h1 className={`text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Pengaturan Sistem Admin</h1>
          <p className={`text-sm mt-0.5 ${isDark ? "text-white/40" : "text-gray-500"}`}>Kelola konfigurasi platform usaha dan keamanan sistem.</p>
        </header>

        {/* Settings Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Website General Settings */}
          <section className={`lg:col-span-7 p-5 md:p-6 rounded-2xl border space-y-5 ${
            isDark ? "bg-[#1a1a1a] border-white/5" : "bg-white border-gray-200/80 shadow-sm"
          }`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isDark ? "bg-white/5 text-amber-400" : "bg-[#51000d]/10 text-[#51000d]"
              }`}>
                <span className="material-symbols-outlined text-lg">public</span>
              </div>
              <h3 className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Pengaturan Umum</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className={`text-xs font-medium px-1 ${isDark ? "text-white/50" : "text-gray-600"}`}>Judul Website</label>
                <input
                  className={`w-full h-10 rounded-xl px-3.5 text-xs transition-all outline-none border ${
                    isDark ? "bg-white/5 border-white/10 text-white focus:border-white/20" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#51000d]"
                  }`}
                  type="text"
                  defaultValue="Bakso Pak Mul | Grosir & Eceran Premium"
                />
              </div>
              <div className="space-y-1">
                <label className={`text-xs font-medium px-1 ${isDark ? "text-white/50" : "text-gray-600"}`}>Email Utama</label>
                <input
                  className={`w-full h-10 rounded-xl px-3.5 text-xs transition-all outline-none border ${
                    isDark ? "bg-white/5 border-white/10 text-white focus:border-white/20" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#51000d]"
                  }`}
                  type="email"
                  defaultValue="sales@baksopakmul.com"
                />
              </div>
              <div className="space-y-1">
                <label className={`text-xs font-medium px-1 ${isDark ? "text-white/50" : "text-gray-600"}`}>Nomor WhatsApp Business</label>
                <input
                  className={`w-full h-10 rounded-xl px-3.5 text-xs transition-all outline-none border ${
                    isDark ? "bg-white/5 border-white/10 text-white focus:border-white/20" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#51000d]"
                  }`}
                  type="text"
                  defaultValue="+62 812-3456-7890"
                />
              </div>
              <div className="space-y-1">
                <label className={`text-xs font-medium px-1 ${isDark ? "text-white/50" : "text-gray-600"}`}>Alamat Utama Usaha</label>
                <input
                  className={`w-full h-10 rounded-xl px-3.5 text-xs transition-all outline-none border ${
                    isDark ? "bg-white/5 border-white/10 text-white focus:border-white/20" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#51000d]"
                  }`}
                  type="text"
                  defaultValue="Pasar Kramat Jati, Jakarta Timur"
                />
              </div>
            </div>

            <div>
              <label className={`text-xs font-medium px-1 mb-1.5 block ${isDark ? "text-white/50" : "text-gray-600"}`}>Logo Toko</label>
              <div className={`border border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-all cursor-pointer ${
                isDark ? "border-white/15 bg-white/3 hover:bg-white/5" : "border-gray-300 bg-gray-50 hover:bg-gray-100"
              }`}>
                <span className="material-symbols-outlined text-3xl opacity-40 mb-1">upload_file</span>
                <p className={`text-xs font-medium ${isDark ? "text-white/60" : "text-gray-700"}`}>Tarik berkas logo ke sini atau klik untuk memilih</p>
                <p className={`text-[10px] uppercase mt-1 ${isDark ? "text-white/30" : "text-gray-400"}`}>PNG, SVG atau WEBP (Maksimal 2MB)</p>
              </div>
            </div>
          </section>

          {/* Seasonal Promo Toggle & Landing Page */}
          <section className={`lg:col-span-5 p-5 md:p-6 rounded-2xl border space-y-5 ${
            isDark ? "bg-[#1a1a1a] border-white/5" : "bg-white border-gray-200/80 shadow-sm"
          }`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isDark ? "bg-white/5 text-amber-400" : "bg-[#51000d]/10 text-[#51000d]"
              }`}>
                <span className="material-symbols-outlined text-lg">auto_awesome</span>
              </div>
              <h3 className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Tampilan Beranda</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className={`text-xs font-medium px-1 ${isDark ? "text-white/50" : "text-gray-600"}`}>Teks Banner Utama</label>
                <textarea
                  className={`w-full rounded-xl p-3 text-xs transition-all outline-none resize-none border ${
                    isDark ? "bg-white/5 border-white/10 text-white focus:border-white/20" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#51000d]"
                  }`}
                  rows={3}
                  defaultValue="Cita rasa bakso & mie ayam autentik sejak 2000. Siap melayani pesanan keluarga dan mitra pedagang."
                ></textarea>
              </div>

              <div className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                promoActive
                  ? isDark ? 'bg-amber-400/5 border-amber-400/20' : 'bg-red-50 border-red-200'
                  : isDark ? 'bg-white/3 border-white/5' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex flex-col">
                  <span className={`text-xs font-medium ${isDark ? "text-white" : "text-gray-900"}`}>Promo Musiman Ramadhan</span>
                  <span className={`text-[10px] ${isDark ? "text-white/30" : "text-gray-500"}`}>Aktifkan atau nonaktifkan banner promo khusus</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={promoActive} onChange={() => setPromoActive(!promoActive)} />
                  <div className={`w-9 h-5 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${
                    isDark ? "bg-white/20 peer-checked:bg-amber-400" : "bg-gray-300 peer-checked:bg-[#51000d]"
                  }`}></div>
                </label>
              </div>

              <div className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                bannerActive
                  ? isDark ? 'bg-amber-400/5 border-amber-400/20' : 'bg-red-50 border-red-200'
                  : isDark ? 'bg-white/3 border-white/5' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex flex-col">
                  <span className={`text-xs font-medium ${isDark ? "text-white" : "text-gray-900"}`}>Banner Produk Unggulan</span>
                  <span className={`text-[10px] ${isDark ? "text-white/30" : "text-gray-500"}`}>Tampilkan sorotan video Bakso Super</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={bannerActive} onChange={() => setBannerActive(!bannerActive)} />
                  <div className={`w-9 h-5 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${
                    isDark ? "bg-white/20 peer-checked:bg-amber-400" : "bg-gray-300 peer-checked:bg-[#51000d]"
                  }`}></div>
                </label>
              </div>
            </div>
          </section>

          {/* Business Rules */}
          <section className={`lg:col-span-12 p-5 md:p-6 rounded-2xl border space-y-5 ${
            isDark ? "bg-[#1a1a1a] border-white/5" : "bg-white border-gray-200/80 shadow-sm"
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isDark ? "bg-white/5 text-amber-400" : "bg-[#51000d]/10 text-[#51000d]"
                }`}>
                  <span className="material-symbols-outlined text-lg">gavel</span>
                </div>
                <h3 className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Aturan Pesanan &amp; Usaha</h3>
              </div>
              <span className="px-2.5 py-0.5 bg-emerald-500/15 text-emerald-500 border border-emerald-500/20 rounded-full text-[10px] font-medium uppercase tracking-wider hidden sm:block">
                Konfigurasi Aktif
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`space-y-2 p-4 rounded-xl border ${
                isDark ? "bg-white/3 border-white/5" : "bg-gray-50 border-gray-200"
              }`}>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-500 text-base">inventory</span>
                  <label className={`text-xs font-medium ${isDark ? "text-white/70" : "text-gray-700"}`}>Min. Pesanan Grosir</label>
                </div>
                <div className="relative">
                  <input className={`w-full h-10 rounded-xl px-3.5 pr-12 text-xs font-medium outline-none transition-all border ${
                    isDark ? "bg-white/5 border-white/10 text-white focus:border-white/20" : "bg-white border-gray-200 text-gray-900 focus:border-[#51000d]"
                  }`} type="number" defaultValue="50" />
                  <span className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-xs ${isDark ? "text-white/30" : "text-gray-400"}`}>Bungkus</span>
                </div>
                <p className={`text-[10px] ${isDark ? "text-white/30" : "text-gray-500"}`}>Jumlah minimal barang untuk harga grosir.</p>
              </div>

              <div className={`space-y-2 p-4 rounded-xl border ${
                isDark ? "bg-white/3 border-white/5" : "bg-gray-50 border-gray-200"
              }`}>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-500 text-base">percent</span>
                  <label className={`text-xs font-medium ${isDark ? "text-white/70" : "text-gray-700"}`}>Tarif Pajak (PPN)</label>
                </div>
                <div className="relative">
                  <input className={`w-full h-10 rounded-xl px-3.5 pr-8 text-xs font-medium outline-none transition-all border ${
                    isDark ? "bg-white/5 border-white/10 text-white focus:border-white/20" : "bg-white border-gray-200 text-gray-900 focus:border-[#51000d]"
                  }`} type="number" defaultValue="0" />
                  <span className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-xs ${isDark ? "text-white/30" : "text-gray-400"}`}>%</span>
                </div>
                <p className={`text-[10px] ${isDark ? "text-white/30" : "text-gray-500"}`}>Pajak standar yang diterapkan pada transaksi.</p>
              </div>

              <div className={`space-y-2 p-4 rounded-xl border ${
                isDark ? "bg-white/3 border-white/5" : "bg-gray-50 border-gray-200"
              }`}>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-500 text-base">local_shipping</span>
                  <label className={`text-xs font-medium ${isDark ? "text-white/70" : "text-gray-700"}`}>Zona Gratis Ongkir</label>
                </div>
                <select className={`w-full h-10 rounded-xl px-3.5 text-xs font-medium outline-none transition-all cursor-pointer border ${
                  isDark ? "bg-[#141414] border-white/10 text-white/80" : "bg-white border-gray-200 text-gray-900"
                }`}>
                  <option>Wilayah Jabodetabek</option>
                  <option>Wilayah Jawa Barat</option>
                  <option>Wilayah Jawa Tengah</option>
                  <option>Seluruh Jawa &amp; Bali</option>
                </select>
                <p className={`text-[10px] ${isDark ? "text-white/30" : "text-gray-500"}`}>Jangkauan gratis pengiriman logistik.</p>
              </div>
            </div>
          </section>

          {/* Security & Access */}
          <section className={`lg:col-span-12 p-5 md:p-6 rounded-2xl border space-y-5 ${
            isDark ? "bg-[#1a1a1a] border-white/5" : "bg-white border-gray-200/80 shadow-sm"
          }`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isDark ? "bg-white/5 text-amber-400" : "bg-[#51000d]/10 text-[#51000d]"
              }`}>
                <span className="material-symbols-outlined text-lg">security</span>
              </div>
              <h3 className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Keamanan &amp; Akses Admin</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className={`border-b ${isDark ? "border-white/5 bg-white/3 text-white/30" : "border-gray-200 bg-gray-50 text-gray-500"}`}>
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide">Nama Admin</th>
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide">Peran</th>
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide">Aktivitas Terakhir</th>
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide">Aksi</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? "divide-white/3" : "divide-gray-100"}`}>
                  <tr className={`transition-colors ${isDark ? "hover:bg-white/3" : "hover:bg-gray-50"}`}>
                    <td className="px-4 py-3.5 flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-amber-400/10 text-amber-500 flex items-center justify-center font-medium text-xs">PM</div>
                      <span className={`text-xs font-medium ${isDark ? "text-white" : "text-gray-900"}`}>Pak Mulyono (Pemilik)</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-medium uppercase ${
                        isDark ? "bg-amber-400/10 border border-amber-400/20 text-amber-400" : "bg-red-100 text-red-700 border border-red-200"
                      }`}>
                        Super Admin
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs font-medium text-emerald-500">Sedang Aktif</td>
                    <td className="px-4 py-3.5">
                      <button className={`text-xs font-medium cursor-pointer transition-colors ${
                        isDark ? "text-white/40 hover:text-white" : "text-gray-500 hover:text-gray-900"
                      }`}>Kelola</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Save Actions Bar */}
        <div className={`flex items-center justify-end gap-3 pt-6 mt-6 border-t ${
          isDark ? "border-white/5" : "border-gray-200"
        }`}>
          <button className={`px-5 py-2.5 text-xs font-medium transition-colors cursor-pointer ${
            isDark ? "text-white/40 hover:text-white" : "text-gray-500 hover:text-gray-900"
          }`}>Batalkan Perubahan</button>
          <button className="px-6 py-2.5 bg-[#51000d] hover:bg-[#7a0019] text-white rounded-xl text-xs font-medium transition-colors shadow-sm cursor-pointer">Simpan Konfigurasi Sistem</button>
        </div>
      </main>
    </div>
  );
}
