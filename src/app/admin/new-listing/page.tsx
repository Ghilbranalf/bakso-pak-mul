"use client";

import React, { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";

export default function NewListingPage() {
  const [selectedCategory, setSelectedCategory] = useState("Bakso");
  const categories = ["Bakso", "Mie", "Bumbu", "Pelengkap", "Minuman"];
  const [showInMarketplace, setShowInMarketplace] = useState(true);

  return (
    <div className="flex min-h-screen bg-[#F8F8F8] text-[#1A1C1C] font-sans antialiased">
      <AdminSidebar />

      <main className="md:ml-[280px] flex-1 flex flex-col">
        {/* TopNavBar */}
        <header className="h-20 bg-white/70 backdrop-blur-[20px] flex items-center justify-between px-6 md:px-12 sticky top-0 z-30 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-900">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Tambah Menu Baru</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden lg:block">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
              <input className="pl-12 pr-6 py-2 bg-gray-100 border-none rounded-full w-64 focus:ring-2 focus:ring-[#7a0019]/20 text-sm transition-all outline-none" placeholder="Cari menu atau SKU..." type="text"/>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXnVNMiH0kjQuX9aYTlGhsfLdAmC-5DxBvcnS2ZaF5Usg020nK4IGp6KxBk25_SOnXqhunPIzWxfKfkxF6wCvBzUooamLMwFUR-3w6Eti90JG-wtEdGSNP-rG00fbnwF2YHn6_mXp6O0NmAn4K_BViGEI53QYMEES0gfaWNKxnVJB3D8osrVZVaNTx4-r16zB4-rRlojwVaZvXwJOw9sH953n4asiRdL6CBZKbsAL1FJxPsTwQJdnNcQD--tIR203eEM0mKiOBECuA" alt="Admin Profile" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6 md:p-12 space-y-8 max-w-[1200px] mx-auto w-full">
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            
            {/* Left Column: Primary Forms */}
            <div className="flex-1 space-y-6 md:space-y-8">
              {/* Section 1: Informasi Produk */}
              <section className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#51000d]/5 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#51000d]" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
                  </div>
                  <h3 className="text-xl font-semibold">Informasi Produk</h3>
                </div>
                
                <div className="space-y-4 mt-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-2">Nama Produk</label>
                    <input className="w-full h-14 px-4 border border-gray-200 rounded-2xl focus:border-[#7A0019] focus:ring-1 focus:ring-[#7A0019] outline-none transition-all text-base" placeholder="Contoh: Bakso Urat Spesial Jumbo" type="text" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-2">Kategori</label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <button 
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-4 py-2 rounded-full border transition-all text-sm font-semibold ${selectedCategory === cat ? 'bg-[#51000d] text-white border-[#51000d]' : 'border-gray-300 text-gray-500 hover:border-[#51000d] hover:text-[#51000d]'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-2">Deskripsi Produk</label>
                    <textarea className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:border-[#7A0019] focus:ring-1 focus:ring-[#7A0019] outline-none transition-all text-base resize-none" placeholder="Jelaskan detail keunggulan produk Anda..." rows={4}></textarea>
                  </div>
                </div>
              </section>

              {/* Section 2: Manajemen Stok & Harga */}
              <section className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#51000d]/5 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#51000d]" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
                  </div>
                  <h3 className="text-xl font-semibold">Manajemen Stok &amp; Harga</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-2">Harga Jual (Rp)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500">Rp</span>
                      <input className="w-full h-14 pl-12 pr-4 border border-gray-200 rounded-2xl focus:border-[#7A0019] focus:ring-1 focus:ring-[#7A0019] outline-none transition-all text-base" placeholder="0" type="number" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-2">SKU (Kode Produk)</label>
                    <input className="w-full h-14 px-4 border border-gray-200 rounded-2xl focus:border-[#7A0019] focus:ring-1 focus:ring-[#7A0019] outline-none transition-all text-base" placeholder="BKS-001" type="text" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-500 mb-2">Stok Awal</label>
                    <div className="flex items-center gap-4">
                      <input className="w-32 h-14 px-4 border border-gray-200 rounded-2xl focus:border-[#7A0019] focus:ring-1 focus:ring-[#7A0019] outline-none transition-all text-base" placeholder="0" type="number" />
                      <span className="text-gray-500 text-sm">pcs / unit</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Sidebar Panels */}
            <div className="w-full lg:w-[380px] space-y-6 md:space-y-8">
              
              {/* Image Upload Zone */}
              <section className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 md:p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Foto Produk</h3>
                  <span className="text-xs text-gray-400 italic font-semibold">Maks 5MB</span>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-[24px] p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-[#51000d] transition-all cursor-pointer group">
                  <div className="w-16 h-16 rounded-full bg-[#51000d]/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[#51000d] text-3xl">cloud_upload</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 text-center">Klik atau seret foto ke sini</p>
                  <p className="text-xs text-gray-500 text-center mt-2">Gunakan format JPG/PNG dengan resolusi min. 800x800px</p>
                </div>
                
                <div className="mt-6 grid grid-cols-3 gap-2">
                  <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center relative overflow-hidden group">
                    <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDs9WIldqyPpMnXrDmnbHk7nwmZfSisXF3IOTt7VnLyC7b4XdZ5I1k3-484lqGA6ntPoG7Mzq_3FgGEbvh2TXCIRSCXZeBheSaIP5ex2fqFJjxqqHiVX4od-P5ee5V4I52VBa8iUw7xvpv0zge8wIhaWCdp03ub7nJrblSNCOHAONv6OUkLu8JtWs2jaqbXbLnJcHfpUEnwc4b4Q3i6sQ-4v1hJ9bP8Qn19nZ5jh3uODsItU7uYvWnlcUWfAMkgBqYOzEYJZa0QzPIB" alt="Uploaded Product" />
                    <button className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                  <div className="aspect-square bg-gray-50 rounded-xl border border-gray-300 border-dashed flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-gray-400">add</span>
                  </div>
                  <div className="aspect-square bg-gray-50 rounded-xl border border-gray-300 border-dashed flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-gray-400">add</span>
                  </div>
                </div>
              </section>

              {/* Visibility Settings */}
              <section className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 md:p-8">
                <h3 className="text-xl font-semibold mb-6">Pengaturan Tampilan</h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900">Tampilkan di Marketplace</span>
                    <span className="text-xs text-gray-500 font-medium">Produk akan langsung terlihat oleh pembeli</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={showInMarketplace} onChange={() => setShowInMarketplace(!showInMarketplace)} />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#51000d]"></div>
                  </label>
                </div>
                <div className="mt-6 p-4 rounded-xl border border-gray-200 bg-gray-50 flex gap-3">
                  <span className="material-symbols-outlined text-[#7A0019]">info</span>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">Pastikan informasi harga dan stok sudah benar sebelum diaktifkan.</p>
                </div>
              </section>
            </div>
          </div>

          {/* Sticky Bottom Actions */}
          <div className="flex items-center justify-end gap-4 pt-8 border-t border-gray-200">
            <button className="px-8 py-3 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
              Batal
            </button>
            <button className="px-10 py-3 bg-[#51000d] text-white text-sm font-bold rounded-xl hover:bg-[#7a0019] transition-all shadow-md active:scale-95">
              Simpan Menu
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full py-10 px-6 md:px-12 bg-white grid grid-cols-1 md:grid-cols-4 gap-8 mt-auto border-t border-gray-200 text-xs font-medium text-gray-500">
          <div className="md:col-span-1">
            <h4 className="font-bold text-gray-900 text-sm mb-2">Bakso Pak Mul</h4>
            <p className="leading-relaxed">© 2024 Bakso Pak Mul. All rights reserved.</p>
          </div>
          <div className="md:col-span-1 flex flex-col gap-2">
            <h5 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] mb-1">Corporate</h5>
            <a href="#" className="hover:text-[#51000d] transition-colors">B2B Terms</a>
            <a href="#" className="hover:text-[#51000d] transition-colors">Bulk Pricing Policy</a>
          </div>
          <div className="md:col-span-1 flex flex-col gap-2">
            <h5 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] mb-1">Support</h5>
            <a href="#" className="hover:text-[#51000d] transition-colors">Compliance</a>
            <a href="#" className="hover:text-[#51000d] transition-colors">Sustainability</a>
          </div>
          <div className="md:col-span-1 flex flex-col gap-2">
            <h5 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] mb-1">Logistics</h5>
            <a href="#" className="hover:text-[#51000d] transition-colors">Global Logistics</a>
          </div>
        </footer>
      </main>
    </div>
  );
}
