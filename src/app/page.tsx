"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/CartSidebar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

// Fallback catalog items so the artisan UI always looks complete & delicious
const FALLBACK_PRODUCTS = [
  {
    id: "bakso-urat-spesial",
    name: "Bakso Sapi Urat Spesial BPM",
    category: "Bakso",
    price: 65000,
    unit: "50 Butir / Pack",
    rating: "5.0",
    image: "/images/bakso-citra-rasa-premium.webp",
    description: "Bakso urat sapi murni bertekstur kenyal alami dengan cacahan urat melimpah dan aroma daging sapi gurih asli.",
  },
  {
    id: "bakso-halus-super",
    name: "Bakso Sapi Halus Super Essem",
    category: "Bakso",
    price: 58000,
    unit: "50 Butir / Pack",
    rating: "4.9",
    image: "/images/bakso-super-essem.webp",
    description: "Bakso daging sapi halus bertekstur lembut dan kenyal pas, favorit santapan anak-anak dan hajatan keluarga.",
  },
  {
    id: "mie-telor-bebek",
    name: "Mie Basah Telor Bebek Super",
    category: "Mie",
    price: 26000,
    unit: "1 Kg (10-12 Porsi)",
    rating: "4.9",
    image: "/images/bakmie-telor-bebek.webp",
    description: "Mie basah mentah racikan telor bebek asli, kenyal tidak mudah putus saat direbus dan menyerap kuah sempurna.",
  },
  {
    id: "kulit-pangsit-spesial",
    name: "Kulit Pangsit Spesial Rebus & Goreng",
    category: "Pangsit",
    price: 18000,
    unit: "500 Gram",
    rating: "4.8",
    image: "/images/kulit-pangsit-spesial-rebus-dan-goreng.webp",
    description: "Kulit pangsit tipis lentur, sangat renyah ketika digoreng dan lembut gurih saat direbus dalam kuah bakso.",
  },
  {
    id: "bumbu-kuah-bakso",
    name: "Bumbu Kuah Kaldu Rempah Sapi",
    category: "Bumbu",
    price: 22000,
    unit: "250 Gram / Botol",
    rating: "5.0",
    image: "/images/bumbu-kuah-bakso.webp",
    description: "Racikan bumbu kaldu bubuk ekstrak sumsum sapi dengan tumisan bawang putih wangi dan rempah warisan Pak Mul.",
  },
  {
    id: "bakso-mekar-wangi",
    name: "Bakso Mekar Wangi Spesial",
    category: "Bakso",
    price: 62000,
    unit: "50 Butir / Pack",
    rating: "4.9",
    image: "/images/bakso-mekar-wangi.webp",
    description: "Bakso sapi yang merekah cantik saat dimasak dengan kuah mendidih, gurih gurih sedap berasa serat dagingnya.",
  },
  {
    id: "saos-pedas-58",
    name: "Saus Sambal Botol 58 Tradisional",
    category: "Saos",
    price: 15000,
    unit: "600 ml",
    rating: "4.8",
    image: "/images/saos-pedas-lima-delapan.webp",
    description: "Saus sambal legendaris langganan pedagang bakso & mie ayam se-Jabodetabek dengan aroma pedas khas rempah.",
  },
  {
    id: "kecap-manis-sari-sedap",
    name: "Kecap Manis Sari Sedap Kedelai Hitam",
    category: "Saos",
    price: 16000,
    unit: "600 ml",
    rating: "4.9",
    image: "/images/kecap-manis-sari-sedap.webp",
    description: "Kecap manis kental gurih dari kedelai hitam alami, pelengkap sempurna semangkuk bakso dan mie ayam panas.",
  },
];

