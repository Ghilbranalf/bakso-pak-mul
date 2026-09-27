"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import { useAdminTheme } from "@/context/AdminThemeContext";

type TimeframeOption = "weekly" | "monthly" | "yearly";

interface ChartDataPoint {
  label: string;
  total: number;
  count: number;
}

const formatPrice = (price: number) =>
  `Rp ${(price || 0).toLocaleString("id-ID")}`;

export default function AdminDashboardPage() {
  const { isDark } = useAdminTheme();
  const [timeframe, setTimeframe] = useState<TimeframeOption>("monthly");
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null);
  const [newOrderToast, setNewOrderToast] = useState<string | null>(null);
  const prevCountRef = React.useRef(0);

  const playBellChime = () => {
    try {
      const AudioCtx =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(659.25, ctx.currentTime);
      gain1.gain.setValueAtTime(0.2, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 1.2);
    } catch (_) {}
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      const [resOrders, resProducts] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/products"),
      ]);
      const dataOrders = await resOrders.json();
      const dataProducts = await resProducts.json();

      if (dataOrders.orders) {
        const currentCount = dataOrders.orders.length;
        if (prevCountRef.current > 0 && currentCount > prevCountRef.current) {
          playBellChime();
          setNewOrderToast("Pesanan baru telah masuk!");
          setTimeout(() => setNewOrderToast(null), 5000);
        }
        prevCountRef.current = currentCount;
        setOrders(dataOrders.orders);
      }
      if (dataProducts.products) {
        setProducts(dataProducts.products);
      }
    } catch (_) {
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // Statistics Calculation
  const today = new Date();
  const todayOrders = useMemo(() => {
    return orders.filter((o) => {
      const d = new Date(o.createdAt);
      return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    });
  }, [orders]);

  const todayRevenue = useMemo(() => {
    return todayOrders
      .filter((o) => o.status === "COMPLETED" || o.status === "PAID")
      .reduce((s, o) => s + (o.finalTotal || 0), 0);
  }, [todayOrders]);

  const pendingCount = useMemo(() => {
    return orders.filter(
      (o) =>
        o.status !== "COMPLETED" &&
        o.status !== "PAID" &&
        o.status !== "CANCELED" &&
        o.status !== "CANCELLED"
    ).length;
  }, [orders]);

  const lowStockProducts = useMemo(() => {
    return products.filter((p) => p.stock != null && p.stock < 15);
  }, [products]);

  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status === "COMPLETED" || o.status === "PAID")
      .reduce((s, o) => s + (o.finalTotal || 0), 0);
  }, [orders]);

  // Recent 5 orders
  const recentOrders = useMemo(() => {
    return [...orders].slice(0, 5);
  }, [orders]);

  // Chart Data Builder
  const chartData: ChartDataPoint[] = useMemo(() => {
    if (timeframe === "weekly") {
      const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
      const result: ChartDataPoint[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayOrders = orders.filter((o) => {
          const od = new Date(o.createdAt);
          return (
            od.getDate() === d.getDate() &&
            od.getMonth() === d.getMonth() &&
            od.getFullYear() === d.getFullYear()
          );
        });
        const total = dayOrders
          .filter((o) => o.status === "COMPLETED" || o.status === "PAID")
          .reduce((s, o) => s + (o.finalTotal || 0), 0);
        result.push({
          label: days[d.getDay()],
          total,
          count: dayOrders.length,
        });
      }
      return result;
    }

    if (timeframe === "monthly") {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Agu",
        "Sep",
        "Okt",
        "Nov",
        "Des",
      ];
      return months.map((m, idx) => {
        const mOrders = orders.filter((o) => {
          const od = new Date(o.createdAt);
          return (
            od.getMonth() === idx && od.getFullYear() === today.getFullYear()
          );
        });
        const total = mOrders
          .filter((o) => o.status === "COMPLETED" || o.status === "PAID")
          .reduce((s, o) => s + (o.finalTotal || 0), 0);
        return { label: m, total, count: mOrders.length };
      });
    }

    // Yearly
    const currentYear = today.getFullYear();
    const years = [currentYear - 2, currentYear - 1, currentYear];
    return years.map((y) => {
      const yOrders = orders.filter((o) => {
        const od = new Date(o.createdAt);
        return od.getFullYear() === y;
      });
      const total = yOrders
        .filter((o) => o.status === "COMPLETED" || o.status === "PAID")
        .reduce((s, o) => s + (o.finalTotal || 0), 0);
      return { label: String(y), total, count: yOrders.length };
    });
  }, [orders, timeframe]);

  const maxTotal = Math.max(...chartData.map((d) => d.total), 1);

  // SVG Chart Dimensions
  const cW = 600;
  const cH = 180;
  const pX = 35;
  const pY = 25;

  const points = chartData.map((d, idx) => {
    const step = (cW - pX * 2) / (chartData.length - 1 || 1);
    const x = pX + idx * step;
    const y = cH - pY - (d.total / maxTotal) * (cH - pY * 2);
    return { x, y, data: d };
  });

  const linePath = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, "");

  const areaPath = points.length
    ? `${linePath} L ${points[points.length - 1].x} ${cH - pY} L ${points[0].x} ${cH - pY} Z`
    : "";

  const statCards = [
    {
      label: "Omset Selesai Hari Ini",
      value: formatPrice(todayRevenue),
      subtext: `${todayOrders.length} transaksi tercatat`,
      icon: "payments",
      iconColor: isDark ? "text-amber-400 bg-amber-400/10" : "text-[#540b13] bg-amber-100",
    },
    {
      label: "Pesanan Menunggu",
      value: String(pendingCount),
      subtext: pendingCount > 0 ? "Perlu segera diproses" : "Semua pesanan tertangani",
      icon: "pending_actions",
      iconColor:
        pendingCount > 0
          ? "text-amber-500 bg-amber-500/15"
          : isDark
          ? "text-stone-400 bg-stone-800"
          : "text-stone-500 bg-stone-100",
      link: "/admin/orders",
    },
    {
      label: "Peringatan Stok Menipis",
      value: `${lowStockProducts.length} Produk`,
      subtext: lowStockProducts.length > 0 ? "Stok di bawah 15 item" : "Semua stok mencukupi",
      icon: "inventory_2",
      iconColor:
        lowStockProducts.length > 0
          ? "text-rose-500 bg-rose-500/15"
          : "text-emerald-500 bg-emerald-500/15",
      link: "/admin/inventory",
    },
    {
      label: "Akumulasi Penjualan",
      value: formatPrice(totalRevenue),
      subtext: `${orders.length} total pesanan masuk`,
      icon: "account_balance_wallet",
      iconColor: isDark ? "text-emerald-400 bg-emerald-400/10" : "text-emerald-700 bg-emerald-100",
    },
  ];

  return (
    <div
      className={`min-h-screen font-sans antialiased flex transition-colors ${
        isDark ? "bg-[#0c0c0e] text-stone-100" : "bg-[#f8f9fa] text-stone-900"
      }`}
    >
      <AdminSidebar />

      <main className="flex-1 min-w-0 max-w-full overflow-x-hidden lg:ml-[240px] min-h-screen p-4 sm:p-6 lg:p-8 pt-18 lg:pt-8 pb-28 lg:pb-12">
        {/* Toast Notification */}
        {newOrderToast && (
          <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold bg-[#540b13] text-white border border-amber-400/30 animate-in fade-in">
            <span className="material-symbols-outlined text-amber-400 text-lg">
              notifications_active
            </span>
            <span>{newOrderToast}</span>
          </div>
        )}

        {/* Header Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Ringkasan Operasional
            </h1>
            <p className={`text-xs mt-0.5 ${isDark ? "text-stone-400" : "text-stone-500"}`}>
              {today.toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })} • Kios Pusat Pasar Kramat Jati
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchDashboardData()}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                isDark
                  ? "bg-stone-800/80 border-stone-700 hover:bg-stone-800 text-stone-200"
                  : "bg-white border-stone-200 hover:bg-stone-50 text-stone-700 shadow-2xs"
              }`}
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              <span>Muat Ulang</span>
            </button>
            <Link
              href="/admin/orders"
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#540b13] hover:bg-[#720f1a] text-white transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <span className="material-symbols-outlined text-sm">receipt_long</span>
              <span>Pesanan ({pendingCount})</span>
            </Link>
          </div>
        </header>

        {/* 4 KPI Metric Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-2xl p-5 border h-28 animate-pulse ${
                    isDark ? "bg-[#161618] border-stone-800" : "bg-white border-stone-200"
                  }`}
                />
              ))
            : statCards.map((card, i) => (
                <div
                  key={i}
                  className={`rounded-2xl p-5 border transition-all ${
                    isDark
                      ? "bg-[#141417] border-stone-800 hover:border-stone-700"
                      : "bg-white border-stone-200/90 shadow-2xs hover:shadow-xs"
                  } ${card.link ? "cursor-pointer" : ""}`}
                  onClick={() => card.link && (window.location.href = card.link)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`text-xs font-medium ${isDark ? "text-stone-400" : "text-stone-500"}`}>
                        {card.label}
                      </p>
                      <h3 className="text-xl sm:text-2xl font-extrabold mt-1 tracking-tight">
                        {card.value}
                      </h3>
                      <p className={`text-[11px] mt-1 ${isDark ? "text-stone-500" : "text-stone-400"}`}>
                        {card.subtext}
                      </p>
                    </div>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${card.iconColor}`}>
                      <span className="material-symbols-outlined text-[20px]">{card.icon}</span>
                    </div>
                  </div>
                </div>
              ))}
        </section>

        {/* Sales Chart Section */}
        <section
          className={`rounded-2xl p-5 md:p-6 border mb-6 transition-colors ${
            isDark ? "bg-[#141417] border-stone-800" : "bg-white border-stone-200/90 shadow-2xs"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-sm font-bold tracking-tight">Grafik Penjualan &amp; Omset</h2>
              <p className={`text-xs mt-0.5 ${isDark ? "text-stone-400" : "text-stone-500"}`}>
                Total omset terverifikasi: <strong className="text-amber-500">{formatPrice(totalRevenue)}</strong>
              </p>
            </div>
            <div
              className={`flex items-center p-1 rounded-xl gap-1 border ${
                isDark ? "bg-stone-900 border-stone-800" : "bg-stone-100 border-stone-200"
              }`}
            >
              {(["weekly", "monthly", "yearly"] as TimeframeOption[]).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    timeframe === tf
                      ? isDark
                        ? "bg-stone-800 text-white shadow-2xs"
                        : "bg-white text-stone-900 shadow-2xs"
                      : isDark
                      ? "text-stone-400 hover:text-stone-200"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  {tf === "weekly" ? "7 Hari" : tf === "monthly" ? "Bulanan" : "Tahunan"}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Canvas */}
          <div className="relative w-full overflow-x-auto">
            <div className="min-w-[560px]">
              <svg viewBox={`0 0 ${cW} ${cH}`} className="w-full h-auto">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d97706" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#d97706" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
                  const y = pY + pct * (cH - pY * 2);
                  return (
                    <line
                      key={i}
                      x1={pX}
                      y1={y}
                      x2={cW - pX}
                      y2={y}
                      stroke={isDark ? "#ffffff0c" : "#0000000a"}
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                  );
                })}
                {areaPath && <path d={areaPath} fill="url(#chartGrad)" />}
                {linePath && (
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#d97706"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
                {points.map((pt, idx) => (
                  <g
                    key={idx}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(pt.data)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="4.5"
                      fill="#d97706"
                      stroke={isDark ? "#141417" : "#ffffff"}
                      strokeWidth="2"
                    />
                    <text
                      x={pt.x}
                      y={cH - 6}
                      textAnchor="middle"
                      fontSize="9"
                      fill={isDark ? "#a1a1aa" : "#71717a"}
                      fontFamily="Inter, sans-serif"
                      fontWeight="500"
                    >
                      {pt.data.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          <div
            className={`mt-3 pt-3 border-t flex items-center justify-between text-xs ${
              isDark ? "border-stone-800 text-stone-400" : "border-stone-100 text-stone-500"
            }`}
          >
            <span>
              {hoveredPoint
                ? `Periode: ${hoveredPoint.label} • ${hoveredPoint.count} transaksi`
                : "Arahkan kursor pada titik grafik untuk detail omset"}
            </span>
            <span className="font-extrabold text-amber-500">
              {hoveredPoint
                ? formatPrice(hoveredPoint.total)
                : formatPrice(chartData.reduce((s, d) => s + d.total, 0))}
            </span>
          </div>
        </section>

        {/* Recent Orders & Quick Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Orders Table */}
          <section
            className={`lg:col-span-8 rounded-2xl p-5 border transition-colors ${
              isDark ? "bg-[#141417] border-stone-800" : "bg-white border-stone-200/90 shadow-2xs"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold tracking-tight">Pesanan Terbaru</h2>
              <Link
                href="/admin/orders"
                className="text-xs font-semibold text-amber-500 hover:underline flex items-center gap-1"
              >
                <span>Buka Semua</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </Link>
            </div>

            {isLoading ? (
              <div className="space-y-2 py-4">
                <div className={`h-10 rounded-xl animate-pulse ${isDark ? "bg-stone-800" : "bg-stone-100"}`} />
                <div className={`h-10 rounded-xl animate-pulse ${isDark ? "bg-stone-800" : "bg-stone-100"}`} />
              </div>
            ) : recentOrders.length === 0 ? (
              <p className={`text-xs py-6 text-center ${isDark ? "text-stone-500" : "text-stone-400"}`}>
                Belum ada transaksi pesanan yang masuk.
              </p>
            ) : (
              <div className="divide-y divide-stone-100 dark:divide-stone-800/80">
                {recentOrders.map((ord: any) => {
                  const isCompleted = ord.status === "COMPLETED" || ord.status === "PAID";
                  const isCanceled = ord.status === "CANCELED" || ord.status === "CANCELLED";
                  return (
                    <div
                      key={ord.id}
                      className="py-3 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <p className="font-bold truncate">
                          {ord.customerName || ord.userEmail || `Pesanan #${ord.id.slice(0, 6)}`}
                        </p>
                        <p className={`text-[11px] truncate ${isDark ? "text-stone-500" : "text-stone-400"}`}>
                          {new Date(ord.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="font-extrabold text-[#540b13] dark:text-amber-400">
                          {formatPrice(ord.finalTotal)}
                        </p>
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-0.5 ${
                            isCompleted
                              ? "bg-emerald-500/15 text-emerald-500"
                              : isCanceled
                              ? "bg-stone-500/15 text-stone-500"
                              : "bg-amber-500/20 text-amber-500 animate-pulse"
                          }`}
                        >
                          {ord.status || "PENDING"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Quick Actions & Stock Alerts */}
          <section className="lg:col-span-4 space-y-4">
            <div
              className={`rounded-2xl p-5 border transition-colors ${
                isDark ? "bg-[#141417] border-stone-800" : "bg-white border-stone-200/90 shadow-2xs"
              }`}
            >
              <h2 className="text-sm font-bold tracking-tight mb-3">Tindakan Cepat</h2>
              <div className="space-y-2">
                <Link
                  href="/admin/inventory"
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-[#540b13] text-white hover:bg-[#720f1a] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-base">add_box</span>
                    <span className="text-xs font-bold">Tambah / Edit Produk</span>
                  </div>
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </Link>

                <Link
                  href="/admin/orders"
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-colors ${
                    isDark
                      ? "bg-stone-800/80 border-stone-700 text-stone-200 hover:bg-stone-800"
                      : "bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-base">local_shipping</span>
                    <span className="text-xs font-bold">Proses Pengiriman</span>
                  </div>
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </Link>

                <Link
                  href="/admin/promotions"
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-colors ${
                    isDark
                      ? "bg-stone-800/80 border-stone-700 text-stone-200 hover:bg-stone-800"
                      : "bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-base">campaign</span>
                    <span className="text-xs font-bold">Kupon &amp; Diskon Mitra</span>
                  </div>
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </Link>
              </div>
            </div>

            {/* Low stock reminder */}
            {lowStockProducts.length > 0 && (
              <div
                className={`rounded-2xl p-4 border border-rose-500/30 ${
                  isDark ? "bg-rose-950/20 text-rose-300" : "bg-rose-50 text-rose-900"
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5 font-bold text-xs">
                  <span className="material-symbols-outlined text-rose-500 text-base">
                    warning
                  </span>
                  <span>{lowStockProducts.length} Produk Segera Habis</span>
                </div>
                <p className="text-[11px] opacity-80 leading-relaxed mb-3">
                  Pastikan persediaan daging dan bumbu kuah tetap terjaga untuk melayani pesanan warung.
                </p>
                <Link
                  href="/admin/inventory"
                  className="inline-block text-xs font-extrabold underline decoration-rose-400"
                >
                  Buka Kelola Stok →
                </Link>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
