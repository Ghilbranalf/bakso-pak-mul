import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Pesan tidak boleh kosong" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Intelligent local fallback AI assistant response if GEMINI_API_KEY is not set yet
      const msgLower = message.toLowerCase();
      let fallbackReply = "Halo! Saya Asisten AI Bakso Pak Mul 🍲. ";

      if (msgLower.includes("ongkir") || msgLower.includes("kirim") || msgLower.includes("kurir")) {
        fallbackReply += "Pengiriman dilakukan langsung dari Kios Pasar Kramat Jati, Jakarta Timur. Kami mendukung kurir JNE, SiCepat, J&T, serta GoSend Instant/SameDay. Ongkir dihitung otomatis saat checkout!";
      } else if (msgLower.includes("bakso") || msgLower.includes("mie") || msgLower.includes("bahan") || msgLower.includes("produk")) {
        fallbackReply += "Kami menyediakan Baso Sapi Asli (Urat, Polos, Halus), Mie Keriting Kenyal tanpa pengawet, Bumbu Kuah Rahasia, serta Saus & Kecap pilihan.";
      } else if (msgLower.includes("bayar") || msgLower.includes("qris") || msgLower.includes("cod") || msgLower.includes("transfer")) {
        fallbackReply += "Pembayaran bisa melalui QRIS All Payment (GoPay, OVO, DANA, ShopeePay, m-Banking), Virtual Account, maupun COD (Bayar di Tempat).";
      } else {
        fallbackReply += "Ada yang bisa saya bantu terkait produk bakso, mie ayam, cek ongkir, atau cara pemesanan hari ini?";
      }

      return NextResponse.json({ reply: fallbackReply });
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Kamu adalah asisten toko ramah dan responsif Bakso Pak Mul (Pusat Bahan Baku Bakso & Mie Ayam Pasar Kramat Jati Jakarta Timur). Jawab pertanyaan pengguna secara ramah, singkat, dan tepat seputar produk bahan bakso, mie ayam, ongkir kurir, cara order, dan pembayaran QRIS/COD.\n\nPertanyaan Pengguna: ${message}`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gemini API Error:", errText);
      return NextResponse.json({
        reply: "Halo! CS Bakso Pak Mul siap membantu Anda. Untuk pertanyaan seputar ketersediaan stok & pesanan grosir, Anda juga bisa langsung WhatsApp ke 0812-9898-0252.",
      });
    }

    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Halo! Ada yang bisa kami bantu seputar pesanan Bakso Pak Mul?";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { reply: "Maaf, terjadi kendala koneksi. Anda juga dapat menghubungi WhatsApp CS Bakso Pak Mul di 0812-9898-0252." },
      { status: 500 }
    );
  }
}
