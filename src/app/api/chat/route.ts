import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Pesan tidak boleh kosong" }, { status: 400 });
    }

    // 1. Fetch live product catalog from database
    let productList: any[] = [];
    let productCatalogText = "";
    try {
      productList = await prisma.product.findMany({
        where: { isActive: true },
        select: {
          name: true,
          price: true,
          unit: true,
          category: true,
          description: true,
        },
      });

      if (productList.length > 0) {
        productCatalogText = productList
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

    // 2. Intelligent Rule Engine (Periksadulu pertanyaan spesifik pengguna)
    const msgLower = message.toLowerCase();

    // Guardrail Check: Tolak pertanyaan di luar konteks toko
    const outOfScopeKeywords = [
      "presiden", "politik", "koding", "javascript", "python", "matematika",
      "cuaca", "berita", "gemini", "gpt", "siapa kamu", "buatkan program", "game"
    ];

    const isOutOfScope = outOfScopeKeywords.some((k) => msgLower.includes(k));
    if (isOutOfScope) {
      return NextResponse.json({
        reply: "Maaf, saya adalah Asisten AI khusus Toko Bakso Pak Mul 🍲. Saya hanya dapat membantu pertanyaan seputar produk bahan bakso, mie ayam, ongkir, dan pemesanan di toko kami.",
      });
    }

    // Direct Matcher jika API Key tidak ada atau jika pengguna bertanya produk spesifik (misal: "sumpit", "harga", "bakso")
    if (!apiKey) {
      // Cari jika pengguna bertanya tentang produk spesifik di database
      const matchedProduct = productList.find(p => msgLower.includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(msgLower));
      
      if (msgLower.includes("sumpit")) {
        return NextResponse.json({
          reply: "Ya, kami menyediakan Sumpit Bambu Steril! 🥢 Harganya Rp 100 / pcs. Anda dapat menambahkannya langsung ke keranjang belanja saat checkout."
        });
      }

      if (matchedProduct) {
        return NextResponse.json({
          reply: `Ya, kami menjual ${matchedProduct.name}! Harganya Rp ${matchedProduct.price.toLocaleString("id-ID")} per ${matchedProduct.unit || "pcs"}. ${matchedProduct.description ? `Keterangan: ${matchedProduct.description}.` : ""}`
        });
      }

      if (msgLower.includes("harga") || msgLower.includes("berapa") || msgLower.includes("katalog") || msgLower.includes("ada apa aja")) {
        return NextResponse.json({
          reply: productCatalogText 
            ? `Berikut daftar produk & harga Bakso Pak Mul saat ini:\n\n${productCatalogText}\n\nAnda dapat memesannya langsung melalui menu Produk di website kami!`
            : "Berikut beberapa daftar produk & harga Bakso Pak Mul:\n- Baso Sapi Urat Super: Rp 35.000 / pack 500g\n- Baso Sapi Polos Halus: Rp 30.000 / pack 500g\n- Mie Keriting Kenyal: Rp 12.000 / pack 500g\n- Bumbu Kuah Bakso Rahasia: Rp 8.000 / botol\n- Sumpit Bambu Steril: Rp 100 / pcs\n\nUntuk melihat katalog lengkap, silakan buka menu Produk!"
        });
      }

      if (msgLower.includes("ongkir") || msgLower.includes("kirim") || msgLower.includes("kurir")) {
        return NextResponse.json({
          reply: "Pengiriman dilakukan dari Kios Pasar Kramat Jati, Jakarta Timur. Kami mendukung JNE, SiCepat, J&T, serta GoSend Instant/SameDay. Ongkir dihitung otomatis saat checkout sesuai lokasi kota Anda!"
        });
      }

      if (msgLower.includes("bayar") || msgLower.includes("qris") || msgLower.includes("cod") || msgLower.includes("transfer")) {
        return NextResponse.json({
          reply: "Pembayaran mendukung QRIS All Payment (GoPay, OVO, DANA, ShopeePay, m-Banking), Virtual Account, maupun COD (Bayar di Tempat)."
        });
      }

      return NextResponse.json({
        reply: "Kami menyediakan varian Baso Sapi Asli (Urat & Polos), Mie Keriting Kenyal, Bumbu Kuah, Saus, hingga Sumpit Steril. Ada produk spesifik yang ingin Anda tanyakan harganya?"
      });
    }

    // 3. Gemini 2.5 Flash Prompt dengan konteks penuh
    const systemPrompt = `
Kamu adalah Customer Service AI Resmi dari Toko "Bakso Pak Mul" (Pusat Bahan Baku Bakso & Mie Ayam Pasar Kramat Jati, Jakarta Timur).

KATALOG PRODUK LENGKAP & HARGA REAL-TIME:
${productCatalogText || `
- Baso Sapi Urat Super: Rp 35.000 / Pack 500g
- Baso Sapi Polos Halus: Rp 30.000 / Pack 500g
- Mie Keriting Kenyal: Rp 12.000 / Pack 500g
- Bumbu Kuah Bakso Rahasia: Rp 8.000 / Botol 250ml
- Saus Cabai Asli Khas Bakso: Rp 10.000 / Botol
- Sumpit Bambu Steril: Rp 100 / pcs
`}

ATURAN PENTING:
1. Jawablah pertanyaan pengguna dengan LANGSUNG, SPESIFIK, dan AKURAT sesuai katalog produk di atas. (Contoh: Jika ditanya "apakah ada sumpit?", jawab "Ya ada, Sumpit Bambu Steril harganya Rp 100/pcs").
2. JIKA PENGGUNA MENANYAKAN HAL DI LUAR TOKO (politik, koding, cuaca, game, dll), TOLAK DENGAN SOPAN: "Maaf, saya adalah AI Asisten Toko Bakso Pak Mul. Saya hanya dapat menjawab pertanyaan seputar produk bahan bakso, mie ayam, ongkir, dan pemesanan."

Pertanyaan Pengguna: "${message}"
`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.7,
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      }
    );

    if (!res.ok) {
      const errorBody = await res.text();
      console.error("Gemini API failed:", res.status, errorBody);
      return NextResponse.json({
        reply: productCatalogText 
          ? `Ya, kami menjual berbagai produk bahan baku bakso & mie ayam. Berikut daftarnya:\n${productCatalogText}`
          : "Ya, kami menjual Baso Sapi, Mie Keriting, Bumbu Kuah, Saus, hingga Sumpit Steril. Silakan cek menu Produk untuk detailnya!"
      });
    }

    const data = await res.json();
    console.log("Gemini raw response:", JSON.stringify(data));
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Ada yang bisa saya bantu seputar produk Bakso Pak Mul?";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({
      reply: "Maaf, terjadi kendala teknis. Silakan tanyakan langsung ke WhatsApp CS kami di 0812-9898-0252."
    });
  }
}
