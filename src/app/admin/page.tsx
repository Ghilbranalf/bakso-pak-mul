"use client";

import React, { useState } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminDashboardPage() {
  const [timeframe, setTimeframe] = useState<"monthly" | "weekly">("monthly");

  const recentOrders = [
    {
      id: "#ORD-2024-8901",
      client: "Jaya Bakso Group",
      location: "Jakarta Selatan",
      initials: "JB",
      bgColor: "bg-[#ffdad8] text-[#410007]",
      product: "Bulk Meatball Pack (500kg)",
      value: "Rp 42.500.000",
      status: "Delivered",
      statusColor: "bg-green-100 text-green-700 border border-green-200",
    },
    {
      id: "#ORD-2024-8905",
      client: "Frozen Mart Central",
      location: "Surabaya East",
      initials: "FM",
      bgColor: "bg-[#ffdad9] text-[#410009]",
      product: "Signature Spice Mix (100kg)",
      value: "Rp 12.800.000",
      status: "Processing",
      statusColor: "bg-orange-100 text-orange-700 border border-orange-200",
    },
    {
      id: "#ORD-2024-8910",
      client: "Bakso Master Co.",
      location: "Bandung Utara",
      initials: "BM",
      bgColor: "bg-red-100 text-[#51000d]",
      product: "Assorted Frozen Goods",
      value: "Rp 28.450.000",
      status: "In Transit",
      statusColor: "bg-blue-100 text-blue-700 border border-blue-200",
    },
    {
      id: "#ORD-2024-8912",
      client: "UD Maju Bersama",
      location: "Semarang City",
      initials: "UD",
      bgColor: "bg-gray-200 text-gray-800",
      product: "Beef Bone Broth Base",
      value: "Rp 5.200.000",
      status: "Pending",
      statusColor: "bg-gray-100 text-gray-700 border border-gray-200",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-[#1a1c1c] font-sans antialiased flex">
      {/* Shared Reusable Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content Canvas */}
      <main className="ml-[280px] flex-1 min-h-screen p-8 md:p-12">
        {/* Header & Quick Actions */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#51000d] tracking-tight">
              Performance Overview
            </h2>
            <p className="text-xs md:text-sm text-gray-500 font-medium mt-1">
              Welcome back, Administrator. Here&apos;s what&apos;s happening today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/promotions"
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-[#51000d] rounded-xl text-xs font-bold hover:bg-gray-50 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              <span>Create Promo</span>
            </Link>
            <Link
              href="/admin/inventory"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#51000d] hover:bg-[#7a0019] text-white rounded-xl text-xs font-bold shadow-md transition-all uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>Add New Product</span>
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
                +12.4% <span className="material-symbols-outlined text-sm">arrow_upward</span>
              </span>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Gross Sales</p>
            <h3 className="text-3xl font-black text-gray-900">Rp 142.8M</h3>
            <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#51000d] w-[75%] rounded-full"></div>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-red-50 text-[#7a0019] rounded-xl">
                <span className="material-symbols-outlined text-2xl">shopping_basket</span>
              </div>
              <span className="text-green-600 font-bold text-xs flex items-center gap-0.5 bg-green-50 px-2 py-0.5 rounded-md border border-green-200">
                +8.1% <span className="material-symbols-outlined text-sm">arrow_upward</span>
              </span>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Active Orders</p>
            <h3 className="text-3xl font-black text-gray-900">1,248</h3>
            <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#7a0019] w-[62%] rounded-full"></div>
            </div>
          </div>

          {/* New Resellers */}
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-red-50 text-red-700 rounded-xl">
                <span className="material-symbols-outlined text-2xl">group</span>
              </div>
              <span className="text-red-600 font-bold text-xs flex items-center gap-0.5 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                -2.3% <span className="material-symbols-outlined text-sm">arrow_downward</span>
              </span>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">New Reseller Partners</p>
            <h3 className="text-3xl font-black text-gray-900">34</h3>
            <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-red-700 w-[45%] rounded-full"></div>
            </div>
          </div>
        </section>

        {/* Analytics & Trends Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Sales Chart */}
          <section className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Monthly Sales Analytics</h3>
                <p className="text-xs text-gray-500 font-medium">Trend projection for Q3 - 2024</p>
              </div>
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setTimeframe("monthly")}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    timeframe === "monthly" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setTimeframe("weekly")}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    timeframe === "weekly" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                  }`}
                >
                  Weekly
                </button>
              </div>
            </div>

            {/* Faux Bar Chart Representation */}
            <div className="h-[220px] flex items-end justify-between gap-3 px-2 pb-2">
              {[
                { month: "Jan", height: "40%", color: "bg-gray-200" },
                { month: "Feb", height: "55%", color: "bg-gray-200" },
                { month: "Mar", height: "75%", color: "bg-red-200" },
                { month: "Apr", height: "90%", color: "bg-[#51000d]" },
                { month: "May", height: "65%", color: "bg-red-300" },
                { month: "Jun", height: "82%", color: "bg-gray-300" },
              ].map((bar) => (
                <div key={bar.month} className="flex flex-col items-center flex-1 h-full justify-end">
                  <div
                    className={`w-full ${bar.color} rounded-t-xl transition-all duration-700 hover:opacity-90`}
                    style={{ height: bar.height }}
                  ></div>
                  <span className="mt-3 text-xs font-bold text-gray-500">{bar.month}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Distribution Breakdown */}
          <section className="bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6">Regional Distribution</h3>
              <div className="space-y-4">
                {[
                  { region: "Jakarta Raya", pct: "45%", color: "bg-[#51000d]" },
                  { region: "Bandung Metro", pct: "28%", color: "bg-[#7a0019]" },
                  { region: "Surabaya Central", pct: "15%", color: "bg-red-400" },
                  { region: "Others", pct: "12%", color: "bg-gray-300" },
                ].map((item) => (
                  <div key={item.region} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-gray-800">{item.region}</span>
                      <span className="text-gray-400">{item.pct}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: item.pct }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 p-4 bg-red-50/60 rounded-2xl border border-red-100">
              <p className="text-xs font-bold text-[#51000d] mb-1">Expansion Opportunity</p>
              <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
                Central Java regions have shown a 15% increase in bulk order inquiries this month.
              </p>
            </div>
          </section>
        </div>

        {/* Recent Orders Table */}
        <section className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Recent Enterprise Orders</h3>
            <Link
              href="/transaksi"
              className="text-[#51000d] font-bold text-xs flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>View All Transactions</span>
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Client / Reseller</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Product Line</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Value</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-gray-900">{order.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${order.bgColor} flex items-center justify-center font-bold text-[10px] shrink-0`}>
                          {order.initials}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900">{order.client}</p>
                          <p className="text-[10px] font-medium text-gray-400">{order.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-gray-600">{order.product}</td>
                    <td className="px-6 py-4 text-xs font-extrabold text-[#51000d]">{order.value}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${order.statusColor}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="material-symbols-outlined text-gray-400 hover:text-[#51000d] transition-colors cursor-pointer text-lg">
                        more_vert
                      </button>
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
