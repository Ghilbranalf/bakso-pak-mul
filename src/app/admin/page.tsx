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
        const [resOrders, resProducts] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/products"),
        ]);
        
        const dataOrders = await resOrders.json();
        const dataProducts = await resProducts.json();

        if (dataOrders.orders) {
          const currentCount = dataOrders.orders.length;
          if (prevOrderCount > 0 && currentCount > prevOrderCount) {
            playBellChime();
            setNewOrderToast("🔔 Pesanan Baru Masuk!");
            setTimeout(() => setNewOrderToast(null), 5000);
          }
          prevOrderCount = currentCount;
          setOrders(dataOrders.orders);
        }

        if (dataProducts.products) {
          setProducts(dataProducts.products);
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

  // Only calculate paid/completed revenue
  const validOrders = orders.filter((o) => o.status === "PAID" || o.status === "COMPLETED" || o.status === "PROCESSING");
  const totalRevenue = validOrders.reduce((sum, o) => sum + (o.finalTotal || 0), 0);
  const totalOrdersCount = orders.length;
  const lowStockProducts = products.filter((p) => (p.stock || 0) < 20);

  // Dynamic Chart Aggregation Generator
  const getChartData = (): ChartDataPoint[] => {
    const now = new Date();

    if (timeframe === "daily") {
      const hours: ChartDataPoint[] = [];
      for (let h = 8; h <= 22; h += 2) {
        const label = `${h.toString().padStart(2, "0")}:00`;
        const hourOrders = validOrders.filter((o) => {
          const d = new Date(o.createdAt);
          return d.toDateString() === now.toDateString() && d.getHours() >= h && d.getHours() < h + 2;
        });
        const total = hourOrders.reduce((sum, o) => sum + (o.finalTotal || 0), 0);
        hours.push({ label, total, count: hourOrders.length });
      }
      return hours;
    }

    if (timeframe === "weekly") {
      const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
      return days.map((dayLabel, idx) => {
        const dayOrders = validOrders.filter((o) => new Date(o.createdAt).getDay() === idx);
        const total = dayOrders.reduce((sum, o) => sum + (o.finalTotal || 0), 0);
        return { label: dayLabel, total, count: dayOrders.length };
      });
    }

    if (timeframe === "monthly") {
      const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
      const currentYear = now.getFullYear();
      return months.map((monthLabel, idx) => {
        const monthOrders = validOrders.filter((o) => {
          const d = new Date(o.createdAt);
          return d.getFullYear() === currentYear && d.getMonth() === idx;
        });
        const total = monthOrders.reduce((sum, o) => sum + (o.finalTotal || 0), 0);
        return { label: monthLabel, total, count: monthOrders.length };
      });
    }

    // Yearly timeframe
    const years: ChartDataPoint[] = [];
    const startYear = now.getFullYear() - 3;
    for (let yr = startYear; yr <= now.getFullYear(); yr++) {
      const yrLabel = yr.toString();
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
    <div className="min-h-screen bg-[#FDFBF7] text-gray-900 font-sans antialiased flex flex-col lg:flex-row">
      {/* Shared Reusable Executive Sidebar */}
      <AdminSidebar activeMenu="dashboard" />

      {/* Main Content Canvas */}
      <main className="flex-1 w-full lg:ml-[260px] min-h-screen p-4 md:p-8 lg:p-10 relative max-w-7xl pb-28 lg:pb-12">
        {/* Floating Luxury Notification */}
        {newOrderToast && (
          <div className="fixed top-16 lg:top-6 right-4 lg:right-6 z-50 bg-gradient-to-r from-[#3d000a] to-[#51000d] text-white px-6 py-4 rounded-2xl shadow-2xl border border-amber-500/30 flex items-center gap-3 animate-bounce text-xs font-extrabold">
            <span className="material-symbols-outlined text-amber-400 text-2xl animate-pulse">notifications</span>
            <span>{newOrderToast}</span>
          </div>
        )}

        {/* Executive Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-900 border border-amber-300/30 rounded-full text-[10px] font-black uppercase tracking-widest">
                Official Analytics Hub
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-[#51000d] tracking-tight">
              Portal Dashboard Penjualan
            </h2>
            <p className="text-xs md:text-sm text-gray-500 font-medium mt-1">
              Pantau omset grafik penjualan, persediaan produk, dan pesanan secara real-time.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/admin/inventory"
              className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-105 text-[#51000d] rounded-2xl text-xs font-black shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">add_box</span>
              <span>Tambah Produk</span>
            </Link>
            <Link
              href="/admin/orders"
              className="px-4 py-2.5 bg-[#51000d] hover:bg-[#380009] text-white rounded-2xl text-xs font-extrabold shadow-md shadow-[#51000d]/15 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-lg text-amber-300">receipt_long</span>
              <span>Kelola Pesanan</span>
            </Link>
          </div>
        </header>

        {/* Executive Stat Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {/* Card 1: Total Omset Selesai */}
          <div className="bg-gradient-to-br from-white via-white to-amber-500/5 p-6 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(81,0,13,0.04)] relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-gray-400">Total Omset Disetujui</span>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-[#51000d] flex items-center justify-center shadow-md shadow-amber-500/20">
                <span className="material-symbols-outlined text-2xl font-bold">payments</span>
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-[#51000d] tracking-tight">{formatPrice(totalRevenue)}</h3>
            <p className="text-[11px] text-emerald-600 font-extrabold mt-1.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>100% Real-Time Omset Resmi</span>
            </p>
          </div>

          {/* Card 2: Total Pesanan Masuk */}
          <div className="bg-gradient-to-br from-white via-white to-[#51000d]/5 p-6 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(81,0,13,0.04)] relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-gray-400">Total Transaksi</span>
              <div className="w-11 h-11 rounded-2xl bg-[#51000d] text-amber-300 flex items-center justify-center shadow-md shadow-[#51000d]/20">
                <span className="material-symbols-outlined text-2xl">shopping_bag</span>
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">{totalOrdersCount} Pesanan</h3>
            <p className="text-[11px] text-gray-500 font-semibold mt-1.5">
              Termasuk Lunas, Menunggu, &amp; Selesai
            </p>
          </div>

          {/* Card 3: Peringatan Stok Menipis */}
          <div className="bg-gradient-to-br from-white via-white to-rose-500/5 p-6 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(81,0,13,0.04)] relative overflow-hidden group sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-gray-400">Stok Menipis (&lt;20)</span>
              <div className="w-11 h-11 rounded-2xl bg-rose-500/10 text-rose-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">warning</span>
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-rose-700 tracking-tight">{lowStockProducts.length} Produk</h3>
            <p className="text-[11px] text-rose-600 font-bold mt-1.5 flex items-center gap-1">
              <span>{lowStockProducts.length > 0 ? "Perlu Restok Segera!" : "Semua Stok Terjaga Aman"}</span>
            </p>
          </div>
        </section>

        {/* Luxury Interactive Sales Chart */}
        <section className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(81,0,13,0.04)] border border-gray-100 mb-8 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                <h3 className="text-lg md:text-xl font-black text-[#51000d]">Grafik Performa Penjualan</h3>
              </div>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Visualisasi tren penjualan Bakso Pak Mul berdasarkan periode waktu.
              </p>
            </div>

            {/* Timeframe Filter Buttons */}
            <div className="flex items-center bg-gray-100/80 p-1 rounded-2xl gap-1 overflow-x-auto">
              {[
                { key: "daily", label: "Per Hari" },
                { key: "weekly", label: "Per Minggu" },
                { key: "monthly", label: "Per Bulan" },
                { key: "yearly", label: "Per Tahun" },
              ].map((tf) => (
                <button
                  key={tf.key}
                  onClick={() => setTimeframe(tf.key as TimeframeOption)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                    timeframe === tf.key
                      ? "bg-[#51000d] text-white shadow-md shadow-[#51000d]/20"
                      : "text-gray-600 hover:bg-gray-200/80"
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic SVG Canvas */}
          <div className="relative w-full overflow-x-auto scrollbar-none py-2">
            <div className="min-w-[650px]">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible">
                <defs>
                  <linearGradient id="maroonGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#51000d" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#51000d" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
                  const y = paddingY + pct * (chartHeight - paddingY * 2);
                  return (
                    <line
                      key={i}
                      x1={paddingX}
                      y1={y}
                      x2={chartWidth - paddingX}
                      y2={y}
                      stroke="#f3f4f6"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                  );
                })}

                {/* Gradient Fill under curve */}
                {areaPathD && <path d={areaPathD} fill="url(#maroonGradient)" />}

                {/* Smooth Curve Line */}
                {linePathD && (
                  <path
                    d={linePathD}
                    fill="none"
                    stroke="#51000d"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Data Points & Interactive Dots */}
                {points.map((pt, idx) => (
                  <g key={idx} className="cursor-pointer group">
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="6"
                      fill="#51000d"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      className="transition-all duration-200 group-hover:r-8 group-hover:fill-amber-500"
                      onMouseEnter={() => setHoveredPoint(pt.data)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                    <text
                      x={pt.x}
                      y={chartHeight - 8}
                      textAnchor="middle"
                      className="text-[11px] font-bold fill-gray-400"
                    >
                      {pt.data.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Interactive Tooltip Card */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#51000d]"></span>
              <span className="font-bold text-gray-600">
                {hoveredPoint ? `Periode: ${hoveredPoint.label}` : "Arahkan kursor ke titik untuk rincian"}
              </span>
            </div>
            <div className="font-black text-[#51000d] text-sm">
              {hoveredPoint ? (
                <span>{formatPrice(hoveredPoint.total)} ({hoveredPoint.count} Transaksi)</span>
              ) : (
                <span>Total Periode Ini: {formatPrice(chartData.reduce((acc, d) => acc + d.total, 0))}</span>
              )}
            </div>
          </div>
        </section>

        {/* Latest Incoming Orders Card */}
        <section className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(81,0,13,0.04)] border border-gray-100 overflow-hidden">
          <div className="p-6 flex items-center justify-between border-b border-gray-100">
            <div>
              <h3 className="text-lg font-black text-[#51000d]">Pesanan Terbaru Masuk</h3>
              <p className="text-xs text-gray-500 font-medium">Daftar transaksi yang baru saja dilakukan pelanggan.</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-black text-[#51000d] hover:underline flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-400">
                  <th className="px-6 py-3.5 text-[10px] font-black uppercase tracking-wider">No. Pesanan</th>
                  <th className="px-6 py-3.5 text-[10px] font-black uppercase tracking-wider">Pelanggan</th>
                  <th className="px-6 py-3.5 text-[10px] font-black uppercase tracking-wider">Kota</th>
                  <th className="px-6 py-3.5 text-[10px] font-black uppercase tracking-wider">Total Belanja</th>
                  <th className="px-6 py-3.5 text-[10px] font-black uppercase tracking-wider">Status</th>
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
                    <tr key={o.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4 font-mono font-extrabold text-[#51000d]">{o.orderNumber}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">{o.customerName || "-"}</td>
                      <td className="px-6 py-4 text-gray-500 font-medium">{o.city || o.province || "-"}</td>
                      <td className="px-6 py-4 font-black text-gray-900">{formatPrice(o.finalTotal)}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-xl text-[10px] font-black border bg-amber-500/10 text-amber-900 border-amber-300/40">
                          {o.status === "COMPLETED" || o.status === "PAID" ? "DISETUJUI" : "MENUNGGU"}
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
