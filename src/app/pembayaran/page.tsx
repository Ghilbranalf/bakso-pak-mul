"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

const PROVINCES = ["DKI Jakarta", "Jawa Barat", "Banten"];
const CITIES: Record<string, { name: string, rate: number }[]> = {
  "DKI Jakarta": [
    { name: "Jakarta Selatan", rate: 15000 },
    { name: "Jakarta Pusat", rate: 18000 },
    { name: "Jakarta Barat", rate: 20000 },
    { name: "Jakarta Timur", rate: 20000 },
    { name: "Jakarta Utara", rate: 22000 },
  ],
  "Jawa Barat": [
    { name: "Depok", rate: 25000 },
    { name: "Bogor", rate: 35000 },
    { name: "Bekasi", rate: 30000 },
    { name: "Bandung", rate: 65000 },
  ],
  "Banten": [
    { name: "Tangerang", rate: 28000 },
    { name: "Tangerang Selatan", rate: 25000 },
    { name: "Serang", rate: 50000 },
  ]
};

export default function CheckoutPage() {
  const { items, totalPrice, discount } = useCart();
  const router = useRouter();
  
  const [shippingInfo, setShippingInfo] = useState({
    name: "Toko Bakso Mulia",
    phone: "081234567890",
    province: "",
    city: "",
    address: "Jl. Merdeka No. 45, Kebayoran Baru",
    notes: "Titipkan ke kasir jika toko buka"
  });
  
  const [checkoutShipping, setCheckoutShipping] = useState(0);
  const checkoutFinalTotal = items.length > 0 ? Math.max(0, totalPrice + checkoutShipping - discount) : 0;

  const [paymentType, setPaymentType] = useState<"online" | "cod">("online");
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleCheckout = async () => {
    if (!shippingInfo.province || !shippingInfo.city) {
      alert("Mohon lengkapi Provinsi dan Kota pengiriman terlebih dahulu.");
      return;
    }

    if (paymentType === "cod") {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        router.push("/transaksi");
      }, 1500);
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch("/api/tokenizer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          totalPrice,
          shippingCost: checkoutShipping,
          discount
        }),
      });

      const data = await response.json();
      
      if (data.token) {
        (window as any).snap.pay(data.token, {
          onSuccess: function (result: any) {
            console.log("Success:", result);
            window.location.href = "/transaksi";
          },
          onPending: function (result: any) {
            console.log("Pending:", result);
            window.location.href = "/transaksi";
          },
          onError: function (result: any) {
            console.log("Error:", result);
            alert("Pembayaran gagal!");
            setIsProcessing(false);
          },
          onClose: function () {
            setIsProcessing(false);
          }
        });
      } else {
        console.error("API Tokenizer Response:", data);
        alert(`Gagal mendapatkan token pembayaran. ${data.error || ""} ${data.details ? JSON.stringify(data.details) : ""}`);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem.");
      setIsProcessing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setShippingInfo(prev => ({ ...prev, [name]: value }));

    // Reset city and shipping if province changes
    if (name === "province") {
      setShippingInfo(prev => ({ ...prev, city: "" }));
      setCheckoutShipping(0);
    }

    // Set shipping rate based on city selection
    if (name === "city") {
      const selectedProvince = shippingInfo.province;
      if (selectedProvince && CITIES[selectedProvince]) {
        const cityData = CITIES[selectedProvince].find(c => c.name === value);
        if (cityData) {
          // Asumsi berat total 1kg untuk demo. Di dunia nyata dikali total kg barang.
          setCheckoutShipping(cityData.rate);
        } else {
          setCheckoutShipping(0);
        }
      }
    }
  };

  return (
    <div className="bg-[#f3f3f3] text-[#1a1c1c] min-h-screen flex items-center justify-center p-4 md:p-8 font-sans antialiased pb-24 md:pb-8">
      {/* Modal Container */}
      <main className="w-full max-w-5xl mx-auto bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative border border-white/50">
        
        {/* Back Button */}
        <Link
          href="/"
          className="absolute top-6 left-6 z-20 flex items-center gap-2 text-gray-600 hover:text-[#51000d] transition-colors bg-white/80 px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-sm border border-gray-200 text-xs font-semibold cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span>Kembali Belanja</span>
        </Link>

        {/* Left Side: Order Summary */}
        <section className="w-full md:w-5/12 bg-white p-8 md:p-12 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-red-100 rounded-full blur-3xl opacity-30 pointer-events-none"></div>

          <div className="relative z-10 mt-12 md:mt-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#51000d] mb-1">Checkout Pesanan</h1>
              <p className="text-xs text-gray-500 font-medium">B2B Wholesale Portal</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 shadow-sm mb-6 border border-gray-100">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                <span className="text-xs text-gray-500 font-medium">Order ID</span>
                <span className="text-xs font-bold text-gray-900">#BPM-8821</span>
              </div>

              <div className="space-y-4 mb-6 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                {items.length === 0 ? (
                  <>
                    <div className="flex justify-between items-start text-xs">
                      <div>
                        <p className="font-bold text-gray-900">Premium Beef Meatballs</p>
                        <p className="text-gray-500 text-[11px]">Bulk Pack (50kg)</p>
                      </div>
                      <span className="font-medium text-gray-800">Rp 3.500.000</span>
                    </div>
                  </>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start text-xs">
                      <div>
                        <p className="font-bold text-gray-900 truncate max-w-[150px]">{item.name}</p>
                        <p className="text-gray-500 text-[11px]">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-medium text-gray-800">Rp {formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-2">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Subtotal Produk</span>
                  <span className="text-gray-900 font-medium">Rp {formatPrice(totalPrice)}</span>
                </div>
                
                {checkoutShipping > 0 && (
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Ongkos Kirim (Reguler)</span>
                    <span className="text-gray-900 font-medium">Rp {formatPrice(checkoutShipping)}</span>
                  </div>
                )}
                
                {discount > 0 && (
                  <div className="flex justify-between items-center text-xs text-[#b32633]">
                    <span>Diskon Grosir</span>
                    <span className="font-semibold">- Rp {formatPrice(discount)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-300 border-dashed">
                <span className="text-sm font-bold text-gray-900">Total Akhir</span>
                <span className="text-xl font-black text-[#51000d]">Rp {formatPrice(checkoutFinalTotal)}</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-gray-400 text-xs mt-4">
            <span className="material-symbols-outlined text-base">lock</span>
            <span>Pembayaran Aman Terenkripsi SSL 256-bit</span>
          </div>
        </section>

        {/* Right Side: Checkout Form */}
        <section className="w-full md:w-7/12 bg-[#f9f9f9] p-8 md:p-12 flex flex-col justify-center relative">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Informasi Pengiriman</h2>
            
            <div className="space-y-4 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Nama Penerima</label>
                  <input
                    type="text"
                    name="name"
                    value={shippingInfo.name}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 focus:ring-1 focus:ring-[#51000d] transition-shadow outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Nomor Telepon</label>
                  <input
                    type="text"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 focus:ring-1 focus:ring-[#51000d] transition-shadow outline-none"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Provinsi</label>
                  <select
                    name="province"
                    value={shippingInfo.province}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 focus:ring-1 focus:ring-[#51000d] transition-shadow outline-none appearance-none"
                  >
                    <option value="">Pilih Provinsi</option>
                    {PROVINCES.map(prov => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Kota / Kabupaten</label>
                  <select
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    disabled={!shippingInfo.province}
                    className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 focus:ring-1 focus:ring-[#51000d] transition-shadow outline-none appearance-none disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <option value="">Pilih Kota</option>
                    {shippingInfo.province && CITIES[shippingInfo.province]?.map(city => (
                      <option key={city.name} value={city.name}>{city.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Alamat Lengkap</label>
                <textarea
                  rows={2}
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 focus:ring-1 focus:ring-[#51000d] transition-shadow outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Catatan Kurir (Opsional)</label>
                <input
                  type="text"
                  name="notes"
                  value={shippingInfo.notes}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 focus:ring-1 focus:ring-[#51000d] transition-shadow outline-none"
                />
              </div>
            </div>

            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Metode Pembayaran</h2>
            <div className="grid grid-cols-2 gap-3 mb-8">
              <button
                type="button"
                onClick={() => setPaymentType("online")}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                  paymentType === "online" 
                  ? "border-[#51000d] bg-[#51000d]/5 text-[#51000d] ring-1 ring-[#51000d]" 
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                }`}
              >
                <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                <span className="text-xs font-bold text-center">Bayar Online<br/><span className="text-[10px] font-medium opacity-80">(Midtrans)</span></span>
              </button>
              
              <button
                type="button"
                onClick={() => setPaymentType("cod")}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                  paymentType === "cod" 
                  ? "border-emerald-600 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600" 
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                }`}
              >
                <span className="material-symbols-outlined text-2xl">local_shipping</span>
                <span className="text-xs font-bold text-center">Bayar di Tempat<br/><span className="text-[10px] font-medium opacity-80">(COD)</span></span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={isProcessing}
              className={`w-full h-14 bg-[#51000d] hover:bg-[#7a0019] text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-red-900/20 uppercase tracking-wider cursor-pointer mt-4 ${isProcessing ? "opacity-75 cursor-wait" : ""}`}
            >
              <span>{isProcessing ? "Memproses..." : "Selesaikan Pesanan"}</span>
              {!isProcessing && <span className="material-symbols-outlined text-lg">check_circle</span>}
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-4">
              Dengan menyelesaikan pesanan, Anda menyetujui <a className="text-[#51000d] hover:underline font-semibold" href="#">Syarat &amp; Ketentuan</a> kami.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
