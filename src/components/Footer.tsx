"use client";

import React from "react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function Footer() {
  return (
    <footer className="bg-[#18181b] text-stone-300 pt-16 pb-12 w-full border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-stone-800/80">
          {/* Brand Info & Address */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-block">
              <BrandLogo variant="light" size="md" />
            </Link>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Pusat penyedia bahan baku bakso sapi murni, mie basah kenyal, kulit pangsit, bumbu kuah rempah, dan saus racikan khas untuk keluarga serta ratusan mitra warung kuliner di Jabodetabek.
            </p>

            <div className="pt-2 space-y-2 text-xs text-stone-400">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-amber-400 text-base mt-0.5 shrink-0">
                  location_on
                </span>
                <span>
                  <strong>Kios Pusat:</strong> Pasar Kramat Jati, Kramat Jati, Jakarta Timur 13510
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-amber-400 text-base shrink-0">
                  schedule
                </span>
                <span>Buka Setiap Hari: 06.00 – 17.00 WIB</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-emerald-400 text-base shrink-0">
                  chat
                </span>
                <span>CS / Pesanan Grosir: 0812-9898-0252</span>
              </div>
            </div>
          </div>

          {/* Navigasi Produk */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">
              Kategori Produk
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/produk?q=bakso" className="hover:text-amber-300 transition-colors">
                  Bakso Sapi Murni
                </Link>
              </li>
              <li>
                <Link href="/produk?q=mie" className="hover:text-amber-300 transition-colors">
                  Mie Basah &amp; Telor Bebek
                </Link>
              </li>
              <li>
                <Link href="/produk?q=pangsit" className="hover:text-amber-300 transition-colors">
                  Kulit Pangsit &amp; Dimsum
                </Link>
              </li>
              <li>
                <Link href="/produk?q=bumbu" className="hover:text-amber-300 transition-colors">
                  Bumbu Kuah &amp; Rempah
                </Link>
              </li>
              <li>
                <Link href="/produk?q=kecap" className="hover:text-amber-300 transition-colors">
                  Kecap &amp; Saos Pilihan
                </Link>
              </li>
            </ul>
          </div>

          {/* Layanan & Bantuan */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">
              Layanan &amp; Info
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/lacak" className="hover:text-amber-300 transition-colors">
                  Lacak Pengiriman
                </Link>
              </li>
              <li>
                <Link href="/transaksi" className="hover:text-amber-300 transition-colors">
                  Cek Status Pesanan
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="hover:text-amber-300 transition-colors">
                  Kisah &amp; Profil Kami
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/6281298980252"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <span>Kemitraan Warung</span>
                  <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                </a>
              </li>
              <li>
                <Link href="/admin/login" className="text-amber-400/80 hover:text-amber-300 transition-colors font-medium">
                  Portal Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Mitra & Jaminan */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">
              Kemitraan &amp; Garansi
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Melayani pengiriman rutin harian ke warung bakso, depot mie ayam, katering, dan pesanan acara hajatan.
            </p>
            <div className="p-3.5 bg-stone-900 rounded-xl border border-stone-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <span className="material-symbols-outlined text-emerald-400 text-lg">
                  verified
                </span>
                <span>Garansi Kesegaran 100%</span>
              </div>
              <p className="text-[11px] text-stone-400 leading-tight">
                Barang rusak saat pengiriman? Kami ganti baru tanpa biaya tambahan.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright & badges */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Bakso Pak Mul. Cita Rasa Otentik Kramat Jati, Jakarta Timur.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-stone-400">check_circle</span>
              Daging Sapi Pilihan
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-stone-400">shield</span>
              Higienis &amp; Aman
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-stone-400">local_shipping</span>
              Kirim Cepat Se-Jabodetabek
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
