"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/CartSidebar";
import { useCart } from "@/context/CartContext";

export default function ProductsPage() {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { openCart, totalItems, addToCart } = useCart();

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const products = [
    {
      id: "prod_1",
      name: "Bakso Sapi Super Polos (50pcs) - Vacuum Pack",
      price: 75000,
      unit: "Vacuum Pack",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDoSn1QFRuBtno28pVjYK6N4_y85CUzc2yG57z8lGFD9tGlkMGeRAFGrNx4-Z72V88egcpEkTE39DtNOyJ26myXEM6O_Imnwsl1htytvOnRsOEeqC4tCxDCQWEvzoodMx3gHAPlWpz26c90gG4c_Hh5wJ-YZ5LqWAh3fZ58nak9RyNJR3Tt6v7-EEq7qtQlvJqKTAUyflIwlD6rwfTwwoC0mStIFfdE6EGL_3dw3u6kMYbrvVsXsZZgSq1pU8cwv36nii7mGTn2UWwg",
      rating: 4.9,
      category: "Bakso Super",
      stock: "Ready Stock"
    },
    {
      id: "prod_2",
      name: "Bakso Sapi Urat Spesial (50pcs) - B2B Pack",
      price: 90000,
      unit: "B2B Pack",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1w0vvJSrk1eft-6aivgFBVz2UkU6lb-RfllLPk-ymAkWrV9PZK3vhLgJvY7LZAWUDySVqhdJjqkx8-LAkEaMJXBdn1sPWzS_ssGW45PwPWlJE_j8tQCQHBbWkdtZdJBdqpkd-3eIDHxlzUvLFy6PUK69llfBqpoljJ00hut_MfDI16EuJX_mAbPqx7SQrOo2dKDS01NOadT5VN0ErKkZNIgmSfbgtHdB_gat4PxbOAwvXQbVBQfzEAYHiootUKw9EUnFvmGHc_SUz",
      rating: 4.8,
      category: "Bakso Urat",
      stock: "Premium Quality"
    },
    {
      id: "prod_3",
      name: "Mie Kuning Premium 225 (Bal 5kg) - Fresh Daily",
      price: 45000,
      unit: "Bal 5kg",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBeERQB6nMx75KBcf6lslRry7PYbawSP6-NPJc7RKAqynsAtF0AXjCS1gBHEoJx4XhMqGkyRtfAQY_fsEGpD8ia4m1bYw5YxLAxXF4VAPh3TjtQDCMHOt3KpEtJ8P2ETN4P9ljqf57skiL8Ds7VkqnrqEcfbKbZaYqVdDCqskoJUhlSUouIH0Xcw93HNjE73LtoSV4KBbzx89RYqI8Qt-YV3Z35CZgX1Q6HMVBwq5VwkBJ2N_fJ7LFuIEaStAlQLHP-6GBSmuJe_Q7w",
      rating: 4.7,
      category: "Mie 225",
      stock: "Fresh Daily"
    },
    {
      id: "prod_4",
      name: "Bumbu Kuah Bakso Rahasia Pak Mul (5L) - Special Edition",
      price: 210000,
      unit: "Jerigen 5L",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdQO1Re968kIIdcQ4nrphEVBEUVRNCPBJdvbaOyveLwYQ4yUKq2qMiAOCWnwlNf3kwKwdCxdHO2USsV-jBywZJbeGfC7enmeu4RNV_aBYwyclLtw61JXtY8IJGW0HW2r8vk12NSSrN574CNBm1aIKUyIjbIdFSkd9LumyJkEcVDQF1ezyBs_RxspA25XpwQbCw8uekXiWZyvyaUqutQIafFiPxphZd63L00Jmn40uJt6MflorntExDrkNnrdWesrOOPj9a-u-AQ3XH",
      rating: 5.0,
      category: "Signature Series",
      stock: "Limited Batch",
      isSpecial: true
    }
  ];

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
            <button className="px-5 py-2 rounded-full bg-primary text-white text-xs font-semibold shadow-md shadow-primary/10">Semua</button>
            <button className="px-5 py-2 rounded-full bg-white border border-gray-100 text-text-muted text-xs font-medium filter-chip">Bakso</button>
            <button className="px-5 py-2 rounded-full bg-white border border-gray-100 text-text-muted text-xs font-medium filter-chip">Mie</button>
            <button className="px-5 py-2 rounded-full bg-white border border-gray-100 text-text-muted text-xs font-medium filter-chip">Bihun</button>
            <button className="px-5 py-2 rounded-full bg-white border border-gray-100 text-text-muted text-xs font-medium filter-chip">Sohun</button>
            <button className="px-5 py-2 rounded-full bg-white border border-gray-100 text-text-muted text-xs font-medium filter-chip">Bumbu Bakso</button>
            <button className="px-5 py-2 rounded-full bg-white border border-gray-100 text-text-muted text-xs font-medium filter-chip">Pelengkap</button>
            <button className="px-5 py-2 rounded-full bg-white border border-gray-100 text-text-muted text-xs font-medium filter-chip">Peralatan</button>
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
          {products.map((product) => (
            <div key={product.id} className={`product-card group rounded-2xl overflow-hidden flex flex-col relative ${product.isSpecial ? 'bg-primary text-white' : 'bg-white border border-gray-100'}`}>
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
          ))}
        </div>

        {/* Elegant Pagination */}
        <div className="mt-20 flex justify-center items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 text-text-muted hover:bg-primary hover:text-white transition-all disabled:opacity-30" disabled>
            <i className="fas fa-chevron-left text-xs"></i>
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-white font-bold text-xs">1</button>
          <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 text-text-muted font-medium text-xs hover:border-primary hover:text-primary transition-all">2</button>
          <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 text-text-muted font-medium text-xs hover:border-primary hover:text-primary transition-all">3</button>
          <span className="text-gray-300 font-bold px-1 text-xs">...</span>
          <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 text-text-muted font-medium text-xs hover:border-primary hover:text-primary transition-all">12</button>
          <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 text-text-muted hover:bg-primary hover:text-white transition-all">
            <i className="fas fa-chevron-right text-xs"></i>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#121212] text-gray-400 py-20 mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
            <div className="md:col-span-4">
              <div className="flex items-center mb-8">
                <img
                  alt="Logo"
                  className="h-10 w-auto brightness-200"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDBL54ay3_wH1MTRduKq7WuysfeSQbkXJTUCJgNiKCIPLKacTQTGY--R8yc5l1yZ0UKwLHhypDJz8pC9IvOs8_kTHavE67Ebjs3TvlQCb3D558xWtMD7gTTdbqZMUO8Da2T_u3DtfuS6NTIenP8pCtDspF_mK4uhwS4EfHM2NV8pymrf7C6qSb3MG7R34aqGeBoR9dxABZzbQDvnwhQ93TZsssPJSZF3Nq4maYwKDvDV460_eZfzPsCe7vwFQFWdBEXQ2JoH_FKqy_"
                />
                <span className="ml-3 font-bold text-xl text-white tracking-tight">Bakso Pak Mul</span>
              </div>
              <p className="text-sm leading-relaxed mb-8 max-w-xs">
                Mendedikasikan rasa dan kualitas sejak tahun 2000. Kami percaya setiap hidangan layak mendapatkan bahan terbaik.
              </p>
              <div className="flex space-x-5">
                <Link className="text-gray-500 hover:text-white transition-colors" href="#">
                  <i className="fab fa-instagram text-xl"></i>
                </Link>
                <Link className="text-gray-500 hover:text-white transition-colors" href="#">
                  <i className="fab fa-tiktok text-xl"></i>
                </Link>
                <Link className="text-gray-500 hover:text-white transition-colors" href="#">
                  <i className="fab fa-facebook-f text-xl"></i>
                </Link>
              </div>
            </div>
            <div className="md:col-span-2">
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Navigasi</h4>
              <ul className="space-y-4 text-xs">
                <li><Link className="hover:text-primary transition-colors" href="#">Produk Baru</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#">Bestseller</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#">Kemitraan B2B</Link></li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Perusahaan</h4>
              <ul className="space-y-4 text-xs">
                <li><Link className="hover:text-primary transition-colors" href="#">Kisah Kami</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#">Hubungi Kami</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#">Karir</Link></li>
              </ul>
            </div>
            <div className="md:col-span-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Dapatkan Update Eksklusif</h4>
              <p className="text-xs mb-6">Berlangganan untuk info promo mitra dan produk terbaru.</p>
              <div className="flex gap-2">
                <input
                  className="bg-white/5 border-transparent focus:ring-primary focus:border-primary text-xs rounded-lg flex-grow py-3 px-4 transition-all"
                  placeholder="Email Anda"
                  type="email"
                />
                <button className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-6 py-3 rounded-lg transition-all">Daftar</button>
              </div>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] uppercase tracking-widest">© 2024 Bakso Pak Mul. Elegance in Every Bite.</p>
            <div className="flex items-center gap-8 opacity-40">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">verified</span>
                <span className="text-[9px] font-bold uppercase tracking-tighter">Sertifikat Halal MUI</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">security</span>
                <span className="text-[9px] font-bold uppercase tracking-tighter">Pembayaran Aman</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

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
