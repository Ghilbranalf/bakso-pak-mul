"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"profile" | "edit">("profile");
  const [isEditing, setIsEditing] = useState(false);

  // Profile Form State
  const [profile, setProfile] = useState({
    fullName: "Andi Wijaya",
    phone: "+62 812 3456 7890",
    email: "andi.wijaya@example.com",
    storeName: "Kedai Makan Berkah",
    address: "Jl. Melati No. 45, RT 02/RW 04, Kelurahan Merdeka, Kecamatan Sumur Bandung, Kota Bandung, Jawa Barat 40113",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#1a1c1c] font-sans antialiased flex flex-col justify-between">
      {/* Top Navbar */}
      <Navbar />

      <main className="pt-28 pb-20 px-6 max-w-7xl mx-auto flex-grow w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar: Profile Summary */}
          <aside className="lg:col-span-4 sticky top-28">
            <div className="bg-white rounded-[24px] shadow-lg p-6 md:p-8 flex flex-col items-center text-center border border-gray-100">
              <div className="relative mb-6 group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-red-100 shadow-md">
                  <img
                    alt="Andi Wijaya Avatar"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjWMk_UKjPigFpbrd42aVnpb4lIv6NhOOsWmeXFT41XxiMA7bfLxpwX3pr-MPnx5Ns5-G5QIXIJ2oFWLSPjnqap4TKdogZQ46QxI48-u4JOKaJREs3rtH_oxxLh55eNNIiz9cJ_3HZJakI6BMcAslLviDGN0_p0HeC6ddGftBkFK0MALwRT2QMXbmUYmwCqDoRp6docLVYbmBLAorNTXz3B5paOR-gZyZqnu-KUw9TLxdT3Ppzqt0OPoC3wcCSWJNmgncc0to8iWaN"
                  />
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="absolute bottom-1 right-1 bg-[#51000d] hover:bg-[#7a0019] text-white w-9 h-9 rounded-full flex items-center justify-center border-2 border-white shadow-lg active:scale-95 transition-all cursor-pointer"
                  title="Edit Foto Profil"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-1">{profile.fullName}</h1>
              <div className="inline-flex items-center px-3.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold mb-6">
                <span className="material-symbols-outlined text-[16px] mr-1">stars</span>
                Gold Member
              </div>

              {/* Side Nav Links */}
              <div className="w-full space-y-1.5 text-left">
                <button
                  onClick={() => { setActiveTab("profile"); setIsEditing(false); }}
                  className={`flex items-center space-x-3 w-full p-3.5 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                    activeTab === "profile"
                      ? "bg-[#51000d]/10 text-[#51000d]"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">person</span>
                  <span>Profil Pribadi</span>
                </button>

                <Link
                  href="/transaksi"
                  className="flex items-center space-x-3 w-full p-3.5 text-gray-600 hover:bg-gray-100 rounded-xl text-xs md:text-sm font-bold transition-all"
                >
                  <span className="material-symbols-outlined text-lg">receipt_long</span>
                  <span>Riwayat Transaksi</span>
                </Link>

                <Link
                  href="/produk"
                  className="flex items-center space-x-3 w-full p-3.5 text-gray-600 hover:bg-gray-100 rounded-xl text-xs md:text-sm font-bold transition-all"
                >
                  <span className="material-symbols-outlined text-lg">favorite</span>
                  <span>Produk Favorit</span>
                </Link>

                <div className="pt-4 mt-4 border-t border-gray-200">
                  <Link
                    href="/login"
                    className="flex items-center space-x-3 w-full p-3.5 text-red-600 hover:bg-red-50 rounded-xl text-xs md:text-sm font-bold transition-all"
                  >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    <span>Keluar Akun</span>
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Content: Profile Details */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Section 1: Personal Information */}
            <section className="bg-white rounded-[24px] shadow-lg p-6 md:p-8 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-[#51000d]">
                    <span className="material-symbols-outlined">badge</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Informasi Pribadi</h2>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-[#51000d] font-bold text-xs hover:underline cursor-pointer"
                >
                  {isEditing ? "Batal" : "Edit Informasi"}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:bg-white focus:border-[#51000d]"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Nomor WhatsApp</label>
                      <input
                        type="text"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:bg-white focus:border-[#51000d]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Alamat Email</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:bg-white focus:border-[#51000d]"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#51000d] text-white font-bold text-xs rounded-xl hover:bg-[#7a0019] transition-all"
                  >
                    Simpan Perubahan
                  </button>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nama Lengkap</label>
                    <p className="text-sm font-extrabold text-gray-900">{profile.fullName}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nomor WhatsApp</label>
                    <p className="text-sm font-extrabold text-gray-900">{profile.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Alamat Email</label>
                    <p className="text-sm font-extrabold text-gray-900">{profile.email}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status Verifikasi</label>
                    <div className="flex items-center text-green-600 text-xs font-extrabold">
                      <span className="material-symbols-outlined text-[18px] mr-1">verified</span>
                      Terverifikasi
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Section 2: Business Information */}
            <section className="bg-white rounded-[24px] shadow-lg p-6 md:p-8 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-[#51000d]">
                    <span className="material-symbols-outlined">storefront</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Informasi Usaha / Toko</h2>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-[#51000d] font-bold text-xs hover:underline cursor-pointer"
                >
                  Kelola Outlet
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nama Toko / Usaha Kuliner</label>
                  <p className="text-sm font-extrabold text-gray-900">{profile.storeName}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Alamat Lengkap Pengiriman</label>
                  <div className="flex items-start space-x-2.5 text-gray-800">
                    <span className="material-symbols-outlined text-gray-400 mt-0.5 text-lg">location_on</span>
                    <p className="text-xs md:text-sm font-semibold leading-relaxed max-w-lg">
                      {profile.address}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Security & Password */}
            <section className="bg-white rounded-[24px] shadow-lg p-6 md:p-8 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-[#51000d]">
                  <span className="material-symbols-outlined">lock</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Keamanan Akun</h2>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="text-sm font-extrabold text-gray-900">Kata Sandi</p>
                  <p className="text-xs text-gray-500 font-medium">Terakhir diubah 3 bulan yang lalu</p>
                </div>
                <button className="px-6 py-3 bg-[#51000d] hover:bg-[#7a0019] text-white rounded-xl font-bold text-xs transition-all shadow-md cursor-pointer">
                  Ubah Kata Sandi
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-gray-500 text-xs font-medium">
                  <span className="material-symbols-outlined text-base">devices</span>
                  <span>2 sesi aktif di perangkat lain</span>
                </div>
                <button className="text-red-600 font-bold text-xs hover:underline cursor-pointer">
                  Keluar dari semua perangkat
                </button>
              </div>
            </section>

            {/* Promotional Bento Style Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#51000d] rounded-[24px] p-6 text-white flex flex-col justify-between h-[180px] relative overflow-hidden shadow-xl">
                <div className="relative z-10">
                  <p className="text-xs text-white/80 font-bold uppercase tracking-wider mb-1">Loyalty Points Anda</p>
                  <h3 className="text-3xl font-black">1,250 Points</h3>
                </div>
                <Link
                  href="/promo"
                  className="relative z-10 flex items-center space-x-2 font-bold text-xs text-white hover:underline cursor-pointer"
                >
                  <span>Tukarkan Poin Rewards</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </Link>
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
              </div>

              <div className="bg-red-600 rounded-[24px] p-6 text-white flex flex-col justify-between h-[180px] relative overflow-hidden shadow-xl">
                <div className="relative z-10">
                  <p className="text-xs text-white/80 font-bold uppercase tracking-wider mb-1">Voucher Aktif</p>
                  <h3 className="text-xl font-bold">Gratis Ongkir Pesanan Berikutnya</h3>
                </div>
                <Link
                  href="/promo"
                  className="relative z-10 flex items-center space-x-2 font-bold text-xs text-white hover:underline cursor-pointer"
                >
                  <span>Lihat Semua Voucher</span>
                  <span className="material-symbols-outlined text-base">confirmation_number</span>
                </Link>
                <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}
