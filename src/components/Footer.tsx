"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#121212] text-gray-400 py-16 mt-20 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16">
          <div className="md:col-span-4">
            <div className="flex items-center mb-6">
              <img
                alt="Logo"
                className="h-10 w-auto brightness-200"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDBL54ay3_wH1MTRduKq7WuysfeSQbkXJTUCJgNiKCIPLKacTQTGY--R8yc5l1yZ0UKwLHhypDJz8pC9IvOs8_kTHavE67Ebjs3TvlQCb3D558xWtMD7gTTdbqZMUO8Da2T_u3DtfuS6NTIenP8pCtDspF_mK4uhwS4EfHM2NV8pymrf7C6qSb3MG7R34aqGeBoR9dxABZzbQDvnwhQ93TZsssPJSZF3Nq4maYwKDvDV460_eZfzPsCe7vwFQFWdBEXQ2JoH_FKqy_"
              />
              <span className="ml-3 font-bold text-xl text-white tracking-tight">Bakso Pak Mul</span>
            </div>
            <p className="text-xs leading-relaxed mb-6 max-w-xs text-gray-400">
              Mendedikasikan rasa dan kualitas sejak tahun 2000. Kami percaya setiap hidangan layak mendapatkan bahan terbaik.
            </p>
            <div className="flex space-x-5">
              <a className="text-gray-500 hover:text-white transition-colors" href="#">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a className="text-gray-500 hover:text-white transition-colors" href="#">
                <i className="fab fa-tiktok text-xl"></i>
              </a>
              <a className="text-gray-500 hover:text-white transition-colors" href="#">
                <i className="fab fa-facebook-f text-xl"></i>
              </a>
            </div>
          </div>
          <div className="md:col-span-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6">Navigasi</h4>
            <ul className="space-y-3 text-xs font-medium">
              <li>
                <Link className="hover:text-white transition-colors" href="/">
                  Beranda
                </Link>
              </li>
              <li>
                <Link className="hover:text-white transition-colors" href="/produk">
                  Produk Baru
                </Link>
              </li>
              <li>
                <Link className="hover:text-white transition-colors" href="/transaksi">
                  Transaksi
                </Link>
              </li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6">Perusahaan</h4>
            <ul className="space-y-3 text-xs font-medium">
              <li>
                <Link className="hover:text-white transition-colors" href="/tentang">
                  Kisah Kami
                </Link>
              </li>
              <li>
                <a
                  className="hover:text-white transition-colors"
                  href="https://wa.me/6281298980252"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Hubungi Kami
                </a>
              </li>
              <li>
                <Link className="hover:text-amber-400 transition-colors text-amber-500 font-bold" href="/admin/login">
                  Portal Admin
                </Link>
              </li>
            </ul>
          </div>
          <div className="md:col-span-4">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6">Dapatkan Update Eksklusif</h4>
            <p className="text-xs mb-4 text-gray-400">Berlangganan untuk info promo mitra dan produk terbaru.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-2 max-w-md">
              <input
                className="bg-white/5 border border-white/10 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 text-xs rounded-xl py-3 px-4 text-white placeholder-gray-500 flex-1 min-w-0"
                placeholder="Email Anda"
                type="email"
              />
              <button type="submit" className="bg-[#51000d] hover:bg-[#7a0019] text-white text-xs font-bold px-6 py-3 rounded-xl transition-all cursor-pointer shrink-0 shadow-md">
                Daftar
              </button>
            </form>
          </div>
        </div>
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] uppercase tracking-widest">© 2024 Bakso Pak Mul. Elegance in Every Bite.</p>
          <div className="flex items-center gap-8 opacity-40">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">verified</span>
              <span className="text-[9px] font-bold uppercase tracking-tighter">Sertifikat Halal MUI</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">security</span>
              <span className="text-[9px] font-bold uppercase tracking-tighter">Pembayaran Aman</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
