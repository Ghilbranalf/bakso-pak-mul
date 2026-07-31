"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua Status");
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Cancel order modal state
  const [cancelTargetOrder, setCancelTargetOrder] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/orders");
      const data = await res.json();
      
      if (data.orders) {
        const formattedOrders = data.orders.map((o: any) => {
          let statusText = o.status;
          let statusColor = "bg-gray-100 text-gray-800";
          
          if (o.status === "COMPLETED") {
            statusText = "Selesai";
            statusColor = "bg-green-100 text-green-800 border border-green-200";
          } else if (o.status === "CANCELED" || o.status === "CANCELLED") {
            statusText = "Dibatalkan";
            statusColor = "bg-red-100 text-red-800 border border-red-200";
          } else if (o.status === "PROCESSING" || o.status === "PAID") {
            statusText = "Diproses";
            statusColor = "bg-blue-100 text-blue-800 border border-blue-200";
          } else if (o.status === "PENDING" || o.status === "AWAITING_PAYMENT") {
            statusText = "Menunggu Pembayaran";
            statusColor = "bg-yellow-100 text-yellow-800 border border-yellow-200";
          }

          const date = new Date(o.createdAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          });

          return {
            ...o,
            date,
            statusText,
            statusColor,
            totalItems: (o.items || []).reduce((acc: number, item: any) => acc + item.quantity, 0)
          };
        });
        
        setOrders(formattedOrders);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingId(orderId);
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        showToast("Status pesanan berhasil diperbarui!");
        fetchOrders();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const confirmCancelOrder = async () => {
    if (!cancelTargetOrder) return;
    await handleStatusChange(cancelTargetOrder.id, "CANCELED");
    showToast(`Pesanan ${cancelTargetOrder.orderNumber} berhasil dibatalkan.`);
    setCancelTargetOrder(null);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExportExcel = () => {
    if (orders.length === 0) return alert("Tidak ada data pesanan untuk diekspor.");

    const headers = ["No Pesanan", "Tanggal", "Nama Pelanggan", "No HP", "Kota", "Provinsi", "Metode Pembayaran", "Total Tagihan (Rp)", "Status"];
    const csvRows = [headers.join(",")];

    filteredOrders.forEach((o) => {
      const row = [
        `"${o.orderNumber}"`,
        `"${o.date}"`,
        `"${o.customerName || "-"}"`,
        `"${o.phone || "-"}"`,
        `"${o.city || "-"}"`,
        `"${o.province || "-"}"`,
        `"${o.paymentType || "Online"}"`,
        `"${o.finalTotal || 0}"`,
        `"${o.statusText || o.status}"`
      ];
      csvRows.push(row.join(","));
    });

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Penjualan_Bakso_Pak_Mul_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Laporan Penjualan (Excel/CSV) berhasil didownload!");
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (o.customerName && o.customerName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    let matchesStatus = true;
    if (filterStatus !== "Semua Status") {
      if (filterStatus === "Selesai" && o.status !== "COMPLETED") matchesStatus = false;
      if (filterStatus === "Diproses" && (o.status !== "PROCESSING" && o.status !== "PAID")) matchesStatus = false;
      if (filterStatus === "Menunggu" && (o.status !== "PENDING" && o.status !== "AWAITING_PAYMENT")) matchesStatus = false;
      if (filterStatus === "Dibatalkan" && o.status !== "CANCELED" && o.status !== "CANCELLED") matchesStatus = false;
    }
    
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price: number) => {
    return `Rp ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] text-gray-900 font-sans antialiased">
      {/* Admin Sidebar */}
      <AdminSidebar activeMenu="orders" />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 p-6 md:p-10 max-w-7xl">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-6 right-6 bg-[#51000d] text-white px-5 py-3 rounded-2xl shadow-xl z-50 flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300 text-xs font-bold">
            <span className="material-symbols-outlined text-lg text-green-400">check_circle</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#51000d] tracking-tight">
              Kelola Pesanan Masuk
            </h1>
            <p className="text-xs md:text-sm text-gray-500 font-medium mt-1">
              Pantau pesanan pelanggan, ubah status pengiriman, atau ekspor laporan keuangan.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportExcel}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>Export Laporan Excel (.CSV)</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-2xl text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">print</span>
              <span>Cetak PDF</span>
            </button>
          </div>
        </div>

        {/* Controls Toolbar: Search & Filter */}
        <div className="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
              search
            </span>
            <input
              type="text"
              placeholder="Cari berdasarkan No. Pesanan / Nama..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-2xl text-xs font-medium text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#51000d]/20 transition-all border border-gray-100"
            />
          </div>

          {/* Status Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {["Semua Status", "Menunggu", "Diproses", "Selesai", "Dibatalkan"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  filterStatus === status
                    ? "bg-[#51000d] text-white shadow-sm"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">No. Pesanan</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pelanggan</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Jumlah Item</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Pembayaran</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status Pesanan</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Aksi &amp; Pembatalan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                      Memuat pesanan...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                      Tidak ada pesanan yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-xs font-bold text-[#51000d]">{order.orderNumber}</p>
                          <p className="text-[10px] font-medium text-gray-400 mt-1">{order.date}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-semibold text-gray-900">{order.customerName}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{order.city || order.province}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md">
                          {order.totalItems} Barang
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-extrabold text-gray-900">
                        {formatPrice(order.finalTotal)}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          disabled={updatingId === order.id}
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer outline-none border transition-all ${order.statusColor}`}
                        >
                          <option value="PENDING">Menunggu Pembayaran</option>
                          <option value="PROCESSING">Diproses / Dikemas</option>
                          <option value="COMPLETED">Selesai (Diterima)</option>
                          <option value="CANCELED">Dibatalkan</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right flex items-center justify-end gap-1.5">
                        <a
                          href={`/transaksi/${order.orderNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-[#51000d] transition-all inline-block cursor-pointer"
                          title="Lihat Detail Pesanan"
                        >
                          <span className="material-symbols-outlined text-lg">visibility</span>
                        </a>
                        <a
                          href={`/transaksi/${order.orderNumber}?print=true`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-blue-600 transition-all inline-block cursor-pointer"
                          title="Cetak Struk / Invoice PDF"
                        >
                          <span className="material-symbols-outlined text-lg">print</span>
                        </a>
                        {order.status !== "CANCELED" && order.status !== "CANCELLED" && (
                          <button
                            onClick={() => setCancelTargetOrder(order)}
                            className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-all inline-block cursor-pointer"
                            title="Batalkan Pesanan Ini"
                          >
                            <span className="material-symbols-outlined text-lg">cancel</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* CONFIRMATION CANCEL MODAL */}
      {cancelTargetOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 border border-gray-100">
            <div className="w-12 h-12 bg-red-100 text-red-700 rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">error_med</span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900">Batalkan Pesanan Ini?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Apakah Anda yakin ingin membatalkan pesanan <span className="font-extrabold text-[#51000d]">{cancelTargetOrder.orderNumber}</span> milik customer <span className="font-bold text-gray-800">{cancelTargetOrder.customerName}</span>? Status akan diubah menjadi <span className="font-bold text-red-600">Dibatalkan</span>.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setCancelTargetOrder(null)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Kembali
              </button>
              <button
                onClick={confirmCancelOrder}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                Ya, Batalkan Pesanan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
