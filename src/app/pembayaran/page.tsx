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

  const [paymentType, setPaymentType] = useState<"online" | "cod" | "qris">("qris");
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const [qrisModalData, setQrisModalData] = useState<{
    show: boolean;
    qrCodeUrl: string;
    orderNumber: string;
    amount: number;
    qrisString: string;
    isPaid: boolean;
  }>({
    show: false,
    qrCodeUrl: "",
    orderNumber: "",
    amount: 0,
    qrisString: "",
    isPaid: false,
  });

  // Real-time polling effect for QRIS payment status
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (qrisModalData.show && qrisModalData.orderNumber && !qrisModalData.isPaid) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/orders/track?orderNumber=${qrisModalData.orderNumber}`);
          const data = await res.json();
          if (data && (data.status === "PAID" || data.status === "COMPLETED")) {
            setQrisModalData(prev => ({ ...prev, isPaid: true }));
            clearInterval(interval);
            setTimeout(() => {
              window.location.href = `/pembayaran/berhasil?orderNumber=${qrisModalData.orderNumber}`;
            }, 1800);
          }
        } catch (e) {
          console.error("Polling status error:", e);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [qrisModalData.show, qrisModalData.orderNumber, qrisModalData.isPaid]);

  const handleCheckout = async () => {
    if (!shippingInfo.province || !shippingInfo.city) {
      alert("Mohon lengkapi Provinsi dan Kota pengiriman terlebih dahulu.");
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
          discount,
          shippingInfo,
          paymentType
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Terjadi kesalahan server");
      }

      if (paymentType === "cod") {
        window.location.href = "/transaksi";
        return;
      }

      if ((paymentType as string) === "qris") {
        const orderNum = data.orderNumber || "BPM-" + Date.now().toString().slice(-6);
        const qrisRes = await fetch(`/api/payment/qris?orderNumber=${orderNum}&amount=${data.amount || checkoutFinalTotal}`);
        const qrisData = await qrisRes.json();

        if (qrisData.success) {
          setQrisModalData({
            show: true,
            qrCodeUrl: qrisData.qrCodeUrl,
            orderNumber: orderNum,
            amount: qrisData.amount,
            qrisString: qrisData.qrisString,
            isPaid: false,
          });
        } else {
          alert("Gagal membuat QRIS Dinamis: " + (qrisData.error || ""));
        }
        setIsProcessing(false);
        return;
      }

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
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Terjadi kesalahan sistem.");
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
    <div className="bg-[#f3f3f3] text-[#1a1c1c] min-h-[100dvh] flex items-center justify-center p-4 md:p-8 font-sans antialiased pb-24 md:pb-8">
      {/* Modal Container */}
      <main className="w-full max-w-5xl mx-auto bg-white rounded-2xl overflow-hidden flex flex-col md:flex-row relative border border-stone-200">
        
        {/* Back Button */}
        <Link
          href="/"
          className="absolute top-6 left-6 z-20 flex items-center gap-2 text-stone-600 hover:text-[#51000d] transition-colors bg-white px-3.5 py-1.5 rounded-full border border-stone-200 text-xs font-semibold cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span>Kembali Belanja</span>
        </Link>

        {/* Left Side: Order Summary */}
        <section className="w-full md:w-5/12 bg-white p-8 md:p-12 border-b md:border-b-0 md:border-r border-stone-200 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 mt-12 md:mt-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#51000d] mb-1">Checkout Pesanan</h1>
              <p className="text-xs text-stone-500 font-medium">B2B Wholesale Portal</p>
            </div>

            <div className="bg-stone-50 rounded-xl p-6 mb-6 border border-stone-200">
              <div className="flex justify-between items-center mb-4 pb-3">
                <span className="text-xs text-stone-500 font-medium">Order ID</span>
                <span className="text-xs font-bold text-stone-900">#BPM-8821</span>
              </div>

              <div className="space-y-4 mb-6 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                {items.length === 0 ? (
                  <>
                    <div className="flex justify-between items-start text-xs">
                      <div>
                        <p className="font-bold text-stone-900">Premium Beef Meatballs</p>
                        <p className="text-stone-500 text-[11px]">Bulk Pack (50kg)</p>
                      </div>
                      <span className="font-medium text-stone-800">Rp 3.500.000</span>
                    </div>
                  </>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start text-xs">
                      <div>
                        <p className="font-bold text-stone-900 truncate max-w-[150px]">{item.name}</p>
                        <p className="text-stone-500 text-[11px]">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-medium text-stone-800">Rp {formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-3 space-y-2">
                <div className="flex justify-between items-center text-xs text-stone-500">
                  <span>Subtotal Produk</span>
                  <span className="text-stone-900 font-medium">Rp {formatPrice(totalPrice)}</span>
                </div>
                
                {checkoutShipping > 0 && (
                  <div className="flex justify-between items-center text-xs text-stone-500">
                    <span>Ongkos Kirim (Reguler)</span>
                    <span className="text-stone-900 font-medium">Rp {formatPrice(checkoutShipping)}</span>
                  </div>
                )}
                
                {discount > 0 && (
                  <div className="flex justify-between items-center text-xs text-[#b32633]">
                    <span>Diskon Grosir</span>
                    <span className="font-semibold">- Rp {formatPrice(discount)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-3 mt-3 bg-stone-100 p-3 rounded-lg">
                <span className="text-sm font-bold text-stone-900">Total Akhir</span>
                <span className="text-xl font-black text-[#51000d]">Rp {formatPrice(checkoutFinalTotal)}</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-stone-400 text-xs mt-4">
            <span className="material-symbols-outlined text-base">lock</span>
            <span>Pembayaran Aman Terenkripsi SSL 256-bit</span>
          </div>
        </section>

        {/* Right Side: Checkout Form */}
        <section className="w-full md:w-7/12 bg-[#f9f9f9] p-8 md:p-12 flex flex-col justify-center relative">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-lg font-bold text-stone-900 mb-4 pb-2">Informasi Pengiriman</h2>
            
            <div className="space-y-4 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Nama Penerima</label>
                  <input
                    type="text"
                    name="name"
                    value={shippingInfo.name}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs font-semibold text-stone-900 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Nomor Telepon</label>
                  <input
                    type="text"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs font-semibold text-stone-900 outline-none transition-colors"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Provinsi</label>
                  <select
                    name="province"
                    value={shippingInfo.province}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs font-semibold text-stone-900 outline-none appearance-none transition-colors"
                  >
                    <option value="">Pilih Provinsi</option>
                    {PROVINCES.map(prov => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Kota / Kabupaten</label>
                  <select
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    disabled={!shippingInfo.province}
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs font-semibold text-stone-900 outline-none appearance-none disabled:bg-stone-100 disabled:text-stone-400 transition-colors"
                  >
                    <option value="">Pilih Kota</option>
                    {shippingInfo.province && CITIES[shippingInfo.province]?.map(city => (
                      <option key={city.name} value={city.name}>{city.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Alamat Lengkap</label>
                <textarea
                  rows={2}
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs font-semibold text-stone-900 outline-none resize-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Catatan Kurir (Opsional)</label>
                <input
                  type="text"
                  name="notes"
                  value={shippingInfo.notes}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs font-semibold text-stone-900 outline-none transition-colors"
                />
              </div>
            </div>

            <h2 className="text-lg font-bold text-stone-900 mb-4 pb-2">Metode Pembayaran</h2>
            <div className="grid grid-cols-3 gap-3 mb-8">
              <button
                type="button"
                onClick={() => setPaymentType("qris" as any)}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  (paymentType as string) === "qris"
                  ? "border-[#51000d] bg-[#51000d]/10 text-[#51000d] font-bold" 
                  : "border-stone-200 bg-white text-stone-500 hover:border-stone-300"
                }`}
              >
                <span className="material-symbols-outlined text-2xl text-red-600">qr_code_2</span>
                <span className="text-xs font-bold text-center">QRIS Dinamis<br/><span className="text-[9px] font-semibold text-red-700 bg-red-100 px-1.5 py-0.5 rounded-full mt-0.5 inline-block">Bebas Biaya</span></span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentType("online")}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  paymentType === "online" 
                  ? "border-[#51000d] bg-[#51000d]/5 text-[#51000d]" 
                  : "border-stone-200 bg-white text-stone-500 hover:border-stone-300"
                }`}
              >
                <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                <span className="text-xs font-bold text-center">Bayar Online<br/><span className="text-[10px] font-medium opacity-80">(Midtrans)</span></span>
              </button>
              
              <button
                type="button"
                onClick={() => setPaymentType("cod")}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  paymentType === "cod" 
                  ? "border-emerald-600 bg-emerald-50 text-emerald-700" 
                  : "border-stone-200 bg-white text-stone-500 hover:border-stone-300"
                }`}
              >
                <span className="material-symbols-outlined text-2xl">local_shipping</span>
                <span className="text-xs font-bold text-center">Bayar di Tempat<br/><span className="text-[10px] font-medium opacity-80">(COD)</span></span>
              </button>
            </div>

            {(paymentType as string) === "qris" && (
              <div className="bg-red-50 p-4 rounded-2xl border border-red-200/60 mb-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-xs font-bold text-[#51000d]">QRIS Resmi GPN</span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">NMID: ID1026563066301</span>
                </div>
                <p className="text-xs text-stone-600 font-medium">
                  Scan QRIS dengan GoPay, OVO, DANA, ShopeePay, LinkAja, atau m-Banking Anda.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={handleCheckout}
              disabled={isProcessing}
              className={`w-full h-14 bg-[#51000d] hover:bg-[#7a0019] text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer mt-4 ${isProcessing ? "opacity-75 cursor-wait" : ""}`}
            >
              <span>{isProcessing ? "Memproses..." : (paymentType as string) === "qris" ? "Tampilkan QRIS Pembayaran" : "Selesaikan Pesanan"}</span>
              {!isProcessing && <span className="material-symbols-outlined text-lg">check_circle</span>}
            </button>
            <p className="text-center text-[10px] text-stone-400 mt-4">
              Dengan menyelesaikan pesanan, Anda menyetujui <a className="text-[#51000d] hover:underline font-semibold" href="#">Syarat &amp; Ketentuan</a> kami.
            </p>
          </div>
        </section>
      </main>

      {/* ==================== QRIS DYNAMIC PAYMENT MODAL ==================== */}
      {qrisModalData.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 animate-fadeIn">
          <div data-ui className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl border border-stone-200 text-center relative overflow-hidden">
            {/* Modal Header */}
            <button
              onClick={() => setQrisModalData(prev => ({ ...prev, show: false }))}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg w-8 h-8 flex items-center justify-center transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>

            <div className="flex items-center justify-center gap-2 mb-1 mt-2">
              <span className="font-headline text-base font-bold text-[#7a0019]">QRIS Pembayaran</span>
              <span className="bg-stone-100 text-stone-700 text-[10px] font-semibold px-2 py-0.5 rounded">GPN</span>
            </div>
            <p className="text-[11px] text-stone-500 font-medium mb-4">Bakso Pak Mul • NMID: ID1026563066301</p>

            {/* Total Nominal Badge */}
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 mb-4">
              <span className="text-[11px] text-stone-500 block font-medium">Total Nominal Pas (Otomatis)</span>
              <span className="font-headline text-2xl font-bold text-[#7a0019]">
                Rp {qrisModalData.amount.toLocaleString("id-ID")}
              </span>
              <span className="text-[10px] text-stone-400 block mt-0.5">Order ID: {qrisModalData.orderNumber}</span>
            </div>

            {/* QR Code Container */}
            <div className="bg-white p-3 rounded-xl border border-stone-200 inline-block relative mb-4">
              {qrisModalData.isPaid ? (
                <div className="w-64 h-64 flex flex-col items-center justify-center bg-emerald-50 rounded-lg text-emerald-700 space-y-2">
                  <span className="material-symbols-outlined text-6xl text-emerald-600">check_circle</span>
                  <span className="font-headline font-bold text-lg">Pembayaran Berhasil!</span>
                  <span className="text-xs text-emerald-600 font-medium">Mengalihkan halaman...</span>
                </div>
              ) : (
                <img
                  src={qrisModalData.qrCodeUrl}
                  alt="QRIS Dinamis Bakso Pak Mul"
                  className="w-64 h-64 object-contain rounded-lg mx-auto"
                />
              )}
            </div>

            {/* Status Indicator */}
            <div className="flex items-center justify-center gap-2 text-xs font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-[#7a0019]"></span>
              <span className="text-stone-700">Menunggu Pembayaran (Otomatis Terverifikasi)</span>
            </div>

            <p className="text-[11px] text-stone-500 leading-relaxed font-medium">
              Buka aplikasi e-Wallet / m-Banking Anda, pilih menu <strong className="text-[#7a0019]">Scan QRIS</strong>, lalu bayar sesuai nominal di atas.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
