"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Selected Order for Modal Detail
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<any | null>(null);
  
  // Cancel target
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
          let statusText = "Menunggu";
          let statusBg = "bg-amber-500/10 text-amber-900 border-amber-300/40";
          let statusBadgeIcon = "hourglass_top";
          
          if (o.status === "COMPLETED" || o.status === "PAID" || o.status === "PROCESSING") {
            statusText = "Disetujui";
            statusBg = "bg-emerald-500/10 text-emerald-900 border-emerald-300/40";
            statusBadgeIcon = "check_circle";
          } else if (o.status === "CANCELED" || o.status === "CANCELLED") {
            statusText = "Dibatalkan";
            statusBg = "bg-rose-500/10 text-rose-900 border-rose-300/40";
            statusBadgeIcon = "cancel";
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
        showToast(newStatus === "COMPLETED" ? "Pesanan berhasil disetujui!" : "Status pesanan diperbarui!");
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
    showToast(`Pesanan ${cancelTargetOrder.orderNumber} telah dibatalkan.`);
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
    showToast("Laporan Penjualan Excel (.CSV) berhasil diunduh!");
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (o.customerName && o.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (o.phone && o.phone.includes(searchQuery));
    
    let matchesStatus = true;
    if (filterStatus !== "Semua") {
      if (filterStatus === "Menunggu" && o.statusText !== "Menunggu") matchesStatus = false;
      if (filterStatus === "Disetujui" && o.statusText !== "Disetujui") matchesStatus = false;
      if (filterStatus === "Dibatalkan" && o.statusText !== "Dibatalkan") matchesStatus = false;
    }
    
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price: number) => {
    return `Rp ${(price || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };

  // Stats calculation
  const totalOrdersCount = orders.length;
  const pendingCount = orders.filter((o) => o.statusText === "Menunggu").length;
  const approvedCount = orders.filter((o) => o.statusText === "Disetujui").length;
  const totalOmset = orders.filter((o) => o.statusText === "Disetujui").reduce((acc, o) => acc + (o.finalTotal || 0), 0);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#FDFBF7] text-[#1A1C1C] font-sans antialiased">
      {/* Admin Sidebar */}
      <AdminSidebar activeMenu="orders" />

      {/* Main Content Canvas */}
      <main className="flex-1 w-full lg:ml-[260px] min-h-screen p-4 md:p-8 lg:p-10 relative max-w-7xl pb-28 lg:pb-12">
        {/* Floating Luxury Toast */}
        {toastMessage && (
          <div className="fixed top-16 lg:top-6 right-4 lg:right-6 bg-gradient-to-r from-[#3d000a] to-[#51000d] text-white px-5 py-3.5 rounded-2xl shadow-2xl z-50 flex items-center gap-2.5 border border-amber-500/30 text-xs font-bold animate-in fade-in duration-200">
            <span className="material-symbols-outlined text-amber-400 text-lg">check_circle</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-900 border border-amber-300/30 rounded-full text-[10px] font-black uppercase tracking-widest">
                Executive Order Panel
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-[#51000d] tracking-tight">
              Manajemen Pesanan Masuk
            </h1>
            <p className="text-xs md:text-sm text-gray-500 font-medium mt-1">
              Setujui transaksi masuk dan kelola struk resmi pelanggan dengan sekali sentuh.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleExportExcel}
              className="px-4 py-2.5 bg-gradient-to-r from-[#51000d] to-[#7a0019] hover:brightness-110 text-white rounded-2xl text-xs font-black shadow-lg shadow-[#51000d]/15 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-lg text-amber-300">download</span>
              <span>Unduh Excel</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 rounded-2xl text-xs font-extrabold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg text-gray-600">print</span>
              <span>Cetak Struk</span>
            </button>
          </div>
        </div>

        {/* Executive Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-5 mb-8">
          <div className="bg-white p-4 md:p-5 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(81,0,13,0.04)] flex items-center gap-3.5">
            <div className="w-11 h-11 bg-[#51000d]/10 text-[#51000d] rounded-2xl flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">shopping_bag</span>
            </div>
            <div>
              <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Total Transaksi</p>
              <p className="text-lg md:text-xl font-black text-gray-900">{totalOrdersCount} Pesanan</p>
            </div>
          </div>

          <div className="bg-white p-4 md:p-5 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(81,0,13,0.04)] flex items-center gap-3.5">
            <div className="w-11 h-11 bg-amber-500/10 text-amber-800 rounded-2xl flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">hourglass_top</span>
            </div>
            <div>
              <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Menunggu</p>
              <p className="text-lg md:text-xl font-black text-gray-900">{pendingCount} Pesanan</p>
            </div>
          </div>

          <div className="bg-white p-4 md:p-5 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(81,0,13,0.04)] flex items-center gap-3.5">
            <div className="w-11 h-11 bg-emerald-500/10 text-emerald-800 rounded-2xl flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">verified</span>
            </div>
            <div>
              <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Disetujui</p>
              <p className="text-lg md:text-xl font-black text-gray-900">{approvedCount} Pesanan</p>
            </div>
          </div>

          <div className="bg-white p-4 md:p-5 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(81,0,13,0.04)] flex items-center gap-3.5">
            <div className="w-11 h-11 bg-gradient-to-br from-amber-400 to-amber-500 text-[#51000d] rounded-2xl flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
              <span className="material-symbols-outlined text-2xl font-bold">payments</span>
            </div>
            <div>
              <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Omset Disetujui</p>
              <p className="text-lg md:text-xl font-black text-[#51000d]">{formatPrice(totalOmset)}</p>
            </div>
          </div>
        </div>

        {/* Toolbar Cari & Filter */}
        <div className="bg-white p-4 rounded-3xl shadow-[0_8px_30px_rgb(81,0,13,0.04)] border border-gray-100 mb-8 flex flex-col md:flex-row gap-3 justify-between items-center">
          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Cari pemesan atau nomor pesanan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50/80 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#51000d]/20 transition-all border border-gray-200/80"
            />
          </div>

          {/* Luxury Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {["Semua", "Menunggu", "Disetujui", "Dibatalkan"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                  filterStatus === status
                    ? "bg-[#51000d] text-white shadow-md shadow-[#51000d]/20"
                    : "bg-gray-100/80 text-gray-600 hover:bg-gray-200/80"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* ==================== MOBILE CARDS LAYOUT (< md) ==================== */}
        <div className="md:hidden space-y-3.5 mb-8">
          {isLoading ? (
            <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center text-xs text-gray-500 font-bold shadow-xs">
              Memuat data pesanan...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center text-xs text-gray-500 font-bold shadow-xs">
              Tidak ada pesanan ditemukan.
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white p-4.5 rounded-3xl border border-gray-100 shadow-[0_8px_25px_rgb(81,0,13,0.04)] space-y-3">
                <div className="flex items-start justify-between border-b pb-3 border-gray-100">
                  <div>
                    <span className="font-extrabold text-[#51000d] font-mono text-sm">{order.orderNumber}</span>
                    <p className="text-[11px] text-gray-400 font-medium">{order.date}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-[11px] font-black border ${order.statusBg}`}>
                    <span className="material-symbols-outlined text-xs">{order.statusBadgeIcon}</span>
                    <span>{order.statusText}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div>
                    <p className="font-extrabold text-gray-900">{order.customerName}</p>
                    <p className="text-[11px] text-gray-500 font-medium">📍 {order.city || order.province || "Alamat tercantum"}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-[#51000d] text-base">{formatPrice(order.finalTotal)}</p>
                    <p className="text-[10px] text-gray-500 font-bold">{order.totalItems} Barang</p>
                  </div>
                </div>

                {/* Touch-Friendly Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => setSelectedOrderDetail(order)}
                    className="flex-1 py-2.5 bg-[#51000d] text-white rounded-2xl text-xs font-black flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-sm">visibility</span>
                    <span>Detail</span>
                  </button>

                  {order.statusText !== "Disetujui" && (
                    <button
                      disabled={updatingId === order.id}
                      onClick={() => handleStatusChange(order.id, "COMPLETED")}
                      className="flex-1 py-2.5 bg-emerald-700 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                    >
                      <span className="material-symbols-outlined text-sm">check</span>
                      <span>Setujui</span>
                    </button>
                  )}

                  {order.statusText !== "Dibatalkan" && (
                    <button
                      onClick={() => setCancelTargetOrder(order)}
                      className="px-3.5 py-2.5 bg-gray-100 text-gray-700 rounded-2xl text-xs font-black flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                      <span>Batal</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* ==================== DESKTOP TABLE LAYOUT (>= md) ==================== */}
        <div className="hidden md:block bg-white rounded-3xl shadow-[0_8px_30px_rgb(81,0,13,0.04)] border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200/80 bg-gray-50/70 text-gray-500">
                  <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider">No. Pesanan</th>
                  <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider">Pelanggan</th>
                  <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider">Total Belanja</th>
                  <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-center">Aksi Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-medium">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm font-semibold text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-[#51000d] border-t-transparent rounded-full animate-spin"></div>
                        <span>Memuat data pesanan...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm font-medium text-gray-500">
                      Tidak ada pesanan ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-extrabold text-[#51000d] font-mono text-sm">{order.orderNumber}</p>
                        <p className="text-[11px] text-gray-400 font-medium mt-0.5">{order.date}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900 text-sm">{order.customerName}</p>
                        <p className="text-[11px] text-gray-500 font-medium">
                          📍 {order.city || order.province || "Alamat tercantum"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-black text-gray-900 text-sm">{formatPrice(order.finalTotal)}</p>
                        <p className="text-[11px] text-gray-500 font-medium">{order.totalItems} Barang</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-black border ${order.statusBg}`}>
                          <span className="material-symbols-outlined text-sm">{order.statusBadgeIcon}</span>
                          <span>{order.statusText}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedOrderDetail(order)}
                            className="px-3.5 py-2 bg-[#51000d] text-white hover:bg-[#380009] rounded-xl text-xs font-extrabold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                            title="Lihat Detail Rincian Pesanan"
                          >
                            <span className="material-symbols-outlined text-sm">visibility</span>
                            <span>Detail</span>
                          </button>

                          {order.statusText !== "Disetujui" && (
                            <button
                              disabled={updatingId === order.id}
                              onClick={() => handleStatusChange(order.id, "COMPLETED")}
                              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-extrabold transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                              title="Setujui dan selesaikan pesanan ini"
                            >
                              <span className="material-symbols-outlined text-sm">check</span>
                              <span>Setujui</span>
                            </button>
                          )}

                          {order.statusText !== "Dibatalkan" && (
                            <button
                              onClick={() => setCancelTargetOrder(order)}
                              className="px-3.5 py-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1 cursor-pointer"
                              title="Batalkan pesanan ini"
                            >
                              <span className="material-symbols-outlined text-sm">close</span>
                              <span>Batalkan</span>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[90] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 md:p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 border border-gray-100 my-8 text-xs">
            <div className="flex items-start justify-between border-b pb-3.5 border-gray-100">
              <div>
                <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">Rincian Pesanan Resmi</span>
                <h2 className="text-lg font-black text-[#51000d] font-mono mt-1">{selectedOrderDetail.orderNumber}</h2>
                <p className="text-xs text-gray-500 font-medium">Tanggal: {selectedOrderDetail.date}</p>
              </div>

              <button
                onClick={() => setSelectedOrderDetail(null)}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-black text-[#51000d] text-xs flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">person</span>
                  Informasi Pembeli
                </span>

                {selectedOrderDetail.phone && (
                  <a
                    href={`https://wa.me/${selectedOrderDetail.phone.replace(/[^0-9]/g, "")}?text=Halo%20${encodeURIComponent(selectedOrderDetail.customerName)},%20kami%20dari%20Bakso%20Pak%20Mul%20mengenai%20pesanan%20${selectedOrderDetail.orderNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-[#51000d] text-white hover:bg-[#380009] rounded-xl text-[11px] font-extrabold transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-xs text-amber-300">chat</span>
                    <span>Chat WhatsApp</span>
                  </a>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-gray-400 font-bold">Nama:</p>
                  <p className="font-black text-gray-900">{selectedOrderDetail.customerName || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-bold">Nomor WhatsApp:</p>
                  <p className="font-black text-gray-900">{selectedOrderDetail.phone || "-"}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-gray-400 font-bold">Alamat Pengiriman:</p>
                  <p className="font-bold text-gray-900">
                    {selectedOrderDetail.shippingAddress || "-"}{selectedOrderDetail.city ? `, ${selectedOrderDetail.city}` : ""}{selectedOrderDetail.province ? `, ${selectedOrderDetail.province}` : ""}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-black text-gray-800 uppercase flex items-center gap-1 text-[11px] tracking-wider">
                <span className="material-symbols-outlined text-base text-[#51000d]">shopping_cart</span>
                Daftar Barang ({selectedOrderDetail.items?.length || 0} Jenis)
              </h3>

              <div className="divide-y divide-gray-100 border border-gray-200/80 rounded-2xl overflow-hidden max-h-36 overflow-y-auto bg-white">
                {(selectedOrderDetail.items || []).map((item: any, idx: number) => (
                  <div key={idx} className="p-3 flex items-center justify-between">
                    <div>
                      <p className="font-extrabold text-gray-900">{item.productName || item.product?.name || "Produk Bakso Pak Mul"}</p>
                      <p className="text-[11px] text-gray-500 font-medium">{item.quantity} x {formatPrice(item.price)}</p>
                    </div>
                    <span className="font-black text-gray-900">{formatPrice(item.quantity * item.price)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200/80 space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Subtotal Barang:</span>
                <span className="font-bold">{formatPrice(selectedOrderDetail.totalAmount || selectedOrderDetail.finalTotal)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-[#51000d] pt-2 border-t border-gray-200">
                <span>TOTAL AKHIR:</span>
                <span>{formatPrice(selectedOrderDetail.finalTotal)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href={`/transaksi/${selectedOrderDetail.orderNumber}?print=true`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">print</span>
                <span>Cetak Struk</span>
              </a>

              <button
                onClick={() => setSelectedOrderDetail(null)}
                className="px-6 py-2.5 bg-[#51000d] text-white rounded-xl text-xs font-bold hover:bg-[#380009] transition-all cursor-pointer shadow-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION CANCEL MODAL */}
      {cancelTargetOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[90] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 border border-gray-100 text-xs">
            <div className="w-11 h-11 bg-[#51000d]/10 text-[#51000d] rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">warning</span>
            </div>

            <div>
              <h3 className="text-base font-black text-gray-900">Batalkan Pesanan Ini?</h3>
              <p className="text-gray-500 mt-1.5 font-medium">
                Apakah Anda yakin ingin membatalkan pesanan <span className="font-black text-[#51000d]">{cancelTargetOrder.orderNumber}</span> milik customer <span className="font-bold text-gray-800">{cancelTargetOrder.customerName}</span>?
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCancelTargetOrder(null)}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all cursor-pointer"
              >
                Kembali
              </button>
              <button
                onClick={confirmCancelOrder}
                className="px-5 py-2.5 bg-[#51000d] hover:bg-[#380009] text-white rounded-xl font-bold shadow-xs transition-all cursor-pointer"
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
