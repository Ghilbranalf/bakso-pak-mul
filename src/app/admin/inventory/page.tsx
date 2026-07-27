"use client";

import React, { useState } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminInventoryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All Categories");

  const [products, setProducts] = useState([
    {
      id: "bpm-001-bs",
      name: "Bakso Super (Premium)",
      sku: "SKU: BPM-001-BS",
      category: "Bakso Packs",
      stock: 120,
      unit: "kg",
      percentage: 80,
      price: "145.000",
      status: "IN STOCK",
      statusColor: "bg-green-100 text-green-800",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCmZ9BE7nE8nkLAmAgbYMZ0lwBnyk-YRaZMNFffsHfB4leE4aECCT1WiUR6gjcuuQVRb8Eae2UglWE5ikQuN4DD3s3s3H9hoA-3GBD18Gdh95sREONfUw8ZO_nNZyvCibm0jdcjL7o_WNF2y2iLjrVVgfC-LTGPLdzuT-z_MkQ9ZptN9N8F0CeGJFCD4ejLOh6vLrGpBoHS02jHejBHb6QyPxrwebTX9PK0l5S81Ejmlt-R5rYd0gGiW6jPBTA6tv-cJSIgiY49drUR",
    },
    {
      id: "bpm-042-mk",
      name: "Mie Kuning Basah",
      sku: "SKU: BPM-042-MK",
      category: "Complementary",
      stock: 12,
      unit: "kg",
      percentage: 15,
      price: "18.500",
      status: "LOW STOCK",
      statusColor: "bg-red-100 text-red-700 border border-red-200 animate-pulse",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCkjD3yCHWnMV6QnYAco02QnSORLUrZW3CeIICC4q54SN4WbQNdXmk_8Kt0gkZzXZLKiVTKwgFnAfoBbr5jrYeLt8U36iLPTahjWTgJN-yDatIJS28FhZzuD8RGWBbhirQlpRf1u6A72gZeCvlZmqXDNnJ-DDtLSqkIxQc86pxcsIfJzCjZRbh_Z-oYtXJyJW_6DB-MiBp8ExQUdgmtzsvNHDMX3B5XX9i_Z0ZwbiwVLJltm7z6jvfnycocJ1EqkQ-E2V-oX3_B0Q0H",
    },
    {
      id: "bpm-088-sp",
      name: "Bumbu Rahasia Pak Mul",
      sku: "SKU: BPM-088-SP",
      category: "Spices & Sauces",
      stock: 45,
      unit: "packs",
      percentage: 55,
      price: "62.000",
      status: "IN STOCK",
      statusColor: "bg-green-100 text-green-800",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBi0W21BVXXm9bQAKa1FBoIS_r3RlCf6rDNuDksVgQiQMaIeNOTs3TddGeGy6q6oNdjDop-1vcNvAcJ6QKiWj9gNaBtDjDeo5TXRxcfF7CxDD6SiiiQMJH-7zYnPZbsf6Wbm2UPcinQ1XcIqy6JlmP4wu4uoTxhwXBbt6ltr2SsVmjgmw_5u7k7lGp9Uh_XBxZ1fK6nXTDqPLkwf_vLX8dBtGIiCqjnlet9Q_-uUOVxqc-rAMP2CeLQtBlu6G5LvCcPjk0wvQKkj7Tf",
    },
    {
      id: "bpm-015-tb",
      name: "Tahu Bakso Goreng",
      sku: "SKU: BPM-015-TB",
      category: "Ready-to-Eat",
      stock: 28,
      unit: "packs",
      percentage: 40,
      price: "35.000",
      status: "IN STOCK",
      statusColor: "bg-green-100 text-green-800",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCI9N8kQN1Al82qoPcfj9AstQXFYZD_FKgD6oSHyWsT5_q_exPIp_J8lQilVVbQFuNajGGKik0awJxx4Kf1oDSI6AjoorSmjQqXq5DdFVaFntMulhUYNlbLuQUk3hUmx-zguiOK3uJp52bjRorepLMbxmiv88LvMZgmvIGAjXUoqrZOccoTCVanECxIyuejlp-OVRGaEJiGXcURWfSUCsQrvY2qs9pJJx7PShaqKZCO3iXqZtXUdu7lCXRh3i6RwHUQC5ZE2089vbWz",
    },
  ]);

  // New Item Form
  const [newItem, setNewItem] = useState({
    name: "",
    category: "Bakso Packs",
    stock: "",
    price: "",
    sku: "",
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name) return;
    setProducts([
      ...products,
      {
        id: newItem.sku || `bpm-custom-${Date.now()}`,
        name: newItem.name,
        sku: newItem.sku || "SKU: BPM-NEW",
        category: newItem.category,
        stock: Number(newItem.stock) || 50,
        unit: "kg",
        percentage: 60,
        price: newItem.price || "50.000",
        status: "IN STOCK",
        statusColor: "bg-green-100 text-green-800",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCmZ9BE7nE8nkLAmAgbYMZ0lwBnyk-YRaZMNFffsHfB4leE4aECCT1WiUR6gjcuuQVRb8Eae2UglWE5ikQuN4DD3s3s3H9hoA-3GBD18Gdh95sREONfUw8ZO_nNZyvCibm0jdcjL7o_WNF2y2iLjrVVgfC-LTGPLdzuT-z_MkQ9ZptN9N8F0CeGJFCD4ejLOh6vLrGpBoHS02jHejBHb6QyPxrwebTX9PK0l5S81Ejmlt-R5rYd0gGiW6jPBTA6tv-cJSIgiY49drUR",
      },
    ]);
    setIsModalOpen(false);
    setNewItem({ name: "", category: "Bakso Packs", stock: "", price: "", sku: "" });
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = category === "All Categories" || p.category === category;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-[#1a1c1c] font-sans antialiased flex">
      {/* Shared Reusable Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="md:ml-[280px] flex-1 min-h-screen p-4 md:p-8 lg:p-12">
        {/* Header / Stats Bar */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Inventory Management
            </h2>
            <p className="text-xs md:text-sm text-gray-500 font-medium mt-1">
              Real-time stock control and menu availability for Bakso Pak Mul.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-white p-4 rounded-2xl flex items-center gap-3 shadow-sm border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold shrink-0">
                <span className="material-symbols-outlined text-xl">warning</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Low Stock Alerts</p>
                <p className="text-lg font-black text-red-600">3 Items</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl flex items-center gap-3 shadow-sm border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#51000d] flex items-center justify-center font-bold shrink-0">
                <span className="material-symbols-outlined text-xl">shopping_bag</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Menu</p>
                <p className="text-lg font-black text-[#51000d]">{products.length} Products</p>
              </div>
            </div>
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
              placeholder="Search product name or SKU..."
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category:</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-800 focus:border-[#51000d] cursor-pointer"
            >
              <option>All Categories</option>
              <option>Bakso Packs</option>
              <option>Complementary</option>
              <option>Spices &amp; Sauces</option>
              <option>Ready-to-Eat</option>
            </select>
          </div>
        </section>

        {/* Data Table Card */}
        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Stock Level</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Price (IDR)</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((p) => (
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
                    <td className="px-6 py-4 text-xs font-extrabold text-gray-900">{p.price}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold ${p.statusColor}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-[#51000d] transition-all cursor-pointer">
                        <span className="material-symbols-outlined text-lg">edit_square</span>
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-[#51000d] transition-all cursor-pointer">
                        <span className="material-symbols-outlined text-lg">more_vert</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400 font-medium">Showing {filteredProducts.length} of {products.length} products</p>
            <div className="flex items-center gap-1.5">
              <button disabled className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:opacity-40">
                <span className="material-symbols-outlined text-base">chevron_left</span>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#51000d] text-white font-bold text-xs">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 font-bold text-xs">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 font-bold text-xs">
                <span className="material-symbols-outlined text-base">chevron_right</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Modal: Add New Menu */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-extrabold text-gray-900">Add New Menu Item</h3>
                <p className="text-xs text-gray-500 font-medium">Fill in details to create a new product listing.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:border-[#51000d]"
                  placeholder="e.g. Bakso Urat Jumbo"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:border-[#51000d]"
                  >
                    <option>Bakso Packs</option>
                    <option>Complementary</option>
                    <option>Spices &amp; Sauces</option>
                    <option>Ready-to-Eat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Initial Stock Level</label>
                  <input
                    type="number"
                    value={newItem.stock}
                    onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:border-[#51000d]"
                    placeholder="e.g. 50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Unit Price (IDR)</label>
                  <input
                    type="text"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:border-[#51000d]"
                    placeholder="e.g. 50.000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">SKU Identifier</label>
                  <input
                    type="text"
                    value={newItem.sku}
                    onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:border-[#51000d]"
                    placeholder="BPM-XXX-XX"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#51000d] hover:bg-[#7a0019] text-white text-xs font-bold rounded-xl shadow-md uppercase tracking-wider"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
