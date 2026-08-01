// Fonnte WhatsApp Gateway API Integration

const FONNTE_TOKEN = process.env.FONNTE_TOKEN || "fonnte_demo_token";
const STORE_ADMIN_WA = "081298980252";

export async function sendFonnteWhatsAppMessage(targetPhone: string, message: string) {
  try {
    const formattedPhone = targetPhone.replace(/^0/, "62").replace(/\D/g, "");

    const res = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: FONNTE_TOKEN,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        target: `${formattedPhone},${STORE_ADMIN_WA}`,
        message: message,
        countryCode: "62",
      }),
    });

    const data = await res.json();
    console.log("Fonnte WA Gateway Response:", data);
    return data;
  } catch (error) {
    console.error("Fonnte WA Gateway error:", error);
    return null;
  }
}

export async function notifyNewOrderWhatsApp(params: {
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  finalTotal: number;
  paymentType: string;
}) {
  const { orderNumber, customerName, phone, address, finalTotal, paymentType } = params;

  const message = 
    `🔔 *PESANAN BARU BAKSO PAK MUL*\n\n` +
    `📦 *ID Pesanan*: ${orderNumber}\n` +
    `👤 *Nama*: ${customerName}\n` +
    `📞 *No HP*: ${phone}\n` +
    `📍 *Alamat*: ${address}\n` +
    `💰 *Total Pembayaran*: Rp ${finalTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}\n` +
    `💳 *Metode*: ${paymentType || "COD"}\n\n` +
    `Pesan ini dikirim otomatis oleh Sistem Website Bakso Pak Mul Official 🥩🚀`;

  return sendFonnteWhatsAppMessage(phone, message);
}
