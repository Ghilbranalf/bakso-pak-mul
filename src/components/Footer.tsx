"use client";

import React from "react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function Footer() {
  return (
    <footer className="bg-[#1c1917] text-stone-400 pt-16 pb-12 w-full border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-stone-800/80">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-block group">
              <BrandLogo variant="light" size="md" />
            </Link>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Penyedia bahan baku bakso sapi murni segar, mie telor bebek basah, kulit pangsit lembut, dan bumbu kuah kaldu rempah. Melayani kebutuhan dapur keluarga, hajatan, hingga ratusan warung mitra se-Jabodetabek.
            </p>

            <div className="space-y-1.5 text-xs text-stone-400 pt-1">
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400 text-base shrink-0">
                  location_on
                </span>
                <span>Pasar Kramat Jati, Jakarta Timur 13510</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400 text-base shrink-0">
                  schedule
                </span>
                <span>Buka Setiap Hari: 06.00 – 17.00 WIB</span>
              </p>
            </div>
          </div>

          {/* Navigasi Produk */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">
              Koleksi Menu
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/produk?q=bakso" className="hover:text-amber-200 transition-colors">
                  Bakso Sapi Pilihan
                </Link>
              </li>
              <li>
                <Link href="/produk?q=mie" className="hover:text-amber-200 transition-colors">
                  Mie Basah &amp; Telor Bebek
                </Link>
              </li>
              <li>
                <Link href="/produk?q=pangsit" className="hover:text-amber-200 transition-colors">
                  Kulit Pangsit &amp; Dimsum
                </Link>
              </li>
              <li>
                <Link href="/produk?q=bumbu" className="hover:text-amber-200 transition-colors">
                  Bumbu Kuah Kaldu
                </Link>
              </li>
              <li>
                <Link href="/produk?q=saos" className="hover:text-amber-200 transition-colors">
                  Kecap &amp; Saus Sambal
                </Link>
              </li>
            </ul>
          </div>

          {/* Layanan & Bantuan */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">
              Bantuan &amp; Info
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/lacak" className="hover:text-amber-200 transition-colors">
                  Lacak Pengiriman
                </Link>
              </li>
              <li>
                <Link href="/transaksi" className="hover:text-amber-200 transition-colors">
                  Riwayat Transaksi
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="hover:text-amber-200 transition-colors">
                  Kisah &amp; Filosofi Rasa
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-stone-500 hover:text-amber-200 transition-colors">
                  Portal Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontak & WhatsApp */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">
              Kemitraan &amp; Grosir
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Konsultasi pesanan skala warung kuliner, hajatan, atau katering langsung dengan tim Pak Mul.
            </p>
            <a
              href="https://wa.me/6281298980252?text=Halo%20Pak%20Mul,%20saya%20ingin%20konsultasi%20pemesanan%20grosir"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors shadow-2xs"
            >
              <span className="material-symbols-outlined text-base">chat</span>
              <span>Hubungi via WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Bakso Pak Mul. Pasar Kramat Jati, Jakarta Timur.</p>
          <p className="text-stone-500 text-[11px]">100% Halal • Daging Sapi Murni • Olahan Segar Tiap Hari</p>
        </div>
      </div>
    </footer>
  );
}
