"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { INDONESIA_REGIONS } from "@/lib/indonesia-regions";

export default function CheckoutPage() {
  const router = useRouter();
  const cartContext = useCart();
  const cartItems = cartContext?.items || [];
  const totalPrice = cartContext?.totalPrice || 0;
  const clearCart = cartContext?.clearCart || (() => { });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Custom Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState<string>("");
  const [createdOrderTotal, setCreatedOrderTotal] = useState<number>(0);
  const [activePaymentTab, setActivePaymentTab] = useState<"qris" | "va" | "retail">("qris");
  const [selectedBank, setSelectedBank] = useState<"BCA" | "Mandiri" | "BNI" | "BRI">("BCA");
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [midtransToken, setMidtransToken] = useState<string | null>(null);
  const [midtransQrisUrl, setMidtransQrisUrl] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    district: "Kramat Jati",
    city: "Jakarta Timur",
    province: "DKI Jakarta",
    notes: "",
    paymentMethod: "MIDTRANS",
  });

  // Check logged in user to auto-fill form
  // Check logged in user and saved profile address to auto-fill form
  const [isAutoFilled, setIsAutoFilled] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { createClient } = await import("@/utils/supabase/client");
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        const storedUser = localStorage.getItem("user");
        const savedAddr = localStorage.getItem("user_saved_address");
        let hasValidUser = !!session?.user;
        if (!hasValidUser && storedUser) {
          try {
            const u = JSON.parse(storedUser);
            if (u && (u.email || u.id)) hasValidUser = true;
          } catch (e) {}
        }

        if (!hasValidUser) {
          router.push("/login");
          return;
        }

        let parsed: any = {};
        if (savedAddr) {
          try { parsed = JSON.parse(savedAddr); } catch (e) { }
        }

        setFormData((prev) => {
          const updated = {
            ...prev,
            customerEmail: session?.user?.email || parsed.email || prev.customerEmail,
            customerName: parsed.name || session?.user?.user_metadata?.full_name || prev.customerName,
            customerPhone: parsed.phone || prev.customerPhone,
            shippingAddress: parsed.address || prev.shippingAddress,
            city: parsed.city || prev.city,
            province: parsed.province || prev.province,
          };
          if (parsed.address || parsed.phone) {
            setIsAutoFilled(true);
          }
          return updated;
        });
      } catch (err) {
        console.warn("Could not auto-fill user data:", err);
      }
    };
    fetchUser();
  }, [router]);

  const [couriers, setCouriers] = useState<any[]>([]);
  const [isLoadingCouriers, setIsLoadingCouriers] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState<any>(null);

  useEffect(() => {
    const fetchRates = async () => {
      setIsLoadingCouriers(true);
      try {
        const res = await fetch("/api/shipping/rates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postalCode: 13510, weight: 1000 }),
        });
        const data = await res.json();
        if (data.couriers && data.couriers.length > 0) {
          setCouriers(data.couriers);
          setSelectedCourier(data.couriers[0]);
        }
      } catch (e) {
        console.error("Failed to load Biteship rates:", e);
      } finally {
        setIsLoadingCouriers(false);
      }
    };
    fetchRates();
  }, []);

  const shippingFee = selectedCourier?.price ?? (totalPrice >= 200000 ? 0 : 15000);
  const finalTotal = totalPrice + shippingFee;

  // Mock VA Numbers for custom modal UI
  const vaNumbers = {
    BCA: "88012" + Math.floor(10000000 + Math.random() * 90000000),
    Mandiri: "89320" + Math.floor(10000000 + Math.random() * 90000000),
    BNI: "88100" + Math.floor(10000000 + Math.random() * 90000000),
    BRI: "88088" + Math.floor(10000000 + Math.random() * 90000000),
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setErrorMessage("Keranjang belanja Anda kosong.");
      return;
    }

    try {
      // Auto-save address & contact details to localStorage so it syncs with Profile
      localStorage.setItem("user_saved_address", JSON.stringify({
        name: formData.customerName,
        email: formData.customerEmail,
        phone: formData.customerPhone,
        address: formData.shippingAddress,
        city: formData.city,
        province: formData.province,
      }));

      // Create Order in DB via /api/checkout
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          shippingFee,
          items: cartItems,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Gagal membuat pesanan.");
      }

      setCreatedOrderNumber(data.orderNumber);
      setCreatedOrderTotal(finalTotal);

      // Clear local cart
      clearCart();

      // Instantly redirect to Invoice / Detail Pesanan page
      router.push(`/transaksi/${data.orderNumber}`);
    } catch (err: any) {
      console.error("Checkout failed:", err);
      setErrorMessage(err.message || "Terjadi kesalahan saat memproses pesanan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-[#1a1c1c] font-sans antialiased flex flex-col pt-20">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#51000d] tracking-tight">
            Checkout &amp; Pembayaran
          </h1>
          <p className="text-xs md:text-sm text-gray-500 font-medium mt-1">
            Lengkapi data pengiriman untuk menyelesaikan pesanan Anda.
          </p>
        </div>

        {cartItems.length === 0 && !isPaymentModalOpen ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-4 max-w-lg mx-auto">
            <span className="material-symbols-outlined text-6xl text-gray-300">shopping_bag</span>
            <h2 className="text-lg font-bold text-gray-800">Keranjang Belanja Kosong</h2>
            <p className="text-xs text-gray-500">Anda belum memilih produk Bakso Pak Mul apapun.</p>
            <button
              onClick={() => router.push("/produk")}
              className="px-6 py-3 bg-[#51000d] text-white rounded-xl text-xs font-bold shadow-md hover:bg-[#7a0019] transition-all uppercase tracking-wider cursor-pointer"
            >
              Lihat Katalog Produk
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Delivery & Customer Info */}
            <div className="lg:col-span-7 space-y-6">

              {/* Auto-fill notification badge */}
              {isAutoFilled && (
                <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between gap-3 text-emerald-900 shadow-sm">
                  <div className="flex items-center gap-2.5 text-xs font-bold">
                    <span className="material-symbols-outlined text-emerald-600 text-lg">verified</span>
                    <span>Alamat &amp; No HP otomatis terisi dari Profil Anda</span>
                  </div>
                  <a href="/profil" className="text-[11px] font-black text-[#51000d] hover:underline shrink-0">
                    Ubah di Profil →
                  </a>
                </div>
              )}

              {/* Customer Info Card */}
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-5">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-[#51000d] flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-xl">person</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">1. Informasi Penerima</h3>
                    <p className="text-xs text-gray-500">Data untuk konfirmasi pengiriman &amp; WhatsApp</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Nama Lengkap *</label>
                    <input
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:border-[#51000d] focus:bg-white bg-gray-50 outline-none transition-all"
                      placeholder="Masukkan nama lengkap Anda"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Nomor WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={formData.customerPhone}
                        onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:border-[#51000d] focus:bg-white bg-gray-50 outline-none transition-all"
                        placeholder="Misal: 081234567890"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Email (Opsional)</label>
                      <input
                        type="email"
                        value={formData.customerEmail}
                        onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:border-[#51000d] focus:bg-white bg-gray-50 outline-none transition-all"
                        placeholder="email@contoh.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address Card */}
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-5">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-[#51000d] flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-xl">location_on</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">2. Alamat Pengiriman</h3>
                    <p className="text-xs text-gray-500">Pastikan alamat pengiriman akurat untuk kurir</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Alamat Lengkap *</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.shippingAddress}
                      onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:border-[#51000d] focus:bg-white bg-gray-50 outline-none transition-all resize-none"
                      placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan..."
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:border-[#51000d] focus:bg-white bg-gray-50 outline-none transition-all cursor-pointer"
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
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:border-[#51000d] focus:bg-white bg-gray-50 outline-none transition-all cursor-pointer"
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
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:border-[#51000d] focus:bg-white bg-gray-50 outline-none transition-all cursor-pointer"
                      >
                        {formData.province && formData.city && INDONESIA_REGIONS[formData.province]?.[formData.city]
                          ? INDONESIA_REGIONS[formData.province][formData.city].map((dist) => (
                              <option key={dist} value={dist}>
                                {dist}
                              </option>
                            ))
                          : <option value={formData.district || "Kramat Jati"}>{formData.district || "Kramat Jati"}</option>}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Catatan Kurir (Opsional)</label>
                    <input
                      type="text"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:border-[#51000d] focus:bg-white bg-gray-50 outline-none transition-all"
                      placeholder="Misal: Pagar hitam / titip di sekuriti"
                    />
                  </div>
                </div>
              </div>

              {/* Biteship Shipping Courier Card */}
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-5">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-xl">local_shipping</span>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900">2. PILIH KURIR EKSPEDISI (BITESHIP)</h3>
                      <p className="text-xs text-gray-500">Dikirim langsung dari Kios Pasar Kramat Jati, Jakarta Timur</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
                    API Biteship Live
                  </span>
                </div>

                {isLoadingCouriers ? (
                  <div className="py-6 text-center text-xs font-semibold text-gray-500 flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#51000d] border-t-transparent rounded-full animate-spin"></span>
                    Menghubungkan ke API Biteship untuk cek ongkir kurir...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {couriers.map((courier: any, idx: number) => {
                      const isSelected = selectedCourier?.courier_code === courier.courier_code && selectedCourier?.courier_service_code === courier.courier_service_code;
                      return (
                        <div
                          key={`${courier.courier_code}-${courier.courier_service_code}-${idx}`}
                          onClick={() => setSelectedCourier(courier)}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                            isSelected ? "border-[#51000d] bg-red-50/50 shadow-sm" : "border-gray-100 bg-gray-50 hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase text-[#51000d]">
                              🚚 {courier.courier_name} {courier.courier_service_name}
                            </span>
                            <span className="text-xs font-extrabold text-gray-900">
                              Rp {formatPrice(courier.price)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium">
                            <span>{courier.description || "Layanan Pengiriman Terverifikasi"}</span>
                            <span className="font-bold text-gray-700">⏱️ {courier.duration}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Payment Method Card */}
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-5">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-[#51000d] flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-xl">payments</span>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900">3. Metode Pembayaran</h3>
                      <p className="text-xs text-gray-500">Pilih pembayaran instan atau COD</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                    Terverifikasi Aman
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Midtrans / Payment Gateway */}
                  <label
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-3 ${formData.paymentMethod === "MIDTRANS"
                        ? "border-[#51000d] bg-red-50/50"
                        : "border-gray-100 bg-gray-50 hover:bg-gray-100"
                      }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="MIDTRANS"
                      checked={formData.paymentMethod === "MIDTRANS"}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between">
                      <span className="material-symbols-outlined text-3xl text-[#51000d]">credit_card</span>
                      <span className="text-[9px] font-black bg-[#51000d] text-white px-2.5 py-0.5 rounded-full">RECOMMENDED</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Pembayaran Instan (QRIS &amp; Virtual Account)</p>
                      <p className="text-[10px] text-gray-500">GoPay, ShopeePay, QRIS All Payment, BCA, Mandiri, BNI, BRI</p>
                    </div>
                  </label>

                  {/* COD */}
                  <label
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-3 ${formData.paymentMethod === "COD"
                        ? "border-[#51000d] bg-red-50/50"
                        : "border-gray-100 bg-gray-50 hover:bg-gray-100"
                      }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="COD"
                      checked={formData.paymentMethod === "COD"}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between">
                      <span className="material-symbols-outlined text-3xl text-[#51000d]">handshake</span>
                      <span className="text-[9px] font-black bg-gray-200 text-gray-700 px-2.5 py-0.5 rounded-full">TUNAI</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Bayar di Tempat (COD)</p>
                      <p className="text-[10px] text-gray-500">Bayar tunai saat barang diterima via kurir toko</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary Sidebar */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6 sticky top-28">
                <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-4">
                  Ringkasan Pesanan ({cartItems.length} Barang)
                </h3>

                {/* Items List */}
                <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                  {cartItems.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-contain bg-gray-50 border border-gray-200 shrink-0 p-1"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{item.name}</p>
                        <p className="text-[10px] text-gray-500">
                          {item.quantity} x Rp {formatPrice(item.price)}
                        </p>
                      </div>
                      <p className="text-xs font-black text-[#51000d] shrink-0">
                        Rp {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-gray-100 pt-4 space-y-2 text-xs font-semibold text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal Produk</span>
                    <span className="font-bold text-gray-900">Rp {formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ongkos Kirim</span>
                    {shippingFee === 0 ? (
                      <span className="font-extrabold text-green-600 uppercase text-[10px] bg-green-100 px-2 py-0.5 rounded-md">Gratis Ongkir</span>
                    ) : (
                      <span className="font-bold text-gray-900">Rp {formatPrice(shippingFee)}</span>
                    )}
                  </div>
                </div>

                {/* Final Total */}
                <div className="border-t border-gray-100 pt-4 flex items-baseline justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-500">Total Pembayaran</p>
                    <p className="text-xs text-green-600 font-medium">Stok Langsung Diproses</p>
                  </div>
                  <p className="text-2xl font-black text-[#51000d]">
                    Rp {formatPrice(finalTotal)}
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-bold border border-red-200 flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">error</span>
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#51000d] hover:bg-[#7a0019] text-white rounded-2xl text-xs font-bold shadow-lg hover:shadow-xl transition-all uppercase tracking-wider cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-base">sync</span>
                      <span>Memproses Pembayaran...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">lock</span>
                      <span>Lanjut Pembayaran</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
