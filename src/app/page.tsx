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

  return (
    <div className="antialiased min-h-screen bg-[#faf8f5] text-stone-900 font-sans selection:bg-[#540b13] selection:text-white">
      <Navbar />

      <main className="pt-26 sm:pt-28">
        {/* ================= HERO SECTION ================= */}
        <section className="relative overflow-hidden border-b border-stone-200/80 bg-gradient-to-b from-stone-100/60 via-stone-50/40 to-[#faf8f5] py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left Column: Authentic Copy */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span>Kios Pusat Pasar Kramat Jati, Jakarta Timur</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#18181b] tracking-tight leading-[1.15]">
                  Pusat Bahan Baku{" "}
                  <span className="text-[#540b13] underline decoration-amber-400 decoration-4 underline-offset-4">
                    Bakso &amp; Mie Ayam
                  </span>{" "}
                  Pilihan Sejak 2000.
                </h1>

                <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
                  Sedia bakso sapi asli dengan tekstur kenyal alami, mie telor bebek basah, kulit pangsit lembut, bumbu kuah kaldu sapi, hingga saus rempah autentik. Melayani kebutuhan dapur keluarga, hajatan, hingga ratusan warung mitra di Jabodetabek.
                </p>

                {/* Key Selling Highlights */}
                <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
                  <div className="p-3 bg-white rounded-xl border border-stone-200/80 shadow-xs">
                    <p className="text-[#540b13] font-extrabold text-base">100% Sapi</p>
                    <p className="text-[11px] text-stone-500 font-medium">Bebas Boraks/Kimia</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-stone-200/80 shadow-xs">
                    <p className="text-[#540b13] font-extrabold text-base">500+ Mitra</p>
                    <p className="text-[11px] text-stone-500 font-medium">Warung &amp; Katering</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-stone-200/80 shadow-xs">
                    <p className="text-[#540b13] font-extrabold text-base">Fresh Daily</p>
                    <p className="text-[11px] text-stone-500 font-medium">Kirim Cepat Hari Ini</p>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/produk"
                    className="px-6 py-3.5 rounded-xl bg-[#540b13] hover:bg-[#720f1a] text-white font-bold text-sm shadow-sm transition-all hover:shadow-md cursor-pointer flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">storefront</span>
                    <span>Lihat Daftar Produk</span>
                  </Link>
                  <a
                    href="https://wa.me/6281298980252?text=Halo%20Pak%20Mul,%20saya%20ingin%20tanya%20harga%20grosir%20dan%20pemesanan%20bahan%20baku"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 font-bold text-sm transition-all shadow-xs flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-emerald-600 text-lg">chat</span>
                    <span>Konsultasi Grosir (WA)</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Authentic Image Showcase */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden border border-stone-300 shadow-lg bg-white">
                  <img
                    alt="Etalase Bahan Baku Bakso Pak Mul Kramat Jati"
                    className="w-full h-[380px] sm:h-[420px] object-cover"
                    src="/images/hero-banner.webp"
                  />
                  {/* Overlay Store Badge */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-stone-200/80 shadow-md flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-stone-900">
                        Kios Toko Bakso Pak Mul
                      </p>
                      <p className="text-[11px] text-stone-500">
                        Pasar Kramat Jati, Jakarta Timur
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                      ✓ Halal &amp; Higienis
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= VALUE PROPOSITIONS ================= */}
        <section className="py-12 bg-white border-b border-stone-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 rounded-2xl bg-stone-50/70 border border-stone-200/70">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#540b13] flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-xl">savings</span>
                </div>
                <h3 className="text-sm font-bold text-stone-900 mb-1">
                  Harga Tangan Pertama
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Langsung dari kios pusat pasar grosir, modal lebih hemat &amp; margin jualan lebih untung.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-stone-50/70 border border-stone-200/70">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#540b13] flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-xl">award_star</span>
                </div>
                <h3 className="text-sm font-bold text-stone-900 mb-1">
                  Kekenyalan Konsisten
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Daging sapi segar olahan mesin presisi menghasilkan tekstur garing dan rasa kaldu gurih.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-stone-50/70 border border-stone-200/70">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#540b13] flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-xl">local_shipping</span>
                </div>
                <h3 className="text-sm font-bold text-stone-900 mb-1">
                  Pengiriman Dingin &amp; Cepat
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Kemasan vacuum tebal dan es batu menjaga mutu kesegaran produk sampai di dapur Anda.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-stone-50/70 border border-stone-200/70">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#540b13] flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-xl">verified</span>
                </div>
                <h3 className="text-sm font-bold text-stone-900 mb-1">
                  100% Halal Terjamin
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Bahan baku tersertifikasi halal MUI &amp; diproses higienis sesuai standar keamanan pangan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= POPULAR PRODUCTS SHOWCASE ================= */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#540b13] uppercase tracking-wider mb-1">
                <span className="material-symbols-outlined text-sm">local_fire_department</span>
                <span>Paling Diminati</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Pilihan Bahan Baku Terlaris
              </h2>
              <p className="text-stone-500 text-xs sm:text-sm mt-1">
                Koleksi favorit pemilik warung bakso dan mie ayam langganan se-Jakarta.
              </p>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-2">
              {["Semua", "Bakso", "Mie", "Pangsit", "Bumbu"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeCategory === cat
                      ? "bg-[#540b13] text-white shadow-xs"
                      : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
              <Link
                href="/produk"
                className="text-xs font-bold text-[#540b13] hover:underline px-2 py-1 flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoadingProducts ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-stone-200 p-4 h-80 animate-pulse"
                />
              ))
            ) : filteredDisplayProducts.length === 0 ? (
              <div className="col-span-full py-12 text-center text-stone-500 text-sm">
                Belum ada produk untuk kategori ini.
              </div>
            ) : (
              filteredDisplayProducts.map((product: any) => (
                <div
                  key={product.id}
                  className="product-card bg-white rounded-2xl border border-stone-200/90 overflow-hidden flex flex-col justify-between"
                >
                  <Link href={`/produk/${product.id}`} className="block">
                    <div className="relative aspect-square bg-stone-50 p-4 flex items-center justify-center overflow-hidden">
                      <img
                        alt={product.name}
                        className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                        src={product.image || "/images/hero-banner.webp"}
                      />
                      <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#540b13] text-[10px] font-bold px-2 py-0.5 rounded-md border border-stone-200/80 shadow-xs">
                        {product.category || "Bakso"}
                      </span>
                    </div>
                  </Link>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <Link href={`/produk/${product.id}`} className="block">
                        <h3 className="text-xs sm:text-sm font-bold text-stone-900 leading-snug line-clamp-2 hover:text-[#540b13] transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-[11px] text-stone-400 mt-1">
                        Kemasan: <span className="text-stone-600 font-medium">{product.unit || "Pack"}</span>
                      </p>
                    </div>

                    <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-between">
                      <div>
                        {product.originalPrice && (
                          <p className="text-[10px] text-stone-400 line-through">
                            Rp {product.originalPrice.toLocaleString("id-ID")}
                          </p>
                        )}
                        <p className="text-sm sm:text-base font-extrabold text-[#540b13]">
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
                        className={`h-9 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                          addedId === product.id
                            ? "bg-emerald-600 text-white"
                            : "bg-[#540b13] text-white hover:bg-[#720f1a]"
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
        </section>

        {/* ================= KIOS FISIK KRAMAT JATI SECTION ================= */}
        <section className="py-16 bg-white border-t border-stone-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Interactive Map & Kios Photo */}
              <div className="lg:col-span-6 space-y-4">
                <div className="rounded-2xl overflow-hidden border border-stone-300 shadow-md bg-stone-100 h-[340px] relative">
                  <iframe
                    title="Peta Lokasi Toko Bakso Pak Mul Kramat Jati"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=106.8600%2C-6.2680%2C106.8750%2C-6.2580&amp;layer=mapnik&amp;marker=-6.2628%2C106.8672"
                    className="w-full h-full border-0"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm text-xs font-bold text-[#540b13] flex items-center gap-2 border border-stone-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    Kios Pasar Kramat Jati
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                    <p className="font-bold text-stone-900">Jam Operasional</p>
                    <p className="text-stone-500 mt-0.5">Senin – Minggu: 06.00 – 17.00 WIB</p>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                    <p className="font-bold text-stone-900">Parkir &amp; Akses</p>
                    <p className="text-stone-500 mt-0.5">Mobil &amp; Motor Langsung Pasar Kramat Jati</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Grounded Warisan Copy */}
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold uppercase tracking-wider">
                  Kunjungi Kios Langsung
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-snug">
                  Beli Eceran Maupun Partai Besar Langsung di Pasar Kramat Jati
                </h2>

                <p className="text-stone-600 text-sm leading-relaxed">
                  Ingin melihat langsung kualitas butiran bakso, mencium harum kaldu rempah, atau mencoba mie telor kenyal kami? Anda dipersilakan berkunjung langsung ke kios kami setiap hari. Tim kami siap merekomendasikan takaran dan bahan terbaik sesuai modal dan target pasar warung Anda.
                </p>

                <div className="space-y-3 pt-1">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#540b13] text-white flex items-center justify-center shrink-0 text-xs font-bold">
                      1
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-900">Bisa Cicip &amp; Pilih Grade Bakso</p>
                      <p className="text-[11px] text-stone-500">Tersedia bakso urat super, halus premium, hingga bakso kerikil hemat untuk jualan.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#540b13] text-white flex items-center justify-center shrink-0 text-xs font-bold">
                      2
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-900">Harga Khusus Mitra Jangka Panjang</p>
                      <p className="text-[11px] text-stone-500">Dapatkan skema pasokan teratur harian dengan potongan harga grosir terbaik.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <a
                    href="https://maps.google.com/?q=Pasar+Kramat+Jati+Jakarta+Timur"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">near_me</span>
                    <span>Buka Petunjuk Arah</span>
                  </a>
                  <a
                    href="https://wa.me/6281298980252?text=Halo%20Pak%20Mul,%20saya%20mau%20mampir%20ke%20kios%20Pasar%20Kramat%20Jati"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <span>Hubungi Kios</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CARA PEMESANAN PRAKTIS ================= */}
        <section className="py-14 bg-stone-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-10">
              <h2 className="text-2xl font-bold tracking-tight">4 Langkah Belanja Praktis</h2>
              <p className="text-stone-400 text-xs mt-1">
                Pesan online dari rumah, pesanan bahan baku sampai siap olah di hari yang sama.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 bg-stone-800/80 rounded-2xl border border-stone-700/60">
                <span className="text-amber-400 font-extrabold text-sm font-mono">01</span>
                <h3 className="text-sm font-bold text-white mt-2">Pilih Bahan Baku</h3>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                  Pilih varian bakso, mie segar, pangsit, atau saus botol sesuai kebutuhan.
                </p>
              </div>

              <div className="p-5 bg-stone-800/80 rounded-2xl border border-stone-700/60">
                <span className="text-amber-400 font-extrabold text-sm font-mono">02</span>
                <h3 className="text-sm font-bold text-white mt-2">Atur Jumlah &amp; Alamat</h3>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                  Masukkan alamat kirim di Jabodetabek dan tentukan jadwal penerimaan.
                </p>
              </div>

              <div className="p-5 bg-stone-800/80 rounded-2xl border border-stone-700/60">
                <span className="text-amber-400 font-extrabold text-sm font-mono">03</span>
                <h3 className="text-sm font-bold text-white mt-2">Bayar Instan QRIS / Transfer</h3>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                  Sistem pembayaran aman dengan verifikasi otomatis tanpa repot kirim bukti manual.
                </p>
              </div>

              <div className="p-5 bg-stone-800/80 rounded-2xl border border-stone-700/60">
                <span className="text-amber-400 font-extrabold text-sm font-mono">04</span>
                <h3 className="text-sm font-bold text-white mt-2">Dikirim Dingin &amp; Segar</h3>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                  Kurir instan mengantar paket tersegel rapat untuk menjaga higienitas daging.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= REAL TESTIMONIALS ================= */}
        <section className="py-16 bg-[#faf8f5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-bold text-[#540b13] uppercase tracking-wider">
                Ulasan Nyata Pelanggan
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
                Dipercaya Sejak Generasi Pertama
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex text-amber-500 text-xs">★★★★★</div>
                  <p className="text-xs text-stone-600 leading-relaxed italic">
                    &ldquo;Sudah 6 tahun berlangganan mie telor bebek dan bakso urat Pak Mul untuk gerobak mie ayam saya. Mie-nya kenyal tidak mudah putus kalau direbus, pelanggan selalu puji kuahnya mantap.&rdquo;
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#540b13] text-amber-300 font-bold text-xs flex items-center justify-center">
                    MB
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-900">Mas Bambang</p>
                    <p className="text-[11px] text-stone-500">Pemilik Mie Ayam Podomoro, Ciracas</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex text-amber-500 text-xs">★★★★★</div>
                  <p className="text-xs text-stone-600 leading-relaxed italic">
                    &ldquo;Beli bakso halus buat acara arisan dan hajatan keluarga di rumah. Daging sapinya berasa banget, bukan cuma tepung. Pengiriman tepat waktu dan baksonya masih dingin beku segar.&rdquo;
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#540b13] text-amber-300 font-bold text-xs flex items-center justify-center">
                    IS
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-900">Ibu Siti Rahma</p>
                    <p className="text-[11px] text-stone-500">Ibu Rumah Tangga, Kramat Jati</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex text-amber-500 text-xs">★★★★★</div>
                  <p className="text-xs text-stone-600 leading-relaxed italic">
                    &ldquo;Pesanan grosir untuk katering pabrik selalu aman. Kulit pangsitnya garing kalau digoreng, tidak banyak menyerap minyak. Pelayanan cepat dan responsif kalau ada pesanan mendadak.&rdquo;
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#540b13] text-amber-300 font-bold text-xs flex items-center justify-center">
                    KW
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-900">Pak Hendra Wijaya</p>
                    <p className="text-[11px] text-stone-500">Pengelola Katering Berkah Mandiri</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Cart Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-8 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-medium border border-stone-700 animate-in fade-in slide-in-from-bottom-2">
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
