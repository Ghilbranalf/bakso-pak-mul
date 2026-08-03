"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminInventoryPage() {
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
          let statusColor = "bg-green-100 text-green-800";
          const currentStock = p.stock || 0;
          
          if (currentStock === 0) {
            status = "STOK HABIS";
            statusColor = "bg-gray-100 text-gray-800";
          } else if (currentStock < 20) {
            status = "STOK MENIPIS";
            statusColor = "bg-red-100 text-red-700 border border-red-200 animate-pulse";
          }
          
          return {
            ...p,
            sku: p.sku || `BPM-${p.id.substring(0, 5).toUpperCase()}`,
            percentage: Math.min(100, Math.round((currentStock / 100) * 100)),
            status,
            statusColor,
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

  // Form State
  const defaultForm = {
    id: "",
    name: "",
    category: "Bakso",
    stock: "100",
    price: "",
    sku: "",
    unit: "bks",
    image: "/images/Bakso Jeruk SB.png",
  };

  const [formData, setFormData] = useState(defaultForm);

  const handleOpenAddModal = () => {
    setFormData(defaultForm);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (product: any) => {
    setFormData({
      id: product.id,
      name: product.name,
      category: product.category,
      stock: String(product.stock || 100),
      price: String(product.price),
      sku: product.sku || "",
      unit: product.unit || "bks",
      image: product.image || "/images/Bakso Jeruk SB.png",
    });
    setIsEditModalOpen(true);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;
    
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          stock: parseInt(formData.stock) || 100,
          price: parseInt(formData.price),
          sku: formData.sku || `BPM-${Math.floor(Math.random() * 900 + 100)}`,
          unit: formData.unit,
          image: formData.image,
        }),
      });
      
      if (res.ok) {
        setIsAddModalOpen(false);
        fetchProducts();
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.name || !formData.price) return;
    
    try {
      const res = await fetch(`/api/products/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          stock: parseInt(formData.stock) || 0,
          price: parseInt(formData.price),
          sku: formData.sku,
          unit: formData.unit,
          image: formData.image,
        }),
      });

      if (res.ok) {
        setIsEditModalOpen(false);
        fetchProducts();
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteId(null);
        fetchProducts();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = category === "Semua Kategori" || p.category.toLowerCase().includes(category.toLowerCase());
    return matchesSearch && matchesCat;
  });

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1a1c1c] font-sans antialiased flex flex-col lg:flex-row">
      <AdminSidebar activeMenu="inventory" />

      {/* Main Content Area */}
      <main className="flex-1 w-full lg:ml-[260px] min-h-screen p-4 md:p-8 lg:p-10 pb-24 lg:pb-8 max-w-7xl">
        {/* Header / Stats Bar */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Manajemen Stok &amp; Produk
            </h2>
            <p className="text-xs md:text-sm text-gray-500 font-medium mt-1">
              Kontrol stok dan ketersediaan menu Bakso Pak Mul secara real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleOpenAddModal}
              className="px-5 py-2.5 bg-[#51000d] hover:bg-[#7a0019] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 uppercase tracking-wider cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>Tambah Produk Baru</span>
            </button>
          </div>
        </header>

        {/* Filters & Search */}
        <section className="bg-white rounded-2xl p-4 md:p-6 mb-6 shadow-sm border border-gray-100 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[280px] relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-[#51000d] transition-all"
              placeholder="Cari nama produk atau SKU..."
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Kategori:</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-800 focus:border-[#51000d] cursor-pointer"
            >
              <option>Semua Kategori</option>
              <option>Bakso</option>
              <option>Mie &amp; Kulit Pangsit</option>
              <option>Bumbu &amp; Saos</option>
            </select>
          </div>
        </section>

        {/* ==================== MOBILE CARDS LAYOUT (< md) ==================== */}
        <div className="md:hidden space-y-3 mb-6">
          {isLoading ? (
            <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center text-xs text-gray-500 font-bold">
              Memuat produk...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center text-xs text-gray-500 font-bold">
              Tidak ada produk ditemukan.
            </div>
          ) : (
            filteredProducts.map((p) => (
              <div key={p.id} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-14 h-14 rounded-xl bg-cover bg-center border border-gray-200 shrink-0"
                    style={{ backgroundImage: `url('${p.image}')` }}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{p.name}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{p.sku} • {p.category}</p>
                    <p className="text-xs font-black text-[#51000d] mt-0.5">{formatPrice(p.price)}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase shrink-0 ${p.statusColor}`}>
                    {p.status}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                  <div>
                    <span className="text-gray-500 font-medium">Stok: </span>
                    <span className="font-extrabold text-gray-900">{p.stock} {p.unit}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(p)}
                      className="px-3 py-1.5 bg-[#51000d] text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xs">edit</span>
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setDeleteId(p.id)}
                      className="px-3 py-1.5 bg-gray-100 text-rose-700 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xs">delete</span>
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ==================== DESKTOP TABLE LAYOUT (>= md) ==================== */}
        <section className="hidden md:block bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Produk</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Jumlah Stok</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Harga (Rp)</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                      Memuat produk...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                      Tidak ada produk ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-xl bg-cover bg-center border border-gray-200 shrink-0"
                            style={{ backgroundImage: `url('${p.image}')` }}
                          ></div>
                          <div>
                            <p className="text-xs font-bold text-gray-900">{p.name}</p>
                            <p className="text-[10px] font-medium text-gray-400">{p.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-gray-700">{p.category}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-extrabold text-gray-900">
                            {p.stock} <span className="text-[10px] font-normal text-gray-400">{p.unit}</span>
                          </span>
                          <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${p.stock < 20 ? "bg-red-600" : "bg-[#51000d]"}`}
                              style={{ width: `${p.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-extrabold text-gray-900">{formatPrice(p.price)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold ${p.statusColor}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-blue-600 transition-all cursor-pointer mr-1"
                          title="Edit Produk"
                        >
                          <span className="material-symbols-outlined text-lg">edit_square</span>
                        </button>
                        <button
                          onClick={() => setDeleteId(p.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-all cursor-pointer"
                          title="Hapus Produk"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400 font-medium">Menampilkan {filteredProducts.length} dari {products.length} produk</p>
          </div>
        </section>
      </main>

      {/* Modal: Tambah & Edit Produk */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-extrabold text-gray-900">
                  {isEditModalOpen ? "Edit Produk" : "Tambah Produk Baru"}
                </h3>
                <p className="text-xs text-gray-500 font-medium">Isi rincian informasi produk Anda di bawah ini.</p>
              </div>
              <button
                onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <form onSubmit={isEditModalOpen ? handleEditProduct : handleAddProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nama Produk</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:border-[#51000d]"
                  placeholder="Misal: Bakso Jeruk SB Spesial"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:border-[#51000d]"
                  >
                    <option value="Bakso">Bakso</option>
                    <option value="Mie & Kulit Pangsit">Mie &amp; Kulit Pangsit</option>
                    <option value="Bumbu & Saos">Bumbu &amp; Saos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Jumlah Stok</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:border-[#51000d]"
                    placeholder="Misal: 100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Harga Satuan (Rp)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:border-[#51000d]"
                    placeholder="Misal: 60000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Kode SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:border-[#51000d]"
                    placeholder="BPM-001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Satuan Kemasan</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:border-[#51000d]"
                    placeholder="Misal: bks / pack"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Pilih Gambar (`public/images/`)</label>
                  {availableImages.length > 0 ? (
                    <select
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:border-[#51000d]"
                    >
                      {availableImages.map((imgPath) => (
                        <option key={imgPath} value={imgPath}>
                          {imgPath.replace("/images/", "")}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:border-[#51000d]"
                      placeholder="/images/NamaGambar.png"
                    />
                  )}
                </div>
              </div>

              {/* Preview image */}
              {formData.image && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <img src={formData.image} alt="Preview" className="w-12 h-12 object-cover rounded-lg border border-gray-300" />
                  <div>
                    <p className="text-[11px] font-bold text-gray-700">Pratinjau Gambar Produk</p>
                    <p className="text-[10px] text-gray-400 truncate max-w-xs">{formData.image}</p>
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                  className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#51000d] hover:bg-[#7a0019] text-white text-xs font-bold rounded-xl shadow-md uppercase tracking-wider cursor-pointer"
                >
                  {isEditModalOpen ? "Perbarui Produk" : "Simpan Produk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl">warning</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Konfirmasi Hapus Produk</h3>
              <p className="text-xs text-gray-500 mt-1">Apakah Anda yakin ingin menghapus produk ini dari katalog?</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteId)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
