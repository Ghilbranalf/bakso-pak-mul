"use client";

import React from "react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-14 pb-12 w-full border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-block">
              <BrandLogo variant="light" size="md" />
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Penyedia bahan baku bakso sapi murni, mie telor basah, kulit pangsit, dan bumbu kuah kaldu segar. Melayani belanja eceran, acara keluarga, dan kemitraan warung se-Jabodetabek.
            </p>

            <div className="space-y-1.5 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-base shrink-0">
                  location_on
                </span>
                <span>Pasar Kramat Jati, Jakarta Timur 13510</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-base shrink-0">
                  schedule
                </span>
                <span>Setiap Hari: 06.00 – 17.00 WIB</span>
              </p>
            </div>
          </div>

          {/* Navigasi Produk */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider">
              Produk
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/produk?q=bakso" className="hover:text-white transition-colors">
                  Bakso Sapi
                </Link>
              </li>
              <li>
                <Link href="/produk?q=mie" className="hover:text-white transition-colors">
                  Mie Basah
                </Link>
              </li>
              <li>
                <Link href="/produk?q=pangsit" className="hover:text-white transition-colors">
                  Kulit Pangsit
                </Link>
              </li>
              <li>
                <Link href="/produk?q=bumbu" className="hover:text-white transition-colors">
                  Bumbu Kuah
                </Link>
              </li>
            </ul>
          </div>

          {/* Layanan & Bantuan */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider">
              Bantuan
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/lacak" className="hover:text-white transition-colors">
                  Lacak Pesanan
                </Link>
              </li>
              <li>
                <Link href="/transaksi" className="hover:text-white transition-colors">
                  Riwayat Transaksi
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="hover:text-white transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-slate-500 hover:text-slate-300 transition-colors">
                  Portal Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontak & WhatsApp */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider">
              Kontak &amp; Grosir
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Konsultasi pesanan grosir, hajatan, atau kebutuhan warung langsung dengan tim kami.
            </p>
            <a
              href="https://wa.me/6281298980252?text=Halo%20Pak%20Mul,%20saya%20ingin%20tanya%20produk%20dan%20pemesanan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
            >
              <span className="material-symbols-outlined text-base">chat</span>
              <span>Hubungi via WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Bakso Pak Mul. Pasar Kramat Jati, Jakarta Timur.</p>
          <p className="text-slate-500 text-[11px]">100% Halal • Daging Sapi Pilihan • Segar Tiap Hari</p>
        </div>
      </div>
    </footer>
  );
}
