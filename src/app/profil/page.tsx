"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { INDONESIA_REGIONS } from "@/lib/indonesia-regions";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "orders">("profile");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    district: "Tonjong",
    city: "Kabupaten Brebes",
    province: "Jawa Tengah",
  });

  useEffect(() => {
    const controller = new AbortController();

    const loadUserData = async () => {
      try {
        setIsLoading(true);
        const { createClient } = await import("@/utils/supabase/client");
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        // Check if there is saved address in localStorage
        const savedAddr = localStorage.getItem("user_saved_address");
        let parsedSaved: any = {};
        if (savedAddr) {
          try { parsedSaved = JSON.parse(savedAddr); } catch (e) {}
        }

        if (session?.user) {
          const u = session.user;
          setUser(u);
          setFormData({
            name: parsedSaved.name || u.user_metadata?.full_name || "Pelanggan Setia",
            email: u.email || "",
            phone: parsedSaved.phone || u.phone || "085600436463",
            address: parsedSaved.address || "Dk.karang anyar RT02/RW05 Desa Kalijurang, Kecamatan Tonjong, Kabupaten Brebes, Jawa Tengah",
            district: parsedSaved.district || "Tonjong",
            city: parsedSaved.city || "Kabupaten Brebes",
            province: parsedSaved.province || "Jawa Tengah",
          });

          // Fetch user's orders safely
          const res = await fetch("/api/orders", { signal: controller.signal });
          const data = await res.json();
          if (data.orders) {
            const userOrders = data.orders.filter(
              (o: any) => !o.customerEmail || o.customerEmail.toLowerCase() === (u.email || "").toLowerCase()
            );
            setOrders(userOrders.length > 0 ? userOrders : data.orders.slice(0, 5));
          }
        } else if (savedAddr) {
          setFormData((prev) => ({
            ...prev,
            ...parsedSaved,
          }));
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Error loading user profile:", err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();

    return () => {
      controller.abort();
    };
  }, []);

  const handleSaveProfile = () => {
    localStorage.setItem("user_saved_address", JSON.stringify(formData));
    alert("✅ Data Diri & Alamat Utama berhasil disimpan ke Profil!\nAlamat ini akan otomatis terisi saat Anda Checkout.");
  };

  const handleSignOut = async () => {
    try {
      const { createClient } = await import("@/utils/supabase/client");
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = "/";
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1a1c1c] font-sans antialiased flex flex-col pt-16 sm:pt-20">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full">
        {/* Profile Card Banner */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-gray-100 mb-6 sm:mb-8 transition-all">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
            
            {/* User Avatar & Info */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <div className="relative">
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-gradient-to-br from-[#51000d] to-[#7a0019] text-white flex items-center justify-center font-black text-3xl shadow-lg shadow-[#51000d]/20 border-2 border-white">
                  {(formData.name || "U").charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[10px] text-white font-black">check</span>
                </div>
              </div>

              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight leading-snug">
                  {formData.name || "Pelanggan Setia"}
                </h1>
                <p className="text-xs text-gray-500 font-medium">{formData.email || "email@pelanggan.com"}</p>
                <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                  <span className="px-3 py-0.5 bg-green-50 text-green-700 border border-green-200/60 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                    Pelanggan VIP
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">• Terverifikasi</span>
                </div>
              </div>
            </div>

            {/* Desktop & Mobile Actions */}
            <div className="w-full sm:w-auto pt-2 sm:pt-0">
              <button
                onClick={handleSignOut}
                className="w-full sm:w-auto px-5 py-2.5 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer border border-red-100 hover:border-transparent active:scale-95 shadow-sm"
              >
                <span className="material-symbols-outlined text-base">logout</span>
                <span>Keluar Akun</span>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Segmented Switcher */}
          <div className="mt-6 pt-5 border-t border-gray-100 flex p-1.5 bg-gray-100/80 rounded-2xl gap-1">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "profile"
                  ? "bg-white text-[#51000d] shadow-md shadow-gray-200/50"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <span className="material-symbols-outlined text-base">person</span>
              <span>Data Diri &amp; Alamat</span>
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "orders"
                  ? "bg-white text-[#51000d] shadow-md shadow-gray-200/50"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <span className="material-symbols-outlined text-base">receipt_long</span>
              <span>Riwayat Pesanan ({orders.length})</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Profile & Address Form */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            <div className="lg:col-span-8 bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#51000d] text-xl">manage_accounts</span>
                  <h2 className="text-base font-extrabold text-gray-900">Pengaturan Profil &amp; Alamat</h2>
                </div>
                <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full font-bold">
                  Otomatis Terisi saat Checkout
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Nama Lengkap *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 bg-gray-50/50 focus:bg-white focus:border-[#51000d] focus:ring-2 focus:ring-[#51000d]/10 transition-all outline-none"
                    placeholder="Masukkan nama lengkap Anda"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Alamat Email (Akun)</label>
                  <input
                    type="email"
                    disabled
                    value={formData.email}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-400 bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Nomor Telepon / WhatsApp *</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 bg-gray-50/50 focus:bg-white focus:border-[#51000d] focus:ring-2 focus:ring-[#51000d]/10 transition-all outline-none"
                    placeholder="Contoh: 085600436463"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Detail Alamat Lengkap Pengiriman *</label>
                  <textarea
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 bg-gray-50/50 focus:bg-white focus:border-[#51000d] focus:ring-2 focus:ring-[#51000d]/10 transition-all outline-none resize-none leading-relaxed"
                    placeholder="Nama Jalan, RT/RW, Patokan Rumah, Desa/Kelurahan"
                  />
                </div>

                {/* Regional Selects */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Provinsi *</label>
                  <select
                    value={formData.province}
                    onChange={(e) => {
                      const newProv = e.target.value;
                      const availableCities = INDONESIA_REGIONS[newProv] ? Object.keys(INDONESIA_REGIONS[newProv]) : [];
                      const firstCity = availableCities[0] || "";
                      const availableDistricts = INDONESIA_REGIONS[newProv]?.[firstCity] || [];
                      setFormData({
                        ...formData,
                        province: newProv,
                        city: firstCity,
                        district: availableDistricts[0] || ""
                      });
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 bg-gray-50/50 focus:bg-white focus:border-[#51000d] outline-none cursor-pointer"
                  >
                    {Object.keys(INDONESIA_REGIONS).map((prov) => (
                      <option key={prov} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Kota / Kabupaten *</label>
                  <select
                    value={formData.city}
                    onChange={(e) => {
                      const newCity = e.target.value;
                      const availableDistricts = INDONESIA_REGIONS[formData.province]?.[newCity] || [];
                      setFormData({
                        ...formData,
                        city: newCity,
                        district: availableDistricts[0] || ""
                      });
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 bg-gray-50/50 focus:bg-white focus:border-[#51000d] outline-none cursor-pointer"
                  >
                    {formData.province && INDONESIA_REGIONS[formData.province]
                      ? Object.keys(INDONESIA_REGIONS[formData.province]).map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))
                      : <option value={formData.city}>{formData.city}</option>}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Kecamatan *</label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 bg-gray-50/50 focus:bg-white focus:border-[#51000d] outline-none cursor-pointer"
                  >
                    {formData.province && formData.city && INDONESIA_REGIONS[formData.province]?.[formData.city]
                      ? INDONESIA_REGIONS[formData.province][formData.city].map((dist) => (
                          <option key={dist} value={dist}>
                            {dist}
                          </option>
                        ))
                      : <option value={formData.district || "Tonjong"}>{formData.district || "Tonjong"}</option>}
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#51000d] hover:bg-[#7a0019] text-white rounded-2xl text-xs font-extrabold shadow-lg shadow-[#51000d]/20 active:scale-95 transition-all uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">save</span>
                  <span>Simpan Alamat ke Profil</span>
                </button>
              </div>
            </div>

            {/* Member Benefits Sidebar */}
            <div className="lg:col-span-4 bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
                <span className="material-symbols-outlined text-[#51000d] text-xl">verified</span>
                <h3 className="text-base font-extrabold text-gray-900">Keuntungan Member</h3>
              </div>
              <div className="space-y-3 text-xs text-gray-600">
                <div className="flex items-start gap-3 p-3.5 bg-red-50/60 rounded-2xl border border-red-100/80">
                  <span className="material-symbols-outlined text-xl text-[#51000d]">stars</span>
                  <div>
                    <p className="font-bold text-[#51000d]">Harga Prioritas Mitra</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">Dapatkan otomatis harga grosir murah untuk pesanan besar.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3.5 bg-green-50/60 rounded-2xl border border-green-100/80">
                  <span className="material-symbols-outlined text-xl text-green-700">local_shipping</span>
                  <div>
                    <p className="font-bold text-green-800">Subsidi Ongkir Toko</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">Gratis ongkir untuk pembelian minimal Rp 200.000.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100/80">
                  <span className="material-symbols-outlined text-xl text-blue-700">support_agent</span>
                  <div>
                    <p className="font-bold text-blue-800">Layanan Pelanggan WhatsApp</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">Bantuan langsung admin toko Pak Mul dari aplikasi.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Orders List */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-gray-900">Riwayat Pesanan Saya</h2>
                <p className="text-xs text-gray-500 mt-0.5">Pantau status pesanan dan rincian transaksi Anda.</p>
              </div>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">
                {orders.length} Pesanan
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center text-gray-400 space-y-3">
                <span className="material-symbols-outlined text-4xl text-gray-300">receipt_long</span>
                <p className="text-xs font-medium">Belum ada riwayat pesanan.</p>
                <Link href="/produk" className="inline-block px-5 py-2.5 bg-[#51000d] text-white rounded-xl text-xs font-bold">
                  Mulai Belanja Now
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <div key={order.id} className="p-5 sm:p-6 hover:bg-gray-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-sm font-black text-[#51000d] tracking-wide">{order.orderNumber}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          order.status === 'COMPLETED' ? 'bg-green-100 text-green-800 border border-green-200' :
                          order.status === 'CANCELED' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {order.status === 'COMPLETED' ? 'Selesai' : order.status === 'CANCELED' ? 'Dibatalkan' : 'Diproses'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Penerima: <span className="font-semibold text-gray-900">{order.customerName}</span> ({order.customerPhone})
                      </p>
                      <p className="text-[11px] text-gray-400 font-medium">
                        {new Date(order.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0">
                      <div>
                        <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Total Tagihan</p>
                        <p className="text-base font-black text-[#51000d]">Rp {formatPrice(order.finalTotal)}</p>
                      </div>
                      <Link
                        href={`/transaksi/${order.orderNumber}`}
                        className="px-4 py-2.5 bg-gray-100 hover:bg-[#51000d] hover:text-white rounded-xl text-xs font-bold text-gray-700 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Detail</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
