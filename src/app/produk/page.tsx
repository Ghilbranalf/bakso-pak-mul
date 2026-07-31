"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/CartSidebar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

function ProductsContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { openCart, totalItems, addToCart } = useCart();

  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const filteredProducts = products.filter(p => {
    // Check Search Query from URL
    if (queryParam && !p.name.toLowerCase().includes(queryParam.toLowerCase()) && !p.category.toLowerCase().includes(queryParam.toLowerCase())) {
      return false;
    }

    if (selectedCategory === "Semua") return true;
    
    const cat = selectedCategory.toLowerCase();
    
    if (cat === "kecap") return p.name.toLowerCase().includes("kecap");
    if (cat === "saos") return p.name.toLowerCase().includes("saos");
    if (cat === "pangsit") return p.name.toLowerCase().includes("pangsit");
    return p.category.toLowerCase().includes(cat) || p.name.toLowerCase().includes(cat);
  });

  const getPriority = (p: any) => {
    const cat = (p.category || "").toLowerCase();
    const name = (p.name || "").toLowerCase();

    // Any Bumbu, Saos, Kecap, or Lada goes to the very bottom (Priority 99)
    if (cat.includes("bumbu") || cat.includes("saos") || cat.includes("kecap") || 
        name.includes("bumbu") || name.includes("saos") || name.includes("kecap") || name.includes("lada")) {
      return 99;
    }

    // Pure Bakso items first (Priority 1)
    if (cat.includes("bakso") || name.includes("bakso")) return 1;
    // Mie / Bakmie items second (Priority 2)
    if (cat.includes("mie") || name.includes("mie") || name.includes("bakmie")) return 2;
    // Pangsit items third (Priority 3)
    if (cat.includes("pangsit") || name.includes("pangsit")) return 3;

    return 10;
  };

  const sortedProducts = [...filteredProducts].sort((a, b) => getPriority(a) - getPriority(b));

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;
  const paginatedProducts = sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="antialiased min-h-screen flex flex-col pt-20">
      <Navbar />

      {/* Main Experience Area */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 lg:px-12 py-12">
        {/* Hero Header & Global Filter Bar */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-extrabold text-text-primary tracking-tight mb-3">
                Koleksi Produk Pilihan
              </h1>
              <p className="text-text-muted text-lg font-light leading-relaxed">
                Menghadirkan standar mutu <span className="text-primary font-medium italic">Premium Quality</span> untuk kebutuhan rumah tangga maupun mitra kuliner profesional.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <select className="appearance-none bg-white border border-gray-100 rounded-xl px-5 py-3 pr-12 text-xs font-semibold text-text-primary focus:border-primary focus:ring-0 cursor-pointer shadow-sm">
                  <option>Urutkan: Rekomendasi</option>
                  <option>Harga: Terendah ke Tinggi</option>
                  <option>Harga: Tertinggi ke Rendah</option>
                  <option>Terbaru</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm">
                  expand_more
                </span>
              </div>
            </div>
          </div>
          {/* Horizontal Minimalist Filters */}
          <p className="text-xs text-text-muted mt-8 font-medium">
            Temukan berbagai kebutuhan bakso autentik mulai dari bahan utama hingga perlengkapan penyajian.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-10 border-t border-gray-100 pt-8">
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted mr-4">Kategori:</span>
            {["Semua", "Bakso", "Mie", "Pangsit", "Bumbu", "Kecap", "Saos"].map(cat => (
              <button 
                key={cat}
                onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                className={`px-5 py-2 rounded-full text-xs font-semibold shadow-md transition-all ${selectedCategory === cat ? 'bg-primary text-white shadow-primary/10' : 'bg-white border border-gray-100 text-text-muted filter-chip hover:bg-gray-50'}`}
              >
                {cat}
              </button>
            ))}
            <div className="h-6 w-px bg-gray-200 mx-2"></div>
            <button
              className="flex items-center gap-2 text-xs font-bold text-primary hover:opacity-80"
              onClick={() => setIsFilterModalOpen(true)}
            >
              <span className="material-symbols-outlined text-[18px]">tune</span> Filter Lanjut
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {isLoading ? (
            <div className="col-span-full py-20 text-center text-text-muted font-medium w-full flex justify-center items-center gap-3">
              <span className="material-symbols-outlined animate-spin text-primary">refresh</span> Memuat produk...
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="col-span-full py-20 text-center text-text-muted font-medium w-full">
              Tidak ada produk yang ditemukan.
            </div>
          ) : (
            paginatedProducts.map((product, idx) => (
            <div key={`${product.id}-${idx}`} className={`product-card group rounded-2xl overflow-hidden flex flex-col relative ${product.isSpecial ? 'bg-primary text-white' : 'bg-white border border-gray-100'}`}>
              {product.isSpecial && <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark opacity-95 pointer-events-none"></div>}
              <div className={`relative aspect-square flex items-center justify-center p-8 z-10 pointer-events-none ${!product.isSpecial ? 'bg-[#fcfcfc]' : ''}`}>
                <img
                  alt={product.name}
                  className={`object-contain w-full h-full transition-transform duration-700 ${product.isSpecial ? 'drop-shadow-2xl group-hover:scale-110' : 'group-hover:scale-105'}`}
                  src={product.image}
                />
                <div className="absolute top-4 left-4">
                  {product.isSpecial ? (
                    <span className="bg-white/20 backdrop-blur px-2.5 py-1 rounded-full text-[9px] font-black text-white shadow-sm border border-white/20 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[10px] fill-1">local_fire_department</span> Terlaris
                    </span>
                  ) : (
                    <span className="bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[9px] font-bold text-primary shadow-sm border border-gray-100 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[10px] fill-1">star</span> {product.rating}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow z-10 relative">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${product.isSpecial ? 'text-red-200' : 'text-secondary'}`}>{product.category}</span>
                  <span className={`text-[9px] font-bold ${product.isSpecial ? 'text-white/70' : 'text-green-600'} flex items-center gap-1`}>
                    {!product.isSpecial && product.stock === "Ready Stock" && <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>}
                    {product.stock}
                  </span>
                </div>
                <h3 className={`text-sm font-semibold leading-snug mb-4 ${product.isSpecial ? '' : 'text-text-primary'}`}>{product.name}</h3>
                <div className="mt-auto flex items-end justify-between">
                  <div>
                    {product.price > 100000 && <p className={`text-[10px] line-through mb-0.5 ${product.isSpecial ? 'text-white/50' : 'text-text-muted'}`}>Rp {formatPrice(product.price + 40000)}</p>}
                    <p className={`text-lg font-bold ${product.isSpecial ? '' : 'text-primary'}`}>Rp {formatPrice(product.price)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        unit: product.unit
                      });
                      setAddedId(product.id);
                      setToastMessage(product.name);
                      setTimeout(() => setAddedId(null), 1500);
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className={`cursor-pointer relative z-30 px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-md hover:scale-105 active:scale-95 transition-all uppercase tracking-wider ${addedId === product.id ? 'bg-green-600 text-white' : product.isSpecial ? 'bg-white text-[#51000d] hover:bg-gray-100' : 'bg-[#51000d] text-white hover:bg-[#7a0019]'}`}
                  >
                    {addedId === product.id ? '✓ Berhasil!' : '+ Tambah'}
                  </button>
                </div>
              </div>
            </div>
            ))
          )}
        </div>

        {/* Elegant Pagination */}
        {totalPages > 1 && (
          <div className="mt-20 flex justify-center items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 text-text-muted hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text-muted cursor-pointer"
            >
              <i className="fas fa-chevron-left text-xs"></i>
            </button>
            
            {Array.from({ length: totalPages }).map((_, idx) => {
              const page = idx + 1;
              return (
                <button 
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all font-bold text-xs cursor-pointer ${currentPage === page ? "bg-primary text-white shadow-md" : "border border-gray-100 text-text-muted hover:border-primary hover:text-primary"}`}
                >
                  {page}
                </button>
              );
            })}

            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 text-text-muted hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text-muted cursor-pointer"
            >
              <i className="fas fa-chevron-right text-xs"></i>
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Advanced Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6" id="filter-modal">
          <div
            className="absolute inset-0 bg-[#121212]/60 backdrop-blur-sm"
            onClick={() => setIsFilterModalOpen(false)}
          ></div>

          {/* Modal Container */}
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-text-primary tracking-tight">Filter Lanjutan</h2>
              <button
                className="text-text-muted hover:text-primary transition-colors"
                onClick={() => setIsFilterModalOpen(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh]">
              {/* Categories */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4">Kategori</h3>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input className="w-5 h-5 rounded border-gray-200 text-primary focus:ring-primary cursor-pointer" type="checkbox" />
                    <span className="text-sm text-text-primary group-hover:text-primary transition-colors">Bakso</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input className="w-5 h-5 rounded border-gray-200 text-primary focus:ring-primary cursor-pointer" type="checkbox" />
                    <span className="text-sm text-text-primary group-hover:text-primary transition-colors">Mie</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input className="w-5 h-5 rounded border-gray-200 text-primary focus:ring-primary cursor-pointer" type="checkbox" />
                    <span className="text-sm text-text-primary group-hover:text-primary transition-colors">Bihun</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input className="w-5 h-5 rounded border-gray-200 text-primary focus:ring-primary cursor-pointer" type="checkbox" />
                    <span className="text-sm text-text-primary group-hover:text-primary transition-colors">Sohun</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input className="w-5 h-5 rounded border-gray-200 text-primary focus:ring-primary cursor-pointer" type="checkbox" />
                    <span className="text-sm text-text-primary group-hover:text-primary transition-colors">Bumbu Bakso</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input className="w-5 h-5 rounded border-gray-200 text-primary focus:ring-primary cursor-pointer" type="checkbox" />
                    <span className="text-sm text-text-primary group-hover:text-primary transition-colors">Pelengkap</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input className="w-5 h-5 rounded border-gray-200 text-primary focus:ring-primary cursor-pointer" type="checkbox" />
                    <span className="text-sm text-text-primary group-hover:text-primary transition-colors">Peralatan</span>
                  </label>
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4">Rentang Harga</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-grow">
                      <label className="text-[10px] font-bold text-text-muted uppercase mb-1 block">Min</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">Rp</span>
                        <input className="w-full pl-9 pr-3 py-2 bg-surface-container-low border-transparent rounded-lg text-sm focus:bg-white focus:border-primary focus:ring-0" type="number" defaultValue="0" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <label className="text-[10px] font-bold text-text-muted uppercase mb-1 block">Max</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">Rp</span>
                        <input className="w-full pl-9 pr-3 py-2 bg-surface-container-low border-transparent rounded-lg text-sm focus:bg-white focus:border-primary focus:ring-0" type="number" defaultValue="500000" />
                      </div>
                    </div>
                  </div>
                  <div className="relative h-1.5 bg-gray-100 rounded-full">
                    <div className="absolute left-0 right-0 h-full bg-primary/20 rounded-full"></div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow-md cursor-pointer"></div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow-md cursor-pointer"></div>
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4">Ketersediaan</h3>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-sm text-text-primary">Stok Tersedia</span>
                    <input className="w-5 h-5 rounded border-gray-200 text-primary focus:ring-primary cursor-pointer" type="checkbox" />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-sm text-text-primary">Pre-order</span>
                    <input className="w-5 h-5 rounded border-gray-200 text-primary focus:ring-primary cursor-pointer" type="checkbox" />
                  </label>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <button className="text-xs font-bold text-text-muted hover:text-primary transition-colors uppercase tracking-widest">Hapus Semua</button>
              <button
                className="bg-primary text-white px-8 py-3 rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all uppercase tracking-widest"
                onClick={() => setIsFilterModalOpen(false)}
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      )}

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

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#51000d]">Memuat produk...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
