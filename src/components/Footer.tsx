"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 w-full mt-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-6 md:px-12 py-12 max-w-7xl mx-auto">
        <div className="md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <img
              alt="BPM Logo"
              className="h-8 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDBL54ay3_wH1MTRduKq7WuysfeSQbkXJTUCJgNiKCIPLKacTQTGY--R8yc5l1yZ0UKwLHhypDJz8pC9IvOs8_kTHavE67Ebjs3TvlQCb3D558xWtMD7gTTdbqZMUO8Da2T_u3DtfuS6NTIenP8pCtDspF_mK4uhwS4EfHM2NV8pymrf7C6qSb3MG7R34aqGeBoR9dxABZzbQDvnwhQ93TZsssPJSZF3Nq4maYwKDvDV460_eZfzPsCe7vwFQFWdBEXQ2JoH_FKqy_"
            />
            <span className="font-extrabold text-lg text-[#51000d]">Bakso Pak Mul</span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed font-medium">
            Meningkatkan pengalaman kuliner tradisional Indonesia melalui standar mutu dan higienitas modern.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#51000d] mb-4">Menu Utama</h4>
          <ul className="space-y-2.5 text-xs font-semibold text-gray-600">
            <li>
              <Link href="/" className="hover:text-[#51000d] transition-colors">Beranda</Link>
            </li>
            <li>
              <Link href="/produk" className="hover:text-[#51000d] transition-colors">Produk</Link>
            </li>
            <li>
              <Link href="/transaksi" className="hover:text-[#51000d] transition-colors">Transaksi</Link>
            </li>
            <li>
              <Link href="/tentang" className="hover:text-[#51000d] transition-colors">Tentang Kami</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#51000d] mb-4">Dukungan</h4>
          <ul className="space-y-2.5 text-xs font-semibold text-gray-600">
            <li>
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="hover:text-[#51000d] transition-colors">Pusat Bantuan (WhatsApp)</a>
            </li>
            <li>
              <a href="#" className="hover:text-[#51000d] transition-colors">Kebijakan Privasi</a>
            </li>
            <li>
              <a href="#" className="hover:text-[#51000d] transition-colors">Syarat & Ketentuan</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#51000d] mb-4">Media Sosial</h4>
          <div className="flex gap-3 mb-4">
            <a href="#" className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-[#51000d] hover:bg-[#51000d] hover:text-white transition-all shadow-sm">
              <span className="material-symbols-outlined text-base">public</span>
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-[#51000d] hover:bg-[#51000d] hover:text-white transition-all shadow-sm">
              <span className="material-symbols-outlined text-base">alternate_email</span>
            </a>
          </div>
          <p className="text-[11px] text-gray-400 font-medium">© 2024 Bakso Pak Mul. Premium Culinary Excellence.</p>
        </div>
      </div>
    </footer>
  );
}
