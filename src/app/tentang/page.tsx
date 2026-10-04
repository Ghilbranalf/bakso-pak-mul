"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#faf7f2] text-stone-900 font-sans antialiased flex flex-col justify-between selection:bg-[#51000d] selection:text-white">
      <Navbar />

      <main className="pt-20 sm:pt-24 flex-grow">
        {/* Editorial Story Hero */}
        <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2.5 text-xs font-bold tracking-[0.25em] text-[#7a0019] uppercase">
              <span className="w-6 h-[1px] bg-[#7a0019]" />
              <span>Dedikasi &amp; Tradisi Sejak 2000</span>
              <span className="w-6 h-[1px] bg-[#7a0019]" />
            </div>
            <h1 className="font-headline text-4xl sm:text-6xl text-[#1c1917] uppercase tracking-tight leading-tight">
              Kisah di Balik Kios Kramat Jati
            </h1>
            <p className="text-[#2b1b17] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-medium">
              Perjalanan lebih dari dua dekade meracik olahan daging sapi segar pilihan, mempertahankan rasa otentik yang jujur dan dipercaya keluarga serta ratusan mitra kuliner di Jabodetabek.
            </p>
          </div>
        </section>

        {/* Narrative & Authentic Photography */}
        <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-stone-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <p className="font-headline uppercase text-2xl sm:text-3xl text-[#1c1917] leading-snug tracking-wide">
                &ldquo;Rasa tidak pernah bisa dibohongi. Ketika daging sapi murni diolah dengan kejujuran resep rempah, lidah pelanggan akan selalu ingat jalan pulang.&rdquo;
              </p>

              <div className="space-y-4 text-[#2b1b17] text-sm sm:text-base leading-relaxed font-medium">
                <p>
                  Bermula pada tahun 2000 dari sebuah kios sederhana di lantai dasar Pasar Kramat Jati, Jakarta Timur, Pak Mul memulai usahanya dengan prinsip sederhana: tidak akan pernah berkompromi dengan kualitas daging sapi. Di saat banyak produsen mencampur bahan pengisi berlebih demi mengejar volume, Pak Mul tetap setia memilih daging sapi segar langsung dari pemotongan pasar induk pada pukul 04.30 subuh setiap hari.
                </p>
                <p>
                  Kini, setelah lebih dari 24 tahun konsistensi rasa itu dijaga, Bakso Pak Mul telah melayani ribuan pelanggan rumah tangga dan menjadi mitra utama bagi lebih dari 500 gerobak mie ayam, warung bakso solo, depot katering, hingga restoran keluarga di seluruh penjuru Jakarta, Bogor, Depok, Tangerang, dan Bekasi.
                </p>
              </div>

              {/* Legacy Milestones */}
              <div className="pt-6 border-t border-stone-200 grid grid-cols-3 gap-6">
                <div>
                  <p className="font-headline text-3xl font-bold text-[#51000d]">2000</p>
                  <p className="text-xs text-[#51000d] font-bold mt-1">Tahun Berdiri di Kramat Jati</p>
                </div>
                <div>
                  <p className="font-headline text-3xl font-bold text-[#51000d]">100%</p>
                  <p className="text-xs text-[#51000d] font-bold mt-1">Daging Sapi Segar Pilihan</p>
                </div>
                <div>
                  <p className="font-headline text-3xl font-bold text-[#51000d]">500+</p>
                  <p className="text-xs text-[#51000d] font-bold mt-1">Mitra Warung &amp; Katering</p>
                </div>
              </div>
            </div>

            {/* Right Photo */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-stone-900 group border-4 border-[#e5a93c]/30">
                <img
                  src="/images/toko-pak-mul-kramat-jati.webp"
                  alt="Pak Mul di Kios Pasar Kramat Jati"
                  className="w-full h-[450px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e5a93c]">
                    Dokumentasi Kios Asli
                  </span>
                  <p className="font-headline text-xl uppercase tracking-wide mt-1 text-white">
                    Kios Bakso Pak Mul
                  </p>
                  <p className="text-xs text-[#fef3c7] mt-0.5 font-medium">
                    Pasar Kramat Jati, Jakarta Timur • Buka Tiap Subuh
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quality Values (Editorial Grid) */}
        <section className="py-16 sm:py-24 bg-white border-y border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-14">
              <p className="text-xs font-bold tracking-[0.2em] text-[#7a0019] uppercase mb-1">
                Prinsip Tanpa Kompromi
              </p>
              <h2 className="font-headline text-3xl sm:text-4xl text-[#1c1917] uppercase tracking-tight">
                Tiga Pilar Kualitas Bakso Pak Mul
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
              <div className="bg-[#faf7f2] p-8 rounded-2xl border border-stone-200 space-y-3">
                <span className="font-headline text-2xl font-bold text-[#51000d]">01</span>
                <h3 className="font-headline text-lg uppercase text-[#1c1917]">
                  Daging Murni Tanpa Boraks
                </h3>
                <p className="text-xs sm:text-sm text-[#2b1b17] leading-relaxed font-medium">
                  Tekstur kenyal bakso kami berasal murni dari kekenyalan alami serat daging sapi segar yang digiling dingin, bukan dari bahan kimia berbahaya maupun pengenyal buatan.
                </p>
              </div>

              <div className="bg-[#faf7f2] p-8 rounded-2xl border border-stone-200 space-y-3">
                <span className="font-headline text-2xl font-bold text-[#51000d]">02</span>
                <h3 className="font-headline text-lg uppercase text-[#1c1917]">
                  Resep Rempah Warisan
                </h3>
                <p className="text-xs sm:text-sm text-[#2b1b17] leading-relaxed font-medium">
                  Takaran bawang putih goreng lokal, merica butir tumbuk, dan bumbu kaldu rempah yang dipertahankan turun temurun memberikan keharuman aroma yang khas dan menggugah selera.
                </p>
              </div>

              <div className="bg-[#faf7f2] p-8 rounded-2xl border border-stone-200 space-y-3">
                <span className="font-headline text-2xl font-bold text-[#51000d]">03</span>
                <h3 className="font-headline text-lg uppercase text-[#1c1917]">
                  Kemasan Higienis &amp; Rantai Dingin
                </h3>
                <p className="text-xs sm:text-sm text-[#2b1b17] leading-relaxed font-medium">
                  Produk disegel rapi dalam kemasan hampa udara (vacuum pack) dan didinginkan langsung untuk memastikan keamanan pangan dan kualitas mutu terjaga hingga ke tangan Anda.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Invitation & Kiosk Location */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-[#200408] via-[#51000d] to-[#200408] text-white p-8 sm:p-14 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border border-[#59101f]">
            <div className="max-w-xl space-y-3">
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#e5a93c]">
                Kemitraan Usaha &amp; Hajatan
              </p>
              <h2 className="font-headline text-2xl sm:text-4xl uppercase leading-tight tracking-wide">
                Tertarik Bermitra atau Butuh Pasokan Rutin?
              </h2>
              <p className="text-[#fef3c7] text-xs sm:text-sm leading-relaxed font-medium">
                Kami siap menyuplai kebutuhan bakso sapi, mie telor, kulit pangsit, dan bumbu kuah dengan harga grosir terbaik untuk usaha Anda.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href="https://wa.me/6281298980252?text=Halo%20Pak%20Mul,%20saya%20tertarik%20dengan%20kemitraan%20usaha%20bakso"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-white text-[#51000d] hover:bg-stone-100 font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-emerald-700 text-base">chat</span>
                <span>Konsultasi WhatsApp</span>
              </a>

              <Link
                href="/produk"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Katalog Menu
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