export default function HomePage() {
  const [addedId, setAddedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { addToCart } = useCart();

  const [products, setProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("Semua");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const res = await fetch("/api/products", { signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data.products && data.products.length > 0) {
            setProducts(data.products);
          } else {
            setProducts(FALLBACK_PRODUCTS);
          }
        } else {
          setProducts(FALLBACK_PRODUCTS);
        }
      } catch (err) {
        console.warn("Failed to load products from API, using fallback catalog:", err);
        setProducts(FALLBACK_PRODUCTS);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const displayList = products.length > 0 ? products : FALLBACK_PRODUCTS;

  const filteredDisplayProducts = useMemo(() => {
    if (activeCategory === "Semua") {
      return displayList.slice(0, 8);
    }
    const cat = activeCategory.toLowerCase();
    return displayList
      .filter(
        (p) =>
          p.category?.toLowerCase().includes(cat) ||
          p.name?.toLowerCase().includes(cat)
      )
      .slice(0, 8);
  }, [displayList, activeCategory]);

  const categories = [
    { name: "Semua", label: "Semua Menu" },
    { name: "Bakso", label: "Bakso Sapi" },
    { name: "Mie", label: "Mie Telor Bebek" },
    { name: "Pangsit", label: "Kulit Pangsit" },
    { name: "Bumbu", label: "Bumbu Kaldu" },
    { name: "Saos", label: "Kecap & Saus" },
  ];

  const handleQuickAdd = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      unit: product.unit || "Pack",
    });
    setAddedId(product.id);
    setToastMessage(product.name);
    setTimeout(() => setAddedId(null), 1500);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c1917] font-sans antialiased selection:bg-[#7a0019] selection:text-white">
      <Navbar />

      <main>
        {/* ========================================================================= */}
        {/* 1. HERO SECTION: WARM, APPETIZING, CONVERTING                             */}
        {/* ========================================================================= */}
        <section className="relative bg-[#200508] text-white pt-28 sm:pt-32 pb-16 lg:pb-24 overflow-hidden border-b border-[#3d0a11]">
          {/* Subtle warm ambient glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(229,169,60,0.12)_0%,_transparent_60%)] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left Column: Authentic Brand Headline & Ordering Flow */}
              <div className="lg:col-span-7 space-y-6 text-left">
                {/* Location / Heritage Badge */}
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#e5a93c]/15 text-[#e5a93c] border border-[#e5a93c]/30 text-xs font-semibold tracking-wide">
                  <span className="material-symbols-outlined text-base">storefront</span>
                  <span>Kios Pasar Kramat Jati • Warisan Kuliner Sejak 2000</span>
                </div>

                {/* Main Headline */}
                <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
                  Bakso Sapi Asli &amp; Racikan Gurih Pilihan Keluarga{" "}
                  <span className="text-[#e5a93c]">Khas Kramat Jati.</span>
                </h1>

                {/* Clear Subtitle */}
                <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
                  Diracik segar setiap subuh dari <strong className="text-white font-semibold">100% daging sapi murni</strong> tanpa campuran boraks maupun pengawet kimiawi. Menyediakan bakso urat, bakso halus, mie basah telor bebek, kulit pangsit gurih, dan bumbu kuah kaldu rempah untuk meja makan keluarga hingga ratusan warung mitra di seluruh Jabodetabek.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <a
                    href="#menu-catalog"
                    className="px-7 py-3.5 rounded-xl bg-[#e5a93c] hover:bg-amber-400 text-[#200508] font-bold text-sm tracking-wide shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span className="material-symbols-outlined text-lg">restaurant_menu</span>
                    <span>Pilih Menu Sekarang</span>
                  </a>

                  <a
                    href="https://wa.me/6281298980252?text=Halo%20Pak%20Mul,%20saya%20ingin%20pesan%20bakso%20sapi%20dan%20mie"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm tracking-wide transition-all duration-200 flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span className="material-symbols-outlined text-emerald-400 text-lg">chat</span>
                    <span>Pesan via WhatsApp</span>
                  </a>
                </div>

                {/* 3 Trust Guarantees */}
                <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-4 max-w-lg">
                  <div>
                    <p className="text-[#e5a93c] font-bold text-xs flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">verified</span>
                      <span>100% Daging Sapi</span>
                    </p>
                    <p className="text-[11px] text-stone-300/80 mt-0.5 font-medium">Bebas boraks &amp; bahan kimiawi</p>
                  </div>
                  <div>
                    <p className="text-[#e5a93c] font-bold text-xs flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">soup_kitchen</span>
                      <span>Kaldu Sumsum Asli</span>
                    </p>
                    <p className="text-[11px] text-stone-300/80 mt-0.5 font-medium">Rebusan rempah gurih alami</p>
                  </div>
                  <div>
                    <p className="text-[#e5a93c] font-bold text-xs flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">local_shipping</span>
                      <span>Kirim Tiap Hari</span>
                    </p>
                    <p className="text-[11px] text-stone-300/80 mt-0.5 font-medium">Segar cepat se-Jabodetabek</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Clean Appetizing Showcase Visual */}
              <div className="lg:col-span-5 space-y-4">
                {/* Hero Dish Visual */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 bg-[#30080d] group">
                  <div className="aspect-[4/3] w-full overflow-hidden">
                    <img
                      src="/images/hero-banner.webp"
                      alt="Semangkuk Bakso Sapi Komplit Pak Mul"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#200508] via-transparent to-transparent opacity-80" />

                  {/* Rating Tag */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-xs text-[#1c1917] px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
                    <span className="text-amber-500 text-sm">★</span>
                    <span>4.98</span>
                    <span className="text-stone-500 font-normal text-[11px]">• 500+ Mitra</span>
                  </div>

                  {/* Bottom Dish Info */}
                  <div className="absolute bottom-4 left-4 right-4 text-white flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#e5a93c]">
                        Menu Andalan Kios
                      </p>
                      <h3 className="font-headline text-lg sm:text-xl font-bold text-white">
                        Bakso Sapi Komplit &amp; Mie Basah
                      </h3>
                    </div>
                    <button
                      onClick={() => handleQuickAdd(displayList[0] || FALLBACK_PRODUCTS[0])}
                      className="px-3.5 py-1.5 rounded-lg bg-[#e5a93c] hover:bg-amber-400 text-[#200508] text-xs font-bold flex items-center gap-1 shadow-md transition-all active:scale-95"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                      <span>Pesan</span>
                    </button>
                  </div>
                </div>

                {/* Quick Companion Cards (Bakso Urat & Mie Telor Bebek) */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Item 1 */}
                  <div className="bg-[#2d070c] rounded-xl p-3 border border-white/10 flex items-center gap-3 hover:border-[#e5a93c]/50 transition-colors">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/40 shrink-0">
                      <img
                        src="/images/bakso-citra-rasa-premium.webp"
                        alt="Bakso Urat"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">Bakso Urat 50 Butir</p>
                      <p className="text-[11px] text-[#e5a93c] font-semibold">Rp 65.000</p>
                    </div>
                    <button
                      onClick={() => handleQuickAdd(displayList[0] || FALLBACK_PRODUCTS[0])}
                      className="w-7 h-7 rounded-lg bg-white/10 hover:bg-[#e5a93c] hover:text-[#200508] text-white flex items-center justify-center shrink-0 transition-colors"
                      title="Tambah ke keranjang"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>

                  {/* Item 2 */}
                  <div className="bg-[#2d070c] rounded-xl p-3 border border-white/10 flex items-center gap-3 hover:border-[#e5a93c]/50 transition-colors">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/40 shrink-0">
                      <img
                        src="/images/bakmie-telor-bebek.webp"
                        alt="Mie Telor Bebek"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">Mie Telor Bebek 1 Kg</p>
                      <p className="text-[11px] text-[#e5a93c] font-semibold">Rp 26.000</p>
                    </div>
                    <button
                      onClick={() => handleQuickAdd(displayList[2] || FALLBACK_PRODUCTS[2])}
                      className="w-7 h-7 rounded-lg bg-white/10 hover:bg-[#e5a93c] hover:text-[#200508] text-white flex items-center justify-center shrink-0 transition-colors"
                      title="Tambah ke keranjang"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. VALUE GUARANTEE BAR (CLEAN, SOLID, PROFESSIONAL)                       */}
        {/* ========================================================================= */}
        <section className="bg-[#38070d] text-white py-5 border-b border-[#520c15]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-[#e5a93c]">
                  <span className="material-symbols-outlined text-xl">soup_kitchen</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wide text-white">100% Daging Murni</h4>
                  <p className="text-[11px] text-stone-300">Tanpa boraks &amp; formalin</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-[#e5a93c]">
                  <span className="material-symbols-outlined text-xl">ramen_dining</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wide text-white">Mie Telor Bebek</h4>
                  <p className="text-[11px] text-stone-300">Kenyal alami tidak benyek</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-[#e5a93c]">
                  <span className="material-symbols-outlined text-xl">verified</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wide text-white">Tradisi 24+ Tahun</h4>
                  <p className="text-[11px] text-stone-300">Dipercaya 500+ warung mitra</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-[#e5a93c]">
                  <span className="material-symbols-outlined text-xl">inventory_2</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wide text-white">Kemas Vakum Rapi</h4>
                  <p className="text-[11px] text-stone-300">Higienis &amp; aman kirim jauh</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. BRAND PHILOSOPHY / QUALITY STATEMENT (CLEAN EDITORIAL)                 */}
        {/* ========================================================================= */}
        <section className="py-16 sm:py-20 bg-[#faf8f5]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7a0019]">
              Filosofi Rasa Bakso Pak Mul
            </span>
            <h2 className="font-headline text-2xl sm:text-4xl lg:text-5xl font-bold text-[#1c1917] tracking-tight leading-snug">
              &ldquo;Rasa jujur yang diracik dari daging sapi murni, dipercaya turun-temurun sejak tahun 2000.&rdquo;
            </h2>
            <p className="text-[#57534e] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
              Bagi kami, menjaga kelezatan semangkuk bakso bukan sekadar menggiling daging, melainkan merawat amanah rasa yang dinikmati ribuan keluarga dan ratusan warung binaan setiap harinya. Setiap porsi diracik segar tanpa pengenyal buatan, menjaga kekenyalan alami serat daging sapi murni.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. MENU CATALOG & CATEGORY FILTER                                         */}
        {/* ========================================================================= */}
        <section id="menu-catalog" className="py-16 sm:py-20 bg-white border-y border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7a0019]">
                  Koleksi Menu &amp; Bahan Baku
                </span>
                <h3 className="font-headline text-3xl sm:text-4xl font-bold text-[#1c1917] tracking-tight mt-1">
                  Pilihan Racikan Segar Kios
                </h3>
                <p className="text-stone-500 text-xs sm:text-sm mt-1">
                  Pesan langsung kebutuhan olahan bakso, mie, dan bumbu untuk dapur rumah tangga maupun warung kuliner.
                </p>
              </div>

              <Link
                href="/produk"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7a0019] hover:text-[#51000d] uppercase tracking-wider group"
              >
                <span>Lihat Seluruh Produk</span>
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Link>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
              {categories.map((cat) => {
                const isSelected = activeCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-[#7a0019] text-white shadow-md font-bold"
                        : "bg-stone-100 hover:bg-stone-200 text-stone-700"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDisplayProducts.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-[#e5a93c] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                      <img
                        src={item.image || "/images/hero-banner.webp"}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e: any) => {
                          e.target.src = "/images/hero-banner.webp";
                        }}
                      />
                      <span className="absolute top-3 left-3 bg-[#200508]/85 backdrop-blur-xs text-[#e5a93c] font-bold text-[10px] px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                        {item.category || "Bakso"}
                      </span>
                      <div className="absolute top-3 right-3 bg-white/95 text-[#1c1917] font-bold text-[11px] px-2 py-0.5 rounded-md flex items-center gap-0.5 shadow-xs">
                        <span className="text-amber-500 text-xs">★</span>
                        <span>{item.rating || "4.9"}</span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-4 sm:p-5">
                      <Link href={`/produk/${item.id}`} className="block">
                        <h4 className="font-headline font-bold text-[#1c1917] text-base group-hover:text-[#7a0019] transition-colors line-clamp-1">
                          {item.name}
                        </h4>
                      </Link>
                      <p className="text-stone-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                        {item.description || "Olahan segar berkualitas dari bahan baku murni terpilih khas Bakso Pak Mul."}
                      </p>
                      {item.unit && (
                        <p className="text-[11px] font-semibold text-stone-600 mt-2 bg-stone-100 inline-block px-2 py-0.5 rounded">
                          Kemasan: <span className="text-stone-900 font-bold">{item.unit}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="p-4 sm:p-5 pt-0 border-t border-stone-100 flex items-center justify-between mt-2">
                    <div className="pt-2">
                      <span className="text-[10px] uppercase font-bold text-stone-500 block">
                        Harga
                      </span>
                      <span className="font-headline font-bold text-lg text-[#1c1917]">
                        Rp {(item.price || 0).toLocaleString("id-ID")}
                      </span>
                    </div>

                    <button
                      onClick={() => handleQuickAdd(item)}
                      className={`px-4 py-2 rounded-xl font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer ${
                        addedId === item.id
                          ? "bg-emerald-700 text-white"
                          : "bg-[#7a0019] hover:bg-[#51000d] text-white"
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {addedId === item.id ? "check" : "add"}
                      </span>
                      <span>{addedId === item.id ? "Masuk" : "Tambah"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom link to all products */}
            <div className="mt-10 text-center">
              <Link
                href="/produk"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#1c1917] font-bold text-xs uppercase tracking-wider transition-colors"
              >
                <span>Buka Katalog Lengkap</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. 4 PILAR KUALITAS PAK MUL                                               */}
        {/* ========================================================================= */}
        <section className="py-16 sm:py-24 bg-[#faf8f5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7a0019]">
                Standar Mutu
              </span>
              <h3 className="font-headline text-2xl sm:text-4xl font-bold text-[#1c1917] tracking-tight mt-1">
                4 Pilar Kualitas Bakso Pak Mul
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#7a0019]/10 text-[#7a0019] flex items-center justify-center font-bold font-headline text-lg">
                  01
                </div>
                <h4 className="font-headline font-bold text-base text-[#1c1917]">100% Daging Sapi Murni</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Dipilih langsung dari pemotongan pasar induk setiap subuh tanpa campuran boraks maupun pengawet sintetis.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#7a0019]/10 text-[#7a0019] flex items-center justify-center font-bold font-headline text-lg">
                  02
                </div>
                <h4 className="font-headline font-bold text-base text-[#1c1917]">Kaldu Tulang Sumsum</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Sari rebusan tulang sumsum sapi berpadu tumisan bawang putih harum, menghasilkan aroma kuah yang gurih alami.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#7a0019]/10 text-[#7a0019] flex items-center justify-center font-bold font-headline text-lg">
                  03
                </div>
                <h4 className="font-headline font-bold text-base text-[#1c1917]">Tradisi Sejak Tahun 2000</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Dipercaya lebih dari 24 tahun melayani kebutuhan santapan keluarga dan ratusan warung mitra se-Jabodetabek.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#7a0019]/10 text-[#7a0019] flex items-center justify-center font-bold font-headline text-lg">
                  04
                </div>
                <h4 className="font-headline font-bold text-base text-[#1c1917]">Segel Higienis &amp; Segar</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Dikemas rapi dalam standar mutu pangan untuk menjaga kebersihan dan kesegaran terbaik tiba di dapur Anda.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. AUTHENTIC STORY SECTION (EDITORIAL SPREAD)                             */}
        {/* ========================================================================= */}
        <section className="py-16 sm:py-24 bg-white border-y border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column: Portrait of Pak Mul at the Kiosk */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden shadow-xl bg-stone-900 border border-stone-200 group">
                  <img
                    alt="Pak Mul di Kios Tradisional Pasar Kramat Jati"
                    className="w-full h-[400px] sm:h-[480px] object-cover transition-transform duration-500 group-hover:scale-105"
                    src="/images/toko-pak-mul-kramat-jati.webp"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#e5a93c]">
                      Dokumentasi Kios Asli
                    </span>
                    <p className="font-headline font-bold text-xl uppercase mt-0.5 text-white">
                      Pak Mul di Kios Kramat Jati
                    </p>
                    <p className="text-xs text-stone-300 mt-0.5">
                      Melayani pelanggan setiap subuh sejak tahun 2000
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Narrative & Dedication */}
              <div className="lg:col-span-7 space-y-5 text-left">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-[2px] bg-[#7a0019]" />
                  <p className="text-xs font-bold tracking-[0.2em] text-[#7a0019] uppercase">
                    Kisah &amp; Filosofi Rasa
                  </p>
                </div>

                <blockquote className="font-headline text-2xl sm:text-3xl font-bold text-[#1c1917] leading-tight">
                  &ldquo;Bagi kami, membuat bakso bukan sekadar menggiling daging, melainkan menjaga amanah rasa yang sudah dipercaya keluarga sejak generasi pertama.&rdquo;
                </blockquote>

                <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
                  Bermula dari kios sederhana di lantai dasar Pasar Kramat Jati Jakarta Timur, Pak Mul mengawali hari setiap pukul 04.30 subuh untuk memilih potongan daging sapi segar terbaik dari pemotongan pasar induk. Tanpa pengenyal kimiawi, tanpa rekayasa buatan. Hanya daging sapi murni, takaran bumbu rempah yang pas, dan dedikasi menjaga konsistensi rasa selama lebih dari 24 tahun.
                </p>

                <div className="pt-3 flex flex-wrap items-center gap-3.5">
                  <a
                    href="https://maps.google.com/?q=Pasar+Kramat+Jati+Jakarta+Timur"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl bg-[#200508] hover:bg-[#38070d] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
                  >
                    <span className="material-symbols-outlined text-base text-[#e5a93c]">near_me</span>
                    <span>Petunjuk Arah Kios Pasar Kramat Jati</span>
                  </a>
                  <a
                    href="https://wa.me/6281298980252?text=Halo%20Pak%20Mul,%20saya%20ingin%20berkunjung%20ke%20kios%20langsung"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-[#1c1917] font-bold text-xs flex items-center gap-2 transition-colors"
                  >
                    <span className="material-symbols-outlined text-emerald-700 text-base">chat</span>
                    <span>Hubungi Kios via WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. TESTIMONIALS (WARM EDITORIAL, CRISP READABILITY)                       */}
        {/* ========================================================================= */}
        <section className="py-16 sm:py-24 bg-[#faf8f5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs font-bold tracking-[0.2em] text-[#7a0019] uppercase">
                Ulasan Pelanggan Setia
              </span>
              <h2 className="font-headline text-2xl sm:text-4xl font-bold text-[#1c1917] tracking-tight mt-1">
                Dipercaya Turun Temurun
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Testimonial 1 */}
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="text-amber-500 text-sm mb-3">★★★★★</div>
                  <p className="text-sm text-stone-700 leading-relaxed font-normal">
                    &ldquo;Sudah 6 tahun langganan mie telor bebek dan bakso urat Pak Mul untuk gerobak mie ayam saya. Mie-nya kenyal tidak mudah hancur saat direbus, pelanggan selalu puji kuahnya mantap.&rdquo;
                  </p>
                </div>
                <div className="pt-5 mt-5 border-t border-stone-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#7a0019] text-amber-200 font-headline font-bold text-xs flex items-center justify-center">
                    MB
                  </div>
                  <div>
                    <p className="font-bold text-xs text-[#1c1917]">Mas Bambang</p>
                    <p className="text-[11px] text-[#7a0019] font-medium">Mie Ayam Podomoro, Ciracas</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="text-amber-500 text-sm mb-3">★★★★★</div>
                  <p className="text-sm text-stone-700 leading-relaxed font-normal">
                    &ldquo;Beli bakso halus buat acara arisan dan hajatan keluarga di rumah. Daging sapinya berasa sekali, bukan cuma tepung. Pengiriman tepat waktu dan baksonya masih dingin beku segar.&rdquo;
                  </p>
                </div>
                <div className="pt-5 mt-5 border-t border-stone-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#7a0019] text-amber-200 font-headline font-bold text-xs flex items-center justify-center">
                    SR
                  </div>
                  <div>
                    <p className="font-bold text-xs text-[#1c1917]">Ibu Siti Rahma</p>
                    <p className="text-[11px] text-[#7a0019] font-medium">Ibu Rumah Tangga, Kramat Jati</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="text-amber-500 text-sm mb-3">★★★★★</div>
                  <p className="text-sm text-stone-700 leading-relaxed font-normal">
                    &ldquo;Pesanan grosir untuk katering pabrik selalu aman. Kulit pangsitnya renyah kalau digoreng, tidak banyak menyerap minyak. Pelayanan cepat dan responsif saat ada pesanan dadakan.&rdquo;
                  </p>
                </div>
                <div className="pt-5 mt-5 border-t border-stone-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#7a0019] text-amber-200 font-headline font-bold text-xs flex items-center justify-center">
                    HW
                  </div>
                  <div>
                    <p className="font-bold text-xs text-[#1c1917]">Pak Hendra Wijaya</p>
                    <p className="text-[11px] text-[#7a0019] font-medium">Katering Berkah Mandiri, Pulogadung</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. ORDER NOW CTA BANNER                                                   */}
        {/* ========================================================================= */}
        <section className="bg-[#200508] text-white py-16 sm:py-20 border-t border-[#3d0a11] text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#e5a93c]/20 text-[#e5a93c] font-bold text-xs uppercase tracking-wider border border-[#e5a93c]/30">
              Pesan Segar Langsung Ke Rumah
            </span>
            <h2 className="font-headline text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              Nikmati Kehangatan <span className="text-[#e5a93c]">Bakso Sapi Asli</span> Hari Ini
            </h2>
            <p className="text-stone-300 text-sm sm:text-base font-normal leading-relaxed max-w-xl mx-auto">
              Dibuat segar setiap hari, dikemas higienis, dan dikirim aman ke seluruh Jabodetabek. Nikmati kelezatan semangkuk bakso otentik bersama keluarga tercinta.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3.5">
              <Link
                href="/produk"
                className="px-7 py-3.5 rounded-xl bg-[#e5a93c] hover:bg-amber-400 text-[#200508] font-bold text-xs uppercase tracking-wider shadow-lg transition-all hover:scale-105 flex items-center gap-2"
              >
                <span>Jelajahi Menu Lengkap</span>
                <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
              </Link>
              <a
                href="https://wa.me/6281298980252?text=Halo%20Pak%20Mul,%20saya%20ingin%20tanya%20pesanan%20langsung"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-emerald-400 text-base">chat</span>
                <span>Konsultasi WhatsApp</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Cart Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-8 right-6 z-50 bg-[#200508] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold border border-[#e5a93c]/40 animate-in fade-in slide-in-from-bottom-3">
          <span className="material-symbols-outlined text-[#e5a93c] text-base">
            check_circle
          </span>
          <span>{toastMessage} berhasil masuk keranjang</span>
        </div>
      )}

      {/* Cart Sidebar Drawer */}
      <CartSidebar />
    </div>
  );
}
