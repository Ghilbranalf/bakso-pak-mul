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
    <div className="min-h-screen bg-[#F8F8F8] text-[#1a1c1c] font-sans antialiased flex flex-col pt-20">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#51000d] text-white flex items-center justify-center font-black text-2xl shadow-md">
                {(formData.name || "U").charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-extrabold text-gray-900">{formData.name}</h1>
                <p className="text-xs text-gray-500 font-medium">{formData.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                    Pelanggan Aktif
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">• Terverifikasi</span>
                </div>
              </div>
            </div>

            {/* Mobile Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="md:hidden px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Keluar dari Akun"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              <span>Keluar</span>
            </button>
          </div>

          {/* Tab Navigation & Desktop Sign Out */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="flex items-center bg-gray-100 p-1.5 rounded-2xl w-full sm:w-auto">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "profile"
                    ? "bg-white text-[#51000d] shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Data Diri &amp; Alamat
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "orders"
                    ? "bg-white text-[#51000d] shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Riwayat Pesanan ({orders.length})
              </button>
            </div>

            <button
              onClick={handleSignOut}
              className="hidden md:flex px-4 py-2.5 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded-2xl text-xs font-bold items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              <span>Keluar</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Profile & Address */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-4">
                Informasi Akun Pelanggan
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 bg-gray-50 focus:bg-white focus:border-[#51000d] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Alamat Email</label>
                  <input
                    type="email"
                    disabled
                    value={formData.email}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-400 bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nomor Telepon / WhatsApp</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 bg-gray-50 focus:bg-white focus:border-[#51000d] outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Alamat Utama Pengiriman</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 bg-gray-50 focus:bg-white focus:border-[#51000d] outline-none"
                    placeholder="Nama jalan, RT/RW, desa/kelurahan, kecamatan"
                  />
                </div>

                {/* Provinsi Select */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Provinsi *</label>
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 bg-gray-50 focus:bg-white focus:border-[#51000d] outline-none cursor-pointer"
                  >
                    {Object.keys(INDONESIA_REGIONS).map((prov) => (
                      <option key={prov} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Kota / Kabupaten Select */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Kota / Kabupaten *</label>
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 bg-gray-50 focus:bg-white focus:border-[#51000d] outline-none cursor-pointer"
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

                {/* Kecamatan Select */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Kecamatan *</label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 bg-gray-50 focus:bg-white focus:border-[#51000d] outline-none cursor-pointer"
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

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="px-6 py-3 bg-[#51000d] hover:bg-[#7a0019] text-white rounded-xl text-xs font-bold shadow-md uppercase tracking-wider cursor-pointer flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">save</span>
                  <span>Simpan Alamat ke Profil</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-4">
                Layanan &amp; Keuntungan Member
              </h3>
              <div className="space-y-3 text-xs text-gray-600">
                <div className="flex items-start gap-3 p-3 bg-red-50/50 rounded-xl border border-red-100">
                  <span className="material-symbols-outlined text-lg text-[#51000d]">stars</span>
                  <div>
                    <p className="font-bold text-[#51000d]">Pelanggan Prioritas</p>
                    <p className="text-[11px] text-gray-500">Mendapatkan harga khusus untuk pesanan grosir.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50/50 rounded-xl border border-green-100">
                  <span className="material-symbols-outlined text-lg text-green-700">local_shipping</span>
                  <div>
                    <p className="font-bold text-green-800">Gratis Ongkir Jabodetabek</p>
                    <p className="text-[11px] text-gray-500">Untuk setiap pembelian minimal Rp 200.000.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Transaction History */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">Daftar Transaksi Saya</h2>
              <p className="text-xs text-gray-500">Pantau status pengiriman atau cetak invoice pesanan Anda.</p>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center text-gray-500 text-xs">
                Belum ada riwayat pesanan.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <div key={order.id} className="p-6 hover:bg-gray-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-extrabold text-[#51000d]">{order.orderNumber}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          order.status === 'CANCELED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status === 'COMPLETED' ? 'Selesai' : order.status === 'CANCELED' ? 'Dibatalkan' : 'Diproses'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Penerima: <span className="font-semibold text-gray-900">{order.customerName}</span> ({order.customerPhone})
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0">
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Total Tagihan</p>
                        <p className="text-base font-black text-gray-900">Rp {formatPrice(order.finalTotal)}</p>
                      </div>
                      <Link
                        href={`/transaksi/${order.orderNumber}`}
                        className="px-4 py-2 bg-gray-100 hover:bg-[#51000d] hover:text-white rounded-xl text-xs font-bold text-gray-700 transition-all cursor-pointer"
                      >
                        Lacak Pesanan
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
