"use client";

import React, { useState } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminPromotionsPage() {
  const [promos, setPromos] = useState([
    {
      id: "promo-1",
      name: "Diskon Akhir Tahun Bakso Pak Mul",
      target: "Berlaku untuk: Semua Paket",
      type: "Diskon 20%",
      typeBg: "bg-red-100 text-[#51000d]",
      duration: "15 Des - 01 Jan",
      status: "Aktif",
      statusColor: "text-green-600",
      dotColor: "bg-green-500",
      performance: "1.2k Terpakai",
      percentage: 65,
    },
    {
      id: "promo-2",
      name: "Spesial Kemitraan Reseller Baru",
      target: "Sasaran: Reseller Baru",
      type: "Potongan Rp 50rb",
      typeBg: "bg-red-50 text-red-700 border border-red-200",
      duration: "05 Jan - 12 Jan",
      status: "Terjadwal",
      statusColor: "text-gray-500",
      dotColor: "bg-gray-400",
      performance: "Belum Dimulai",
      percentage: 0,
    },
    {
      id: "promo-3",
      name: "Flash Deal Senin - Selasa",
      target: "Produk Pilihan",
      type: "Diskon 15%",
      typeBg: "bg-red-100 text-[#51000d]",
      duration: "Mingguan",
      status: "Aktif",
      statusColor: "text-green-600",
      dotColor: "bg-green-500",
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
        typeBg: "bg-red-100 text-[#51000d]",
        duration: newPromo.duration || "Waktu Terbatas",
        status: "Aktif",
        statusColor: "text-green-600",
        dotColor: "bg-green-500",
        performance: "0 Terpakai",
        percentage: 10,
      },
    ]);
    setNewPromo({ name: "", type: "Diskon Persentase", value: "", duration: "" });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1a1c1c] font-sans antialiased flex flex-col lg:flex-row">
      <AdminSidebar activeMenu="promotions" />

      {/* Main Content Canvas */}
      <main className="flex-1 w-full lg:ml-[260px] min-h-screen p-4 md:p-8 lg:p-10 pb-24 lg:pb-8 max-w-7xl">
        {/* Top Bar / Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#51000d] tracking-tight">
              Manajemen Promosi &amp; Diskon
            </h2>
            <p className="text-xs md:text-sm text-gray-500 font-medium mt-1">
              Kelola kampanye promosi, voucher, dan penawaran diskon kilat.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2.5 rounded-xl font-bold text-xs text-gray-700 hover:bg-gray-50 transition-all shadow-sm cursor-pointer">
              <span className="material-symbols-outlined text-base">download</span>
              <span>Unduh Laporan</span>
            </button>
            <a
              href="#new-promo-form"
              className="bg-[#51000d] text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-[#7a0019] transition-all shadow-md active:scale-95 uppercase tracking-wider cursor-pointer"
            >
              + Buat Promo Baru
            </a>
          </div>
        </header>

        {/* Bento Grid: Analytics & Active Promos */}
        <div className="grid grid-cols-12 gap-6 mb-8">
          {/* Quick Stats Cards */}
          <div className="col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="p-3 bg-red-100 text-red-700 rounded-2xl">
                  <span className="material-symbols-outlined text-xl">bolt</span>
                </span>
                <span className="text-green-600 font-bold text-xs">+12.5%</span>
              </div>
              <div className="mt-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rata-rata Konversi</p>
                <h3 className="text-2xl font-black text-gray-900 mt-1">18.4%</h3>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="p-3 bg-red-50 text-[#51000d] rounded-2xl">
                  <span className="material-symbols-outlined text-xl">payments</span>
                </span>
                <span className="text-gray-400 font-bold text-xs">Bulan Ini</span>
              </div>
              <div className="mt-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Diskon Diberikan</p>
                <h3 className="text-2xl font-black text-gray-900 mt-1">Rp 4.2M</h3>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="p-3 bg-gray-100 text-gray-700 rounded-2xl">
                  <span className="material-symbols-outlined text-xl">calendar_today</span>
                </span>
                <span className="text-[#51000d] font-bold text-xs">Aktif</span>
              </div>
              <div className="mt-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Kampanye Terjadwal</p>
                <h3 className="text-2xl font-black text-gray-900 mt-1">12</h3>
              </div>
            </div>
          </div>

          {/* Promotion Preview Banner */}
          <div className="col-span-12 lg:col-span-4 row-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col justify-between">
              <div className="p-6 border-b border-gray-100">
                <h4 className="text-sm font-bold text-[#51000d]">Pratinjau Tampilan Promo</h4>
                <p className="text-xs text-gray-500 font-medium">Tampilan yang dilihat oleh pembeli</p>
              </div>

              <div className="p-6 flex flex-col gap-4">
                <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden group shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#51000d]/90 to-transparent z-10"></div>
                  <img
                    alt="Promo Preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src="/images/Bakso Super Essem.png"
                  />
                  <div className="absolute bottom-0 left-0 p-6 z-20 text-white w-full">
                    <span className="bg-red-600 px-3 py-1 rounded-full text-[10px] font-extrabold mb-3 inline-block uppercase tracking-wider">
                      Diskon Kilat
                    </span>
                    <h3 className="text-xl font-extrabold mb-1 leading-tight">Bakso Super Essem Spesial</h3>
                    <div className="flex items-end gap-2">
                      <p className="text-lg font-black text-amber-300">DISKON 25%</p>
                      <p className="text-xs text-white/70 line-through mb-0.5">Rp 100.000</p>
                    </div>
                    <Link
                      href="/produk"
                      className="mt-4 w-full py-2.5 bg-white text-[#51000d] rounded-xl font-bold text-xs hover:bg-gray-100 transition-colors flex items-center justify-center cursor-pointer"
                    >
                      Pesan Grosir Sekarang
                    </Link>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="material-symbols-outlined text-red-600 text-sm">visibility</span>
                    <p className="text-xs font-bold text-gray-700">
                      Dilihat Pelanggan: <span className="text-gray-900 font-extrabold">12.4k</span>
                    </p>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600 w-3/4 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Promotion Table */}
          <div className="col-span-12 lg:col-span-8">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h4 className="text-base font-bold text-gray-900">Promosi Aktif &amp; Terjadwal</h4>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-200">
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nama Promosi</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Jenis Diskon</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Durasi</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Performa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {promos.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-xs font-bold text-gray-900">{p.name}</div>
                          <div className="text-[10px] font-medium text-gray-400">{p.target}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold ${p.typeBg}`}>
                            {p.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-gray-700">{p.duration}</td>
                        <td className="px-6 py-4">
                          <span className={`flex items-center gap-1.5 text-xs font-bold ${p.statusColor}`}>
                            <span className={`w-2 h-2 rounded-full ${p.dotColor}`}></span>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs font-bold text-gray-900">{p.performance}</div>
                          {p.percentage > 0 && (
                            <div className="w-24 h-1 bg-gray-100 rounded-full overflow-hidden mt-1">
                              <div className="bg-red-600 h-full" style={{ width: `${p.percentage}%` }}></div>
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
        <section id="new-promo-form" className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h3 className="text-lg font-bold text-[#51000d] mb-4">Buat Kampanye / Promo Baru</h3>
          <form onSubmit={handleCreatePromo} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Nama Promo</label>
              <input
                type="text"
                required
                value={newPromo.name}
                onChange={(e) => setNewPromo({ ...newPromo, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:border-[#51000d]"
                placeholder="Misal: Promo Menyambut Ramadhan"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Jenis Potongan</label>
              <select
                value={newPromo.type}
                onChange={(e) => setNewPromo({ ...newPromo, type: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:border-[#51000d]"
              >
                <option>Diskon Persentase</option>
                <option>Potongan Harga Tetap</option>
                <option>Gratis Ongkir</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Nilai Diskon (%)</label>
              <input
                type="number"
                value={newPromo.value}
                onChange={(e) => setNewPromo({ ...newPromo, value: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:border-[#51000d]"
                placeholder="Misal: 20"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 bg-[#51000d] hover:bg-[#7a0019] text-white rounded-xl font-bold text-xs shadow-md uppercase tracking-wider cursor-pointer"
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
