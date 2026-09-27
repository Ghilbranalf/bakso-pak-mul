"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/CartSidebar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

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

  const filteredDisplayProducts = useMemo(() => {
    if (!products.length) return [];
    if (activeCategory === "Semua") {
      return products.slice(0, 8);
    }
    const cat = activeCategory.toLowerCase();
    return products
      .filter(
        (p) =>
          p.category?.toLowerCase().includes(cat) ||
          p.name?.toLowerCase().includes(cat)
      )
      .slice(0, 8);
  }, [products, activeCategory]);

  const categoriesList = [
    { name: "Semua", icon: "restaurant_menu", count: "Semua Koleksi" },
    { name: "Bakso", icon: "soup_kitchen", count: "Urat, Halus & Telur" },
    { name: "Mie", icon: "ramen_dining", count: "Telor Bebek & Keriting" },
    { name: "Pangsit", icon: "bakery_dining", count: "Kulit Rebus & Goreng" },
    { name: "Bumbu", icon: "skillet", count: "Kaldu Sapi & Rempah" },
    { name: "Saos", icon: "liquor", count: "Kecap & Saus Sambal" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-[#7a0019] selection:text-white">
      <Navbar />

      <main className="pt-18 sm:pt-22">
        {/* ================= HERO SECTION (CLEAN CLASSIC LUXURY) ================= */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#faf7f2] via-[#fcfbfa] to-white border-b border-slate-100 py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column: Classic Heritage Copy */}
              <div className="lg:col-span-7 space-y-6 text-left">
                {/* Refined Eyebrow Header - Clean, No Gimmicky Pills */}
                <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#7a0019] uppercase">
                  <span className="w-1.5 h-1.5 bg-[#7a0019] inline-block shrink-0" />
                  <span>Cita Rasa Klasik Pasar Kramat Jati • Sejak 2000</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.12]">
                  Sensasi Bakso Sapi Asli yang{" "}
                  <span className="text-[#7a0019] underline decoration-[#7a0019]/30 decoration-wavy underline-offset-8">
                    Kenyal, Gurih &amp; Melegenda
                  </span>
                  .
                </h1>

                {/* Subtitle */}
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
                  Dibuat dari olahan daging sapi segar pilihan setiap hari. Menghadirkan kenikmatan kaldu rempah otentik untuk santapan istimewa keluarga di rumah hingga rahasia sukses ratusan warung kuliner di Jabodetabek.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <Link
                    href="/produk"
                    className="px-7 py-4 rounded-xl bg-[#7a0019] hover:bg-[#51000d] text-white font-bold text-sm shadow-md shadow-[#7a0019]/25 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2.5 cursor-pointer group"
                  >
                    <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">
                      shopping_bag
                    </span>
                    <span>Pesan Menu Favorit</span>
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </Link>

                  <a
                    href="https://wa.me/6281298980252?text=Halo%20Pak%20Mul,%20saya%20tertarik%20dengan%20produk%20bakso%20dan%20ingin%20konsultasi%20pemesanan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 font-bold text-sm shadow-xs hover:border-[#7a0019]/30 hover:shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-emerald-600 text-xl">chat</span>
                    <span>Konsultasi Grosir (WA)</span>
                  </a>
                </div>

                {/* Trust Highlights - Crisp & Architectural */}
                <div className="pt-6 border-t border-slate-200/70 grid grid-cols-3 gap-4 max-w-lg">
                  <div className="space-y-0.5">
                    <p className="text-sm sm:text-base font-black text-slate-900">100% Sapi Asli</p>
                    <p className="text-[11px] text-slate-500 font-medium">Bebas Boraks &amp; Kimia</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm sm:text-base font-black text-slate-900">Fresh Subuh Hari</p>
                    <p className="text-[11px] text-slate-500 font-medium">Produksi Segar Setiap Pagi</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm sm:text-base font-black text-slate-900">500+ Mitra Warung</p>
                    <p className="text-[11px] text-slate-500 font-medium">Depot &amp; Katering Aktif</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Clean Food Showcase - No Cluttered Floating Stickers */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 bg-slate-900 aspect-[4/5] sm:aspect-square group">
                  <img
                    alt="Hidangan Bakso Pak Mul Kramat Jati"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src="/images/hero-banner.webp"
                  />

                  {/* Integrated Bottom Store Overlay - Sleek & Structured */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent p-5 text-white flex items-end justify-between">
                    <div>
                      <p className="text-xs font-bold text-white tracking-wide">
                        Kios Pusat Bakso Pak Mul
                      </p>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        Lantai Dasar Pasar Kramat Jati, Jakarta Timur
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-white bg-[#7a0019] px-3 py-1.5 rounded-lg shrink-0">
                      Buka 06.00 WIB
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CATEGORY CARDS (STRUCTURED & TIDY) ================= */}
        <section className="py-10 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Pilih Kategori Kebutuhan Anda
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Bahan baku segar pilihan langsung dari produsen
                </p>
              </div>
              <Link
                href="/produk"
                className="text-xs font-bold text-[#7a0019] hover:underline flex items-center gap-1"
              >
                <span>Semua Produk</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {categoriesList.map((cat) => {
                const isSelected = activeCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`p-4 rounded-xl text-left transition-all duration-200 cursor-pointer flex flex-col justify-between h-28 border ${
                      isSelected
                        ? "bg-[#7a0019] text-white border-[#7a0019] shadow-sm -translate-y-0.5"
                        : "bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-800"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-white text-[#7a0019] shadow-2xs"
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">{cat.icon}</span>
                    </div>

                    <div>
                      <p className="text-xs sm:text-sm font-bold leading-tight">{cat.name}</p>
                      <p
                        className={`text-[10px] mt-0.5 truncate ${
                          isSelected ? "text-white/80" : "text-slate-500"
                        }`}
                      >
                        {cat.count}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= CATALOG SECTION ================= */}
        <section className="py-14 sm:py-20 bg-slate-50/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-bold text-[#7a0019] uppercase tracking-wider">
                  Menu Unggulan &amp; Terlaris
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight mt-1">
                  Koleksi Paling Diminati Pelanggan
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl">
                  Pilihan favorit ibu rumah tangga untuk hidangan hangat keluarga, dan resep rahasia ratusan gerobak &amp; depot mie ayam di Jakarta.
                </p>
              </div>

              <Link
                href="/produk"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold shadow-2xs transition-colors self-start sm:self-auto"
              >
                <span>Lihat Seluruh Katalog</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {isLoadingProducts ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-slate-200/70 p-4 h-80 animate-pulse shadow-xs"
                  />
                ))
              ) : filteredDisplayProducts.length === 0 ? (
                <div className="col-span-full py-16 text-center text-slate-500 text-sm bg-white rounded-2xl border border-slate-200/80">
                  <span className="material-symbols-outlined text-4xl text-slate-300 mb-2 block">
                    soup_kitchen
                  </span>
                  Tidak ada produk untuk kategori ini.
                </div>
              ) : (
                filteredDisplayProducts.map((product: any) => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col justify-between hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-xs"
                  >
                    {/* Image Area */}
                    <Link
                      href={`/produk/${product.id}`}
                      className="block relative aspect-square bg-[#fcfaf7] p-5 overflow-hidden"
                    >
                      <img
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        src={product.image || "/images/hero-banner.webp"}
                      />
                      <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#7a0019] text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#7a0019]/15 shadow-2xs">
                        {product.category || "Bakso Pilihan"}
                      </span>
                    </Link>

                    {/* Content Area */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Rating */}
                        <div className="flex items-center gap-1 text-amber-500 text-xs mb-1.5">
                          <span>★★★★★</span>
                          <span className="text-[10px] text-slate-400 font-medium">(4.9)</span>
                        </div>

                        <Link href={`/produk/${product.id}`} className="block">
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-[#7a0019] transition-colors">
                            {product.name}
                          </h3>
                        </Link>

                        <p className="text-[11px] text-slate-500 mt-1">
                          Kemasan: <span className="font-semibold text-slate-700">{product.unit || "Pack Segar"}</span>
                        </p>
                      </div>

                      {/* Pricing and Action */}
                      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div>
                          {product.originalPrice && (
                            <p className="text-[10px] text-slate-400 line-through">
                              Rp {product.originalPrice.toLocaleString("id-ID")}
                            </p>
                          )}
                          <p className="text-sm sm:text-base font-black text-[#7a0019]">
                            Rp {(product.price || 0).toLocaleString("id-ID")}
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            addToCart({
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              image: product.image,
                              unit: product.unit,
                            });
                            setAddedId(product.id);
                            setToastMessage(product.name);
                            setTimeout(() => setAddedId(null), 1500);
                            setTimeout(() => setToastMessage(null), 3000);
                          }}
                          className={`h-9 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-xs ${
                            addedId === product.id
                              ? "bg-emerald-600 text-white"
                              : "bg-[#7a0019] hover:bg-[#51000d] text-white"
                          }`}
                          title="Tambah ke Keranjang"
                        >
                          <span className="material-symbols-outlined text-sm">
                            {addedId === product.id ? "check" : "add_shopping_cart"}
                          </span>
                          <span>{addedId === product.id ? "Masuk" : "+ Beli"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* ================= AUTHENTIC HERITAGE KIOSK STORY ================= */}
        <section className="py-16 sm:py-24 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column: Authentic Kiosk Photo of Pak Mul */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-900 group">
                  <img
                    alt="Kios Fisik Toko Bakso Pak Mul Pasar Kramat Jati"
                    className="w-full h-[380px] sm:h-[440px] object-cover transition-transform duration-700 group-hover:scale-105"
                    src="/images/toko-pak-mul-kramat-jati.webp"
                  />
                  {/* Photo Vignette & Structured Tag */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="px-2.5 py-1 rounded-md bg-[#7a0019] text-[10px] font-black uppercase tracking-wider">
                      Kios Asli Sejak 2000
                    </span>
                    <p className="text-sm font-bold mt-2">
                      Pak Mul di Kios Tradisional Pasar Kramat Jati
                    </p>
                    <p className="text-xs text-slate-300">
                      Melayani pelanggan eceran &amp; grosir setiap hari sejak subuh
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Grounded Heritage Copy & Key Pillars */}
              <div className="lg:col-span-7 space-y-6 text-left">
                {/* Eyebrow - Clean & Structured, No Rounded-Full */}
                <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#7a0019] uppercase">
                  <span className="w-1.5 h-1.5 bg-[#7a0019] inline-block shrink-0" />
                  <span>Warisan Kuliner 20+ Tahun</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
                  Dedikasi Nyata Menjaga Keaslian Rasa &amp; Kualitas Daging Sapi
                </h2>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Bermula dari kios kayu sederhana di jantung Pasar Kramat Jati Jakarta Timur, Pak Mul meracik setiap butir bakso dengan komitmen teguh: menggunakan daging sapi segar pilihan setiap subuh hari, bumbu rempah alami tanpa pengawet berbahaya, dan takaran adonan yang pas agar menghasilkan tekstur kenyal berserat yang alami.
                </p>

                {/* 3 Value Pillars */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-[#7a0019]/10 text-[#7a0019] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-xl">verified</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Daging Sapi Murni Subuh Hari</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                        Dipilih langsung dari pemotongan halal pasar induk setiap pagi untuk memastikan aroma dan rasa manis alami daging sapi tetap terjaga.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-[#7a0019]/10 text-[#7a0019] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-xl">soup_kitchen</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Bumbu Kuah Kaldu Rempah Otentik</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                        Kombinasi bawang putih goreng istimewa, lada murni, dan sari rebusan sumsum sapi menghasilkan aroma kuah harum yang menggugah selera.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-[#7a0019]/10 text-[#7a0019] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-xl">local_shipping</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Pengiriman Cepat Segar Hari Ini</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                        Dikemas rapi dalam kantong tebal vakum udara agar tetap dingin dan beku sempurna saat tiba di pintu rumah Anda.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Kios Directions Button */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href="https://maps.google.com/?q=Pasar+Kramat+Jati+Jakarta+Timur"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">near_me</span>
                    <span>Petunjuk Lokasi Google Maps</span>
                  </a>
                  <a
                    href="https://wa.me/6281298980252?text=Halo%20Pak%20Mul,%20saya%20mau%20mampir%20ke%20kios%20Pasar%20Kramat%20Jati"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-emerald-600 text-base">chat</span>
                    <span>Hubungi Kios via WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= TESTIMONIALS (STRUCTURED & REAL) ================= */}
        <section className="py-16 sm:py-20 bg-[#faf8f5] border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-[#7a0019] uppercase tracking-wider">
                Ulasan Pelanggan Setia
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight mt-1">
                Kelezatan yang Terbukti dari Generasi ke Generasi
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Review 1 */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="text-amber-500 text-sm mb-3">★★★★★</div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    &ldquo;Sudah 6 tahun langganan mie telor bebek dan bakso urat Pak Mul untuk gerobak mie ayam saya. Mie-nya kenyal tidak mudah putus kalau direbus, pelanggan selalu puji kuahnya mantap gurih kaldu sapi asli.&rdquo;
                  </p>
                </div>
                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#7a0019] text-white font-bold text-xs flex items-center justify-center">
                    MB
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Mas Bambang</p>
                    <p className="text-[11px] text-slate-500">Pemilik Mie Ayam Podomoro, Ciracas</p>
                  </div>
                </div>
              </div>

              {/* Review 2 */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="text-amber-500 text-sm mb-3">★★★★★</div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    &ldquo;Beli bakso halus buat acara arisan dan hajatan keluarga di rumah. Daging sapinya berasa banget, bukan cuma tepung. Pengiriman cepat dan baksonya masih dingin beku segar sampai di dapur.&rdquo;
                  </p>
                </div>
                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#7a0019] text-white font-bold text-xs flex items-center justify-center">
                    SR
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Ibu Siti Rahma</p>
                    <p className="text-[11px] text-slate-500">Ibu Rumah Tangga, Kramat Jati</p>
                  </div>
                </div>
              </div>

              {/* Review 3 */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="text-amber-500 text-sm mb-3">★★★★★</div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    &ldquo;Pesanan grosir untuk katering pabrik selalu aman dan tepat waktu. Kulit pangsitnya garing kalau digoreng, tidak banyak menyerap minyak. Pelayanan cepat dan responsif kalau ada pesanan mendadak.&rdquo;
                  </p>
                </div>
                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#7a0019] text-white font-bold text-xs flex items-center justify-center">
                    HW
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Pak Hendra Wijaya</p>
                    <p className="text-[11px] text-slate-500">Pengelola Katering Berkah Mandiri</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CALL TO ACTION BANNER (CLEAN & PRESTIGIOUS) ================= */}
        <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#51000d] via-[#7a0019] to-[#51000d] p-8 sm:p-14 text-white shadow-xl">
            <div className="relative z-10 max-w-3xl space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-[#ffdad9]">
                Siap Kirim Cepat Se-Jabodetabek
              </p>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                Hadirkan Kelezatan Bakso Sapi Asli di Meja Makan Anda Hari Ini
              </h2>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-xl">
                Nikmati kemudahan pesan online dengan garansi kualitas terbaik. Pesanan dikirim langsung dalam kondisi tersegel higienis dan segar.
              </p>
              <div className="flex flex-wrap items-center gap-3.5 pt-3">
                <Link
                  href="/produk"
                  className="px-6 py-3.5 rounded-xl bg-white text-[#7a0019] hover:bg-slate-100 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">storefront</span>
                  <span>Belanja Menu Lengkap</span>
                </Link>
                <a
                  href="https://wa.me/6281298980252?text=Halo%20Pak%20Mul,%20saya%20mau%20konsultasi%20pesanan%20langsung"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-emerald-400 text-lg">chat</span>
                  <span>Chat WhatsApp Tim Pak Mul</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Cart Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-8 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold border border-slate-700 animate-in fade-in slide-in-from-bottom-3">
          <span className="material-symbols-outlined text-emerald-400 text-base">
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
