import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const inter = {
  className: "font-sans",
};

import BottomNav from "@/components/BottomNav";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Bakso Pak Mul | Pusat Bahan Baku Bakso & Mie Ayam",
  description: "Koleksi produk berkualitas premium Bakso Pak Mul",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#51000d" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Bakso Pak Mul" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.className} overflow-x-hidden selection:bg-primary/20 selection:text-primary min-h-screen pb-24 md:pb-0`}>
        <CartProvider>
          {children}
          <BottomNav />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
