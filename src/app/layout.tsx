import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({
  subsets: ["latin"],
});

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
        {/* Midtrans Snap Popup Script */}
        <script 
          type="text/javascript"
          src={process.env.NEXT_PUBLIC_MIDTRANS_ENV === "production" 
                ? "https://app.midtrans.com/snap/snap.js" 
                : "https://app.sandbox.midtrans.com/snap/snap.js"} 
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        ></script>
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
