"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

export default function PromoPage() {
  const { addToCart } = useCart();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(8 * 3600 + 45 * 60 + 30); // 08:45:30

  // Realtime countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return { h, m, s };
  };

  const timer = formatTimer(timeLeft);

  const handleAddBundle = (product: { id: string; name: string; price: number; image: string; unit: string }) => {
    addToCart(product);
    setAddedId(product.id);
    setToastMessage(product.name);
    setTimeout(() => setAddedId(null), 1500);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#1a1c1c] font-sans antialiased flex flex-col justify-between">
      {/* Top Navbar */}
      <Navbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#51000d] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 border border-red-800">
          <span className="material-symbols-outlined text-green-400">check_circle</span>
          <span className="text-xs font-bold">{toastMessage} ditambahkan ke keranjang!</span>
        </div>
      )}

      <main className="pt-20 flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-[550px] md:min-h-[600px] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-[#51000d]/90 to-[#51000d]/40 z-10"></div>
            <img
              alt="Ingredients Hero Background"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida/AP1WRLtX9iwyXZc_5EJ7W2XTVCiP-MfAs7vFxFbCrEN9uGmU3KNkxyoCvkMQT3GwKj-lh_7LIyCtQ0WKOm3zTgkq4ko0bHuvjpm8wFaIhTTmuwWgusOzxlPiy-2BejhiBF13nBgpNkXcui5K7IZQB_568I8oPpRptxcxLn0nEcbMb-TTdEUqeuCPj4fxWbEQoomn1h0D6MVIhrzbPfWYKWg0gll3eW3EJGlHvDwG2r3USK1-OqZEUrOQdcFZUDN-"
            />
          </div>

          <div className="relative z-20 px-6 max-w-7xl mx-auto w-full py-12">
            <div className="max-w-2xl text-white">
              <span className="inline-block px-4 py-1.5 rounded-full bg-red-600/90 text-white text-xs font-extrabold uppercase tracking-wider mb-4 shadow-md">
                Penawaran Eksklusif
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight tracking-tight">
                Promo Spesial Bakso Pak Mul
              </h1>
              <p className="text-base md:text-xl mb-8 text-white/90 leading-relaxed font-medium">
                Penawaran eksklusif untuk mitra reseller dan pelanggan setia kami. Tingkatkan keuntungan bisnis kuliner Anda dengan harga terbaik dari supplier terpercaya.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#paket-reseller"
                  className="px-8 py-4 bg-white text-[#51000d] rounded-xl font-bold text-xs md:text-sm shadow-lg hover:bg-gray-100 transition-all active:scale-95 uppercase tracking-wider"
                >
                  Lihat Katalog Promo
                </a>
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 border-2 border-white/30 text-white backdrop-blur-md rounded-xl font-bold text-xs md:text-sm hover:bg-white/10 transition-all active:scale-95 uppercase tracking-wider flex items-center gap-2"
                >
                  <i className="fa-brands fa-whatsapp text-lg text-green-400"></i>
                  <span>Hubungi Account Manager</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Paket Bundle Reseller */}
        <section id="paket-reseller" className="py-20 md:py-28 px-6 bg-[#f9f9f9]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-[#51000d] font-bold text-xs tracking-widest uppercase bg-red-100/60 px-3.5 py-1.5 rounded-full">
                  Diskon Pembelian Jumlah Besar
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#51000d] mt-3">Paket Bundle Reseller</h2>
                <p className="text-gray-600 text-sm md:text-base font-medium mt-1">
                  Solusi hemat untuk memulai atau mengembangkan bisnis kuliner Anda.
                </p>
              </div>
              <div className="hidden md:block">
                <span className="bg-red-50 text-[#51000d] border border-red-200 px-4 py-2 rounded-full text-xs font-extrabold">
                  ⏳ Berakhir dalam 12 Hari
                </span>
              </div>
            </div>

            {/* Bundle Bento Card */}
            <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-xl border border-gray-100 flex flex-col lg:flex-row gap-12 items-center hover:-translate-y-1 transition-transform duration-300">
              <div className="w-full lg:w-1/2 relative group">
                <div className="absolute -top-4 -left-4 z-10 bg-red-600 text-white px-5 py-2 rounded-full text-xs font-extrabold shadow-xl animate-bounce">
                  🔥 Paling Hemat
                </div>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
                  <img
                    alt="Starter Pack Reseller"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoX-arp4bMRYjeWZDsDPpodqYPQny1Hz8uG5WOQVHdbY0hccg8MFOdrRnVef0tfc4zyzbzhTj4ycc_qayrHxqZ1cq0RU86396zEbJwN0klJ6u7-T9dw7uZYnO7o2337fRPxrekKawV5hWdqX2lAbd6kRWiykc3Yn8ELQuRaZeZj9IDPEKEPqJtwIeWpvvZFEASGW0nEgr7pS24bg2yIUMSUeDZKcdh0QcsSMcqTX3b_MTWDa1dc_lwF3CQIV7F7Efp3aTqBbYiIpUr"
                  />
                </div>
              </div>

              <div className="w-full lg:w-1/2">
                <h3 className="text-3xl font-extrabold text-[#51000d] mb-6">Starter Pack Reseller</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-gray-700">
                    <span className="material-symbols-outlined text-[#7a0019] text-xl">inventory_2</span>
                    <span className="text-sm md:text-base font-semibold">Bakso Super (10kg)</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <span className="material-symbols-outlined text-[#7a0019] text-xl">liquor</span>
                    <span className="text-sm md:text-base font-semibold">Bumbu Rahasia (5L)</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <span className="material-symbols-outlined text-[#7a0019] text-xl">restaurant</span>
                    <span className="text-sm md:text-base font-semibold">Mie Kuning (5kg)</span>
                  </div>
                </div>

                <div className="mb-8 p-6 bg-[#f3f3f3] rounded-2xl border border-gray-200">
                  <p className="text-gray-400 text-xs font-bold line-through mb-1">Harga Normal: Rp 1.500.000</p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl md:text-4xl font-black text-[#51000d]">Rp 1.250.000</span>
                    <span className="text-red-600 font-extrabold text-lg bg-red-100 px-2.5 py-0.5 rounded-lg">-17%</span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    handleAddBundle({
                      id: "promo-bundle-starter",
                      name: "Starter Pack Reseller (10kg Bakso + Bumbu + Mie)",
                      price: 1250000,
                      image:
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuDoX-arp4bMRYjeWZDsDPpodqYPQny1Hz8uG5WOQVHdbY0hccg8MFOdrRnVef0tfc4zyzbzhTj4ycc_qayrHxqZ1cq0RU86396zEbJwN0klJ6u7-T9dw7uZYnO7o2337fRPxrekKawV5hWdqX2lAbd6kRWiykc3Yn8ELQuRaZeZj9IDPEKEPqJtwIeWpvvZFEASGW0nEgr7pS24bg2yIUMSUeDZKcdh0QcsSMcqTX3b_MTWDa1dc_lwF3CQIV7F7Efp3aTqBbYiIpUr",
                      unit: "Paket Bundle",
                    })
                  }
                  className={`w-full py-4 rounded-2xl font-bold text-xs md:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider ${
                    addedId === "promo-bundle-starter"
                      ? "bg-green-600 text-white"
                      : "bg-[#51000d] hover:bg-[#7a0019] text-white"
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">
                    {addedId === "promo-bundle-starter" ? "check" : "shopping_basket"}
                  </span>
                  <span>
                    {addedId === "promo-bundle-starter" ? "Berhasil Ditambahkan!" : "Ambil Promo Reseller"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Flash Sale Limited Time */}
        <section className="py-20 md:py-28 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-red-600 text-3xl">bolt</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-[#51000d] uppercase tracking-tight">
                    Flash Sale Limited Time
                  </h2>
                </div>
                <p className="text-gray-600 text-sm md:text-base font-medium">
                  Stok terbatas, siapa cepat dia dapat. Harga khusus hari ini!
                </p>
              </div>

              {/* Realtime Countdown Timer */}
              <div className="flex items-center gap-4 bg-[#f3f3f3] p-3 rounded-2xl border border-gray-200">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Berakhir dalam:</span>
                <div className="flex gap-2">
                  <div className="w-12 h-12 bg-[#51000d] text-white rounded-xl flex flex-col items-center justify-center shadow-md">
                    <span className="font-extrabold text-sm">{timer.h}</span>
                    <span className="text-[9px] uppercase font-semibold">Jam</span>
                  </div>
                  <div className="w-12 h-12 bg-[#51000d] text-white rounded-xl flex flex-col items-center justify-center shadow-md">
                    <span className="font-extrabold text-sm">{timer.m}</span>
                    <span className="text-[9px] uppercase font-semibold">Min</span>
                  </div>
                  <div className="w-12 h-12 bg-[#51000d] text-white rounded-xl flex flex-col items-center justify-center shadow-md">
                    <span className="font-extrabold text-sm">{timer.s}</span>
                    <span className="text-[9px] uppercase font-semibold">Det</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Flash Sale Product Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Product 1 */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 flex flex-col hover:-translate-y-2 transition-transform duration-300">
                <div className="h-64 relative group overflow-hidden">
                  <div className="absolute top-4 right-4 z-10 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-extrabold shadow-md">
                    -25%
                  </div>
                  <img
                    alt="Bakso Urat Premium"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUR9JA1gd8ajCL_fHNvSed-zqiSNDRsOrhoz5taMJSP1ngynzlz3ovvx9hAN0A_cSMNduuNL56UoKuAgnsaChFnbS9awO69K8-PzihGIQt9MqCJ3D3t78Qg6NP5xn58aS6nun6nYs8y0zer4Y-voWIETzrqz3M8G0RV5mDLbI8I87pLhmX-AMZydMAAFh-T-PDGm4cB5b88KAG1vn8XAyTRHFZqlMeGeYJYcLhYZzPIO7pFDaAeXcEI9BOGezXRXuLUJjwj3gRjggK"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-[#51000d] mb-1">Bakso Urat Premium (1kg)</h3>
                  <p className="text-gray-500 text-xs mb-4 flex-grow">Bakso dengan tekstur urat sapi asli yang gurih dan kenyal.</p>
                  
                  <div className="mb-4">
                    <span className="text-gray-400 text-xs line-through block font-medium">Rp 95.000</span>
                    <span className="text-2xl font-black text-[#51000d]">Rp 71.250</span>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1 font-bold">
                      <span className="text-red-600">Terjual 82%</span>
                      <span className="text-gray-400">Sisa 12 Pack</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="w-[82%] h-full bg-red-600 rounded-full"></div>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleAddBundle({
                        id: "promo-urat-1kg",
                        name: "Bakso Urat Premium (1kg)",
                        price: 71250,
                        image:
                          "https://lh3.googleusercontent.com/aida-public/AB6AXuAUR9JA1gd8ajCL_fHNvSed-zqiSNDRsOrhoz5taMJSP1ngynzlz3ovvx9hAN0A_cSMNduuNL56UoKuAgnsaChFnbS9awO69K8-PzihGIQt9MqCJ3D3t78Qg6NP5xn58aS6nun6nYs8y0zer4Y-voWIETzrqz3M8G0RV5mDLbI8I87pLhmX-AMZydMAAFh-T-PDGm4cB5b88KAG1vn8XAyTRHFZqlMeGeYJYcLhYZzPIO7pFDaAeXcEI9BOGezXRXuLUJjwj3gRjggK",
                        unit: "1 Pack (1kg)",
                      })
                    }
                    className={`w-full py-3 rounded-xl font-bold text-xs border-2 transition-all cursor-pointer uppercase tracking-wider ${
                      addedId === "promo-urat-1kg"
                        ? "bg-green-600 border-green-600 text-white"
                        : "border-[#51000d] text-[#51000d] hover:bg-[#51000d] hover:text-white"
                    }`}
                  >
                    {addedId === "promo-urat-1kg" ? "✓ Berhasil!" : "Ambil Promo"}
                  </button>
                </div>
              </div>

              {/* Product 2 */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 flex flex-col hover:-translate-y-2 transition-transform duration-300">
                <div className="h-64 relative group overflow-hidden">
                  <div className="absolute top-4 right-4 z-10 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-extrabold shadow-md">
                    -15%
                  </div>
                  <img
                    alt="Pangsit Goreng"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDqRZte42PArt1MKvkT1G0lbJeTyZeJhqC0v_DdmWeYGOsNKa-vlS1apjV6fJq7MzL0Dn7NoIWYtGQa3sx6dgfqaGGMd0xs0qadzhoKuOQ6QFh80dZcaymkRPhRN9Oa9u5V-A37s5Y9F28T3cdYV9V-Rz5c3VJiHYBRL5f42I1CV-Wuk1lKcJK9HxhKHGAKIhIDugSwL1WOTk0mpzal4FE7dPDklsH4RLAU99ectwXJDz_mEWG9l9UoMy3ojayu-TD6M1a_43N8k0d"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-[#51000d] mb-1">Pangsit Goreng (1 Pack)</h3>
                  <p className="text-gray-500 text-xs mb-4 flex-grow">Pangsit renyah isi ayam dan bumbu rahasia Pak Mul.</p>
                  
                  <div className="mb-4">
                    <span className="text-gray-400 text-xs line-through block font-medium">Rp 45.000</span>
                    <span className="text-2xl font-black text-[#51000d]">Rp 38.250</span>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1 font-bold">
                      <span className="text-red-600">Terjual 45%</span>
                      <span className="text-gray-400">Sisa 40 Pack</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="w-[45%] h-full bg-red-600 rounded-full"></div>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleAddBundle({
                        id: "promo-pangsit-1pack",
                        name: "Pangsit Goreng (1 Pack)",
                        price: 38250,
                        image:
                          "https://lh3.googleusercontent.com/aida-public/AB6AXuBDqRZte42PArt1MKvkT1G0lbJeTyZeJhqC0v_DdmWeYGOsNKa-vlS1apjV6fJq7MzL0Dn7NoIWYtGQa3sx6dgfqaGGMd0xs0qadzhoKuOQ6QFh80dZcaymkRPhRN9Oa9u5V-A37s5Y9F28T3cdYV9V-Rz5c3VJiHYBRL5f42I1CV-Wuk1lKcJK9HxhKHGAKIhIDugSwL1WOTk0mpzal4FE7dPDklsH4RLAU99ectwXJDz_mEWG9l9UoMy3ojayu-TD6M1a_43N8k0d",
                        unit: "1 Pack",
                      })
                    }
                    className={`w-full py-3 rounded-xl font-bold text-xs border-2 transition-all cursor-pointer uppercase tracking-wider ${
                      addedId === "promo-pangsit-1pack"
                        ? "bg-green-600 border-green-600 text-white"
                        : "border-[#51000d] text-[#51000d] hover:bg-[#51000d] hover:text-white"
                    }`}
                  >
                    {addedId === "promo-pangsit-1pack" ? "✓ Berhasil!" : "Ambil Promo"}
                  </button>
                </div>
              </div>

              {/* Product 3 */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 flex flex-col hover:-translate-y-2 transition-transform duration-300">
                <div className="h-64 relative group overflow-hidden">
                  <div className="absolute top-4 right-4 z-10 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-extrabold shadow-md">
                    -20%
                  </div>
                  <img
                    alt="Saos Sambal Premium"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6iAd0IleYbg85qQHqe4CRhOgKEAOA0M6KR_n1mJ8Mk-3kCw-CPaOcMYxvvg-7HxIFWAQH4wxpgbQoAd0eFQBMJ0X7EqKsgc3JUtJnS2g1WZRX5P0gliN-HBPzAj6iIioZ8149MkY8kIFoFl7PqBTFxLC1hirTz_wvQVoqbUYnY3rgunXg9qHMkiHFQf4vZrOoZs8XZ3kNF4uXhajgV9yK611SfcSjlDZooKbAf63VqkA0TqU3sAEdhZnvXJerx-mFhaM-Z7fD4NN7"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-[#51000d] mb-1">Saos Sambal Premium</h3>
                  <p className="text-gray-500 text-xs mb-4 flex-grow">Saus sambal pedas nikmat, pelengkap wajib hidangan bakso.</p>
                  
                  <div className="mb-4">
                    <span className="text-gray-400 text-xs line-through block font-medium">Rp 25.000</span>
                    <span className="text-2xl font-black text-[#51000d]">Rp 20.000</span>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1 font-bold">
                      <span className="text-red-600">Terjual 95%</span>
                      <span className="text-gray-400">Sisa 5 Botol</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="w-[95%] h-full bg-red-600 rounded-full"></div>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleAddBundle({
                        id: "promo-saos-botol",
                        name: "Saos Sambal Premium Pak Mul",
                        price: 20000,
                        image:
                          "https://lh3.googleusercontent.com/aida-public/AB6AXuC6iAd0IleYbg85qQHqe4CRhOgKEAOA0M6KR_n1mJ8Mk-3kCw-CPaOcMYxvvg-7HxIFWAQH4wxpgbQoAd0eFQBMJ0X7EqKsgc3JUtJnS2g1WZRX5P0gliN-HBPzAj6iIioZ8149MkY8kIFoFl7PqBTFxLC1hirTz_wvQVoqbUYnY3rgunXg9qHMkiHFQf4vZrOoZs8XZ3kNF4uXhajgV9yK611SfcSjlDZooKbAf63VqkA0TqU3sAEdhZnvXJerx-mFhaM-Z7fD4NN7",
                        unit: "1 Botol",
                      })
                    }
                    className={`w-full py-3 rounded-xl font-bold text-xs border-2 transition-all cursor-pointer uppercase tracking-wider ${
                      addedId === "promo-saos-botol"
                        ? "bg-green-600 border-green-600 text-white"
                        : "border-[#51000d] text-[#51000d] hover:bg-[#51000d] hover:text-white"
                    }`}
                  >
                    {addedId === "promo-saos-botol" ? "✓ Berhasil!" : "Ambil Promo"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Program Loyalitas */}
        <section className="py-20 md:py-28 px-6 bg-[#51000d] text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                  Program Loyalitas <br />Mitra Bakso Pak Mul
                </h2>
                <p className="text-white/80 text-sm md:text-base mb-8 leading-relaxed font-medium">
                  Kami menghargai setiap langkah perjalanan bisnis Anda. Bergabunglah dengan program loyalitas kami dan nikmati berbagai keuntungan eksklusif untuk setiap transaksi.
                </p>

                <div className="space-y-4">
                  <div className="flex gap-4 items-start p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <div className="p-3 rounded-full bg-red-600 text-white shrink-0">
                      <span className="material-symbols-outlined text-xl">stars</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-base mb-0.5">Kumpulkan Poin</h4>
                      <p className="text-white/60 text-xs">Dapatkan 1 poin untuk setiap transaksi Rp 10.000. Poin tidak pernah hangus.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <div className="p-3 rounded-full bg-red-600 text-white shrink-0">
                      <span className="material-symbols-outlined text-xl">local_shipping</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-base mb-0.5">Diskon Pengiriman</h4>
                      <p className="text-white/60 text-xs">Tukarkan poin untuk potongan biaya kirim hingga 100% untuk area Jabodetabek.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <div className="p-3 rounded-full bg-red-600 text-white shrink-0">
                      <span className="material-symbols-outlined text-xl">apparel</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-base mb-0.5">Merchandise Gratis</h4>
                      <p className="text-white/60 text-xs">Dapatkan Apron, Seragam, atau Banner promosi eksklusif Bakso Pak Mul.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loyalty Card */}
              <div className="relative">
                <div className="bg-white rounded-[32px] p-8 md:p-10 text-gray-900 shadow-2xl">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full border-4 border-[#51000d] p-1.5 mb-4 shadow-sm">
                      <img
                        alt="Brand Identity"
                        className="w-full h-full rounded-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXTmhL2w6_W8ZADyXKtfLuz92Csu6aExtN1WGj-cX25J-iB2Y_lWSV5tZc2wy3cJGEqL9ESadN-QfHNWr5hHjeS7zXYVURkjDdS9gf5WXPUlLQsfT34aCeTkAQsd6wPauSRp1fJFOtDy3Vp6DDOzmbWHeJML731dY9qWOf1j3XTV8RNYA4XGzah44y_q6khcXQPvTQYUdEBUOmTdORXIZzW0ej0rmwyNi7vGpKzsYhkvk9F-0iqwU9Yom9kEF2vkRqDJlnrtuxijIY"
                      />
                    </div>
                    <h3 className="text-[#51000d] font-extrabold text-2xl mb-1">Check Your Rewards</h3>
                    <p className="text-gray-500 text-xs mb-8 font-medium">Login untuk melihat status poin dan penawaran khusus Anda.</p>
                    
                    <div className="w-full space-y-3">
                      <Link
                        href="/login"
                        className="w-full py-4 bg-[#51000d] hover:bg-[#7a0019] text-white rounded-xl font-bold text-xs uppercase tracking-wider block transition-all shadow-md"
                      >
                        Login Member
                      </Link>
                      <Link
                        href="/register"
                        className="w-full py-4 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-bold text-xs uppercase tracking-wider block transition-all"
                      >
                        Daftar Kemitraan
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}
