"use client";

import React, { useState } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminSettingsPage() {
  const [promoActive, setPromoActive] = useState(true);
  const [bannerActive, setBannerActive] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-[#1a1c1c] font-sans antialiased flex flex-col md:flex-row">
      {/* Shared Reusable Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="md:ml-[280px] flex-1 min-h-screen flex flex-col">
        {/* TopAppBar Shell */}
        <header className="sticky top-0 w-full z-30 h-20 bg-white/70 backdrop-blur-xl border-b border-gray-200 flex items-center justify-between px-6 md:px-12 shadow-sm">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 text-[#51000d]">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h2 className="text-xl md:text-2xl font-black text-[#51000d]">Bakso Pak Mul</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 text-gray-500 font-medium text-sm">
              <Link href="/" className="hover:text-[#51000d] transition-colors">Marketplace</Link>
              <Link href="/produk" className="hover:text-[#51000d] transition-colors">Bulk Orders</Link>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 text-[#7a0019] hover:scale-95 transition-all">
                <span className="material-symbols-outlined text-2xl">shopping_cart</span>
              </button>
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                <img 
                  alt="Admin Profile" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-6unE60-0r5n2VQh9_WSmDui-3v0xJVmzs4aQSW771Y8sl1IWxMICE49OmFVYmdWgTQOirtYyYjMhye6LA36JmjyLotILw9IAjLc48TCiYw9rI_TzZAozlavc97pJ7bPUWV3V0j9z3mvIIj-jBzIiZLPF5jxLOUyWX3iWhFsRI4zb42S47aKV3s8I4TPaFc8xz0uEtoMNcAF4D0EpLVS_xXHhYre4AsV_xJ-YMahfl-3b7k5bKc7T400ViURNKBGOLPf9SCe-thWX" 
                />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="p-6 md:p-12 space-y-8 max-w-[1200px] mx-auto w-full">
          <header className="mb-8">
            <h1 className="text-3xl font-extrabold text-[#51000d] tracking-tight">Admin Settings</h1>
            <p className="text-sm text-gray-500 font-medium mt-1">Manage your B2B enterprise platform configurations and security.</p>
          </header>

          {/* Settings Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Website General Settings */}
            <section className="lg:col-span-7 bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-[#51000d]">
                  <span className="material-symbols-outlined text-xl">public</span>
                </div>
                <h3 className="text-lg font-bold text-[#51000d]">General Settings</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 px-1">Website Title</label>
                  <input className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm font-semibold text-gray-900 focus:bg-white focus:border-[#51000d] transition-all outline-none" type="text" defaultValue="Bakso Pak Mul | Premium B2B Wholesale" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 px-1">Primary Email</label>
                  <input className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm font-semibold text-gray-900 focus:bg-white focus:border-[#51000d] transition-all outline-none" type="email" defaultValue="sales@baksopakmul.com" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 px-1">WhatsApp Business</label>
                  <input className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm font-semibold text-gray-900 focus:bg-white focus:border-[#51000d] transition-all outline-none" type="text" defaultValue="+62 812-3456-7890" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 px-1">Corporate Address</label>
                  <input className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm font-semibold text-gray-900 focus:bg-white focus:border-[#51000d] transition-all outline-none" type="text" defaultValue="Jl. Industri Raya No. 42, Jakarta" />
                </div>
              </div>

              <div className="pt-2">
                <label className="text-xs font-bold text-gray-500 px-1 mb-2 block">Brand Logo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-[#51000d] transition-all cursor-pointer">
                  <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">upload_file</span>
                  <p className="text-sm font-bold text-gray-600">Drop logo file here or click to browse</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">PNG, SVG or WEBP (Max 2MB)</p>
                </div>
              </div>
            </section>

            {/* Seasonal Promo Toggle & Landing Page */}
            <section className="lg:col-span-5 bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-[#7a0019]">
                  <span className="material-symbols-outlined text-xl">auto_awesome</span>
                </div>
                <h3 className="text-lg font-bold text-[#51000d]">Landing Page</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 px-1">Hero Banner Text</label>
                  <textarea 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-semibold text-gray-900 focus:bg-white focus:border-[#51000d] transition-all outline-none resize-none" 
                    rows={3}
                    defaultValue="Indonesian Premium Culinary Excellence. Directly from our production floor to your business kitchen."
                  ></textarea>
                </div>

                <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${promoActive ? 'bg-red-50/50 border-[#51000d]/30' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#51000d]">Seasonal Ramadan Promo</span>
                    <span className="text-xs text-gray-500 font-medium">Toggle special holiday discounts</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={promoActive} onChange={() => setPromoActive(!promoActive)} />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#51000d]"></div>
                  </label>
                </div>

                <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${bannerActive ? 'bg-red-50/50 border-[#51000d]/30' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#51000d]">Featured Product Banner</span>
                    <span className="text-xs text-gray-500 font-medium">Showcase &apos;Bakso Halus&apos; video</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={bannerActive} onChange={() => setBannerActive(!bannerActive)} />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#51000d]"></div>
                  </label>
                </div>
              </div>
            </section>

            {/* Business Rules */}
            <section className="lg:col-span-12 bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-[#51000d]">
                    <span className="material-symbols-outlined text-xl">gavel</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#51000d]">Business &amp; Order Rules</h3>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 border border-green-200 rounded-full text-[10px] font-extrabold uppercase tracking-wider hidden sm:block">
                  Active Configuration
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3 p-5 bg-gray-50 rounded-2xl border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[#7a0019] text-lg">inventory</span>
                    <label className="text-sm font-bold text-[#51000d]">Min. Bulk Order</label>
                  </div>
                  <div className="relative">
                    <input className="w-full h-12 bg-white border border-gray-300 rounded-xl px-4 pr-12 text-sm font-bold text-gray-900 focus:border-[#51000d] outline-none transition-all" type="number" defaultValue="50" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs">Units</span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium">Minimum items required for wholesale pricing.</p>
                </div>

                <div className="space-y-3 p-5 bg-gray-50 rounded-2xl border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[#7a0019] text-lg">percent</span>
                    <label className="text-sm font-bold text-[#51000d]">Corporate Tax Rate</label>
                  </div>
                  <div className="relative">
                    <input className="w-full h-12 bg-white border border-gray-300 rounded-xl px-4 pr-10 text-sm font-bold text-gray-900 focus:border-[#51000d] outline-none transition-all" type="number" defaultValue="11" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">%</span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium">Standard VAT applied to all enterprise transactions.</p>
                </div>

                <div className="space-y-3 p-5 bg-gray-50 rounded-2xl border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[#7a0019] text-lg">local_shipping</span>
                    <label className="text-sm font-bold text-[#51000d]">Free Delivery Zone</label>
                  </div>
                  <select className="w-full h-12 bg-white border border-gray-300 rounded-xl px-4 text-sm font-bold text-gray-900 focus:border-[#51000d] outline-none transition-all cursor-pointer">
                    <option>Greater Jakarta Area</option>
                    <option>West Java Region</option>
                    <option>Central Java Region</option>
                    <option>All Java &amp; Bali</option>
                  </select>
                  <p className="text-[11px] text-gray-500 font-medium">Geographical radius for complimentary logistics.</p>
                </div>
              </div>
            </section>

            {/* Security & API */}
            <section className="lg:col-span-12 bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                  <span className="material-symbols-outlined text-xl">security</span>
                </div>
                <h3 className="text-lg font-bold text-[#51000d]">Security &amp; API Access</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Admin Name</th>
                      <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                      <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Last Active</th>
                      <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-100 text-[#7a0019] flex items-center justify-center font-bold text-[10px]">PM</div>
                        <span className="text-sm font-bold text-gray-900">Pak Mulyono (Super)</span>
                      </td>
                      <td className="py-4"><span className="px-3 py-1 bg-red-50 border border-red-200 text-[#51000d] rounded-full text-[10px] font-extrabold uppercase">Owner</span></td>
                      <td className="py-4 text-xs font-medium text-green-600">Active Now</td>
                      <td className="py-4"><button className="text-xs font-bold text-[#7a0019] hover:underline cursor-pointer">Manage</button></td>
                    </tr>
                    <tr className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-[10px]">SA</div>
                        <span className="text-sm font-bold text-gray-900">Siti Aminah</span>
                      </td>
                      <td className="py-4"><span className="px-3 py-1 bg-gray-100 border border-gray-200 text-gray-600 rounded-full text-[10px] font-extrabold uppercase">Sales Admin</span></td>
                      <td className="py-4 text-xs font-medium text-gray-500">2 hours ago</td>
                      <td className="py-4"><button className="text-xs font-bold text-[#7a0019] hover:underline cursor-pointer">Manage</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 p-5 md:p-6 bg-gray-900 text-white rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-amber-400 text-2xl">key</span>
                  <div>
                    <p className="text-sm font-bold">Production API Key</p>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">pk_live_************************4209</p>
                  </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <button className="flex-1 md:flex-none px-5 py-2.5 bg-white/10 hover:bg-white/20 transition-all rounded-xl text-xs font-bold">Reveal Key</button>
                  <button className="flex-1 md:flex-none px-5 py-2.5 bg-red-600 text-white hover:bg-red-700 transition-all rounded-xl text-xs font-bold shadow-md">Rotate Credentials</button>
                </div>
              </div>
            </section>
          </div>

          {/* Save Actions Bar */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <button className="px-6 py-3 text-xs font-bold text-gray-500 hover:text-gray-900 transition-all cursor-pointer">Discard Changes</button>
            <button className="px-8 py-3 bg-[#51000d] text-white rounded-xl text-xs font-bold hover:bg-[#7a0019] transition-all shadow-md active:scale-95 uppercase tracking-wider cursor-pointer">Save System Configurations</button>
          </div>
        </div>

        {/* Footer Shell */}
        <footer className="w-full py-10 px-6 md:px-12 bg-white grid grid-cols-1 md:grid-cols-4 gap-8 mt-auto border-t border-gray-200 text-xs font-medium text-gray-500">
          <div className="md:col-span-1">
            <h4 className="font-bold text-gray-900 text-sm mb-2">Bakso Pak Mul</h4>
            <p className="leading-relaxed">Enterprise B2B Distribution &amp; Management System.</p>
          </div>
          <div className="md:col-span-1 flex flex-col gap-2">
            <h5 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] mb-1">Quick Links</h5>
            <Link href="#" className="hover:text-[#51000d] transition-colors">B2B Terms</Link>
            <Link href="#" className="hover:text-[#51000d] transition-colors">Bulk Pricing Policy</Link>
          </div>
          <div className="md:col-span-1 flex flex-col gap-2">
            <h5 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] mb-1">Compliance</h5>
            <Link href="#" className="hover:text-[#51000d] transition-colors">Compliance</Link>
            <Link href="#" className="hover:text-[#51000d] transition-colors">Sustainability</Link>
          </div>
          <div className="md:col-span-1 text-left md:text-right flex flex-col justify-between">
            <div className="flex gap-4 md:justify-end">
              <span className="material-symbols-outlined text-gray-400 hover:text-[#51000d] cursor-pointer transition-colors text-xl">public</span>
              <span className="material-symbols-outlined text-gray-400 hover:text-[#51000d] cursor-pointer transition-colors text-xl">verified_user</span>
            </div>
            <p className="mt-4 md:mt-0">© 2024 Bakso Pak Mul. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
