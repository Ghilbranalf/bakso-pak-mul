"use client";

import React, { useState } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import { useAdminTheme } from "@/context/AdminThemeContext";

export default function AdminPromotionsPage() {
  const { isDark } = useAdminTheme();
  const [promos, setPromos] = useState([
    {
      id: "promo-1",
      name: "Diskon Akhir Tahun Bakso Pak Mul",
      target: "Berlaku untuk: Semua Paket",
      type: "Diskon 20%",
      typeBg: "bg-amber-400/10 text-amber-400 border border-amber-400/20",
      lightTypeBg: "bg-red-100 text-red-700 border border-red-200",
      duration: "15 Des - 01 Jan",
      status: "Aktif",
      statusColor: "text-emerald-500",
      dotColor: "bg-emerald-500",
      performance: "1.2k Terpakai",
      percentage: 65,
    },
    {
      id: "promo-2",
      name: "Spesial Kemitraan Reseller Baru",
      target: "Sasaran: Reseller Baru",
      type: "Potongan Rp 50rb",
      typeBg: "bg-white/5 text-white/60 border border-white/10",
      lightTypeBg: "bg-gray-100 text-gray-700 border border-gray-200",
      duration: "05 Jan - 12 Jan",
      status: "Terjadwal",
      statusColor: "text-gray-400",
      dotColor: "bg-gray-400",
      performance: "Belum Dimulai",
      percentage: 0,
    },
    {
      id: "promo-3",
      name: "Flash Deal Senin - Selasa",
      target: "Produk Pilihan",
      type: "Diskon 15%",
      typeBg: "bg-amber-400/10 text-amber-400 border border-amber-400/20",
      lightTypeBg: "bg-red-100 text-red-700 border border-red-200",
      duration: "Mingguan",
      status: "Aktif",
      statusColor: "text-emerald-500",
      dotColor: "bg-emerald-500",
      performance: "842 Terpakai",
      percentage: 40,
    },
  ]);

  const [newPromo, setNewPromo] = useState({
    name: "",
    type: "Diskon Persentase",
    value: "",
    duration: "",
  });

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromo.name) return;
    setPromos([
      ...promos,
      {
        id: `promo-${Date.now()}`,
        name: newPromo.name,
        target: "Berlaku untuk: Produk Pilihan",
        type: newPromo.value ? `Diskon ${newPromo.value}%` : "Penawaran Khusus",
        typeBg: "bg-amber-400/10 text-amber-400 border border-amber-400/20",
        lightTypeBg: "bg-red-100 text-red-700 border border-red-200",
        duration: newPromo.duration || "Waktu Terbatas",
        status: "Aktif",
        statusColor: "text-emerald-500",
        dotColor: "bg-emerald-500",
        performance: "0 Terpakai",
        percentage: 10,
      },
    ]);
    setNewPromo({ name: "", type: "Diskon Persentase", value: "", duration: "" });
  };

  return (
    <div className={`min-h-screen font-sans antialiased flex transition-colors ${
      isDark ? "bg-[#0f0f0f] text-white" : "bg-[#f8f9fa] text-gray-900"
    }`}>
      <AdminSidebar />

      {/* Main Content Canvas */}
      <main className="flex-1 min-w-0 max-w-full overflow-x-hidden lg:ml-[240px] min-h-screen p-4 md:p-6 lg:p-8 pt-18 lg:pt-8 pb-32 lg:pb-8">
        {/* Top Bar / Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
          <div>
            <h1 className={`text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Manajemen Promosi &amp; Diskon</h1>
            <p className={`text-sm mt-0.5 ${isDark ? "text-white/40" : "text-gray-500"}`}>
              Kelola kampanye promosi, voucher, dan penawaran diskon kilat.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-medium transition-all shadow-sm cursor-pointer ${
              isDark ? "bg-[#1a1a1a] border-white/10 text-white/70 hover:border-white/20" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}>
              <span className="material-symbols-outlined text-lg">download</span>
              <span>Unduh Laporan</span>
            </button>
            <a
              href="#new-promo-form"
              className="bg-[#51000d] hover:bg-[#7a0019] text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm cursor-pointer"
            >
              + Buat Promo Baru
            </a>
          </div>
        </header>

        {/* Analytics & Active Promos */}
        <div className="grid grid-cols-12 gap-5 mb-6">
          {/* Quick Stats Cards */}
          <div className="col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={`rounded-2xl p-5 border flex flex-col justify-between ${
              isDark ? "bg-[#1a1a1a] border-white/5" : "bg-white border-gray-200/80 shadow-sm"
            }`}>
              <div className="flex items-center justify-between">
                <span className={`p-2.5 rounded-xl ${isDark ? "bg-amber-400/10 text-amber-400" : "bg-red-50 text-red-600"}`}>
                  <span className="material-symbols-outlined text-lg">bolt</span>
                </span>
                <span className="text-emerald-500 font-medium text-xs">+12.5%</span>
              </div>
              <div className="mt-3">
                <p className={`text-xs font-medium ${isDark ? "text-white/40" : "text-gray-500"}`}>Rata-rata Konversi</p>
                <h3 className={`text-xl font-semibold mt-1 ${isDark ? "text-white" : "text-gray-900"}`}>18.4%</h3>
              </div>
            </div>

            <div className={`rounded-2xl p-5 border flex flex-col justify-between ${
              isDark ? "bg-[#1a1a1a] border-white/5" : "bg-white border-gray-200/80 shadow-sm"
            }`}>
              <div className="flex items-center justify-between">
                <span className={`p-2.5 rounded-xl ${isDark ? "bg-white/5 text-white/60" : "bg-gray-100 text-gray-700"}`}>
                  <span className="material-symbols-outlined text-lg">payments</span>
                </span>
                <span className={`text-xs ${isDark ? "text-white/30" : "text-gray-400"}`}>Bulan Ini</span>
              </div>
              <div className="mt-3">
                <p className={`text-xs font-medium ${isDark ? "text-white/40" : "text-gray-500"}`}>Total Diskon Diberikan</p>
                <h3 className={`text-xl font-semibold mt-1 ${isDark ? "text-white" : "text-gray-900"}`}>Rp 4.200.000</h3>
              </div>
            </div>

            <div className={`rounded-2xl p-5 border flex flex-col justify-between ${
              isDark ? "bg-[#1a1a1a] border-white/5" : "bg-white border-gray-200/80 shadow-sm"
            }`}>
              <div className="flex items-center justify-between">
                <span className={`p-2.5 rounded-xl ${isDark ? "bg-white/5 text-white/60" : "bg-gray-100 text-gray-700"}`}>
                  <span className="material-symbols-outlined text-lg">calendar_today</span>
                </span>
                <span className="text-amber-500 font-medium text-xs">Aktif</span>
              </div>
              <div className="mt-3">
                <p className={`text-xs font-medium ${isDark ? "text-white/40" : "text-gray-500"}`}>Kampanye Terjadwal</p>
                <h3 className={`text-xl font-semibold mt-1 ${isDark ? "text-white" : "text-gray-900"}`}>12</h3>
              </div>
            </div>
          </div>

          {/* Promotion Preview Banner */}
          <div className="col-span-12 lg:col-span-4 row-span-2">
            <div className={`rounded-2xl border overflow-hidden h-full flex flex-col justify-between p-5 ${
              isDark ? "bg-[#1a1a1a] border-white/5" : "bg-white border-gray-200/80 shadow-sm"
            }`}>
              <div>
                <h4 className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Pratinjau Promo</h4>
                <p className={`text-xs mt-0.5 ${isDark ? "text-white/40" : "text-gray-500"}`}>Tampilan di aplikasi pelanggan</p>
              </div>

              <div className="my-4">
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden group border border-white/10">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10"></div>
                  <img
                    alt="Promo Preview"
                    className="w-full h-full object-cover"
                    src="/images/Bakso Super Essem.png"
                  />
                  <div className="absolute bottom-0 left-0 p-4 z-20 text-white w-full">
                    <span className="bg-amber-400 text-gray-900 px-2.5 py-0.5 rounded-md text-[10px] font-semibold mb-1.5 inline-block uppercase tracking-wider">
                      Diskon Kilat
                    </span>
                    <h3 className="text-sm font-semibold leading-tight">Bakso Super Essem Spesial</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm font-bold text-amber-400">DISKON 25%</p>
                      <p className="text-xs text-white/50 line-through">Rp 100.000</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`p-3 rounded-xl border text-xs ${
                isDark ? "bg-white/4 border-white/6 text-white/40" : "bg-gray-50 border-gray-200 text-gray-600"
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span>Estimasi Pelanggan:</span>
                  <span className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>12.4k pembeli</span>
                </div>
                <div className={`w-full h-1 rounded-full overflow-hidden ${isDark ? "bg-white/10" : "bg-gray-200"}`}>
                  <div className="h-full bg-amber-400 w-3/4 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Promotion Table */}
          <div className="col-span-12 lg:col-span-8">
            <div className={`rounded-2xl border overflow-hidden ${
              isDark ? "bg-[#1a1a1a] border-white/5" : "bg-white border-gray-200/80 shadow-sm"
            }`}>
              <div className={`p-4 border-b ${isDark ? "border-white/5" : "border-gray-200"}`}>
                <h4 className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Promosi Aktif &amp; Terjadwal</h4>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className={`border-b ${isDark ? "border-white/5 bg-white/3 text-white/30" : "border-gray-200 bg-gray-50 text-gray-500"}`}>
                      <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide">Nama Promosi</th>
                      <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide">Jenis Diskon</th>
                      <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide">Durasi</th>
                      <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide">Status</th>
                      <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide">Performa</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? "divide-white/3" : "divide-gray-100"}`}>
                    {promos.map((p) => (
                      <tr key={p.id} className={`transition-colors ${isDark ? "hover:bg-white/3" : "hover:bg-gray-50"}`}>
                        <td className="px-5 py-3.5">
                          <div className={`text-xs font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{p.name}</div>
                          <div className={`text-[10px] mt-0.5 ${isDark ? "text-white/30" : "text-gray-400"}`}>{p.target}</div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-medium ${
                            isDark ? p.typeBg : p.lightTypeBg
                          }`}>
                            {p.type}
                          </span>
                        </td>
                        <td className={`px-5 py-3.5 text-xs ${isDark ? "text-white/50" : "text-gray-600"}`}>{p.duration}</td>
                        <td className="px-5 py-3.5">
                          <span className={`flex items-center gap-1.5 text-xs font-medium ${p.statusColor}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${p.dotColor}`}></span>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className={`text-xs ${isDark ? "text-white/70" : "text-gray-700"}`}>{p.performance}</div>
                          {p.percentage > 0 && (
                            <div className={`w-20 h-1 rounded-full overflow-hidden mt-1 ${isDark ? "bg-white/10" : "bg-gray-200"}`}>
                              <div className="bg-amber-400 h-full" style={{ width: `${p.percentage}%` }}></div>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Form: Create New Promo */}
        <section id="new-promo-form" className={`rounded-2xl border p-5 md:p-6 ${
          isDark ? "bg-[#1a1a1a] border-white/5" : "bg-white border-gray-200/80 shadow-sm"
        }`}>
          <h3 className={`text-sm font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Buat Kampanye / Promo Baru</h3>
          <form onSubmit={handleCreatePromo} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className={`block text-xs font-medium mb-1 ${isDark ? "text-white/50" : "text-gray-600"}`}>Nama Promo</label>
              <input
                type="text"
                required
                value={newPromo.name}
                onChange={(e) => setNewPromo({ ...newPromo, name: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none ${
                  isDark ? "bg-white/5 border-white/10 text-white placeholder-white/20 focus:border-white/20" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#51000d]"
                }`}
                placeholder="Misal: Promo Menyambut Ramadhan"
              />
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${isDark ? "text-white/50" : "text-gray-600"}`}>Jenis Potongan</label>
              <select
                value={newPromo.type}
                onChange={(e) => setNewPromo({ ...newPromo, type: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none cursor-pointer ${
                  isDark ? "bg-[#141414] border-white/10 text-white" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#51000d]"
                }`}
              >
                <option>Diskon Persentase</option>
                <option>Potongan Harga Tetap</option>
                <option>Gratis Ongkir</option>
              </select>
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${isDark ? "text-white/50" : "text-gray-600"}`}>Nilai Diskon (%)</label>
              <input
                type="number"
                value={newPromo.value}
                onChange={(e) => setNewPromo({ ...newPromo, value: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none ${
                  isDark ? "bg-white/5 border-white/10 text-white placeholder-white/20 focus:border-white/20" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#51000d]"
                }`}
                placeholder="Misal: 20"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 bg-[#51000d] hover:bg-[#7a0019] text-white rounded-xl text-xs font-medium shadow-sm transition-colors cursor-pointer"
              >
                Simpan Promo
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
