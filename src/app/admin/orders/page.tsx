"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { useAdminTheme } from "@/context/AdminThemeContext";

const formatPrice = (price: number) =>
  `Rp ${(price || 0).toLocaleString("id-ID")}`;

const getStatusDetails = (status: string) => {
  const s = (status || "").toUpperCase();
  if (s === "COMPLETED" || s === "PAID") {
    return {
      code: "COMPLETED",
      label: "Selesai",
      badgeClass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
      lightBadgeClass: "bg-emerald-100 text-emerald-700 border-emerald-200",
      icon: "check_circle",
      isNew: false,
      nextStatus: null,
      nextActionText: null,
      nextActionBg: null,
      nextActionIcon: null,
    };
  }
  if (s === "SHIPPED") {
    return {
      code: "SHIPPED",
      label: "Dikirim",
      badgeClass: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      lightBadgeClass: "bg-indigo-100 text-indigo-700 border-indigo-200",
      icon: "local_shipping",
      isNew: false,
      nextStatus: "COMPLETED",
      nextActionText: "Selesai",
      nextActionBg: "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30",
      lightNextActionBg: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm",
      nextActionIcon: "check",
    };
  }
  if (s === "PROCESSING") {
    return {
      code: "PROCESSING",
      label: "Dikemas",
      badgeClass: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      lightBadgeClass: "bg-blue-100 text-blue-700 border-blue-200",
      icon: "inventory_2",
      isNew: false,
      nextStatus: "SHIPPED",
      nextActionText: "Kirim Paket",
      nextActionBg: "bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30",
      lightNextActionBg: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm",
      nextActionIcon: "local_shipping",
    };
  }
  if (s === "CANCELED" || s === "CANCELLED") {
    return {
      code: "CANCELED",
      label: "Dibatalkan",
      badgeClass: "bg-white/5 text-white/30 border-white/10",
      lightBadgeClass: "bg-gray-100 text-gray-500 border-gray-200",
      icon: "cancel",
      isNew: false,
      nextStatus: null,
      nextActionText: null,
      nextActionBg: null,
      nextActionIcon: null,
    };
  }
  // Default: PENDING / NEW ORDER
  return {
    code: "PENDING",
    label: "Menunggu",
    badgeClass: "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse",
    lightBadgeClass: "bg-red-100 text-red-600 border-red-200 animate-pulse",
    icon: "notification_important",
    isNew: true,
    nextStatus: "PROCESSING",
    nextActionText: "Proses & Kemas",
    nextActionBg: "bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40",
    lightNextActionBg: "bg-[#51000d] hover:bg-[#7a0019] text-white shadow-sm",
    nextActionIcon: "package_2",
  };
};

