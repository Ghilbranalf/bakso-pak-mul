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
          console.warn("Error loading user profile:", err);
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
    alert("Data Diri & Alamat Utama berhasil disimpan ke Profil!\nAlamat ini akan otomatis terisi saat Anda Checkout.");
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
    return (price || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#1c1917] font-sans antialiased flex flex-col pt-20 sm:pt-24 selection:bg-[#51000d] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {/* Profile Card Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-stone-200 mb-8 transition-all">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
            {/* User Avatar & Info */}
            <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
              <div className="relative">
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-[#51000d] text-[#e5a93c] flex items-center justify-center font-headline text-4xl shadow-md border-2 border-[#e5a93c]">
                  {(formData.name || "U").charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-600 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[10px] text-white font-black">check</span>
                </div>
              </div>

              <div className="space-y-1">
                <h1 className="font-headline text-2xl sm:text-3xl uppercase text-[#1c1917] tracking-tight leading-snug">
                  {formData.name || "Pelanggan Setia"}
                </h1>
                <p className="text-xs text-[#51000d] font-bold">{formData.email || "email@pelanggan.com"}</p>
                <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                  <span className="px-3 py-0.5 bg-amber-50 text-[#7a0019] border border-amber-200/80 rounded-full text-[10px] font-black uppercase tracking-wider">
                    Pelanggan Setia BPM
                  </span>
                  <span className="text-[10px] text-[#2b1b17] font-semibold">• Terverifikasi</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="w-full sm:w-auto pt-2 sm:pt-0">
              <button
                onClick={handleSignOut}
                className="w-full sm:w-auto px-6 py-2.5 bg-rose-50 hover:bg-rose-700 hover:text-white text-rose-700 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer border border-rose-200 hover:border-transparent active:scale-95 shadow-xs"
              >
                <span className="material-symbols-outlined text-base">logout</span>
                <span>Keluar Akun</span>
              </button>
            </div>
          </div>

          {/* Segmented Switcher */}
          <div className="mt-6 pt-5 border-t border-stone-100 flex p-1.5 bg-[#faf7f2] rounded-2xl gap-2">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "profile"
                  ? "bg-[#51000d] text-[#e5a93c] shadow-md"
                  : "text-[#1c1917] hover:text-[#51000d]"
              }`}
            >
              <span className="material-symbols-outlined text-base">person</span>
              <span>Data Diri &amp; Alamat</span>
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "orders"
                  ? "bg-[#51000d] text-[#e5a93c] shadow-md"
                  : "text-[#1c1917] hover:text-[#51000d]"
              }`}
            >
              <span className="material-symbols-outlined text-base">receipt_long</span>
              <span>Riwayat Pesanan ({orders.length})</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Profile & Address Form */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border-2 border-stone-200 space-y-6">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#51000d] text-xl">manage_accounts</span>
                  <h2 className="font-headline text-lg uppercase text-[#1c1917]">Pengaturan Profil &amp; Alamat</h2>
                </div>
                <span className="text-[10px] bg-amber-50 text-[#7a0019] border border-amber-200 px-3 py-1 rounded-full font-black uppercase tracking-wider">
                  Otomatis Terisi saat Checkout
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1c1917] mb-1.5">Nama Lengkap *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-stone-200 text-xs font-bold text-[#1c1917] bg-stone-50/50 focus:bg-white focus:border-[#51000d] transition-all outline-none"
                    placeholder="Masukkan nama lengkap Anda"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1c1917] mb-1.5">Alamat Email (Akun)</label>
                  <input
                    type="email"
                    disabled
                    value={formData.email}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-stone-200 text-xs font-bold text-stone-500 bg-stone-100 cursor-not-allowed"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#1c1917] mb-1.5">Nomor Telepon / WhatsApp *</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-stone-200 text-xs font-bold text-[#1c1917] bg-stone-50/50 focus:bg-white focus:border-[#51000d] transition-all outline-none"
                    placeholder="Contoh: 085600436463"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#1c1917] mb-1.5">Detail Alamat Lengkap Pengiriman *</label>
                  <textarea
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-stone-200 text-xs font-bold text-[#1c1917] bg-stone-50/50 focus:bg-white focus:border-[#51000d] transition-all outline-none resize-none leading-relaxed"
                    placeholder="Nama Jalan, RT/RW, Patokan Rumah, Desa/Kelurahan"
                  />
                </div>

                {/* Regional Selects */}
                <div>
                  <label className="block text-xs font-bold text-[#1c1917] mb-1.5">Provinsi *</label>
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
                    className="w-full px-4 py-3 rounded-2xl border-2 border-stone-200 text-xs font-bold text-[#1c1917] bg-stone-50/50 focus:bg-white focus:border-[#51000d] outline-none cursor-pointer"
                  >
                    {Object.keys(INDONESIA_REGIONS).map((prov) => (
                      <option key={prov} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1c1917] mb-1.5">Kota / Kabupaten *</label>
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
                    className="w-full px-4 py-3 rounded-2xl border-2 border-stone-200 text-xs font-bold text-[#1c1917] bg-stone-50/50 focus:bg-white focus:border-[#51000d] outline-none cursor-pointer"
                  >
                    {formData.province && INDONESIA_REGIONS[formData.province] && (
                      Object.keys(INDONESIA_REGIONS[formData.province]).map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))
                    )}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#1c1917] mb-1.5">Kecamatan *</label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-stone-200 text-xs font-bold text-[#1c1917] bg-stone-50/50 focus:bg-white focus:border-[#51000d] outline-none cursor-pointer"
                  >
                    {formData.province && formData.city && INDONESIA_REGIONS[formData.province]?.[formData.city]?.map((d: string) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="w-full py-3.5 bg-[#e5a93c] hover:bg-amber-400 text-[#1c0306] rounded-full text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base font-bold">save</span>
                  <span>Simpan Perubahan Profil</span>
                </button>
              </div>
            </div>

            {/* Side Card: Kios Info */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#1c0306] text-white p-6 sm:p-7 rounded-3xl shadow-sm border border-[#420812] space-y-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#e5a93c] text-2xl">verified</span>
                  <h3 className="font-headline text-lg uppercase tracking-wider text-[#e5a93c]">Kios Pasar Kramat Jati</h3>
                </div>
                <p className="text-xs text-[#fef3c7] leading-relaxed font-medium">
                  Alamat Anda otomatis tersimpan di browser ini dan siap dipanggil saat Anda melakukan pemesanan checkout cepat.
                </p>
                <div className="pt-2 border-t border-white/10 text-xs space-y-1 text-stone-300">
                  <p><strong className="text-white">Alamat Kios:</strong> Pasar Kramat Jati, Lantai Dasar Los D, Jakarta Timur</p>
                  <p><strong className="text-white">Jam Buka:</strong> 06.00 – 17.00 WIB (Buka Setiap Hari)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Orders History */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border-2 border-stone-200">
                <span className="material-symbols-outlined text-5xl text-[#51000d] mb-2 block">receipt_long</span>
                <p className="font-headline text-xl uppercase text-[#1c1917]">Belum Ada Riwayat Pesanan</p>
                <p className="text-xs text-[#51000d] font-semibold mt-1">Anda belum melakukan pembelian melalui akun ini.</p>
                <Link
                  href="/produk"
                  className="mt-4 inline-block px-6 py-2.5 bg-[#e5a93c] hover:bg-amber-400 text-[#1c0306] rounded-full text-xs font-black uppercase tracking-wider shadow"
                >
                  Mulai Belanja
                </Link>
              </div>
            ) : (
              orders.map((order: any) => (
                <div key={order.id} className="bg-white rounded-3xl border-2 border-stone-200 p-6 shadow-xs hover:border-[#e5a93c] transition-all">
                  <div className="flex flex-wrap items-center justify-between pb-3 border-b border-stone-100 gap-3">
                    <div>
                      <span className="text-xs font-black uppercase text-[#51000d]">{order.orderNumber}</span>
                      <p className="text-[11px] text-[#2b1b17] font-semibold mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-amber-50 text-[#7a0019] border border-amber-200">
                      {order.status || "DIPROSES"}
                    </span>
                  </div>
                  <div className="pt-3 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-bold text-[#51000d] block">TOTAL</span>
                      <span className="font-headline text-xl text-[#1c1917]">Rp {formatPrice(order.finalTotal)}</span>
                    </div>
                    <Link
                      href={`/lacak?id=${encodeURIComponent(order.orderNumber)}`}
                      className="px-5 py-2 rounded-full bg-[#1c0306] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#36070e] transition-all"
                    >
                      Lacak Status
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}