"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminDashboardPage() {
  const [timeframe, setTimeframe] = useState<"monthly" | "weekly">("monthly");
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Fetch Real Orders
        const resOrders = await fetch("/api/orders");
        if (resOrders.ok) {
          const dataOrders = await resOrders.json();
          setOrders(dataOrders.orders || []);
        }

        // Fetch Real Products
        const resProd = await fetch("/api/products");
        if (resProd.ok) {
          const dataProd = await resProd.json();
          setProducts(dataProd.products || []);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatPrice = (price: number) => {
    return `Rp ${(price || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };

  // Calculate real live metrics
  const totalRevenue = orders
    .filter((o) => o.status === "PAID" || o.status === "COMPLETED")
    .reduce((sum, o) => sum + (o.finalTotal || 0), 0);

  const totalOrdersCount = orders.length;
  const completedOrdersCount = orders.filter((o) => o.status === "PAID" || o.status === "COMPLETED").length;
  const lowStockCount = products.filter((p) => (p.stock || 0) < 20).length;

  const displayOrders = orders.length > 0 ? orders.slice(0, 5) : [
    {
      id: "ord-demo-1",
      orderNumber: "#ORD-2024-8901",
      customerName: "Jaya Bakso Group",
      city: "Jakarta Selatan",
      finalTotal: 42500000,
      status: "COMPLETED",
      createdAt: new Date().toISOString(),
    },
    {
      id: "ord-demo-2",
      orderNumber: "#ORD-2024-8905",
      customerName: "Frozen Mart Central",
      city: "Surabaya Timur",
      finalTotal: 12800000,
      status: "PAID",
      createdAt: new Date().toISOString(),
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-[#1a1c1c] font-sans antialiased flex">
      {/* Shared Reusable Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content Canvas */}
      <main className="md:ml-[280px] flex-1 min-h-screen p-4 md:p-8 lg:p-12">
        {/* Header & Quick Actions */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#51000d] tracking-tight">
              Ringkasan Performa Real-Time
            </h2>
            <p className="text-xs md:text-sm text-gray-500 font-medium mt-1">
              Pantau total penjualan lunas, riwayat pesanan, dan stok produk secara langsung.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/orders"
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-[#51000d] rounded-xl text-xs font-bold hover:bg-gray-50 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-base">receipt_long</span>
              <span>Kelola Pesanan</span>
            </Link>
            <Link
              href="/admin/inventory"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#51000d] hover:bg-[#7a0019] text-white rounded-xl text-xs font-bold shadow-md transition-all uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>Tambah Produk</span>
            </Link>
          </div>
        </header>

        {/* KPI Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Sales */}
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-red-50 text-[#51000d] rounded-xl">
                <span className="material-symbols-outlined text-2xl">payments</span>
              </div>
              <span className="text-green-600 font-bold text-xs flex items-center gap-0.5 bg-green-50 px-2 py-0.5 rounded-md border border-green-200">
                <span>Real-Time DB</span>
              </span>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Penjualan Lunas</p>
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mt-1">
              {isLoading ? "Memuat..." : formatPrice(totalRevenue)}
            </h3>
            <p className="text-[11px] text-gray-500 mt-2">Dari total {completedOrdersCount} pesanan terbayar</p>
          </div>

          {/* Active Orders */}
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
                <span className="material-symbols-outlined text-2xl">local_shipping</span>
              </div>
              <span className="text-amber-700 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                {totalOrdersCount} Total
              </span>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Jumlah Pesanan Masuk</p>
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mt-1">
              {isLoading ? "Memuat..." : `${totalOrdersCount} Pesanan`}
            </h3>
            <p className="text-[11px] text-gray-500 mt-2">Termasuk pembayaran Midtrans &amp; COD</p>
          </div>

          {/* Low Stock Warning */}
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                <span className="material-symbols-outlined text-2xl">warning</span>
              </div>
              <span className="text-orange-600 font-bold text-xs bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                Peringatan Stok
              </span>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Produk Stok Menipis</p>
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mt-1">
              {isLoading ? "Memuat..." : `${lowStockCount} Produk`}
            </h3>
            <p className="text-[11px] text-gray-500 mt-2">Segera lakukan restok produk Bakso Pak Mul</p>
          </div>
        </section>

        {/* Recent Orders Section */}
        <section className="bg-white rounded-[24px] p-6 md:p-8 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Pesanan Terbaru Masuk</h3>
              <p className="text-xs text-gray-500">Daftar transaksi yang baru saja dilakukan pelanggan</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-[#51000d] hover:underline flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="pb-3 px-2">No. Pesanan</th>
                  <th className="pb-3 px-2">Pelanggan</th>
                  <th className="pb-3 px-2">Kota</th>
                  <th className="pb-3 px-2 text-right">Total Tagihan</th>
                  <th className="pb-3 px-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-medium">
                {displayOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-2 font-mono font-bold text-[#51000d]">
                      {o.orderNumber || `#${o.id.substring(0, 8)}`}
                    </td>
                    <td className="py-4 px-2 font-bold text-gray-900">{o.customerName || "Pelanggan"}</td>
                    <td className="py-4 px-2 text-gray-500">{o.city || "Jawa Tengah"}</td>
                    <td className="py-4 px-2 text-right font-black text-gray-900">{formatPrice(o.finalTotal)}</td>
                    <td className="py-4 px-2 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        o.status === "PAID" || o.status === "COMPLETED" 
                          ? "bg-emerald-100 text-emerald-800"
                          : o.status === "CANCELED"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {o.status === "PAID" ? "LUNAS" : o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
