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
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-[#7a0019] selection:text-white">
      <Navbar />

      <main className="pt-20 sm:pt-24">
        {/* ================= HERO SECTION ================= */}
        <section className="py-10 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Clear & Impactful */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7a0019]/10 text-[#7a0019] text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#7a0019]" />
                Pasar Kramat Jati, Jakarta Timur • Est. 2000
              </span>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Bahan Baku Bakso &amp; Mie Ayam Segar Pilihan.
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
                Sedia bakso sapi murni kenyal alami, mie telor bebek basah, kulit pangsit lembut, dan bumbu kaldu rempah. Untuk santapan keluarga hingga ratusan warung mitra.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/produk"
                  className="px-6 py-3.5 rounded-xl bg-[#7a0019] hover:bg-[#51000d] text-white font-bold text-sm shadow-sm hover:shadow transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">shopping_bag</span>
                  <span>Belanja Sekarang</span>
                </Link>
                <a
                  href="https://wa.me/6281298980252?text=Halo%20Pak%20Mul,%20saya%20ingin%20tanya%20harga%20dan%20pemesanan%20bahan%20baku"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-sm border border-slate-200 transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-emerald-600 text-lg">chat</span>
                  <span>Tanya via WhatsApp</span>
                </a>
              </div>

              {/* 3 Simple Trust Points */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 max-w-lg">
                <div>
                  <p className="text-sm font-bold text-slate-900">100% Sapi</p>
                  <p className="text-xs text-slate-500">Tanpa bahan kimia</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Segar Tiap Hari</p>
                  <p className="text-xs text-slate-500">Produksi harian</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Kirim Cepat</p>
                  <p className="text-xs text-slate-500">Se-Jabodetabek</p>
                </div>
              </div>
            </div>

            {/* Right Column: Food Showcase */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-100 aspect-[4/3] sm:aspect-square bg-slate-100">
                <img
                  alt="Bakso Pak Mul Kramat Jati"
                  className="w-full h-full object-cover"
                  src="/images/hero-banner.webp"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-sm border border-white/40 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Kios Toko Bakso Pak Mul</p>
                    <p className="text-[11px] text-slate-500">Pasar Kramat Jati, Jakarta Timur</p>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                    Buka 06.00 – 17.00
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CATALOG SECTION ================= */}
        <section className="py-12 md:py-16 bg-slate-50/70 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Menu &amp; Bahan Baku
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  Pilihan produk terbaik untuk masakan rumahan maupun usaha kuliner.
                </p>
              </div>

              {/* Category Filter Chips */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {["Semua", "Bakso", "Mie", "Pangsit", "Bumbu"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      activeCategory === cat
                        ? "bg-[#7a0019] text-white font-semibold shadow-xs"
                        : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {isLoadingProducts ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-slate-200 p-4 h-72 animate-pulse"
                  />
                ))
              ) : filteredDisplayProducts.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-500 text-sm">
                  Tidak ada produk ditemukan.
                </div>
              ) : (
                filteredDisplayProducts.map((product: any) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group"
                  >
                    <Link href={`/produk/${product.id}`} className="block relative aspect-square bg-slate-50 p-4 overflow-hidden">
                      <img
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        src={product.image || "/images/hero-banner.webp"}
                      />
                      <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-slate-200 shadow-xs">
                        {product.category || "Produk"}
                      </span>
                    </Link>

                    <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <Link href={`/produk/${product.id}`} className="block">
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 hover:text-[#7a0019] transition-colors leading-snug">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Kemasan: <span className="font-medium text-slate-700">{product.unit || "Pack"}</span>
                        </p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div>
                          {product.originalPrice && (
                            <p className="text-[10px] text-slate-400 line-through">
                              Rp {product.originalPrice.toLocaleString("id-ID")}
                            </p>
                          )}
                          <p className="text-xs sm:text-sm font-extrabold text-[#7a0019]">
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
                          className={`h-8 sm:h-9 px-3 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                            addedId === product.id
                              ? "bg-emerald-600 text-white"
                              : "bg-[#7a0019] hover:bg-[#51000d] text-white"
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

            <div className="mt-8 text-center">
              <Link
                href="/produk"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-xs transition-colors"
              >
                <span>Lihat Seluruh Katalog Produk</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ================= STORE INFO BANNER ================= */}
        <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <span className="text-[#ffb3b2] text-xs font-bold uppercase tracking-wider">
                Kios Fisik Resmi
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Kunjungi Kios Kami di Pasar Kramat Jati
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
                Bisa pilih dan cicipi grade bakso secara langsung, atau pesan partai besar untuk hajatan dan kebutuhan warung kuliner. Buka setiap hari mulai pukul 06.00 WIB.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#ffb3b2] text-base">location_on</span>
                  Pasar Kramat Jati, Jakarta Timur
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#ffb3b2] text-base">schedule</span>
                  06.00 – 17.00 WIB
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <a
                href="https://maps.google.com/?q=Pasar+Kramat+Jati+Jakarta+Timur"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-base">directions</span>
                <span>Petunjuk Google Maps</span>
              </a>
              <a
                href="https://wa.me/6281298980252?text=Halo%20Pak%20Mul,%20saya%20mau%20mampir%20ke%20kios%20Pasar%20Kramat%20Jati"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-slate-800 text-white hover:bg-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors border border-slate-700"
              >
                <span className="material-symbols-outlined text-emerald-400 text-base">chat</span>
                <span>Hubungi Toko</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Cart Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-8 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-medium border border-slate-800">
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