export default function AdminOrdersPage() {
  const { isDark } = useAdminTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<any | null>(null);
  const [cancelTargetOrder, setCancelTargetOrder] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.orders) {
        const formatted = data.orders.map((o: any) => {
          const details = getStatusDetails(o.status);
          const date = new Date(o.createdAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
          return {
            ...o,
            date,
            statusDetails: details,
            statusText: details.label,
            totalItems: (o.items || []).reduce(
              (acc: number, i: any) => acc + i.quantity,
              0
            ),
          };
        });
        setOrders(formatted);
      }
    } catch (_) {
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
        if (selectedOrderDetail?.id === orderId) {
          const newDetails = getStatusDetails(newStatus);
          setSelectedOrderDetail((prev: any) =>
            prev ? { ...prev, status: newStatus, statusDetails: newDetails } : null
          );
        }
      }
    } catch (_) {
    } finally {
      setUpdatingId(null);
    }
  };

  const confirmCancelOrder = async () => {
    if (!cancelTargetOrder) return;
    await handleStatusChange(cancelTargetOrder.id, "CANCELED");
    showToast(`Pesanan ${cancelTargetOrder.orderNumber} dibatalkan.`);
    setCancelTargetOrder(null);
  };

  const handleExportCSV = () => {
    if (orders.length === 0) return alert("Tidak ada data untuk diekspor.");
    const headers = [
      "No Pesanan",
      "Tanggal",
      "Nama",
      "No HP",
      "Kota",
      "Total (Rp)",
      "Status",
    ];
    const rows = filteredOrders.map((o) =>
      [
        `"${o.orderNumber}"`,
        `"${o.date}"`,
        `"${o.customerName || "-"}"`,
        `"${o.phone || "-"}"`,
        `"${o.city || o.province || "-"}"`,
        `"${o.finalTotal || 0}"`,
        `"${o.statusDetails?.label}"`,
      ].join(",")
    );
    const csv =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = `Pesanan_BaksoPakMul_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Laporan CSV berhasil diunduh!");
  };

  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      o.orderNumber?.toLowerCase().includes(q) ||
      o.customerName?.toLowerCase().includes(q) ||
      o.phone?.includes(q);
    const matchStatus =
      filterStatus === "Semua" ||
      (filterStatus === "Menunggu" && o.statusDetails?.isNew) ||
      (filterStatus === "Dikemas" && o.statusDetails?.code === "PROCESSING") ||
      (filterStatus === "Dikirim" && o.statusDetails?.code === "SHIPPED") ||
      (filterStatus === "Selesai" && o.statusDetails?.code === "COMPLETED") ||
      (filterStatus === "Dibatalkan" && o.statusDetails?.code === "CANCELED");
    return matchSearch && matchStatus;
  });

  const pendingCount = orders.filter((o) => o.statusDetails?.isNew).length;
  const processingCount = orders.filter((o) => o.statusDetails?.code === "PROCESSING").length;
  const shippedCount = orders.filter((o) => o.statusDetails?.code === "SHIPPED").length;
  const completedCount = orders.filter((o) => o.statusDetails?.code === "COMPLETED").length;
  const canceledCount = orders.filter((o) => o.statusDetails?.code === "CANCELED").length;
  const totalOmset = orders
    .filter((o) => o.statusDetails?.code === "COMPLETED")
    .reduce((acc, o) => acc + (o.finalTotal || 0), 0);

  const filterTabs = [
    { label: "Semua", count: orders.length },
    { label: "Menunggu", count: pendingCount, isAlert: pendingCount > 0 },
    { label: "Dikemas", count: processingCount },
    { label: "Dikirim", count: shippedCount },
    { label: "Selesai", count: completedCount },
    { label: "Dibatalkan", count: canceledCount },
  ];

  return (
    <div className={`min-h-screen font-sans antialiased flex transition-colors ${
      isDark ? "bg-[#0f0f0f] text-white" : "bg-[#f8f9fa] text-gray-900"
    }`}>
      <AdminSidebar />

      <main className="flex-1 min-w-0 max-w-full overflow-x-hidden lg:ml-[240px] min-h-screen p-4 md:p-6 lg:p-8 pt-18 lg:pt-8 pb-32 lg:pb-8">
        {/* Toast */}
        {toastMessage && (
          <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm font-medium border ${
            isDark ? "bg-[#1a1a1a] border-amber-500/30 text-white" : "bg-[#51000d] border-amber-500/30 text-white"
          }`}>
            <span className="material-symbols-outlined text-amber-400 text-lg">
              check_circle
            </span>
            {toastMessage}
          </div>
        )}

        {/* Header */}
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className={`text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Pesanan Masuk</h1>
            <p className={`text-sm mt-0.5 ${isDark ? "text-white/40" : "text-gray-500"}`}>
              Konfirmasi &amp; kelola status pesanan pelanggan
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-medium transition-all shadow-sm cursor-pointer ${
                isDark ? "bg-[#1a1a1a] border-white/10 hover:border-white/20 text-white/70" : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
              }`}
            >
              <span className="material-symbols-outlined text-lg">download</span>
              <span>Ekspor CSV</span>
            </button>
          </div>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            {
              label: "Total Pesanan",
              value: orders.length,
              icon: "shopping_bag",
              color: isDark ? "text-white/60" : "text-gray-600",
            },
            {
              label: "Pesanan Baru",
              value: pendingCount,
              icon: "notification_important",
              color: pendingCount > 0 ? "text-red-500" : isDark ? "text-white/40" : "text-gray-400",
              isAlert: pendingCount > 0,
            },
            {
              label: "Dikemas / Kirim",
              value: processingCount + shippedCount,
              icon: "local_shipping",
              color: "text-blue-500",
            },
            {
              label: "Total Omset Selesai",
              value: formatPrice(totalOmset),
              icon: "payments",
              color: isDark ? "text-amber-400" : "text-[#51000d]",
              small: true,
            },
          ].map((s, i) => (
            <div
              key={i}
              className={`rounded-xl p-4 border transition-all ${
                s.isAlert
                  ? isDark
                    ? "bg-red-500/10 border-red-500/30"
                    : "bg-red-50 border-red-200"
                  : isDark
                  ? "bg-[#1a1a1a] border-white/5"
                  : "bg-white border-gray-200/80 shadow-sm"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`material-symbols-outlined text-lg ${s.color}`}>
                  {s.icon}
                </span>
                <p className={`text-xs font-medium ${isDark ? "text-white/40" : "text-gray-500"}`}>{s.label}</p>
              </div>
              <p
                className={`font-semibold ${isDark ? "text-white" : "text-gray-900"} ${
                  s.small ? "text-sm" : "text-xl"
                }`}
              >
                {s.value}
              </p>
            </div>
          ))}
        </section>

        {/* Search + Filter Tabs */}
        <div className={`rounded-xl border p-3 mb-4 flex flex-col sm:flex-row gap-3 items-center ${
          isDark ? "bg-[#1a1a1a] border-white/5" : "bg-white border-gray-200/80 shadow-sm"
        }`}>
          <div className="relative flex-1 w-full">
            <span className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg ${
              isDark ? "text-white/30" : "text-gray-400"
            }`}>
              search
            </span>
            <input
              type="text"
              placeholder="Cari nama atau nomor pesanan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg text-sm transition-all focus:outline-none ${
                isDark ? "bg-[#141414] border border-white/8 text-white placeholder-white/20 focus:border-white/20" : "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#51000d]"
              }`}
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {filterTabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setFilterStatus(tab.label)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  filterStatus === tab.label
                    ? isDark
                      ? "bg-white text-gray-900 shadow-sm"
                      : "bg-[#51000d] text-white shadow-sm"
                    : tab.isAlert
                    ? "bg-red-500/15 text-red-500 hover:bg-red-500/25 border border-red-500/30"
                    : isDark
                    ? "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                      filterStatus === tab.label
                        ? isDark ? "bg-gray-200 text-gray-700" : "bg-white/20 text-white"
                        : tab.isAlert
                        ? "bg-red-500 text-white"
                        : isDark ? "bg-white/10 text-white/40" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3 mb-4">
          {isLoading ? (
            <div className={`rounded-xl p-8 text-center text-sm border ${
              isDark ? "bg-[#1a1a1a] text-white/30 border-white/5" : "bg-white text-gray-400 border-gray-200"
            }`}>
              Memuat pesanan...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className={`rounded-xl p-10 text-center border ${
              isDark ? "bg-[#1a1a1a] border-white/5 text-white/30" : "bg-white border-gray-200 text-gray-400"
            }`}>
              <span className="material-symbols-outlined text-3xl opacity-30 mb-2 block">
                inbox
              </span>
              <p className="text-sm">Tidak ada pesanan ditemukan.</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const details = order.statusDetails || getStatusDetails(order.status);
              const isNew = details.isNew;

              return (
                <div
                  key={order.id}
                  className={`rounded-xl border p-4 space-y-3 transition-all ${
                    isNew
                      ? isDark
                        ? "bg-[#1f1a1a] border-red-500/40 border-l-4 border-l-red-500 shadow-lg"
                        : "bg-red-50/70 border-red-200 border-l-4 border-l-red-600 shadow-sm"
                      : isDark
                      ? "bg-[#141414] border-white/5 opacity-80"
                      : "bg-white border-gray-200/80 opacity-90 shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className={`font-semibold text-sm font-mono ${
                          isDark ? "text-amber-400" : "text-[#51000d]"
                        }`}>
                          {order.orderNumber}
                        </p>
                        {isNew && (
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        )}
                      </div>
                      <p className={`text-xs ${isDark ? "text-white/30" : "text-gray-400"}`}>{order.date}</p>
                    </div>
                    <span
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                        isDark ? details.badgeClass : details.lightBadgeClass
                      }`}
                    >
                      <span className="material-symbols-outlined text-xs">
                        {details.icon}
                      </span>
                      {details.label}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <div>
                      <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                        {order.customerName || "Pelanggan"}
                      </p>
                      <p className={`text-xs ${isDark ? "text-white/30" : "text-gray-400"}`}>
                        {[order.city, order.province].filter(Boolean).join(", ") || "—"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                        {formatPrice(order.finalTotal)}
                      </p>
                      <p className={`text-xs ${isDark ? "text-white/30" : "text-gray-400"}`}>
                        {order.totalItems} item
                      </p>
                    </div>
                  </div>

                  <div className={`flex gap-2 pt-1 border-t ${isDark ? "border-white/5" : "border-gray-100"}`}>
                    <button
                      onClick={() => setSelectedOrderDetail(order)}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                        isDark ? "bg-white/8 text-white hover:bg-white/12" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        visibility
                      </span>{" "}
                      Detail
                    </button>

                    {details.nextStatus && (
                      <button
                        disabled={updatingId === order.id}
                        onClick={() =>
                          handleStatusChange(order.id, details.nextStatus!)
                        }
                        className={`flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 cursor-pointer transition-all ${
                          isDark ? details.nextActionBg : details.lightNextActionBg
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {details.nextActionIcon}
                        </span>
                        {details.nextActionText}
                      </button>
                    )}

                    {details.code !== "CANCELED" && details.code !== "COMPLETED" && (
                      <button
                        onClick={() => setCancelTargetOrder(order)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors shrink-0 ${
                          isDark ? "bg-white/5 text-white/40 hover:text-red-400 hover:bg-white/10" : "bg-gray-100 text-gray-500 hover:text-red-600 hover:bg-gray-200"
                        }`}
                        title="Batalkan"
                      >
                        <span className="material-symbols-outlined text-sm">
                          close
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop Table */}
        <div className={`hidden md:block rounded-xl border overflow-hidden transition-colors ${
          isDark ? "bg-[#1a1a1a] border-white/5" : "bg-white border-gray-200/80 shadow-sm"
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className={`border-b ${isDark ? "border-white/5 bg-white/3 text-white/30" : "border-gray-200 bg-gray-50 text-gray-500"}`}>
                  <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wide">
                    Pesanan
                  </th>
                  <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wide">
                    Pelanggan
                  </th>
                  <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wide">
                    Total
                  </th>
                  <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wide text-center">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? "divide-white/3" : "divide-gray-100"}`}>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-5 h-5 border-2 border-t-transparent rounded-full animate-spin ${
                          isDark ? "border-amber-400" : "border-[#51000d]"
                        }`} />
                        <span className="text-sm opacity-40">Memuat pesanan...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-14 text-center">
                      <span className="material-symbols-outlined text-3xl opacity-20 block mb-2">
                        inbox
                      </span>
                      <p className="text-sm opacity-40">
                        Tidak ada pesanan ditemukan.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const details =
                      order.statusDetails || getStatusDetails(order.status);
                    const isNew = details.isNew;

                    return (
                      <tr
                        key={order.id}
                        className={`transition-colors ${
                          isNew
                            ? isDark
                              ? "bg-red-500/10 hover:bg-red-500/15"
                              : "bg-red-50/80 hover:bg-red-50"
                            : isDark
                            ? "hover:bg-white/3 opacity-75"
                            : "hover:bg-gray-50/80 opacity-90"
                        }`}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            {isNew && (
                              <span
                                className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0"
                                title="Pesanan Baru"
                              />
                            )}
                            <div>
                              <p className={`font-semibold text-sm font-mono ${
                                isDark ? "text-amber-400" : "text-[#51000d]"
                              }`}>
                                {order.orderNumber}
                              </p>
                              <p className={`text-xs mt-0.5 ${isDark ? "text-white/30" : "text-gray-400"}`}>
                                {order.date}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className={`font-medium text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
                            {order.customerName || "Pelanggan"}
                          </p>
                          <p className={`text-xs ${isDark ? "text-white/30" : "text-gray-400"}`}>
                            {[order.city, order.province]
                              .filter(Boolean)
                              .join(", ") || "—"}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <p className={`font-semibold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
                            {formatPrice(order.finalTotal)}
                          </p>
                          <p className={`text-xs ${isDark ? "text-white/30" : "text-gray-400"}`}>
                            {order.totalItems} item
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                              isDark ? details.badgeClass : details.lightBadgeClass
                            }`}
                          >
                            <span className="material-symbols-outlined text-xs">
                              {details.icon}
                            </span>
                            {details.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setSelectedOrderDetail(order)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors ${
                                isDark ? "bg-white/8 text-white hover:bg-white/12" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              <span className="material-symbols-outlined text-sm">
                                visibility
                              </span>{" "}
                              Detail
                            </button>

                            {details.nextStatus && (
                              <button
                                disabled={updatingId === order.id}
                                onClick={() =>
                                  handleStatusChange(
                                    order.id,
                                    details.nextStatus!
                                  )
                                }
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors ${
                                  isDark ? details.nextActionBg : details.lightNextActionBg
                                }`}
                              >
                                <span className="material-symbols-outlined text-sm">
                                  {details.nextActionIcon}
                                </span>
                                {details.nextActionText}
                              </button>
                            )}

                            {details.code !== "CANCELED" &&
                              details.code !== "COMPLETED" && (
                                <button
                                  onClick={() => setCancelTargetOrder(order)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors ${
                                    isDark ? "bg-white/5 hover:bg-white/10 text-white/40 hover:text-red-400" : "bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-red-600"
                                  }`}
                                  title="Batalkan"
                                >
                                  <span className="material-symbols-outlined text-sm">
                                    close
                                  </span>
                                </button>
                              )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal: Detail Pesanan */}
      {selectedOrderDetail && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className={`rounded-2xl max-w-lg w-full p-5 shadow-2xl my-6 text-sm space-y-4 border ${
            isDark ? "bg-[#1a1a1a] border-white/10 text-white" : "bg-white border-gray-200 text-gray-900"
          }`}>
            {/* Header Modal */}
            <div className={`flex items-start justify-between pb-3 border-b ${isDark ? "border-white/8" : "border-gray-200"}`}>
              <div>
                <p className={`text-xs font-medium ${isDark ? "text-white/30" : "text-gray-400"}`}>Detail Pesanan</p>
                <h2 className={`text-base font-semibold font-mono mt-0.5 ${isDark ? "text-amber-400" : "text-[#51000d]"}`}>
                  {selectedOrderDetail.orderNumber}
                </h2>
                <p className={`text-xs ${isDark ? "text-white/30" : "text-gray-400"}`}>{selectedOrderDetail.date}</p>
              </div>
              <button
                onClick={() => setSelectedOrderDetail(null)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  isDark ? "bg-white/8 hover:bg-white/12 text-white/60" : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  close
                </span>
              </button>
            </div>

            {/* Interactive Status Update Selector */}
            <div className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              isDark ? "bg-white/4 border-white/6" : "bg-gray-50 border-gray-200"
            }`}>
              <div>
                <p className={`text-xs font-medium ${isDark ? "text-white/50" : "text-gray-700"}`}>Ubah Status Pesanan</p>
                <p className={`text-[10px] ${isDark ? "text-white/30" : "text-gray-400"}`}>Pilih status terbaru untuk memperbarui pelanggan</p>
              </div>
              <select
                value={selectedOrderDetail.status || "PENDING"}
                onChange={(e) =>
                  handleStatusChange(selectedOrderDetail.id, e.target.value)
                }
                className={`text-xs font-medium px-3 py-2 rounded-xl cursor-pointer focus:outline-none border ${
                  isDark ? "bg-[#141414] text-white border-white/15 focus:border-amber-400" : "bg-white text-gray-900 border-gray-300 focus:border-[#51000d]"
                }`}
              >
                <option value="PENDING">🔴 Menunggu Konfirmasi</option>
                <option value="PROCESSING">📦 Sedang Dikemas</option>
                <option value="SHIPPED">🚚 Sedang Dikirim</option>
                <option value="COMPLETED">✅ Selesai</option>
                <option value="CANCELED">❌ Dibatalkan</option>
              </select>
            </div>

            {/* Info Pembeli */}
            <div className={`rounded-xl p-4 border ${isDark ? "bg-white/4 border-white/6" : "bg-gray-50 border-gray-200"}`}>
              <div className="flex items-center justify-between mb-3">
                <p className={`text-xs font-medium uppercase tracking-wide ${isDark ? "text-white/40" : "text-gray-500"}`}>
                  Informasi Pembeli
                </p>
                {selectedOrderDetail.phone && (
                  <a
                    href={`https://wa.me/${selectedOrderDetail.phone.replace(
                      /[^0-9]/g,
                      ""
                    )}?text=Halo%20${encodeURIComponent(
                      selectedOrderDetail.customerName
                    )},%20kami%20dari%20Bakso%20Pak%20Mul%20mengenai%20pesanan%20${
                      selectedOrderDetail.orderNumber
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/15 text-emerald-500 rounded-lg text-xs font-medium hover:bg-emerald-500/25 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">chat</span>{" "}
                    WhatsApp
                  </a>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className={isDark ? "text-white/30" : "text-gray-400"}>Nama</p>
                  <p className="font-medium">
                    {selectedOrderDetail.customerName || "—"}
                  </p>
                </div>
                <div>
                  <p className={isDark ? "text-white/30" : "text-gray-400"}>No. HP</p>
                  <p className="font-medium">
                    {selectedOrderDetail.phone || "—"}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className={isDark ? "text-white/30" : "text-gray-400"}>Alamat</p>
                  <p className="font-medium">
                    {[
                      selectedOrderDetail.shippingAddress || selectedOrderDetail.address,
                      selectedOrderDetail.city,
                      selectedOrderDetail.province,
                    ]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Daftar Item */}
            <div>
              <p className={`text-xs font-medium uppercase tracking-wide mb-2 ${isDark ? "text-white/40" : "text-gray-500"}`}>
                Daftar Barang ({selectedOrderDetail.items?.length || 0} jenis)
              </p>
              <div className={`border rounded-xl overflow-hidden max-h-40 overflow-y-auto ${isDark ? "border-white/6" : "border-gray-200"}`}>
                {(selectedOrderDetail.items || []).map(
                  (item: any, idx: number) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between px-4 py-2.5 border-b last:border-0 text-xs ${
                        isDark ? "border-white/4" : "border-gray-100"
                      }`}
                    >
                      <div>
                        <p className="font-medium">
                          {item.productName || item.product?.name || "Produk"}
                        </p>
                        <p className={isDark ? "text-white/30" : "text-gray-400"}>
                          {item.quantity} × {formatPrice(item.priceAtTime || item.price)}
                        </p>
                      </div>
                      <p className="font-semibold">
                        {formatPrice(item.quantity * (item.priceAtTime || item.price))}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Total */}
            <div className={`rounded-xl p-4 border ${isDark ? "bg-white/4 border-white/6" : "bg-gray-50 border-gray-200"}`}>
              <div className={`flex justify-between text-xs mb-2 ${isDark ? "text-white/40" : "text-gray-500"}`}>
                <span>Subtotal</span>
                <span className="font-medium">
                  {formatPrice(
                    selectedOrderDetail.totalAmount || selectedOrderDetail.finalTotal
                  )}
                </span>
              </div>
              <div className={`flex justify-between font-semibold text-sm pt-2 border-t ${
                isDark ? "text-amber-400 border-white/6" : "text-[#51000d] border-gray-200"
              }`}>
                <span>Total Akhir</span>
                <span>{formatPrice(selectedOrderDetail.finalTotal)}</span>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="flex items-center justify-between pt-2">
              <a
                href={`/transaksi/${selectedOrderDetail.orderNumber}?print=true`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  isDark ? "bg-white/6 hover:bg-white/10 text-white/60" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                <span className="material-symbols-outlined text-sm">print</span>{" "}
                Cetak Struk
              </a>
              <button
                onClick={() => setSelectedOrderDetail(null)}
                className={`px-5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  isDark ? "bg-white text-gray-900 hover:bg-gray-100" : "bg-[#51000d] text-white hover:bg-[#7a0019]"
                }`}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Konfirmasi Batal */}
      {cancelTargetOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-sm w-full p-5 shadow-2xl text-sm border ${
            isDark ? "bg-[#1a1a1a] border-white/10 text-white" : "bg-white border-gray-200 text-gray-900"
          }`}>
            <div className="w-10 h-10 bg-red-500/10 text-red-400 rounded-xl flex items-center justify-center mb-3">
              <span className="material-symbols-outlined">warning</span>
            </div>
            <h3 className="font-semibold text-base mb-1">
              Batalkan Pesanan?
            </h3>
            <p className={`text-sm mb-5 ${isDark ? "text-white/40" : "text-gray-500"}`}>
              Pesanan{" "}
              <span className={`font-semibold ${isDark ? "text-amber-400" : "text-[#51000d]"}`}>
                {cancelTargetOrder.orderNumber}
              </span>{" "}
              atas nama{" "}
              <span className="font-medium">
                {cancelTargetOrder.customerName}
              </span>{" "}
              akan dibatalkan.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setCancelTargetOrder(null)}
                className={`px-4 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                  isDark ? "bg-white/6 hover:bg-white/10 text-white/60" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                Kembali
              </button>
              <button
                onClick={confirmCancelOrder}
                className="px-5 py-2 bg-red-500/15 hover:bg-red-500/25 text-red-500 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Ya, Batalkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
