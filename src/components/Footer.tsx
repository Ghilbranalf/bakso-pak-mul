"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#121212] text-gray-400 py-20 mt-20 w-full">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
          <div className="md:col-span-4">
            <div className="flex items-center mb-8">
              <img
                alt="Logo"
                className="h-10 w-auto brightness-200"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDBL54ay3_wH1MTRduKq7WuysfeSQbkXJTUCJgNiKCIPLKacTQTGY--R8yc5l1yZ0UKwLHhypDJz8pC9IvOs8_kTHavE67Ebjs3TvlQCb3D558xWtMD7gTTdbqZMUO8Da2T_u3DtfuS6NTIenP8pCtDspF_mK4uhwS4EfHM2NV8pymrf7C6qSb3MG7R34aqGeBoR9dxABZzbQDvnwhQ93TZsssPJSZF3Nq4maYwKDvDV460_eZfzPsCe7vwFQFWdBEXQ2JoH_FKqy_"
              />
              <span className="ml-3 font-bold text-xl text-white tracking-tight">Bakso Pak Mul</span>
            </div>
            <p className="text-sm leading-relaxed mb-8 max-w-xs">
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
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Navigasi</h4>
            <ul className="space-y-4 text-xs font-medium">
              <li>
                <Link className="hover:text-primary transition-colors" href="/">
                  Beranda
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="/produk">
                  Produk Baru
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="/transaksi">
                  Transaksi
                </Link>
              </li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Perusahaan</h4>
            <ul className="space-y-4 text-xs font-medium">
              <li>
                <Link className="hover:text-primary transition-colors" href="/tentang">
                  Kisah Kami
                </Link>
              </li>
              <li>
                <a
                  className="hover:text-primary transition-colors"
                  href="https://wa.me/6281298980252"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Hubungi Kami
                </a>
              </li>
            </ul>
          </div>
          <div className="md:col-span-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Dapatkan Update Eksklusif</h4>
            <p className="text-xs mb-6">Berlangganan untuk info promo mitra dan produk terbaru.</p>
            <div className="flex gap-2">
              <input
                className="bg-white/5 border-transparent focus:ring-primary focus:border-primary text-xs rounded-lg flex-grow py-3 px-4 transition-all"
                placeholder="Email Anda"
                type="email"
              />
              <button className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-6 py-3 rounded-lg transition-all cursor-pointer">
                Daftar
              </button>
            </div>
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
