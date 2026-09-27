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

  const categories = [
    { name: "Semua", label: "Semua Racikan" },
    { name: "Bakso", label: "Bakso Sapi Pilihan" },
    { name: "Mie", label: "Mie Basah & Telor Bebek" },
    { name: "Pangsit", label: "Kulit Pangsit" },
    { name: "Bumbu", label: "Bumbu Kuah Rempah" },
    { name: "Saos", label: "Kecap & Saus Pilihan" },
  ];

  return (
    <div className="min-h-screen bg-[#faf7f2] text-stone-900 font-sans antialiased selection:bg-[#51000d] selection:text-white">
      <Navbar />

      <main className="pt-20 sm:pt-24">
        {/* ================= HERO SECTION (ARTISANAL EDITORIAL) ================= */}
        <section className="relative py-12 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Literary, Classic, & Prestigious */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Eyebrow Label */}
              <div className="flex items-center gap-3">
                <span className="w-8 h-[1px] bg-[#7a0019]" />
                <p className="text-[11px] font-bold tracking-[0.25em] text-[#7a0019] uppercase font-sans">
                  Kramat Jati, Jakarta Timur • Est. 2000
                </p>
              </div>

              {/* Editorial Headline */}
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-[54px] font-bold tracking-tight text-stone-950 leading-[1.15]">
                Nikmatnya Bakso Sapi Asli &amp;{" "}
                <span className="text-[#51000d]">Kuah Kaldu Gurih</span> Khas Kramat Jati.
              </h1>

              {/* Appetite Subtitle - Modern Sans Tegas */}
              <p className="font-sans text-stone-800 text-base sm:text-lg font-medium leading-relaxed max-w-xl">
                Dibuat segar setiap hari dari 100% daging sapi pilihan dan rempah warisan sejak tahun 2000. Nikmati kehangatan semangkuk bakso otentik di meja makan keluarga, atau pesan pasokan bahan baku segar untuk usaha warung Anda.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <Link
                  href="/produk"
                  className="px-8 py-4 rounded-xl bg-[#51000d] hover:bg-[#7a0019] text-white font-semibold text-sm shadow-md shadow-[#51000d]/20 hover:shadow-lg transition-all flex items-center gap-3 cursor-pointer group"
                >
                  <span>Pesan Menu Favorit</span>
                  <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>

                <a
                  href="https://wa.me/6281298980252?text=Halo%20Pak%20Mul,%20saya%20ingin%20konsultasi%20pesanan%20bahan%20baku%20bakso"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-4 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 font-semibold text-sm shadow-2xs hover:border-stone-400 transition-all flex items-center gap-2.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-emerald-700 text-lg">chat</span>
                  <span>Konsultasi Grosir (WA)</span>
                </a>
              </div>

              {/* Heritage Quote Snippet */}
              <div className="pt-8 border-t border-stone-200/80 flex items-center gap-6">
                <div>
                  <p className="font-serif text-2xl font-bold text-[#51000d]">100%</p>
                  <p className="text-xs text-stone-500 font-medium mt-0.5">Daging Sapi Murni</p>
                </div>
                <div className="w-[1px] h-9 bg-stone-200" />
                <div>
                  <p className="font-serif text-2xl font-bold text-[#51000d]">24+ Thn</p>
                  <p className="text-xs text-stone-500 font-medium mt-0.5">Tradisi &amp; Mutu Rasa</p>
                </div>
                <div className="w-[1px] h-9 bg-stone-200" />
                <div>
                  <p className="font-serif text-2xl font-bold text-[#51000d]">500+</p>
                  <p className="text-xs text-stone-500 font-medium mt-0.5">Warung &amp; Mitra Kuliner</p>
                </div>
              </div>
            </div>

            {/* Right Column: Warm Artisanal Culinary Centerpiece */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-stone-900 group aspect-[4/5] sm:aspect-square">
                <img
                  alt="Sajian Bakso Pak Mul Komplit dengan Kaldu Hangat"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="/images/hero-banner.webp"
                />

                {/* Subtle Editorial Caption Overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/90 via-stone-950/50 to-transparent p-6 text-white flex items-end justify-between">
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-amber-200">
                      Sajian Klasik
                    </p>
                    <p className="font-serif text-lg font-bold text-white mt-0.5">
                      Bakso Urat &amp; Halus Pak Mul
                    </p>
                    <p className="text-xs text-stone-300 mt-1">
                      Kios Pasar Kramat Jati • Buka 06.00 – 17.00 WIB
                    </p>
                  </div>
                  <span className="text-xs font-bold text-white bg-[#7a0019] px-3.5 py-1.5 rounded-lg shrink-0">
                    Fresh Daily
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= QUALITY PILLARS (CLEAN & AIRY) ================= */}
        <section className="py-14 bg-white/70 border-y border-stone-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              <div className="space-y-2">
                <p className="font-serif text-2xl text-[#51000d] font-bold">01</p>
                <h3 className="text-base font-bold text-stone-900">Daging Sapi Segar Subuh Hari</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                  Dipilih langsung dari pemotongan halal pasar induk setiap pagi, menjaga serat alami dan aroma manis gurih asli daging sapi tanpa boraks.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-serif text-2xl text-[#51000d] font-bold">02</p>
                <h3 className="text-base font-bold text-stone-900">Kuah Kaldu Rempah Otentik</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                  Sari rebusan tulang sumsum sapi berpadu racikan bawang putih goreng dan rempah istimewa, menghasilkan aroma kaldu yang harum pekat.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-serif text-2xl text-[#51000d] font-bold">03</p>
                <h3 className="text-base font-bold text-stone-900">Kemasan Dingin &amp; Kirim Cepat</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                  Disegel rapi dalam kemasan vakum udara untuk menjaga kebersihan dan kesegaran maksimal saat diantar langsung ke dapur Anda.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CATALOG SECTION (APPETIZING & SPACIOUS) ================= */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-stone-200">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#7a0019] uppercase mb-1.5">
                <span className="w-6 h-[1px] bg-[#7a0019]" />
                <span>Koleksi Pilihan</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-stone-950 tracking-tight">
                Racikan Paling Diminati
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm mt-2 max-w-lg">
                Pilihan favorit santapan rumahan dan resep rahasia ratusan mitra warung bakso &amp; mie ayam.
              </p>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeCategory === cat.name
                      ? "bg-[#51000d] text-white shadow-xs"
                      : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-7">
            {isLoadingProducts ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl h-80 animate-pulse shadow-xs border border-stone-100"
                />
              ))
            ) : filteredDisplayProducts.length === 0 ? (
              <div className="col-span-full py-16 text-center text-stone-500 text-sm bg-white rounded-2xl border border-stone-200">
                <span className="material-symbols-outlined text-4xl text-stone-400 mb-2 block">
                  soup_kitchen
                </span>
                Belum ada produk untuk kategori ini.
              </div>
            ) : (
              filteredDisplayProducts.map((product: any) => (
                <div
                  key={product.id}
                  className="artisanal-card group overflow-hidden flex flex-col justify-between"
                >
                  {/* Image Presentation */}
                  <Link
                    href={`/produk/${product.id}`}
                    className="block relative aspect-square bg-[#f5f0e8] p-6 overflow-hidden"
                  >
                    <img
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-106 transition-transform duration-500"
                      src={product.image || "/images/hero-banner.webp"}
                    />
                    <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#51000d] text-[10px] font-bold px-2.5 py-1 rounded-md shadow-2xs tracking-wide">
                      {product.category || "Bakso"}
                    </span>
                  </Link>

                  {/* Content & Details */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Rating */}
                      <div className="flex items-center gap-1 text-amber-600 text-xs mb-1.5">
                        <span>★★★★★</span>
                        <span className="text-[10px] text-stone-400 font-medium">(4.9)</span>
                      </div>

                      <Link href={`/produk/${product.id}`} className="block">
                        <h3 className="font-serif text-sm sm:text-base font-bold text-stone-900 leading-snug line-clamp-2 group-hover:text-[#51000d] transition-colors">
                          {product.name}
                        </h3>
                      </Link>

                      <p className="text-[11px] text-stone-500 mt-1">
                        Kemasan: <span className="font-semibold text-stone-700">{product.unit || "Pack"}</span>
                      </p>
                    </div>

                    {/* Price and Action */}
                    <div className="pt-3.5 mt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                      <div>
                        {product.originalPrice && (
                          <p className="text-[10px] text-stone-400 line-through">
                            Rp {product.originalPrice.toLocaleString("id-ID")}
                          </p>
                        )}
                        <p className="font-serif text-base sm:text-lg font-bold text-[#51000d]">
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
                        className={`h-9 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-2xs ${
                          addedId === product.id
                            ? "bg-emerald-700 text-white"
                            : "bg-[#51000d] hover:bg-[#7a0019] text-white"
                        }`}
                        title="Tambah ke Keranjang"
                      >
                        <span className="material-symbols-outlined text-sm">
                          {addedId === product.id ? "check" : "add"}
                        </span>
                        <span>{addedId === product.id ? "Masuk" : "Beli"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/produk"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 font-semibold text-xs transition-colors shadow-2xs"
            >
              <span>Jelajahi Seluruh Koleksi Produk</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </section>

        {/* ================= THE AUTHENTIC STORY SECTION (EDITORIAL SPREAD) ================= */}
        <section className="py-16 sm:py-24 bg-white border-t border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Portrait of Pak Mul at the Kiosk */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-stone-900 group">
                  <img
                    alt="Pak Mul di Kios Tradisional Pasar Kramat Jati"
                    className="w-full h-[400px] sm:h-[480px] object-cover transition-transform duration-700 group-hover:scale-105"
                    src="/images/toko-pak-mul-kramat-jati.webp"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">
                      Dokumentasi Kios Asli
                    </span>
                    <p className="font-serif text-lg font-bold mt-1">
                      Pak Mul di Kios Pasar Kramat Jati
                    </p>
                    <p className="text-xs text-stone-300 mt-0.5">
                      Melayani pelanggan sejak subuh hari tanpa henti
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Narrative & Dedication */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-[1px] bg-[#7a0019]" />
                  <p className="text-[11px] font-bold tracking-[0.25em] text-[#7a0019] uppercase font-sans">
                    Kisah &amp; Filosofi Rasa
                  </p>
                </div>

                <blockquote className="font-serif italic text-2xl sm:text-3xl text-stone-900 leading-snug">
                  &ldquo;Bagi kami, membuat bakso bukan sekadar menggiling daging, melainkan menjaga amanah rasa yang sudah dipercaya keluarga dan ratusan warung sejak generasi pertama.&rdquo;
                </blockquote>

                <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                  Bermula dari kios kayu sederhana di lantai dasar Pasar Kramat Jati Jakarta Timur, Pak Mul mengawali hari setiap pukul 04.30 subuh untuk memilih potongan daging sapi terbaik dari pemotongan lokal. Tanpa pengenyal kimiawi, tanpa rekayasa buatan. Hanya daging sapi murni, takaran bumbu rempah yang pas, dan dedikasi menjaga konsistensi rasa selama lebih dari 24 tahun.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <a
                    href="https://maps.google.com/?q=Pasar+Kramat+Jati+Jakarta+Timur"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">near_me</span>
                    <span>Petunjuk Arah Kios Pasar Kramat Jati</span>
                  </a>
                  <a
                    href="https://wa.me/6281298980252?text=Halo%20Pak%20Mul,%20saya%20ingin%20berkunjung%20ke%20kios%20langsung"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-semibold text-xs flex items-center gap-2 transition-colors"
                  >
                    <span className="material-symbols-outlined text-emerald-700 text-base">chat</span>
                    <span>Hubungi Kios via WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= TESTIMONIALS (EDITORIAL WARMTH) ================= */}
        <section className="py-16 sm:py-24 bg-[#faf7f2] border-t border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-14">
              <p className="text-xs font-bold tracking-[0.2em] text-[#7a0019] uppercase mb-1">
                Ulasan Pelanggan Setia
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-950 tracking-tight">
                Dipercaya Turun Temurun
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-white p-7 rounded-2xl shadow-xs border border-stone-200/80 flex flex-col justify-between">
                <div>
                  <div className="text-amber-600 text-sm mb-3">★★★★★</div>
                  <p className="font-serif text-sm sm:text-base text-stone-800 leading-relaxed italic">
                    &ldquo;Sudah 6 tahun langganan mie telor bebek dan bakso urat Pak Mul untuk gerobak mie ayam saya. Mie-nya kenyal tidak mudah hancur saat direbus, pelanggan selalu puji kuahnya mantap.&rdquo;
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-stone-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#51000d] text-amber-200 font-serif font-bold text-xs flex items-center justify-center">
                    MB
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-900">Mas Bambang</p>
                    <p className="text-[11px] text-stone-500">Mie Ayam Podomoro, Ciracas</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white p-7 rounded-2xl shadow-xs border border-stone-200/80 flex flex-col justify-between">
                <div>
                  <div className="text-amber-600 text-sm mb-3">★★★★★</div>
                  <p className="font-serif text-sm sm:text-base text-stone-800 leading-relaxed italic">
                    &ldquo;Beli bakso halus buat acara arisan dan hajatan keluarga di rumah. Daging sapinya berasa sekali, bukan cuma tepung. Pengiriman tepat waktu dan baksonya masih dingin beku segar.&rdquo;
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-stone-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#51000d] text-amber-200 font-serif font-bold text-xs flex items-center justify-center">
                    SR
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-900">Ibu Siti Rahma</p>
                    <p className="text-[11px] text-stone-500">Ibu Rumah Tangga, Kramat Jati</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-white p-7 rounded-2xl shadow-xs border border-stone-200/80 flex flex-col justify-between">
                <div>
                  <div className="text-amber-600 text-sm mb-3">★★★★★</div>
                  <p className="font-serif text-sm sm:text-base text-stone-800 leading-relaxed italic">
                    &ldquo;Pesanan grosir untuk katering pabrik selalu aman. Kulit pangsitnya renyah kalau digoreng, tidak banyak menyerap minyak. Pelayanan cepat dan responsif saat ada pesanan dadakan.&rdquo;
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-stone-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#51000d] text-amber-200 font-serif font-bold text-xs flex items-center justify-center">
                    HW
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-900">Pak Hendra Wijaya</p>
                    <p className="text-[11px] text-stone-500">Katering Berkah Mandiri, Pulogadung</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= INVITATION BANNER (RICH WINE & GOLD) ================= */}
        <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#3a0009] via-[#51000d] to-[#3a0009] p-8 sm:p-14 text-white shadow-2xl">
            <div className="relative z-10 max-w-2xl space-y-4">
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-300">
                Pesan Mudah Dari Rumah
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
                Hadirkan Kelezatan Bakso Sapi Asli di Meja Makan Anda Hari Ini
              </h2>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                Nikmati kemudahan belanja online dengan garansi kualitas terbaik. Pesanan dikirim langsung dalam kondisi tersegel higienis dan segar.
              </p>
              <div className="flex flex-wrap items-center gap-3.5 pt-3">
                <Link
                  href="/produk"
                  className="px-7 py-3.5 rounded-xl bg-white text-[#51000d] hover:bg-stone-100 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">storefront</span>
                  <span>Jelajahi Menu Lengkap</span>
                </Link>
                <a
                  href="https://wa.me/6281298980252?text=Halo%20Pak%20Mul,%20saya%20ingin%20tanya%20pesanan%20langsung"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-emerald-400 text-lg">chat</span>
                  <span>WhatsApp Layanan Pelanggan</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Cart Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-8 right-6 z-50 bg-[#1c1917] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold border border-stone-700 animate-in fade-in slide-in-from-bottom-3">
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
