"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua Status");
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Selected Order for Modal Detail
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<any | null>(null);
  
  // Cancel order target
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
          let statusText = "Menunggu Pembayaran";
          let statusBg = "bg-amber-50 text-amber-800 border-amber-200";
          let statusBadgeIcon = "schedule";
          
          if (o.status === "COMPLETED") {
            statusText = "Pesanan Selesai";
            statusBg = "bg-emerald-50 text-emerald-800 border-emerald-200";
            statusBadgeIcon = "check_circle";
          } else if (o.status === "CANCELED" || o.status === "CANCELLED") {
            statusText = "Dibatalkan";
            statusBg = "bg-rose-50 text-rose-800 border-rose-200";
            statusBadgeIcon = "cancel";
          } else if (o.status === "PROCESSING" || o.status === "PAID") {
            statusText = "Lunas - Siap Dikemas";
            statusBg = "bg-blue-50 text-blue-800 border-blue-200";
            statusBadgeIcon = "inventory_2";
          } else if (o.status === "SHIPPED") {
            statusText = "Dalam Pengiriman";
            statusBg = "bg-indigo-50 text-indigo-800 border-indigo-200";
            statusBadgeIcon = "local_shipping";
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
            statusBg,
            statusBadgeIcon,
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
        if (selectedOrderDetail && selectedOrderDetail.id === orderId) {
          setSelectedOrderDetail((prev: any) => (prev ? { ...prev, status: newStatus } : null));
        }
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
    showToast("Laporan Penjualan Excel/CSV berhasil diunduh!");
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (o.customerName && o.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (o.phone && o.phone.includes(searchQuery));
    
    let matchesStatus = true;
    if (filterStatus !== "Semua Status") {
      if (filterStatus === "Selesai" && o.status !== "COMPLETED") matchesStatus = false;
      if (filterStatus === "Perlu Diproses" && (o.status !== "PROCESSING" && o.status !== "PAID")) matchesStatus = false;
      if (filterStatus === "Menunggu Bayar" && (o.status !== "PENDING" && o.status !== "AWAITING_PAYMENT")) matchesStatus = false;
      if (filterStatus === "Dibatalkan" && o.status !== "CANCELED" && o.status !== "CANCELLED") matchesStatus = false;
    }
    
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price: number) => {
    return `Rp ${(price || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };

  // Stats calculation
  const totalOrdersCount = orders.length;
  const pendingProcessingCount = orders.filter((o) => o.status === "PROCESSING" || o.status === "PAID" || o.status === "PENDING" || o.status === "AWAITING_PAYMENT").length;
  const completedOrdersCount = orders.filter((o) => o.status === "COMPLETED").length;
  const totalOmset = orders.filter((o) => o.status === "COMPLETED" || o.status === "PAID" || o.status === "PROCESSING").reduce((acc, o) => acc + (o.finalTotal || 0), 0);

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] text-gray-900 font-sans antialiased">
      {/* Admin Sidebar */}
      <AdminSidebar activeMenu="orders" />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 p-4 md:p-8 max-w-7xl">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-6 right-6 bg-[#51000d] text-white px-5 py-3 rounded-2xl shadow-xl z-50 flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300 text-xs font-bold">
            <span className="material-symbols-outlined text-lg text-emerald-400">check_circle</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header Section */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[#51000d] tracking-tight">
              📋 Kelola Pesanan Pelanggan
            </h1>
            <p className="text-xs md:text-sm text-gray-500 font-medium mt-1">
              Daftar transaksi masuk, cetak rekap struk, dan perbarui status pengiriman secara cepat &amp; mudah.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportExcel}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>Unduh Rekap Excel</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">print</span>
              <span>Cetak Cetakan</span>
            </button>
          </div>
        </div>

        {/* Quick Summary Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined">shopping_bag</span>
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500">Total Transaksi</p>
              <p className="text-lg font-black text-gray-900">{totalOrdersCount} Pesanan</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-800 rounded-xl flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined">hourglass_top</span>
            </div>
            <div>
              <p className="text-[11px] font-bold text-blue-600">Perlu Diproses</p>
              <p className="text-lg font-black text-blue-900">{pendingProcessingCount} Pesanan</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined">task_alt</span>
            </div>
            <div>
              <p className="text-[11px] font-bold text-emerald-600">Pesanan Selesai</p>
              <p className="text-lg font-black text-emerald-900">{completedOrdersCount} Pesanan</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <div>
              <p className="text-[11px] font-bold text-amber-700">Total Omset Penjualan</p>
              <p className="text-lg font-black text-gray-900">{formatPrice(totalOmset)}</p>
            </div>
          </div>
        </div>

        {/* Toolbar Filter & Cari */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-3 justify-between items-center">
          {/* Form Cari */}
          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Cari nama pemesan / no. transaksi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#51000d]/20 transition-all border border-gray-200"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {["Semua Status", "Perlu Diproses", "Menunggu Bayar", "Selesai", "Dibatalkan"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  filterStatus === status
                    ? "bg-[#51000d] text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Table Main Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-100/70 text-gray-600">
                  <th className="px-5 py-3.5 text-xs font-extrabold uppercase">No. Pesanan</th>
                  <th className="px-5 py-3.5 text-xs font-extrabold uppercase">Nama Pembeli</th>
                  <th className="px-5 py-3.5 text-xs font-extrabold uppercase">Total Belanja</th>
                  <th className="px-5 py-3.5 text-xs font-extrabold uppercase">Status Pesanan</th>
                  <th className="px-5 py-3.5 text-xs font-extrabold uppercase text-center">Ubah Status</th>
                  <th className="px-5 py-3.5 text-xs font-extrabold uppercase text-center">Tindakan Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-xs">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm font-semibold text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-[#51000d] border-t-transparent rounded-full animate-spin"></div>
                        <span>Memuat data pesanan...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm font-medium text-gray-500">
                      Tidak ditemukan pesanan dengan kata kunci tersebut.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-amber-50/40 transition-colors">
                      {/* No. Pesanan */}
                      <td className="px-5 py-4">
                        <p className="font-extrabold text-[#51000d] font-mono text-sm">{order.orderNumber}</p>
                        <p className="text-[11px] text-gray-500 font-medium mt-0.5">{order.date}</p>
                      </td>

                      {/* Nama & Kontak */}
                      <td className="px-5 py-4">
                        <p className="font-bold text-gray-900 text-sm">{order.customerName}</p>
                        <p className="text-[11px] text-gray-500 font-medium">
                          📍 {order.city || order.province || "Alamat tercantum"}
                        </p>
                      </td>

                      {/* Total */}
                      <td className="px-5 py-4">
                        <p className="font-black text-gray-900 text-sm">{formatPrice(order.finalTotal)}</p>
                        <p className="text-[11px] text-gray-500 font-medium">{order.totalItems} Barang</p>
                      </td>

                      {/* Badge Status */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border ${order.statusBg}`}>
                          <span className="material-symbols-outlined text-sm">{order.statusBadgeIcon}</span>
                          <span>{order.statusText}</span>
                        </span>
                      </td>

                      {/* Dropdown Ubah Status */}
                      <td className="px-5 py-4 text-center">
                        <select
                          disabled={updatingId === order.id}
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-gray-50 text-gray-800 border border-gray-300 hover:border-[#51000d] cursor-pointer outline-none transition-all shadow-sm"
                        >
                          <option value="PENDING">⏳ Menunggu Pembayaran</option>
                          <option value="PROCESSING">📦 Diproses / Dikemas</option>
                          <option value="SHIPPED">🚚 Dalam Pengiriman</option>
                          <option value="COMPLETED">✅ Selesai (Diterima)</option>
                          <option value="CANCELED">❌ Batalkan Pesanan</option>
                        </select>
                      </td>

                      {/* Tombol Aksi Jelas dengan Teks */}
                      <td className="px-5 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Tombol Lihat Detail */}
                          <button
                            onClick={() => setSelectedOrderDetail(order)}
                            className="px-2.5 py-1.5 bg-[#51000d] text-white hover:bg-[#380009] rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                            title="Buka Rincian Pesanan"
                          >
                            <span className="material-symbols-outlined text-sm">visibility</span>
                            <span>Detail</span>
                          </button>

                          {/* Tombol Cetak Struk */}
                          <a
                            href={`/transaksi/${order.orderNumber}?print=true`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-bold transition-all border border-gray-300 flex items-center gap-1 cursor-pointer"
                            title="Cetak Resi Struk Invoice"
                          >
                            <span className="material-symbols-outlined text-sm">print</span>
                            <span>Struk</span>
                          </a>

                          {/* Tombol Batalkan */}
                          {order.status !== "CANCELED" && order.status !== "CANCELLED" && (
                            <button
                              onClick={() => setCancelTargetOrder(order)}
                              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition-all border border-rose-200 flex items-center gap-1 cursor-pointer"
                              title="Batalkan Pesanan Ini"
                            >
                              <span className="material-symbols-outlined text-sm">cancel</span>
                              <span>Batal</span>
                            </button>
                          )}
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

      {/* MODAL VIEW DETAIL PESANAN LENGKAP */}
      {selectedOrderDetail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-150 border border-gray-100 my-8">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b pb-4 border-gray-100">
              <div>
                <span className="text-[11px] font-bold text-gray-500 uppercase">Rincian Lengkap Transaksi</span>
                <h2 className="text-xl font-black text-[#51000d] font-mono mt-0.5">{selectedOrderDetail.orderNumber}</h2>
                <p className="text-xs text-gray-500 font-medium">Tanggal: {selectedOrderDetail.date}</p>
              </div>

              <button
                onClick={() => setSelectedOrderDetail(null)}
                className="w-9 h-9 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Customer Info Card */}
            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#51000d] flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">person</span>
                  Informasi Pembeli
                </span>

                {selectedOrderDetail.phone && (
                  <a
                    href={`https://wa.me/${selectedOrderDetail.phone.replace(/[^0-9]/g, "")}?text=Halo%20${encodeURIComponent(selectedOrderDetail.customerName)},%20kami%20dari%20Bakso%20Pak%20Mul%20mengenai%20pesanan%20${selectedOrderDetail.orderNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">chat</span>
                    <span>Chat WhatsApp</span>
                  </a>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-gray-500 font-medium">Nama Pelanggan:</p>
                  <p className="font-bold text-gray-900">{selectedOrderDetail.customerName || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Nomor WhatsApp / HP:</p>
                  <p className="font-bold text-gray-900">{selectedOrderDetail.phone || "-"}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-gray-500 font-medium">Alamat Pengiriman Lengkap:</p>
                  <p className="font-bold text-gray-900">
                    {selectedOrderDetail.shippingAddress || "-"}{selectedOrderDetail.city ? `, ${selectedOrderDetail.city}` : ""}{selectedOrderDetail.province ? `, ${selectedOrderDetail.province}` : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Ordered Items List */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-gray-800 uppercase flex items-center gap-1">
                <span className="material-symbols-outlined text-base">shopping_cart</span>
                Daftar Barang Dipesan ({selectedOrderDetail.items?.length || 0} Jenis)
              </h3>

              <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden max-h-48 overflow-y-auto">
                {(selectedOrderDetail.items || []).map((item: any, idx: number) => (
                  <div key={idx} className="p-3 bg-white flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-gray-900">{item.productName || item.product?.name || "Produk Bakso Pak Mul"}</p>
                      <p className="text-[11px] text-gray-500">Jumlah: {item.quantity} x {formatPrice(item.price)}</p>
                    </div>
                    <span className="font-extrabold text-gray-900">{formatPrice(item.quantity * item.price)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Breakdown */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal Barang:</span>
                <span className="font-bold">{formatPrice(selectedOrderDetail.totalAmount || selectedOrderDetail.finalTotal)}</span>
              </div>
              {selectedOrderDetail.shippingFee > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Ongkos Kirim:</span>
                  <span className="font-bold">{formatPrice(selectedOrderDetail.shippingFee)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-[#51000d] pt-2 border-t border-gray-200">
                <span>TOTAL AKHIR PEMBAYARAN:</span>
                <span>{formatPrice(selectedOrderDetail.finalTotal)}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2">
              <a
                href={`/transaksi/${selectedOrderDetail.orderNumber}?print=true`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">print</span>
                <span>Cetak Struk Resmi</span>
              </a>

              <button
                onClick={() => setSelectedOrderDetail(null)}
                className="px-5 py-2.5 bg-[#51000d] text-white rounded-xl text-xs font-bold shadow-md hover:bg-[#380009] transition-all cursor-pointer"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION CANCEL MODAL */}
      {cancelTargetOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 border border-gray-100">
            <div className="w-12 h-12 bg-rose-100 text-rose-700 rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">warning</span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900">Batalkan Pesanan Ini?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Apakah Anda yakin ingin membatalkan pesanan <span className="font-black text-[#51000d]">{cancelTargetOrder.orderNumber}</span> milik customer <span className="font-bold text-gray-800">{cancelTargetOrder.customerName}</span>? Status akan diubah menjadi <span className="font-bold text-rose-600">Dibatalkan</span>.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setCancelTargetOrder(null)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Batal (Kembali)
              </button>
              <button
                onClick={confirmCancelOrder}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
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
