"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function AdminPromotionsPage() {
  const [promos, setPromos] = useState([
    {
      id: "promo-1",
      name: "Year End Bakso Blast",
      target: "Applied to: All Bundles",
      type: "20% Fixed",
      typeBg: "bg-red-100 text-[#51000d]",
      duration: "Dec 15 - Jan 01",
      status: "Active",
      statusColor: "text-green-600",
      dotColor: "bg-green-500",
      performance: "1.2k Uses",
      percentage: 65,
    },
    {
      id: "promo-2",
      name: "Reseller Launch Special",
      target: "Target: New Resellers",
      type: "Rp 50k Off",
      typeBg: "bg-red-50 text-red-700 border border-red-200",
      duration: "Jan 05 - Jan 12",
      status: "Scheduled",
      statusColor: "text-gray-500",
      dotColor: "bg-gray-400",
      performance: "Pending",
      percentage: 0,
    },
    {
      id: "promo-3",
      name: "Mon-Tues Flash Deal",
      target: "Selected Items",
      type: "15% Discount",
      typeBg: "bg-red-100 text-[#51000d]",
      duration: "Weekly Recurring",
      status: "Active",
      statusColor: "text-green-600",
      dotColor: "bg-green-500",
      performance: "842 Uses",
      percentage: 40,
    },
  ]);

  const [newPromo, setNewPromo] = useState({
    name: "",
    type: "Percentage Discount",
    value: "",
    duration: "",
  });

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromo.name) return;
    setPromos([
      ...promos,
      {
        id: `promo-${Date.now()}`,
        name: newPromo.name,
        target: "Applied to: Selected Items",
        type: newPromo.value ? `${newPromo.value}% Off` : "Special Offer",
        typeBg: "bg-red-100 text-[#51000d]",
        duration: newPromo.duration || "Limited Time",
        status: "Active",
        statusColor: "text-green-600",
        dotColor: "bg-green-500",
        performance: "0 Uses",
        percentage: 10,
      },
    ]);
    setNewPromo({ name: "", type: "Percentage Discount", value: "", duration: "" });
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-[#1a1c1c] font-sans antialiased flex">
      {/* Sidebar Navigation Shell */}
      <aside className="fixed left-0 top-0 h-full w-[280px] flex flex-col py-6 border-r border-gray-200 bg-white z-40">
        <Link href="/" className="px-6 mb-8 flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#7a0019] rounded-xl flex items-center justify-center text-white shadow-md">
            <span className="material-symbols-outlined text-2xl">restaurant_menu</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#51000d]">Admin Portal</h1>
            <p className="text-[11px] font-semibold text-gray-400">Enterprise Management</p>
          </div>
        </Link>

        <nav className="flex-1 space-y-1 px-4">
          <Link
            href="/admin"
            className="flex items-center gap-3 py-3 px-4 text-gray-600 hover:bg-gray-100 rounded-xl text-xs font-bold transition-all"
          >
            <span className="material-symbols-outlined text-xl">dashboard</span>
            <span>Dashboard</span>
          </Link>
          <Link
            href="/admin/inventory"
            className="flex items-center gap-3 py-3 px-4 text-gray-600 hover:bg-gray-100 rounded-xl text-xs font-bold transition-all"
          >
            <span className="material-symbols-outlined text-xl">inventory_2</span>
            <span>Inventory</span>
          </Link>
          <Link
            href="/transaksi"
            className="flex items-center gap-3 py-3 px-4 text-gray-600 hover:bg-gray-100 rounded-xl text-xs font-bold transition-all"
          >
            <span className="material-symbols-outlined text-xl">receipt_long</span>
            <span>Orders</span>
          </Link>
          <Link
            href="/admin/promotions"
            className="flex items-center gap-3 py-3 px-4 bg-[#51000d] text-white rounded-xl text-xs font-bold shadow-md translate-x-1 transition-all"
          >
            <span className="material-symbols-outlined text-xl">campaign</span>
            <span>Promotions</span>
          </Link>
          <Link
            href="/admin"
            className="flex items-center gap-3 py-3 px-4 text-gray-600 hover:bg-gray-100 rounded-xl text-xs font-bold transition-all"
          >
            <span className="material-symbols-outlined text-xl">trending_up</span>
            <span>Analytics</span>
          </Link>
        </nav>

        <div className="px-4 mt-auto border-t border-gray-200 pt-4 space-y-1">
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 py-2.5 px-4 text-gray-600 hover:bg-gray-100 rounded-xl text-xs font-semibold"
          >
            <span className="material-symbols-outlined text-lg">help</span>
            <span>Support</span>
          </a>
          <Link
            href="/login"
            className="flex items-center gap-3 py-2.5 px-4 text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="ml-[280px] flex-1 p-8 md:p-12 min-h-screen">
        {/* Top Bar / Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#51000d] tracking-tight">
              Promotion Management
            </h2>
            <p className="text-xs md:text-sm text-gray-500 font-medium mt-1">
              Orchestrate B2B campaigns and flash sales.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2.5 rounded-xl font-bold text-xs text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
              <span className="material-symbols-outlined text-base">download</span>
              <span>Export Reports</span>
            </button>
            <a
              href="#new-promo-form"
              className="bg-[#51000d] text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-[#7a0019] transition-all shadow-md active:scale-95 uppercase tracking-wider cursor-pointer"
            >
              + Create New Promo
            </a>
          </div>
        </header>

        {/* Bento Grid: Analytics & Active Promos */}
        <div className="grid grid-cols-12 gap-6 mb-8">
          {/* Quick Stats Cards */}
          <div className="col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="p-3 bg-red-100 text-red-700 rounded-2xl">
                  <span className="material-symbols-outlined text-xl">bolt</span>
                </span>
                <span className="text-green-600 font-bold text-xs">+12.5%</span>
              </div>
              <div className="mt-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Avg. Conversion Rate</p>
                <h3 className="text-2xl font-black text-gray-900 mt-1">18.4%</h3>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="p-3 bg-red-50 text-[#51000d] rounded-2xl">
                  <span className="material-symbols-outlined text-xl">payments</span>
                </span>
                <span className="text-gray-400 font-bold text-xs">This Month</span>
              </div>
              <div className="mt-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Discount Applied</p>
                <h3 className="text-2xl font-black text-gray-900 mt-1">Rp 4.2M</h3>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="p-3 bg-gray-100 text-gray-700 rounded-2xl">
                  <span className="material-symbols-outlined text-xl">calendar_today</span>
                </span>
                <span className="text-[#51000d] font-bold text-xs">Active</span>
              </div>
              <div className="mt-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Scheduled Campaigns</p>
                <h3 className="text-2xl font-black text-gray-900 mt-1">12</h3>
              </div>
            </div>
          </div>

          {/* Promotion Preview Banner */}
          <div className="col-span-12 lg:col-span-4 row-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col justify-between">
              <div className="p-6 border-b border-gray-100">
                <h4 className="text-sm font-bold text-[#51000d]">Live Marketplace Preview</h4>
                <p className="text-xs text-gray-500 font-medium">How customers see your lead promo</p>
              </div>

              <div className="p-6 flex flex-col gap-4">
                <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden group shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#51000d]/90 to-transparent z-10"></div>
                  <img
                    alt="Promo Preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-Z6TX_Aj7hydLZxRla8NNJsiNFcxSGvlwjFmKJgzhbMI6_zlAsA-w5evh_49jhoQIR5JqGVR0e_MF3oqu6-1UGmH0PKfxPLBUZIeeHWfysXPEy3Ou7MR_MwaXWnXAH_dVi6eyftcNoZhplW5WGeKTdKkMPax6d83PwPIz9qitPfhLiBUB42oHmnKbAV3XZJi24Bzm67SlhQ0ct7j547cJwOYXUHeKItXmGN-kC47aW1uj9KHlZdJdhCDVzcrAYFT8Hh-R4cnCcbbf"
                  />
                  <div className="absolute bottom-0 left-0 p-6 z-20 text-white w-full">
                    <span className="bg-red-600 px-3 py-1 rounded-full text-[10px] font-extrabold mb-3 inline-block uppercase tracking-wider">
                      Flash Sale
                    </span>
                    <h3 className="text-xl font-extrabold mb-1 leading-tight">Bakso Urat Mega Pack</h3>
                    <div className="flex items-end gap-2">
                      <p className="text-lg font-black text-amber-300">25% OFF</p>
                      <p className="text-xs text-white/70 line-through mb-0.5">Rp 120.000</p>
                    </div>
                    <Link
                      href="/promo"
                      className="mt-4 w-full py-2.5 bg-white text-[#51000d] rounded-xl font-bold text-xs hover:bg-gray-100 transition-colors flex items-center justify-center cursor-pointer"
                    >
                      Order Bulk Now
                    </Link>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="material-symbols-outlined text-red-600 text-sm">visibility</span>
                    <p className="text-xs font-bold text-gray-700">
                      Impressions: <span className="text-gray-900 font-extrabold">12.4k</span>
                    </p>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600 w-3/4 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Promotion Table */}
          <div className="col-span-12 lg:col-span-8">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h4 className="text-base font-bold text-gray-900">Active &amp; Scheduled Promos</h4>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-200">
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Promotion Name</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Duration</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Performance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {promos.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-xs font-bold text-gray-900">{p.name}</div>
                          <div className="text-[10px] font-medium text-gray-400">{p.target}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold ${p.typeBg}`}>
                            {p.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-gray-700">{p.duration}</td>
                        <td className="px-6 py-4">
                          <span className={`flex items-center gap-1.5 text-xs font-bold ${p.statusColor}`}>
                            <span className={`w-2 h-2 rounded-full ${p.dotColor}`}></span>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs font-bold text-gray-900">{p.performance}</div>
                          {p.percentage > 0 && (
                            <div className="w-24 h-1 bg-gray-100 rounded-full overflow-hidden mt-1">
                              <div className="bg-red-600 h-full" style={{ width: `${p.percentage}%` }}></div>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Form: Create New Promo */}
        <section id="new-promo-form" className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h3 className="text-lg font-bold text-[#51000d] mb-4">Create New Campaign / Promo</h3>
          <form onSubmit={handleCreatePromo} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Campaign Name</label>
              <input
                type="text"
                required
                value={newPromo.name}
                onChange={(e) => setNewPromo({ ...newPromo, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:border-[#51000d]"
                placeholder="e.g. Ramadan Special Discount"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Discount Type</label>
              <select
                value={newPromo.type}
                onChange={(e) => setNewPromo({ ...newPromo, type: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:border-[#51000d]"
              >
                <option>Percentage Discount</option>
                <option>Fixed Amount Off</option>
                <option>Free Shipping</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Discount Value (%)</label>
              <input
                type="number"
                value={newPromo.value}
                onChange={(e) => setNewPromo({ ...newPromo, value: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:border-[#51000d]"
                placeholder="e.g. 20"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 bg-[#51000d] hover:bg-[#7a0019] text-white rounded-xl font-bold text-xs shadow-md uppercase tracking-wider cursor-pointer"
              >
                Save Campaign
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
