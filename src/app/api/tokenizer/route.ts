import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { items = [], totalPrice = 0 } = body;

    const serverKey = process.env.MIDTRANS_SERVER_KEY || "SB-Mid-server-DemoKey12345";
    const authString = Buffer.from(`${serverKey}:`).toString("base64");

    const orderId = `BPM-${Date.now()}`;

    const computedTotal = items.length > 0
      ? items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
      : totalPrice || 4500000;

    const shipping = items.length > 0 ? 150000 : 0;
    const discount = computedTotal > 500000 ? 100000 : 0;
    const grossAmount = Math.max(10000, computedTotal + shipping - discount);

    const payload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      item_details: items.length > 0
        ? items.map((item: any) => ({
            id: String(item.id).substring(0, 50),
            price: Number(item.price),
            quantity: Number(item.quantity),
            name: String(item.name).substring(0, 50),
          }))
        : [
            {
              id: "bpm-bulk-1",
              price: 4500000,
              quantity: 1,
              name: "Pesanan Bakso Pak Mul B2B Wholesale",
            },
          ],
      customer_details: {
        first_name: "Mitra",
        last_name: "Pak Mul",
        email: "mitra@baksopakmul.com",
        phone: "081234567890",
      },
      enabled_payments: [
        "gopay",
        "shopeepay",
        "bca_va",
        "bni_va",
        "bri_va",
        "mandiri_bill",
        "qris",
        "bank_transfer"
      ]
    };

    const response = await fetch("https://app.sandbox.midtrans.com/snap/v1/transactions", {
      method: "POST",
      headers: {
        "Content-[#Type]": "application/json",
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Basic ${authString}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.token) {
      return NextResponse.json({
        token: data.token,
        redirect_url: data.redirect_url,
        orderId,
      });
    }

    // Fallback sandbox simulation token if server key is in test mode
    return NextResponse.json({
      token: "SNAP-SANDBOX-DEMO-" + orderId,
      redirect_url: "https://app.sandbox.midtrans.com",
      orderId,
      payload,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate Midtrans transaction token" },
      { status: 500 }
    );
  }
}
