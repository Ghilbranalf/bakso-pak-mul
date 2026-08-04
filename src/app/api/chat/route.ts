import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Pesan tidak boleh kosong" }, { status: 400 });
    }

    // 1. Ambil seluruh data produk dari Database Prisma secara real-time
    let productCatalogText = "";
    try {
      const products = await prisma.product.findMany({
        where: { isActive: true },
        select: {
          name: true,
          price: true,
          unit: true,
          category: true,
          badge: true,
          description: true,
        },
      });

      if (products.length > 0) {
        productCatalogText = products
          .map(
            (p) =>
              `- ${p.name} (${p.category}): Rp ${p.price.toLocaleString("id-ID")}/${p.unit || "unit"}. Deskripsi: ${p.description || "Bahan berkualitas"}`
          )
          .join("\n");
      }
    } catch (dbErr) {
      console.warn("Could not fetch live products for AI context:", dbErr);
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // 2. Jika API Key Gemini belum diisi, gunakan Intelligent Local Guardrail Engine
    if (!apiKey) {
      const msgLower = message.toLowerCase();

      // Guardrail Check: Tolak pertanyaan di luar konteks toko
      const outOfScopeKeywords = [
        "presiden", "politik", "koding", "javascript", "python", "matematika",
        "cuaca", "berita", "gemini", "gpt", "siapa kamu", "buatkan program", "game"
      ];

      const isOutOfScope = outOfScopeKeywords.some((k) => msgLower.includes(k));

      if (isOutOfScope) {
        return NextResponse.json({
          reply: "Maaf, saya adalah Asisten AI khusus Toko Bakso Pak Mul 🍲. Saya hanya dapat menjawab pertanyaan seputar produk bahan bakso, mie ayam, ongkir, dan pemesanan di toko kami.",
        });
      }

      let fallbackReply = "Halo! Saya Asisten AI Bakso Pak Mul 🍲. ";

      if (msgLower.includes("harga") || msgLower.includes("berapa") || msgLower.includes("katalog") || msgLower.includes("murah")) {
        fallbackReply = "Berikut beberapa daftar produk & harga Bakso Pak Mul:\n- Baso Sapi Urat Super: Rp 35.000 / pack 500g\n- Baso Sapi Polos Halus: Rp 30.000 / pack 500g\n- Mie Keriting Kenyal: Rp 12.000 / pack 500g\n- Bumbu Kuah Bakso Rahasia: Rp 8.000 / botol\n\nUntuk katalog produk lengkap & terbaru, Anda dapat melihat langsung di menu Katalog Produk di website kami!";
      } else if (msgLower.includes("ongkir") || msgLower.includes("kirim") || msgLower.includes("kurir")) {
        fallbackReply = "Pengiriman dilakukan dari Kios Pasar Kramat Jati, Jakarta Timur. Kami mendukung JNE, SiCepat, J&T, serta GoSend Instant/SameDay. Ongkir dihitung otomatis di halaman Checkout sesuai kota Anda!";
      } else if (msgLower.includes("bakso") || msgLower.includes("mie") || msgLower.includes("bahan") || msgLower.includes("produk")) {
        fallbackReply = "Kami menyediakan Baso Sapi Asli (Urat & Polos), Mie Keriting Kenyal tanpa pengawet, Bumbu Kuah Rahasia, serta Saus & Kecap pilihan khas usaha Bakso & Mie Ayam.";
      } else if (msgLower.includes("bayar") || msgLower.includes("qris") || msgLower.includes("cod") || msgLower.includes("transfer")) {
        fallbackReply = "Pembayaran mendukung QRIS All Payment (GoPay, OVO, DANA, ShopeePay, m-Banking), Virtual Account, maupun COD (Bayar di Tempat).";
      } else {
        fallbackReply = "Ada yang bisa saya bantu seputar daftar harga produk bakso, mie ayam, ongkir, atau cara pemesanan di Bakso Pak Mul?";
      }

      return NextResponse.json({ reply: fallbackReply });
    }

    // 3. Prompt System & Knowledge Injection untuk Gemini 2.5 Flash
    const systemPrompt = `
Kamu adalah Customer Service AI Resmi dari Toko "Bakso Pak Mul" (Pusat Bahan Baku Bakso & Mie Ayam yang berlokasi di Kios Pasar Kramat Jati, Jakarta Timur).

PENGETAHUAN PRODUK & TOKO BAKSO PAK MUL (REAL-TIME DATA):
- Lokasi Toko: Kios Pasar Kramat Jati, Jakarta Timur.
- Metode Pengiriman: JNE, SiCepat, J&T, GoSend Instant / SameDay. Ongkir dihitung otomatis saat checkout berdasarkan kota tujuan.
- Metode Pembayaran: QRIS All Payment (GoPay, OVO, DANA, ShopeePay, LinkAja, m-Banking), Virtual Account, & COD (Bayar di Tempat).
- Kontak Admin WA: 0812-9898-0252.

KATALOG PRODUK LENGKAP & HARGA SAAT INI:
${productCatalogText || `
- Baso Sapi Urat Super: Rp 35.000 / Pack 500g
- Baso Sapi Polos Halus: Rp 30.000 / Pack 500g
- Mie Keriting Kenyal: Rp 12.000 / Pack 500g
- Bumbu Kuah Bakso Rahasia: Rp 8.000 / Botol 250ml
- Saus Cabai Asli Khas Bakso: Rp 10.000 / Botol
- Sumpit Bambu Steril: Rp 100 / pcs
`}

ATURAN KETAT (GUARDRAIL INSTRUCTIONS):
1. KAMU HANYA BOLEH MENJAWAB pertanyaan yang berhubungan dengan Toko Bakso Pak Mul, produk yang dijual, harga, ongkir, cara beli, dan lokasi toko.
2. JIKA PENGGUNA MENANYAKAN HAL DI LUAR TOKO (seperti topik politik, koding, cuaca, pengetahuan umum, matematika, dsb), JAWAB DENGAN SOPAN: "Maaf, saya adalah AI Asisten Toko Bakso Pak Mul. Saya hanya dapat membantu pertanyaan seputar produk bahan bakso, mie ayam, ongkir, dan pemesanan di toko kami."
3. Jawablah dengan ramah, singkat, jelas, dan profesional menggunakan Bahasa Indonesia yang sopan.

Pertanyaan Pengguna: "${message}"
`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: systemPrompt }],
            },
          ],
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gemini API Error:", errText);
      return NextResponse.json({
        reply: "Halo! Asisten Toko Bakso Pak Mul siap membantu. Anda bisa melihat daftar harga lengkap di menu Katalog Produk atau chat WA CS kami di 0812-9898-0252.",
      });
    }

    const data = await res.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Halo! Ada yang bisa saya bantu seputar produk Bakso Pak Mul?";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { reply: "Maaf, terjadi kendala teknis. Anda juga dapat langsung chat WhatsApp CS kami di 0812-9898-0252." },
      { status: 500 }
    );
  }
}
