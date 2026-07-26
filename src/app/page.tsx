"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/CartSidebar";
import { useCart } from "@/context/CartContext";

export default function HomePage() {
  const [addedId, setAddedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { openCart, totalItems, addToCart } = useCart();

  return (
    <div className="antialiased selection:bg-maroon selection:text-white font-sans tracking-tight bg-background text-gray-800">
      <Navbar />
      {/* END: Navigation */}

      <main>
        {/* BEGIN: Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden hero-gradient">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
              {/* Hero Content */}
              <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                <span className="inline-block py-1.5 px-4 rounded-full bg-red-100 text-maroon font-semibold text-sm mb-6 shadow-sm border border-red-200">
                  <i className="fas fa-truck-fast mr-2"></i> Pengiriman Instan Tersedia
                </span>
                <span className="inline-block py-1.5 px-4 rounded-full bg-red-50 text-maroon font-semibold text-sm mb-6 ml-2 shadow-sm border border-red-200">
                  <i className="fas fa-certificate mr-2"></i> Stok Selalu Fresh
                </span>
                <h1 className="text-3xl tracking-tight text-gray-900 sm:text-4xl md:text-5xl lg:leading-tight mb-6 font-bold">
                  Pusat Bahan Baku <span className="text-maroon">Bakso & Mie Ayam</span>
                </h1>
                <p className="mt-6 text-lg md:text-xl text-gray-600 font-medium leading-relaxed max-w-xl">
                  Ciptakan kelezatan bakso dan mie ayam seenak langganan Anda langsung dari dapur sendiri. Sedia baso sapi asli, mie keriting kenyal, hingga saus dan kecap pilihan.
                </p>

                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link
                    className="w-full flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-medium rounded-full text-white bg-maroon hover:bg-maroon-dark md:py-4 md:text-lg md:px-10 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    href="#"
                  >
                    Belanja Sekarang
                  </Link>
                  <Link
                    className="w-full flex items-center justify-center px-8 py-3.5 border-2 border-maroon text-base font-medium rounded-full text-maroon bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-all duration-300 transform hover:-translate-y-1"
                    href="#"
                  >
                    Kemitraan Grosir
                  </Link>
                </div>
              </div>
              {/* Hero Image/Graphic */}
              <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                <div className="relative mx-auto w-full rounded-2xl shadow-2xl lg:max-w-md floating glass-effect p-4 border border-white">
                  <img
                    alt="Aneka produk makanan keluarga"
                    className="w-full rounded-xl object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgHtlT2ULBYo3fZ9PXCbwUtARujT9tMQ0miaiY4Nxxkw_uHrnGJ4-o9An0miPRjR91KDdrWBLtDsW-XTBN_-3NLevmycDj8OZluWBS05Tfx35Z0UXiPLxOh-7UUBKA8C1ExAZ9aYIR1FDKM5iqRtgsgCqPUzmSxc7cSSD2G6kvc5QoAdJrlaITVTQNnlNuuBWSLCys9fFt-pCho13Ezyv_AIxNoqpj3OCLNOHguhSJdiGdmE9F9G6HwaebxabIcxbHs2rxe_nHjQ7z"
                  />
                  {/* Floating Badge */}
                  <div className="absolute -right-6 -bottom-6 glass-effect p-4 rounded-xl shadow-xl flex items-center space-x-3 border border-white">
                    <div className="bg-green-100 p-2 rounded-full">
                      <i className="fas fa-check text-green-600 text-xl"></i>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Stok Selalu</p>
                      <p className="text-sm font-bold text-gray-800">Fresh & Halal</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* END: Hero Section */}

        {/* BEGIN: Benefits Section */}
        <section className="bg-white border-t border-gray-100 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
              <div className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors duration-300 cursor-pointer">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-red-50 text-maroon mb-4">
                  <i className="fas fa-wallet text-2xl"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Harga Fleksibel</h3>
                <p className="text-sm text-gray-500">Ramah di kantong, untung buat jualan.</p>
              </div>
              <div className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors duration-300 cursor-pointer">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-red-50 text-maroon mb-4">
                  <i className="fas fa-star text-2xl"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Kualitas Konsisten</h3>
                <p className="text-sm text-gray-500">Pelanggan ruko/gerobak pasti suka.</p>
              </div>
              <div className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors duration-300 cursor-pointer">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-red-50 text-maroon mb-4">
                  <i className="fas fa-motorcycle text-2xl"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Pengiriman Instan</h3>
                <p className="text-sm text-gray-500">Cepat sampai untuk menjaga kesegaran bahan.</p>
              </div>
              <div className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors duration-300 cursor-pointer">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-red-50 text-maroon mb-4">
                  <i className="fas fa-certificate text-2xl"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">100% Halal Terjamin</h3>
                <p className="text-sm text-gray-500">Bersertifikasi Halal & BPOM.</p>
              </div>
            </div>
          </div>
        </section>
        {/* END: Benefits Section */}

        {/* BEGIN: Top Products */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Pilihan Favorit Keluarga</h2>
                <p className="mt-2 text-lg text-gray-500">Produk terlaris yang wajib ada di kulkas Anda.</p>
              </div>
              <Link className="hidden sm:inline-flex items-center text-maroon font-semibold hover:text-maroon-dark group" href="#">
                Lihat Semua Produk
                <i className="fas fa-arrow-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Product 1 */}
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
                <div className="relative h-56 bg-gray-200 overflow-hidden group">
                  <img
                    alt="Varian Bakso Sapi & Ayam"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBm3rDU80r8QUhhXQoEwxeWG4k64A8EkNRWXZ8mTxFndtz1f8qZQXkZzv3dqkpOsWh5-QBwX4S5diVK6YFoOyds4jV8Tz24Y1-Jyu1KEJk3b8VB7v9SZhNF1pncvRrX6OblcflLEre5Hyaqt9K0K1NBOat6raiSFzVZJJoHLTDg_6ngazmUtrwcijBxMjwZ25nhJafsuUjqND_Tulw5n_LXMqIaFvhBkq6RYKwCWZtrFNLcp-Z1bRhBD7raazNKzcQ-g4pec3Me6V2t"
                  />
                  <span className="absolute top-4 left-4 bg-maroon text-white text-xs font-bold px-3 py-1 rounded-full">Terlaris</span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Varian Bakso Sapi & Ayam</h3>
                  <p className="text-sm text-gray-500 mb-4 flex-1">
                    <span className="text-maroon font-medium">Kenyal dan gurih.</span> Cocok untuk sajian keluarga atau menu andalan jualan Anda. Tersedia kemasan pack & bal-balan.
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-400 line-through">Rp 45.000</p>
                      <p className="text-lg font-bold text-maroon">Rp 40.000</p>
                    </div>
                    <button 
                      onClick={() => {
                        addToCart({ id: "prod_1", name: "Varian Bakso Sapi & Ayam", price: 40000, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBm3rDU80r8QUhhXQoEwxeWG4k64A8EkNRWXZ8mTxFndtz1f8qZQXkZzv3dqkpOsWh5-QBwX4S5diVK6YFoOyds4jV8Tz24Y1-Jyu1KEJk3b8VB7v9SZhNF1pncvRrX6OblcflLEre5Hyaqt9K0K1NBOat6raiSFzVZJJoHLTDg_6ngazmUtrwcijBxMjwZ25nhJafsuUjqND_Tulw5n_LXMqIaFvhBkq6RYKwCWZtrFNLcp-Z1bRhBD7raazNKzcQ-g4pec3Me6V2t", unit: "Pack 500g" });
                        setAddedId("prod_1");
                        setToastMessage("Varian Bakso Sapi & Ayam");
                        setTimeout(() => setAddedId(null), 1500);
                        setTimeout(() => setToastMessage(null), 3000);
                      }}
                      className={`h-10 px-4 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer font-bold text-xs ${addedId === "prod_1" ? "bg-green-600 text-white" : "bg-gray-100 hover:bg-maroon hover:text-white text-gray-700"}`}
                    >
                      {addedId === "prod_1" ? "✓ Berhasil" : <i className="fas fa-cart-plus"></i>}
                    </button>
                  </div>
                </div>
              </div>
              {/* Product 2 */}
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
                <div className="relative h-56 bg-gray-200 overflow-hidden group">
                  <img
                    alt="Paket Mie Keriting & Pangsit"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8JmWpP0un4kZ9wKhL7GgYeM4kBNOJjN73kuBCmgF-3uIw93-wdfnAKq_ktpHQGOIW88awo_tG_k09Mzfhm9MsVjXB3eNC36vwYcmsWtZYLIh1oXCkn7v4JPiIMjul3Gb11rcbFaRZp6Ce-lFyK55NIpGW4ZBH4jfFrYoP3_1VfXnLAQ-w_0R4y2yHmDjzPn3rbnD0CqU0JbfEXV-J6N2Tqv12mnNTSsT6WBISN1a5pTofYigeWhrbC4wz4jpnkPt78EmrhWvMK5ol"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Paket Mie Keriting & Pangsit</h3>
                  <p className="text-sm text-gray-500 mb-4 flex-1">
                    Tekstur <span className="text-maroon font-medium">anti-lembek</span> sekelas mie ayam abang-abang. Beli grosir harga lebih hemat untuk pedagang!
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-lg font-bold text-maroon">Mulai Rp 15.000</p>
                    </div>
                    <button 
                      onClick={() => addToCart({ id: "prod_2", name: "Paket Mie Keriting & Pangsit", price: 15000, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8JmWpP0un4kZ9wKhL7GgYeM4kBNOJjN73kuBCmgF-3uIw93-wdfnAKq_ktpHQGOIW88awo_tG_k09Mzfhm9MsVjXB3eNC36vwYcmsWtZYLIh1oXCkn7v4JPiIMjul3Gb11rcbFaRZp6Ce-lFyK55NIpGW4ZBH4jfFrYoP3_1VfXnLAQ-w_0R4y2yHmDjzPn3rbnD0CqU0JbfEXV-J6N2Tqv12mnNTSsT6WBISN1a5pTofYigeWhrbC4wz4jpnkPt78EmrhWvMK5ol", unit: "Paket 1kg" })}
                      className="bg-gray-100 hover:bg-maroon hover:text-white text-gray-700 h-10 w-10 rounded-full flex items-center justify-center transition-colors duration-300 cursor-pointer"
                    >
                      <i className="fas fa-cart-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
              {/* Product 3 */}
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
                <div className="relative h-56 bg-gray-200 overflow-hidden group">
                  <img
                    alt="Bumbu, Saos & Sumpit"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAglc3Pva71YAXZu6nnoJBLvmf7DIdBSmEL3CoQ83dhYJFWtJzioNpetHDwYyiHX27fmG_dEsSprKc-5bUiba2oLD1s1HiUqpc2m_XC8mfYpRp6jIl-hRfSoG9xq7h7xE_GdhZqZelRTqgGFCARWMUDT2vrKvEkkJehd9aREC5BQ1bYFd7aZLWwr5vXC4LLZgAy9vDJiPuom5XAggItelisXD1me229yLbDb2YfOgkXDlXn3trQmSsLG3_yfZv7cq2xdwRU-d0W7IcG"
                  />
                  <span className="absolute top-4 left-4 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">Grosir Hemat</span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Bumbu, Saos & Sumpit</h3>
                  <p className="text-sm text-gray-500 mb-4 flex-1">
                    Kebutuhan <span className="text-maroon font-medium">komplit</span> dari kecap, saos, lada, sampai sumpit bambu. Sekali order, siap masak atau jualan.
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-400 line-through">Rp 40.000</p>
                      <p className="text-lg font-bold text-maroon">Rp 34.000</p>
                    </div>
                    <button 
                      onClick={() => addToCart({ id: "prod_3", name: "Bumbu, Saos & Sumpit", price: 34000, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAglc3Pva71YAXZu6nnoJBLvmf7DIdBSmEL3CoQ83dhYJFWtJzioNpetHDwYyiHX27fmG_dEsSprKc-5bUiba2oLD1s1HiUqpc2m_XC8mfYpRp6jIl-hRfSoG9xq7h7xE_GdhZqZelRTqgGFCARWMUDT2vrKvEkkJehd9aREC5BQ1bYFd7aZLWwr5vXC4LLZgAy9vDJiPuom5XAggItelisXD1me229yLbDb2YfOgkXDlXn3trQmSsLG3_yfZv7cq2xdwRU-d0W7IcG", unit: "Paket Hemat" })}
                      className="bg-gray-100 hover:bg-maroon hover:text-white text-gray-700 h-10 w-10 rounded-full flex items-center justify-center transition-colors duration-300 cursor-pointer"
                    >
                      <i className="fas fa-cart-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link className="inline-flex items-center text-maroon font-semibold" href="#">
                Lihat Semua Produk <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            </div>
          </div>
        </section>
        {/* END: Top Products */}

        {/* BEGIN: Shopping Flow */}
        <section className="py-20 bg-maroon text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Cara Belanja Mudah</h2>
              <p className="mt-4 text-lg text-red-200">Pesanan sampai di tempat Anda dalam 4 langkah praktis.</p>
            </div>
            <div className="relative">
              <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-red-800/50"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-center relative">
                <div className="relative">
                  <div className="w-24 h-24 mx-auto glass-dark rounded-full flex items-center justify-center mb-6 shadow-lg relative z-10 border-2 border-red-400/30">
                    <span className="absolute -top-2 -right-2 w-8 h-8 bg-white text-maroon rounded-full flex items-center justify-center font-bold text-sm shadow-md">1</span>
                    <i className="fas fa-hand-pointer text-3xl text-white"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Pilih Bahan</h3>
                  <p className="text-red-200 text-sm">Pilih baso, mie, atau bumbu pilihan Anda.</p>
                </div>
                <div className="relative">
                  <div className="w-24 h-24 mx-auto glass-dark rounded-full flex items-center justify-center mb-6 shadow-lg relative z-10 border-2 border-red-400/30">
                    <span className="absolute -top-2 -right-2 w-8 h-8 bg-white text-maroon rounded-full flex items-center justify-center font-bold text-sm shadow-md">2</span>
                    <i className="fas fa-shopping-basket text-3xl text-white"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Masukkan Keranjang</h3>
                  <p className="text-red-200 text-sm">Sesuaikan jumlah dan cek kembali pesanan Anda.</p>
                </div>
                <div className="relative">
                  <div className="w-24 h-24 mx-auto glass-dark rounded-full flex items-center justify-center mb-6 shadow-lg relative z-10 border-2 border-red-400/30">
                    <span className="absolute -top-2 -right-2 w-8 h-8 bg-white text-maroon rounded-full flex items-center justify-center font-bold text-sm shadow-md">3</span>
                    <i className="fas fa-credit-card text-3xl text-white"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Bayar Praktis</h3>
                  <p className="text-red-200 text-sm">Metode pembayaran yang aman dan praktis.</p>
                </div>
                <div className="relative">
                  <div className="w-24 h-24 mx-auto glass-dark rounded-full flex items-center justify-center mb-6 shadow-lg relative z-10 border-2 border-red-400/30">
                    <span className="absolute -top-2 -right-2 w-8 h-8 bg-white text-maroon rounded-full flex items-center justify-center font-bold text-sm shadow-md">4</span>
                    <i className="fas fa-truck-fast text-3xl text-white"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Langsung Masak / Jualan</h3>
                  <p className="text-red-200 text-sm">Pesanan dikirim instan hari ini juga.</p>
                </div>
              </div>
            </div>
            <div className="mt-16 text-center">
              <button className="bg-white text-maroon font-bold py-4 px-10 rounded-full hover:bg-gray-100 transition-colors shadow-lg transform hover:-translate-y-1">
                Mulai Belanja Sekarang
              </button>
            </div>
          </div>
        </section>
        {/* END: Shopping Flow */}

        {/* BEGIN: Testimonials */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Kata Mereka</h2>
              <p className="mt-4 text-lg text-gray-500">Pengalaman pelanggan setia kami bersama Bakso Pak Mul.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative">
                <i className="fas fa-quote-right text-4xl text-gray-100 absolute top-6 right-6"></i>
                <div className="flex items-center space-x-1 text-yellow-400 mb-4">
                  <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                </div>
                <p className="text-gray-600 mb-6 italic">&quot;Senang karena bisa masak mie ayam pangsit komplit untuk anak-anak di rumah dengan mudah.&quot;</p>
                <div className="flex items-center">
                  <img alt="Ibu Siti" className="w-12 h-12 rounded-full mr-4 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnr1wjKDi05Fu5VfiTIpu21zWvZ_9SdkyiFJhGIWGhDoisTM4d4him2AbqNKPCSmu13x6enSNKscIIRW-iCLseKH67O8455rgrxsbw6vonLLYh7G0aYcHoeLg2x2p_MvQtnPkrOudni74vr1ktXahJ-DEZ2TLYyefkFDoDrlIO_yHzVEw7bVdCvVj-nGoavF7dBTS7gNkREVOwDfh7ES2aeYcw34SwfMqsSfjBx4VPecU_Go0Jb0W1MBQeXOEBAjDtY5aQm8G39-gf" />
                  <div>
                    <h4 className="font-bold text-gray-900">Ibu Siti M.</h4>
                    <p className="text-sm text-gray-500"><span className="text-maroon font-medium">Kenyal dan gurih.</span></p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative">
                <i className="fas fa-quote-right text-4xl text-gray-100 absolute top-6 right-6"></i>
                <div className="flex items-center space-x-1 text-yellow-400 mb-4">
                  <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                </div>
                <p className="text-gray-600 mb-6 italic">&quot;Terbantu karena harga grosirnya murah, untung nambah, dan mie-nya tidak gampang hancur.&quot;</p>
                <div className="flex items-center">
                  <img alt="Pak Bambang" className="w-12 h-12 rounded-full mr-4 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0-_ZjuCY_Vz0STeHI6yUvr7NPTiPcaeUS7hIUC4V7dex0tB09sqZJB1r4SrEomfWHD-xCThfFhye-sMoQ_eYLqMCx2IojSujs3ATV2uNwWhfoVhgsTAq6HI3PDlhXxgzgXWmm6j0EwnvKEf4VrVPEu9b4JpuFsyqZlhh8PaU-V_Ncx1pfEsWc6Kpa4Hc_sslBG4uUpizWspbHwqxVMmZ9milE8_DX2PgdfXAGlnkFeJBHhvvF6nFfnZdI8-fTCK575WBntz0lFD63" />
                  <div>
                    <h4 className="font-bold text-gray-900">Pak Bambang</h4>
                    <p className="text-sm text-gray-500">Tekstur <span className="text-maroon font-medium">anti-lembek</span>.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative">
                <i className="fas fa-quote-right text-4xl text-gray-100 absolute top-6 right-6"></i>
                <div className="flex items-center space-x-1 text-yellow-400 mb-4">
                  <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star-half-alt"></i>
                </div>
                <p className="text-gray-600 mb-6 italic">&quot;Pengiriman selalu tepat waktu, bakso sampai dalam keadaan beku sempurna. Kualitas premium sungguhan.&quot;</p>
                <div className="flex items-center">
                  <img alt="Koh Ahong" className="w-12 h-12 rounded-full mr-4 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYOW2xE-wNgoDejc-QUCOitIdi6LyoASlA8JmPDIFfsWhGBU8fF0B22Wg-t934EwbhldQ3SZAI76IUKrPjxYrPZ1i16pkCtcHVFDADMgP0-0twPWWnFh8cAopzNeoJQZiszV9IjhNY6XQEslVgDAz3AwTDnlhfZEOMHBNCk_hpvatxbo3n2UXGZj1gXU4nNEnl1_ycH7YJIJR3A3XCFGbbs4bIaZbEaZGJDXnsq9dtNuHa_orYA1th1-xKw-Jhvm6hyEGtyf_fv5f5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Koh Ahong</h4>
                    <p className="text-sm text-gray-500">Kebutuhan <span className="text-maroon font-medium">komplit</span>.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* END: Testimonials */}

        {/* BEGIN: Features */}
        <section className="py-20 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Keunggulan Produk Kami</h2>
              <p className="mt-4 text-lg text-gray-500">Mengapa ribuan keluarga dan pedagang memilih Bakso Pak Mul.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
              <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center text-maroon mb-6">
                  <i className="fas fa-leaf text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Bahan Pilihan</h3>
                <p className="text-gray-600 leading-relaxed">Menggunakan daging sapi segar pilihan dan bumbu rempah alami berkualitas tinggi untuk rasa yang otentik.</p>
              </div>
              <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center text-maroon mb-6">
                  <i className="fas fa-shield-virus text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Proses Higienis</h3>
                <p className="text-gray-600 leading-relaxed">Diproduksi dengan standar kebersihan ketat dan pengawasan kualitas berkala untuk menjamin keamanan pangan.</p>
              </div>
              <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center text-maroon mb-6">
                  <i className="fas fa-ban text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Tanpa Pengawet</h3>
                <p className="text-gray-600 leading-relaxed">Produk kami bebas dari bahan pengawet berbahaya, menjadikannya pilihan sehat untuk konsumsi keluarga setiap hari.</p>
              </div>
              <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center text-maroon mb-6">
                  <span className="material-symbols-outlined text-2xl">sync</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Garansi Kualitas & Tukar</h3>
                <p className="text-gray-600 leading-relaxed">Produk tidak segar atau kualitas buruk? Kami menjamin penukaran produk baru untuk kepuasan Anda.</p>
              </div>
            </div>
          </div>
        </section>

        {/* BEGIN: About */}
        <section className="py-20 bg-gray-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
              <div className="relative mb-12 lg:mb-0">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=1000" alt="Proses Produksi Bakso Pak Mul" className="w-full h-[400px] object-cover" />
                  <div className="absolute inset-0 bg-maroon/10"></div>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl border border-gray-100 hidden md:block">
                  <p className="text-maroon font-bold text-4xl">10+</p>
                  <p className="text-gray-500 text-sm">Kota di Indonesia</p>
                </div>
              </div>
              <div>
                <span className="text-maroon font-bold tracking-wider uppercase text-sm">Tentang Kami</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-4 mb-6">Jakarta Timur, Pasar Kramat Jati</h2>
                <p className="text-gray-600 mb-8 leading-relaxed">Kunjungi gerai utama kami di Pasar Kramat Jati untuk mendapatkan produk bakso dan mie ayam segar setiap hari. Kami hadir lebih dekat untuk melayani kebutuhan dapur keluarga dan mitra pedagang di wilayah Jakarta Timur.</p>
                <div className="flex items-center space-x-4">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200"></div>
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-300"></div>
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-400"></div>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">Tersedia di berbagai pusat kuliner dan mitra resmi kami.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* BEGIN: Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-8 md:space-y-0">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center bg-white p-2 rounded-lg mb-4">
                <img alt="BPM Logo" className="h-8 w-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwWLbBcn57urk2D9WQqDMzJuacURTBmpA8GVDEb2MV5lrUGihGDpSDu5xbm7q6OeI0HCmdyzzHcsUq0xzS-lQxRUID1mPQjGkQiroTVsxlcNFmN5IsGmE3RVCRZCn_7RqbmYZCXLr1il8tZWE-K0GWQriDm3s1Ms097KzKJ5O4sVGZVBPESeN65XIClx_7HO9XM-aZERrHlCQEQEjrMwq8z54nzrGVpNsYvuOcw0LGp8IalfLZJkFsXjpZ-VU9dYjiEkz9_xNM4_9W" />
              </div>
              <p className="text-sm text-gray-400 text-center md:text-left max-w-xs">
                Menyediakan produk olahan daging berkualitas untuk hidangan keluarga yang lezat, sehat, dan praktis setiap hari.
              </p>
            </div>
            <div className="flex space-x-6 text-sm">
              <Link className="hover:text-white transition-colors" href="#">Tentang Kami</Link>
              <Link className="hover:text-white transition-colors" href="#">Kebijakan Privasi</Link>
              <Link className="hover:text-white transition-colors" href="#">Syarat & Ketentuan</Link>
              <Link className="hover:text-white transition-colors" href="#">Bantuan</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-center text-gray-500 flex flex-col md:flex-row justify-between items-center">
            <p>© 2024 Bakso Pak Mul. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link className="text-gray-400 hover:text-white" href="#"><i className="fab fa-instagram text-xl"></i></Link>
              <Link className="text-gray-400 hover:text-white" href="#"><i className="fab fa-facebook text-xl"></i></Link>
              <Link className="text-gray-400 hover:text-white" href="#"><i className="fab fa-tiktok text-xl"></i></Link>
            </div>
          </div>
        </div>
      </footer>
      {/* END: Footer */}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900/95 backdrop-blur text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-gray-700/50">
          <span className="material-symbols-outlined text-green-400 text-2xl">check_circle</span>
          <div>
            <p className="text-xs font-bold text-white">Berhasil Masuk Keranjang!</p>
            <p className="text-[11px] text-gray-300 max-w-xs truncate">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      <CartSidebar />
    </div>
  );
}
