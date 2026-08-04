"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/CartSidebar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

export default function HomePage() {
  const [addedId, setAddedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { openCart, totalItems, addToCart } = useCart();

  const [products, setProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const res = await fetch("/api/products", { signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data.products) {
            setProducts(data.products);
          }
        }
      } catch (err) {
        console.warn("Failed to load products from API:", err);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const featuredProducts = React.useMemo(() => {
    if (!products.length) return [];
    
    const baksoList = products.filter(p => p.category.toLowerCase().includes("bakso") || p.name.toLowerCase().includes("bakso"));
    const mieList = products.filter(p => p.category.toLowerCase().includes("mie") || p.name.toLowerCase().includes("mie") || p.name.toLowerCase().includes("pangsit"));
    const bumbuList = products.filter(p => p.category.toLowerCase().includes("bumbu") || p.name.toLowerCase().includes("saos") || p.name.toLowerCase().includes("kecap") || p.name.toLowerCase().includes("bumbu"));

    const pickRandom = (arr: any[]) => arr.length ? arr[Math.floor(Math.random() * arr.length)] : null;

    const b = pickRandom(baksoList);
    const m = pickRandom(mieList);
    const s = pickRandom(bumbuList);

    const list = [b, m, s].filter(Boolean);
    if (list.length < 3) {
      return products.slice(0, 3);
    }
    return list;
  }, [products]);

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
                <h1 className="text-3xl tracking-tight text-gray-900 sm:text-4xl md:text-5xl lg:leading-tight mb-6 font-bold">
                  Pusat Bahan Baku <span className="text-maroon">Bakso &amp; Mie Ayam</span>
                </h1>
                <p className="mt-6 text-lg md:text-xl text-gray-600 font-medium leading-relaxed max-w-xl">
                  Ciptakan kelezatan bakso dan mie ayam seenak langganan Anda langsung dari dapur sendiri. Sedia baso sapi asli, mie keriting kenyal, hingga saus dan kecap pilihan.
                </p>

                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link
                    className="w-full flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-medium rounded-full text-white bg-maroon hover:bg-maroon-dark md:py-4 md:text-lg md:px-10 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    href="/produk"
                  >
                    Belanja Sekarang
                  </Link>
                </div>
              </div>
              {/* Hero Image/Graphic */}
              <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                <div className="relative mx-auto w-full rounded-3xl shadow-2xl lg:max-w-md floating glass-effect p-3.5 border border-white/80 bg-white/40">
                  <img
                    alt="Aneka produk Bakso Pak Mul"
                    className="w-full h-[460px] rounded-2xl object-cover shadow-sm"
                    src="/images/hero-banner.jpg"
                  />
                  {/* Floating Badge */}
                  <div className="absolute -right-6 -bottom-6 glass-effect p-4 rounded-2xl shadow-xl flex items-center space-x-3 border border-white bg-white/90 backdrop-blur-md">
                    <div className="bg-green-100 p-2.5 rounded-xl text-green-600 shrink-0">
                      <i className="fas fa-check text-lg"></i>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Stok Selalu</p>
                      <p className="text-sm font-black text-gray-900">Fresh &amp; 100% Halal</p>
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
                <p className="text-sm text-gray-500">Bersertifikasi Halal &amp; BPOM.</p>
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
                <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">Pilihan Favorit Keluarga</h2>
                <p className="mt-2 text-lg text-gray-500">Produk terlaris yang wajib ada di kulkas Anda.</p>
              </div>
              <Link className="hidden sm:inline-flex items-center text-maroon font-semibold hover:text-maroon-dark group" href="/produk">
                Lihat Semua Produk
                <i className="fas fa-arrow-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {isLoadingProducts ? (
                <div className="col-span-full text-center py-10 text-gray-500 font-medium">Memuat produk...</div>
              ) : featuredProducts.length === 0 ? (
                <div className="col-span-full text-center py-10 text-gray-500 font-medium">Tidak ada produk tersedia.</div>
              ) : (
                featuredProducts.map((product: any, idx: number) => (
                  <div key={`${product.id}-${idx}`} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
                    <div className="relative h-60 bg-[#fbfbfb] p-4 flex items-center justify-center overflow-hidden group">
                      <img
                        alt={product.name}
                        className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                        src={product.image || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=60"}
                      />
                      {product.badge && (
                        <span className="absolute top-3 left-3 bg-maroon text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">{product.badge}</span>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-sm font-bold text-gray-900 mb-1 leading-tight">{product.name}</h3>
                      <p className="text-xs text-gray-500 mb-4 flex-1">
                        Kategori: <span className="font-medium text-maroon">{product.category}</span>
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                        <div>
                          {product.originalPrice && (
                            <p className="text-[10px] text-gray-400 line-through">Rp {product.originalPrice.toLocaleString('id-ID')}</p>
                          )}
                          <p className="text-base font-black text-maroon">Rp {product.price.toLocaleString('id-ID')} <span className="text-[10px] text-gray-400 font-normal">/{product.unit}</span></p>
                        </div>
                        <button 
                          onClick={() => {
                            addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, unit: product.unit });
                            setAddedId(product.id);
                            setToastMessage(product.name);
                            setTimeout(() => setAddedId(null), 1500);
                            setTimeout(() => setToastMessage(null), 3000);
                          }}
                          className={`h-9 w-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-sm border ${addedId === product.id ? "bg-green-500 text-white border-green-600" : "bg-white text-maroon border-maroon hover:bg-maroon hover:text-white"}`}
                        >
                          {addedId === product.id ? <i className="fas fa-check text-sm"></i> : <i className="fas fa-cart-plus text-sm"></i>}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
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
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Cara Belanja Mudah</h2>
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
              <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">Kata Mereka</h2>
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
              <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">Keunggulan Produk Kami</h2>
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
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                  <img 
                    src="/images/toko-pak-mul-kramat-jati.jpg" 
                    alt="Toko Bakso Pak Mul Pasar Kramat Jati Jakarta Timur" 
                    className="w-full h-[420px] object-cover object-center transform hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs font-bold uppercase tracking-wider text-amber-300">📍 Lokasi Otentik</p>
                    <p className="text-sm font-semibold">Kios Bakso Pak Mul - Pasar Kramat Jati, Jakarta Timur</p>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl border border-gray-100 hidden md:block">
                  <p className="text-maroon font-bold text-4xl">10+</p>
                  <p className="text-gray-500 text-sm">Kota di Indonesia</p>
                </div>
              </div>
              <div>
                <span className="text-maroon font-bold tracking-wider uppercase text-sm">Tentang Kami</span>
                <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mt-4 mb-6">Jakarta Timur, Pasar Kramat Jati</h2>
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
      <Footer />
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
