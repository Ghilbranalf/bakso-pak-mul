"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";

type TimeframeOption = "daily" | "weekly" | "monthly" | "yearly";

interface ChartDataPoint {
  label: string;
  total: number;
  count: number;
}

export default function AdminDashboardPage() {
  const [timeframe, setTimeframe] = useState<TimeframeOption>("monthly");
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newOrderToast, setNewOrderToast] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null);

  // Play a pleasant 2-tone bell chime using Web Audio API
  const playBellChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(659.25, ctx.currentTime);
      gain1.gain.setValueAtTime(0.3, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 1.2);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(987.77, ctx.currentTime + 0.15);
      gain2.gain.setValueAtTime(0.4, ctx.currentTime + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.15);
      osc2.stop(ctx.currentTime + 1.5);
    } catch (err) {
      console.warn("Audio chime play error:", err);
    }
  };

  useEffect(() => {
    let prevOrderCount = 0;

    const fetchDashboardData = async () => {
      try {
        const resOrders = await fetch("/api/orders");
        if (resOrders.ok) {
          const dataOrders = await resOrders.json();
          const fetchedOrders = dataOrders.orders || [];
          
          if (prevOrderCount > 0 && fetchedOrders.length > prevOrderCount) {
            playBellChime();
            const latest = fetchedOrders[0];
            setNewOrderToast(`🔔 Pesanan Baru Masuk! (${latest?.customerName || 'Pelanggan'} - Rp ${(latest?.finalTotal || 0).toLocaleString('id-ID')})`);
            setTimeout(() => setNewOrderToast(null), 7000);
          }

          prevOrderCount = fetchedOrders.length;
          setOrders(fetchedOrders);
        }

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
    const interval = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return `Rp ${(price || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };

  // Calculate overall metrics
  const totalRevenue = orders
    .filter((o) => o.status === "PAID" || o.status === "COMPLETED")
    .reduce((sum, o) => sum + (o.finalTotal || 0), 0);

  const totalOrdersCount = orders.length;
  const completedOrdersCount = orders.filter((o) => o.status === "PAID" || o.status === "COMPLETED").length;
  const lowStockCount = products.filter((p) => (p.stock || 0) < 20).length;

  // Generate Sales Chart Data based on selected Timeframe (Daily, Weekly, Monthly, Yearly)
  const getChartData = (): ChartDataPoint[] => {
    // Only calculate actual paid / completed sales for accurate omset analytics
    const validOrders = orders.filter((o) => o.status === "PAID" || o.status === "COMPLETED");

    if (timeframe === "daily") {
      // Last 7 Days
      const days: ChartDataPoint[] = [];
      const now = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        const dayLabel = d.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" });
        
        const dayTotal = validOrders
          .filter((o) => {
            const oDate = new Date(o.createdAt);
            return oDate.toDateString() === d.toDateString();
          })
          .reduce((sum, o) => sum + (o.finalTotal || 0), 0);

        const count = validOrders.filter((o) => new Date(o.createdAt).toDateString() === d.toDateString()).length;

        days.push({ label: dayLabel, total: dayTotal, count });
      }
      return days;
    }

    if (timeframe === "weekly") {
      // Last 4 Weeks
      const weeks: ChartDataPoint[] = [];
      const now = new Date();
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - i * 7 - 6);
        const weekEnd = new Date(now);
        weekEnd.setDate(now.getDate() - i * 7);

        const weekLabel = `Minggu ${4 - i}`;

        const weekTotal = validOrders
          .filter((o) => {
            const oDate = new Date(o.createdAt);
            return oDate >= weekStart && oDate <= weekEnd;
          })
          .reduce((sum, o) => sum + (o.finalTotal || 0), 0);

        const count = validOrders.filter((o) => {
          const oDate = new Date(o.createdAt);
          return oDate >= weekStart && oDate <= weekEnd;
        }).length;

        weeks.push({ label: weekLabel, total: weekTotal, count });
      }
      return weeks;
    }

    if (timeframe === "monthly") {
      // Last 12 Months
      const months: ChartDataPoint[] = [];
      const now = new Date();
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthLabel = d.toLocaleDateString("id-ID", { month: "short" });

        const monthTotal = validOrders
          .filter((o) => {
            const oDate = new Date(o.createdAt);
            return oDate.getMonth() === d.getMonth() && oDate.getFullYear() === d.getFullYear();
          })
          .reduce((sum, o) => sum + (o.finalTotal || 0), 0);

        const count = validOrders.filter((o) => {
          const oDate = new Date(o.createdAt);
          return oDate.getMonth() === d.getMonth() && oDate.getFullYear() === d.getFullYear();
        }).length;

        months.push({ label: monthLabel, total: monthTotal, count });
      }
      return months;
    }

    // Yearly (Last 5 Years)
    const years: ChartDataPoint[] = [];
    const currentYear = new Date().getFullYear();
    for (let i = 4; i >= 0; i--) {
      const yr = currentYear - i;
      const yrLabel = `${yr}`;

      const yrTotal = validOrders
        .filter((o) => new Date(o.createdAt).getFullYear() === yr)
        .reduce((sum, o) => sum + (o.finalTotal || 0), 0);

      const count = validOrders.filter((o) => new Date(o.createdAt).getFullYear() === yr).length;

      years.push({ label: yrLabel, total: yrTotal, count });
    }
    return years;
  };

  const chartData = getChartData();
  const maxChartValue = Math.max(...chartData.map((d) => d.total), 100000);

  // SVG Chart Calculations
  const chartHeight = 220;
  const chartWidth = 700;
  const paddingX = 40;
  const paddingY = 30;

  const points = chartData.map((d, index) => {
    const x = paddingX + (index / (chartData.length - 1 || 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - (d.total / maxChartValue) * (chartHeight - paddingY * 2);
    return { x, y, data: d };
  });

  // SVG Line Path Generator
  const linePathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, "");

  // SVG Area Fill Path
  const areaPathD = points.length > 0
    ? `${linePathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`
    : "";

  const displayOrders = orders.length > 0 ? orders.slice(0, 5) : [];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans antialiased flex flex-col lg:flex-row">
      {/* Shared Reusable Admin Sidebar */}
      <AdminSidebar activeMenu="dashboard" />

      {/* Main Content Canvas */}
      <main className="flex-1 w-full lg:ml-[260px] min-h-screen p-4 md:p-8 lg:p-10 relative max-w-7xl pb-24 lg:pb-8">
        {/* Floating Toast Notification */}
        {newOrderToast && (
          <div className="fixed top-6 right-6 z-50 bg-[#51000d] text-white px-6 py-4 rounded-2xl shadow-2xl border border-red-400/30 flex items-center gap-3 animate-bounce text-xs font-extrabold">
            <span className="material-symbols-outlined text-amber-400 text-2xl animate-pulse">notifications</span>
            <span>{newOrderToast}</span>
          </div>
        )}

        {/* Header & Quick Actions */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-[#51000d] tracking-tight">
              📊 Portal Dashboard Penjualan
            </h2>
            <p className="text-xs md:text-sm text-gray-500 font-medium mt-1">
              Pantau grafik omset penjualan Bakso Pak Mul, stok produk, dan pesanan terbaru secara real-time.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={playBellChime}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-bold hover:bg-amber-100 transition-all shadow-xs cursor-pointer"
              title="Klik untuk menguji efek suara lonceng pesanan baru"
            >
              <span className="material-symbols-outlined text-base text-amber-600">notifications_active</span>
              <span>Uji Lonceng</span>
            </button>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-300 text-[#51000d] rounded-xl text-xs font-bold hover:bg-gray-50 transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-base">receipt_long</span>
              <span>Kelola Pesanan</span>
            </Link>
            <Link
              href="/admin/inventory"
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[#51000d] hover:bg-[#380009] text-white rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>Tambah Produk</span>
            </Link>
          </div>
        </header>

        {/* KPI Summary Cards Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {/* Total Sales */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-3">
              <div className="p-3 bg-red-50 text-[#51000d] rounded-xl">
                <span className="material-symbols-outlined text-2xl">payments</span>
              </div>
              <span className="text-emerald-700 font-extrabold text-xs bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                Lunas
              </span>
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Penjualan Terbayar</p>
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mt-1">
              {isLoading ? "Memuat..." : formatPrice(totalRevenue)}
            </h3>
            <p className="text-[11px] text-gray-500 font-medium mt-2">Dari {completedOrdersCount} pesanan selesai</p>
          </div>

          {/* Active Orders */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-3">
              <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
                <span className="material-symbols-outlined text-2xl">shopping_bag</span>
              </div>
              <span className="text-amber-800 font-extrabold text-xs bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                {totalOrdersCount} Pesanan
              </span>
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Pesanan Masuk</p>
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mt-1">
              {isLoading ? "Memuat..." : `${totalOrdersCount} Pesanan`}
            </h3>
            <p className="text-[11px] text-gray-500 font-medium mt-2">Termasuk QRIS, VA &amp; COD</p>
          </div>

          {/* Low Stock Warning */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-3">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                <span className="material-symbols-outlined text-2xl">warning</span>
              </div>
              <span className="text-rose-700 font-extrabold text-xs bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                Stok Menipis
              </span>
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Peringatan Restok</p>
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mt-1">
              {isLoading ? "Memuat..." : `${lowStockCount} Produk`}
            </h3>
            <p className="text-[11px] text-gray-500 font-medium mt-2">Stok produk dibawah 20 pack</p>
          </div>
        </section>

        {/* Dynamic Sales Performance Line Chart Section */}
        <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200 mb-8 space-y-6">
          {/* Chart Header & Filter Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#51000d] text-2xl">show_chart</span>
                <h3 className="text-lg font-black text-gray-900">Grafik Performa Penjualan</h3>
              </div>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Visualisasi omset penjualan Bakso Pak Mul berdasarkan periode waktu.
              </p>
            </div>

            {/* Timeframe Filter Options: Per Hari, Per Minggu, Per Bulan, Per Tahun */}
            <div className="flex items-center bg-gray-100 p-1 rounded-xl gap-1">
              {[
                { id: "daily", label: "Per Hari" },
                { id: "weekly", label: "Per Minggu" },
                { id: "monthly", label: "Per Bulan" },
                { id: "yearly", label: "Per Tahun" },
              ].map((tf) => (
                <button
                  key={tf.id}
                  onClick={() => setTimeframe(tf.id as TimeframeOption)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    timeframe === tf.id
                      ? "bg-[#51000d] text-white shadow-xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Line Chart Canvas */}
          <div className="relative w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-auto min-w-[500px]"
            >
              {/* Color Gradient Definitions */}
              <defs>
                <linearGradient id="maroonGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#51000d" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#51000d" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const y = chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
                return (
                  <line
                    key={i}
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="#E5E7EB"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Gradient Area Fill */}
              {points.length > 0 && (
                <path d={areaPathD} fill="url(#maroonGradient)" />
              )}

              {/* Main Line Stroke (#51000d) */}
              {points.length > 0 && (
                <path
                  d={linePathD}
                  fill="none"
                  stroke="#51000d"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Interactive Data Points & Labels */}
              {points.map((pt, idx) => (
                <g key={idx} className="cursor-pointer group">
                  {/* Point Outer Glow */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="6"
                    className="fill-[#51000d] stroke-white stroke-2 hover:r-8 transition-all"
                    onMouseEnter={() => setHoveredPoint(pt.data)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />

                  {/* X-Axis Label */}
                  <text
                    x={pt.x}
                    y={chartHeight - 8}
                    textAnchor="middle"
                    className="text-[10px] font-bold fill-gray-500"
                  >
                    {pt.data.label}
                  </text>
                </g>
              ))}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredPoint && (
              <div className="absolute top-2 right-4 bg-[#51000d] text-white p-3 rounded-xl shadow-xl border border-red-300/30 text-xs animate-in fade-in duration-150 pointer-events-none">
                <p className="font-extrabold text-amber-300">{hoveredPoint.label}</p>
                <p className="font-black text-sm mt-0.5">{formatPrice(hoveredPoint.total)}</p>
                <p className="text-[10px] text-gray-200 mt-0.5">{hoveredPoint.count} Pesanan Masuk</p>
              </div>
            )}
          </div>

          {/* Chart Legend & Summary Info */}
          <div className="flex flex-wrap items-center justify-between bg-amber-50/50 p-4 rounded-2xl border border-amber-200/60 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 bg-[#51000d] rounded-full"></div>
              <span className="font-bold text-gray-800">
                Omset Penjualan ({timeframe === "daily" ? "7 Hari Terakhir" : timeframe === "weekly" ? "4 Minggu Terakhir" : timeframe === "monthly" ? "12 Bulan Terakhir" : "5 Tahun Terakhir"})
              </span>
            </div>

            <div className="font-black text-[#51000d] text-sm">
              Total Periode Ini: {formatPrice(chartData.reduce((acc, d) => acc + d.total, 0))}
            </div>
          </div>
        </section>

        {/* Recent Orders Section */}
        <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-black text-gray-900">Pesanan Terbaru Masuk</h3>
              <p className="text-xs text-gray-500 font-medium">Daftar transaksi yang baru saja dilakukan pelanggan</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-[#51000d] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Lihat Semua</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-xs font-extrabold text-gray-500 uppercase tracking-wider bg-gray-50/50">
                  <th className="py-3 px-4">No. Pesanan</th>
                  <th className="py-3 px-4">Pelanggan</th>
                  <th className="py-3 px-4">Kota</th>
                  <th className="py-3 px-4 text-right">Total Tagihan</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-medium">
                {displayOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500 font-semibold">
                      Belum ada transaksi masuk.
                    </td>
                  </tr>
                ) : (
                  displayOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-black text-[#51000d]">
                        {o.orderNumber || `#${o.id.substring(0, 8)}`}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-gray-900">{o.customerName || "Pelanggan"}</td>
                      <td className="py-3.5 px-4 text-gray-500 font-medium">{o.city || o.province || "Jawa Tengah"}</td>
                      <td className="py-3.5 px-4 text-right font-black text-gray-900">{formatPrice(o.finalTotal)}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-3 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider ${
                          o.status === "PAID" || o.status === "COMPLETED" 
                            ? "bg-emerald-100 text-emerald-800"
                            : o.status === "CANCELED"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {o.status === "PAID" ? "LUNAS" : o.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
