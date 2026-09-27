"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { useAdminTheme } from "@/context/AdminThemeContext";

export default function AdminInventoryPage() {
  const { isDark } = useAdminTheme();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("Semua Kategori");
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [availableImages, setAvailableImages] = useState<string[]>([]);

  // Fetch available images in public/images
  const fetchImages = async () => {
    try {
      const res = await fetch("/api/images");
      const data = await res.json();
      if (data.images) {
        setAvailableImages(data.images);
      }
    } catch (err) {
      console.error("Failed to fetch available images:", err);
    }
  };

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.products) {
        const formattedProducts = data.products.map((p: any) => {
          let status = "TERSEDIA";
          let statusColor = "bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/20";
          let lightStatusColor = "bg-emerald-100 text-emerald-800 border border-emerald-200";
          const currentStock = p.stock || 0;
          
          if (currentStock === 0) {
            status = "STOK HABIS";
            statusColor = "bg-white/5 text-white/40 border border-white/10";
            lightStatusColor = "bg-gray-100 text-gray-700 border border-gray-200";
          } else if (currentStock < 20) {
            status = "STOK MENIPIS";
            statusColor = "bg-red-500/15 text-red-400 border border-red-500/20 animate-pulse";
            lightStatusColor = "bg-red-100 text-red-700 border border-red-200 animate-pulse";
          }
          
          return {
            ...p,
            sku: p.sku || `BPM-${p.id.substring(0, 5).toUpperCase()}`,
            percentage: Math.min(100, Math.round((currentStock / 100) * 100)),
            status,
            statusColor,
            lightStatusColor,
          };
        });
        setProducts(formattedProducts);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchImages();
  }, []);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    category: "Bakso",
    price: "",
    originalPrice: "",
    stock: "100",
    unit: "Pack",
    image: "/images/Bakso Sapi Halus.png",
    customImage: "",
    description: "",
  });

  const handleOpenAddModal = () => {
    setFormData({
      id: "",
      name: "",
      category: "Bakso",
      price: "",
      originalPrice: "",
      stock: "100",
      unit: "Pack",
      image: availableImages[0] ? `/images/${availableImages[0]}` : "/images/Bakso Sapi Halus.png",
      customImage: "",
      description: "",
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (product: any) => {
    setFormData({
      id: product.id,
      name: product.name,
      category: product.category,
      price: String(product.price),
      originalPrice: product.originalPrice ? String(product.originalPrice) : "",
      stock: String(product.stock || 100),
      unit: product.unit || "Pack",
      image: product.image,
      customImage: "",
      description: product.description || "",
    });
    setIsEditModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalImage = formData.customImage.trim() || formData.image;

    const payload = {
      name: formData.name,
      category: formData.category,
      price: parseInt(formData.price) || 0,
      originalPrice: formData.originalPrice ? parseInt(formData.originalPrice) : null,
      stock: parseInt(formData.stock) || 0,
      unit: formData.unit,
      image: finalImage,
      description: formData.description,
    };

    try {
      if (isEditModalOpen && formData.id) {
        // UPDATE
        const res = await fetch(`/api/products/${formData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          fetchProducts();
          setIsEditModalOpen(false);
        }
      } else {
        // CREATE
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          fetchProducts();
          setIsAddModalOpen(false);
        }
      }
    } catch (err) {
      console.error("Failed to save product:", err);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/products/${deleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchProducts();
        setDeleteId(null);
      }
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  // Filter products by search and category
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      category === "Semua Kategori" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className={`min-h-screen font-sans antialiased flex transition-colors ${
      isDark ? "bg-[#0f0f0f] text-white" : "bg-[#f8f9fa] text-gray-900"
    }`}>
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 max-w-full overflow-x-hidden lg:ml-[240px] min-h-screen p-4 md:p-6 lg:p-8 pt-18 lg:pt-8 pb-32 lg:pb-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
          <div>
            <h1 className={`text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Stok &amp; Produk</h1>
            <p className={`text-sm mt-0.5 ${isDark ? "text-white/40" : "text-gray-500"}`}>Kelola produk dan stok ketersediaan</p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#51000d] hover:bg-[#7a0019] text-white rounded-xl text-sm font-medium shadow-sm transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            <span>Tambah Produk</span>
          </button>
        </header>

        {/* Search & Filter */}
        <div className={`rounded-xl border p-3 mb-5 flex flex-col sm:flex-row gap-3 items-center ${
          isDark ? "bg-[#1a1a1a] border-white/5" : "bg-white border-gray-200/80 shadow-sm"
        }`}>
          <div className="relative flex-1 w-full">
            <span className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg ${
              isDark ? "text-white/30" : "text-gray-400"
            }`}>search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg text-sm transition-all focus:outline-none ${
                isDark ? "bg-white/5 border border-white/8 text-white placeholder-white/20 focus:border-white/20" : "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#51000d]"
              }`}
              placeholder="Cari nama produk atau SKU..."
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`rounded-lg px-3 py-2.5 text-sm cursor-pointer w-full sm:w-auto border focus:outline-none ${
              isDark ? "bg-[#141414] border-white/8 text-white/70" : "bg-gray-50 border-gray-200 text-gray-700"
            }`}
          >
            <option>Semua Kategori</option>
            <option>Bakso</option>
            <option>Mie &amp; Kulit Pangsit</option>
            <option>Bumbu &amp; Saos</option>
          </select>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3 mb-4">
          {isLoading ? (
            <div className={`p-8 rounded-xl border text-center text-sm ${
              isDark ? "bg-[#1a1a1a] border-white/5 text-white/30" : "bg-white border-gray-200 text-gray-400"
            }`}>Memuat produk...</div>
          ) : filteredProducts.length === 0 ? (
            <div className={`p-10 rounded-xl border text-center ${
              isDark ? "bg-[#1a1a1a] border-white/5 text-white/30" : "bg-white border-gray-200 text-gray-400"
            }`}>
              <span className="material-symbols-outlined text-3xl opacity-20 block mb-2">inventory_2</span>
              <p className="text-sm">Tidak ada produk ditemukan.</p>
            </div>
          ) : filteredProducts.map((p) => (
            <div key={p.id} className={`rounded-xl border p-4 space-y-3 ${
              isDark ? "bg-[#1a1a1a] border-white/5" : "bg-white border-gray-200/80 shadow-sm"
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-cover bg-center border border-white/10 shrink-0" style={{ backgroundImage: `url('${p.image}')` }} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isDark ? "text-white" : "text-gray-900"}`}>{p.name}</p>
                  <p className={`text-xs ${isDark ? "text-white/30" : "text-gray-400"}`}>{p.sku} · {p.category}</p>
                  <p className={`text-sm font-semibold mt-0.5 ${isDark ? "text-amber-400" : "text-[#51000d]"}`}>Rp {formatPrice(p.price)}</p>
                </div>
                <span className={`px-2 py-1 rounded-lg text-[10px] font-medium shrink-0 ${
                  isDark ? p.statusColor : p.lightStatusColor
                }`}>{p.status}</span>
              </div>
              <div className={`flex items-center justify-between pt-2 border-t ${isDark ? "border-white/5" : "border-gray-100"}`}>
                <span className={`text-xs ${isDark ? "text-white/40" : "text-gray-500"}`}>Stok: <strong className={isDark ? "text-white" : "text-gray-900"}>{p.stock}</strong> {p.unit}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenEditModal(p)} className={`p-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                    isDark ? "bg-white/8 text-white/60 hover:text-white" : "bg-gray-100 text-gray-600 hover:text-gray-900"
                  }`} title="Edit">
                    <span className="material-symbols-outlined text-base">edit</span>
                  </button>
                  <button onClick={() => setDeleteId(p.id)} className={`p-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                    isDark ? "bg-red-500/15 text-red-400 hover:bg-red-500/25" : "bg-red-50 text-red-600 hover:bg-red-100"
                  }`} title="Hapus">
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className={`hidden md:block rounded-xl border overflow-hidden transition-colors ${
          isDark ? "bg-[#1a1a1a] border-white/5" : "bg-white border-gray-200/80 shadow-sm"
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className={`border-b ${isDark ? "border-white/5 bg-white/3 text-white/30" : "border-gray-200 bg-gray-50 text-gray-500"}`}>
                  <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wide">Produk</th>
                  <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wide">Kategori</th>
                  <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wide">Stok</th>
                  <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wide">Harga</th>
                  <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wide">Status</th>
                  <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wide text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? "divide-white/3" : "divide-gray-100"}`}>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-5 h-5 border-2 border-t-transparent rounded-full animate-spin ${
                          isDark ? "border-amber-400" : "border-[#51000d]"
                        }`} />
                        <span className="text-sm opacity-40">Memuat produk...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-14 text-center">
                      <span className="material-symbols-outlined text-3xl opacity-20 block mb-2">inventory_2</span>
                      <p className="text-sm opacity-40">Tidak ada produk ditemukan.</p>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr key={p.id} className={`transition-colors ${isDark ? "hover:bg-white/3" : "hover:bg-gray-50"}`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-cover bg-center border border-white/10 shrink-0" style={{ backgroundImage: `url('${p.image}')` }} />
                          <div>
                            <p className={`font-semibold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>{p.name}</p>
                            <p className={`text-xs ${isDark ? "text-white/30" : "text-gray-400"}`}>{p.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className={`px-5 py-4 text-xs ${isDark ? "text-white/60" : "text-gray-600"}`}>{p.category}</td>
                      <td className="px-5 py-4">
                        <p className={`text-xs font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{p.stock} <span className={`font-normal ${isDark ? "text-white/30" : "text-gray-400"}`}>{p.unit}</span></p>
                      </td>
                      <td className="px-5 py-4">
                        <p className={`text-xs font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Rp {formatPrice(p.price)}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                          isDark ? p.statusColor : p.lightStatusColor
                        }`}>{p.status}</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => handleOpenEditModal(p)} className={`p-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                            isDark ? "bg-white/8 text-white/60 hover:text-white" : "bg-gray-100 text-gray-600 hover:text-gray-900"
                          }`} title="Edit">
                            <span className="material-symbols-outlined text-base">edit</span>
                          </button>
                          <button onClick={() => setDeleteId(p.id)} className={`p-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                            isDark ? "bg-red-500/15 text-red-400 hover:bg-red-500/25" : "bg-red-50 text-red-600 hover:bg-red-100"
                          }`} title="Hapus">
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal Add / Edit */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className={`rounded-2xl max-w-lg w-full p-5 shadow-2xl my-6 text-sm border space-y-4 ${
            isDark ? "bg-[#1a1a1a] border-white/10 text-white" : "bg-white border-gray-200 text-gray-900"
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${isDark ? "border-white/8" : "border-gray-200"}`}>
              <h2 className="text-base font-semibold">
                {isEditModalOpen ? "Edit Produk" : "Tambah Produk Baru"}
              </h2>
              <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                isDark ? "bg-white/8 hover:bg-white/12 text-white/60" : "bg-gray-100 hover:bg-gray-200 text-gray-600"
              }`}>
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? "text-white/50" : "text-gray-600"}`}>Nama Produk</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                    isDark ? "bg-white/5 border-white/10 text-white placeholder-white/20 focus:border-white/20" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#51000d]"
                  }`}
                  placeholder="Misal: Bakso Sapi Halus Super"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? "text-white/50" : "text-gray-600"}`}>Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none cursor-pointer ${
                      isDark ? "bg-[#141414] border-white/10 text-white" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#51000d]"
                    }`}
                  >
                    <option>Bakso</option>
                    <option>Mie &amp; Kulit Pangsit</option>
                    <option>Bumbu &amp; Saos</option>
                    <option>Pelengkap</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? "text-white/50" : "text-gray-600"}`}>Satuan</label>
                  <input
                    type="text"
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                      isDark ? "bg-white/5 border-white/10 text-white focus:border-white/20" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#51000d]"
                    }`}
                    placeholder="Misal: Pack 500g"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? "text-white/50" : "text-gray-600"}`}>Harga Jual (Rp)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                      isDark ? "bg-white/5 border-white/10 text-white focus:border-white/20" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#51000d]"
                    }`}
                    placeholder="35000"
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? "text-white/50" : "text-gray-600"}`}>Stok Ketersediaan</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                      isDark ? "bg-white/5 border-white/10 text-white focus:border-white/20" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#51000d]"
                    }`}
                    placeholder="100"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? "text-white/50" : "text-gray-600"}`}>Pilih Foto Produk</label>
                <select
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none cursor-pointer ${
                    isDark ? "bg-[#141414] border-white/10 text-white" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#51000d]"
                  }`}
                >
                  {availableImages.map((img) => (
                    <option key={img} value={`/images/${img}`}>
                      /images/{img}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/8">
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-medium cursor-pointer ${
                    isDark ? "bg-white/6 hover:bg-white/10 text-white/60" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#51000d] hover:bg-[#7a0019] text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  {isEditModalOpen ? "Simpan Perubahan" : "Tambah Produk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Hapus */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-sm w-full p-5 shadow-2xl text-sm border ${
            isDark ? "bg-[#1a1a1a] border-white/10 text-white" : "bg-white border-gray-200 text-gray-900"
          }`}>
            <div className="w-10 h-10 bg-red-500/10 text-red-400 rounded-xl flex items-center justify-center mb-3">
              <span className="material-symbols-outlined">warning</span>
            </div>
            <h3 className="font-semibold text-base mb-1">Hapus Produk Ini?</h3>
            <p className={`text-sm mb-5 ${isDark ? "text-white/40" : "text-gray-500"}`}>
              Produk yang dihapus tidak dapat dikembalikan.
            </p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteId(null)} className={`px-4 py-2 rounded-xl text-xs font-medium cursor-pointer ${
                isDark ? "bg-white/6 hover:bg-white/10 text-white/60" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}>
                Batal
              </button>
              <button onClick={handleDeleteProduct} className="px-5 py-2 bg-red-500/15 hover:bg-red-500/25 text-red-500 rounded-xl text-xs font-semibold transition-colors cursor-pointer">
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
