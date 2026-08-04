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

    // 2. Intelligent Rule Engine (Sistem Pengenal Pertanyaan Pintar & Manusiawi)
    const msgLower = message.toLowerCase();

    // Guardrail Check: Tolak pertanyaan di luar konteks toko
    const outOfScopeKeywords = [
      "presiden", "politik", "koding", "javascript", "python", "matematika",
      "cuaca", "berita", "gemini", "gpt", "siapa kamu", "buatkan program", "game"
    ];

    const isOutOfScope = outOfScopeKeywords.some((k) => msgLower.includes(k));
    if (isOutOfScope) {
      return NextResponse.json({
        reply: "Waduh maaf ya kak, saya cuma bisa bantu jawab seputar produk Bakso Pak Mul, ongkir, dan pemesanan di toko kami aja nih 🙏 Ada yang bisa dibantu untuk pesanan bakso atau mienya?",
      });
    }

    // Sapaan / Salam Sederhana (Halo, Hi, P, Selamat Pagi/Siang/Sore/Malam, Permisi)
    const isGreeting = ["halo", "hai", "hi", "p", "permisi", "selamat", "tes", "test"].some((g) =>
      msgLower === g || msgLower === g + "!" || msgLower.startsWith(g + " ") || msgLower.endsWith(" " + g)
    );

    if (isGreeting) {
      return NextResponse.json({
        reply: "Halo kak! 👋 Selamat datang di Bakso Pak Mul. Ada yang bisa Mas Mul bantu seputar bahan bakso, mie ayam, cek ongkir, atau cara pemesanan hari ini?"
      });
    }

    // Pertanyaan: "Disini menjual apa?" / "Jual apa aja?" / "Produknya apa?"
    if (msgLower.includes("jual apa") || msgLower.includes("menjual apa") || msgLower.includes("jualan apa") || msgLower.includes("produk apa")) {
      return NextResponse.json({
        reply: "Halo kak! Kami adalah Pusat Bahan Baku Bakso & Mie Ayam berkualitas di Pasar Kramat Jati! 🍲\n\nProduk pilihan kami antara lain:\n1. 🥩 Bakso Sapi Asli (Urat Super & Polos Halus)\n2. 🍜 Mie Ayam & Kulit Pangsit (Mie Keriting Kenyal, Pangsit Goreng/Rebus)\n3. 🧂 Bumbu & Saus (Bumbu Kuah Rahasia, Kecap Manis, Saos Pedas)\n4. 🥢 Pelengkap (Sumpit Bambu Steril)\n\nKakak lagi cari bahan yang mana nih? Mau Mas Mul infokan harganya?"
      });
    }

    // Pertanyaan: Sumpit
    if (msgLower.includes("sumpit")) {
      return NextResponse.json({
        reply: "Iya betul kak, kami menyediakan Sumpit Bambu Steril! 🥢 Harganya cuma Rp 100 / pcs. Bisa langsung kakak tambahkan ke keranjang pas checkout ya."
      });
    }

    // Pertanyaan: Ongkir / Pengiriman / Kurir
    if (msgLower.includes("ongkir") || msgLower.includes("kirim") || msgLower.includes("kurir")) {
      return NextResponse.json({
        reply: "Pengiriman kami dari Kios Pasar Kramat Jati, Jakarta Timur kak! 🚚 Kami pakai JNE, SiCepat, J&T, dan GoSend Instant/SameDay. Ongkirnya otomatis dihitung sistem saat checkout sesuai lokasi kota kakak ya!"
      });
    }

    // Pertanyaan: Cara Bayar / Pembayaran / QRIS / COD
    if (msgLower.includes("bayar") || msgLower.includes("qris") || msgLower.includes("cod") || msgLower.includes("transfer")) {
      return NextResponse.json({
        reply: "Untuk pembayaran bisa pakai QRIS All Payment (GoPay, OVO, DANA, ShopeePay, m-Banking), Virtual Account, maupun COD (Bayar di Tempat saat barang sampai) kak!"
      });
    }

    // Pertanyaan Spesifik Kategori: Bakso Sapi
    if (msgLower.includes("bakso") || msgLower.includes("baso")) {
      const baksoProducts = productList.filter((p) =>
        p.category?.toLowerCase().includes("bakso") || p.name.toLowerCase().includes("bakso") || p.name.toLowerCase().includes("baso")
      );

      const baksoText = baksoProducts.length > 0
        ? baksoProducts.map((p) => `• *${p.name}*\n  👉 *Rp ${p.price.toLocaleString("id-ID")}* / ${p.unit || "bks"}`).join("\n\n")
        : "• *Bakso Cita Rasa Premium*: Rp 80.000/bks\n• *Bakso Super Essem Spesial*: Rp 75.000/bks\n• *Bakso Jeruk SB (50pcs)*: Rp 60.000/bks\n• *Bakso Mekar Wangi (50pcs)*: Rp 50.000/bks";

      return NextResponse.json({
        reply: `Berikut daftar varian *Bakso Sapi Asli* Bakso Pak Mul ya kak 🥩:\n\n${baksoText}\n\n100% daging sapi pilihan fresh dari Kios Pasar Kramat Jati. Kakak tertarik coba varian yang mana nih? 😊`
      });
    }

    // Pertanyaan Spesifik Kategori: Mie & Kulit Pangsit
    if (msgLower.includes("mie") || msgLower.includes("pangsit")) {
      const mieProducts = productList.filter((p) =>
        p.category?.toLowerCase().includes("mie") || p.name.toLowerCase().includes("mie") || p.name.toLowerCase().includes("pangsit")
      );

      const mieText = mieProducts.length > 0
        ? mieProducts.map((p) => `• *${p.name}*\n  👉 *Rp ${p.price.toLocaleString("id-ID")}* / ${p.unit || "bks"}`).join("\n\n")
        : "• *Mie Ayam Resto Telur Bebek*: Rp 20.000/bks\n• *Mie Keriting ACI*: Rp 15.000/bks\n• *Kulit Pangsit Dimsum / Goreng*: Rp 20.000/bks";

      return NextResponse.json({
        reply: `Berikut varian *Mie Ayam & Kulit Pangsit* kenyal khas toko kami 🍜:\n\n${mieText}\n\nTanpa pengawet & kenyal sempurna kak! ✨`
      });
    }

    // Pertanyaan Spesifik Kategori: Bumbu & Saus
    if (msgLower.includes("bumbu") || msgLower.includes("saus") || msgLower.includes("saos") || msgLower.includes("kecap") || msgLower.includes("sambal")) {
      const bumbuProducts = productList.filter((p) =>
        p.category?.toLowerCase().includes("bumbu") || p.name.toLowerCase().includes("bumbu") || p.name.toLowerCase().includes("saos") || p.name.toLowerCase().includes("saus") || p.name.toLowerCase().includes("kecap")
      );

      const bumbuText = bumbuProducts.length > 0
        ? bumbuProducts.map((p) => `• *${p.name}*\n  👉 *Rp ${p.price.toLocaleString("id-ID")}* / ${p.unit || "bks"}`).join("\n\n")
        : "• *Bumbu Multi Guna Kuah Bakso/Sop*: Rp 30.000/bks\n• *Saos Pedas Lima Delapan*: Rp 8.000/bks\n• *Kecap Manis Nasional*: Rp 10.000/bks";

      return NextResponse.json({
        reply: `Berikut koleksi *Bumbu Rahasia & Saus/Kecap* Bakso Pak Mul 🧂:\n\n${bumbuText}\n\nBikin racikan kuah bakso & mie ayam kakak makin mantap! 😋`
      });
    }

    // Cari jika pengguna bertanya tentang produk spesifik nama dari database
    const matchedProduct = productList.find(p => msgLower.includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(msgLower));
    if (matchedProduct) {
      return NextResponse.json({
        reply: `Iya kak, kami menjual *${matchedProduct.name}*! 🏷️\n\nHarga: *Rp ${matchedProduct.price.toLocaleString("id-ID")}* / ${matchedProduct.unit || "pcs"}.\n${matchedProduct.description ? `Keterangan: ${matchedProduct.description}.` : ""}`
      });
    }

    // Pertanyaan: Harga / Berapa / Katalog Umum
    if (msgLower.includes("harga") || msgLower.includes("berapa") || msgLower.includes("katalog") || msgLower.includes("ada apa aja")) {
      return NextResponse.json({
        reply: productCatalogText 
          ? `Berikut daftar produk & harga Bakso Pak Mul saat ini ya kak:\n\n${productCatalogText}\n\nKakak bisa pilih dan pesan langsung lewat menu Produk di website!`
          : "Berikut beberapa daftar produk & harga kami kak:\n- Baso Sapi Urat Super: Rp 35.000 / pack 500g\n- Baso Sapi Polos Halus: Rp 30.000 / pack 500g\n- Mie Keriting Kenyal: Rp 12.000 / pack 500g\n- Bumbu Kuah Bakso Rahasia: Rp 8.000 / botol\n- Sumpit Bambu Steril: Rp 100 / pcs\n\nUntuk melihat katalog lengkap, silakan buka menu Produk ya kak!"
      });
    }

    // 3. Gemini 1.5 Flash Prompt (Human-like CS Assistant)
    const systemPrompt = `
Kamu adalah Mas Mul, Customer Service ramah, sopan, dan manusiawi dari toko "Bakso Pak Mul" (Pusat Bahan Baku Bakso & Mie Ayam yang berlokasi di Kios Pasar Kramat Jati, Jakarta Timur).

KEPRIBADIAN & GAYA BICARA:
- Bicara dengan gaya santai, ramah, dan profesional seperti manusia sungguhan (Gunakan kata seperti "Halo kak!", "Siap kak", "Iya betul kak").
- JANGAN berbicara kaku seperti bot, dan JANGAN mencetak daftar panjang produk jika tidak diminta!
- Jika pembeli bertanya "disini menjual apa?" atau "jual apa aja?", jelaskan dengan bahasa manusia singkat: "Halo kak! Kami menyediakan berbagai kebutuhan bahan baku Bakso & Mie Ayam premium, seperti Bakso Sapi Asli (Urat & Polos), Mie Keriting Kenyal, Bumbu Kuah Rahasia, Saus/Kecap khas bakso, sampai Sumpit Steril kak. Kakak lagi cari bahan yang mana nih?"

DATA KATALOG PRODUK & HARGA SAAT INI (GUNAKAN INI UNTUK MENJAWAB HARGA SPESIFIK):
${productCatalogText || `
- Baso Sapi Urat Super: Rp 35.000 / Pack 500g
- Baso Sapi Polos Halus: Rp 30.000 / Pack 500g
- Mie Keriting Kenyal: Rp 12.000 / Pack 500g
- Bumbu Kuah Bakso Rahasia: Rp 8.000 / Botol 250ml
- Saus Cabai Asli Khas Bakso: Rp 10.000 / Botol
- Sumpit Bambu Steril: Rp 100 / pcs
`}

ATURAN PENTING:
1. Selalu jawab secara alami, ramah, dan solutif.
2. Jika ditanya hal umum toko (lokasi, cara beli, ongkir, produk), jawab dengan ringkas dan enak dibaca.
3. JIKA PENGGUNA MENANYAKAN HAL DI LUAR TOKO (politik, koding, cuaca, game, dll), tolak dengan ramah: "Waduh maaf ya kak, saya cuma bisa bantu jawab seputar produk Bakso Pak Mul, ongkir, dan pemesanan di toko kami aja nih 🙏 Ada yang bisa dibantu untuk pesanan bakso atau mienya?"

Pertanyaan Pembeli: "${message}"
`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: {
            maxOutputTokens: 300,
            temperature: 0.8,
          },
        }),
      }
    );

    if (!res.ok) {
      const errorBody = await res.text();
      console.error("Gemini API failed:", res.status, errorBody);
      return NextResponse.json({
        reply: "Halo! 👋 Ada yang bisa kami bantu seputar varian bahan bakso, mie ayam, atau cek ongkir hari ini?"
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
