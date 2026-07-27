import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { items = [], totalPrice = 0, shippingCost = 0, discount = 0 } = body;

    const serverKey = process.env.MIDTRANS_SERVER_KEY || "SB-Mid-server-DemoKey12345";
    const authString = Buffer.from(`${serverKey}:`).toString("base64");

    const orderId = `BPM-${Date.now()}`;

    const computedTotal = items.length > 0
      ? items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
      : totalPrice || 4500000;

    const shipping = Number(shippingCost) || 0;
    const disc = Number(discount) || 0;
    const grossAmount = Math.max(10000, computedTotal + shipping - disc);

    let item_details = items.length > 0
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
            name: "Pesanan Bakso Pak Mul B2B",
          },
        ];

    if (items.length > 0) {
      if (shipping > 0) {
        item_details.push({
          id: "SHIPPING",
          price: shipping,
          quantity: 1,
          name: "Biaya Pengiriman (Kargo)"
        });
      }
      if (discount > 0) {
        item_details.push({
          id: "DISCOUNT",
          price: -discount,
          quantity: 1,
          name: "Diskon Pembelian Grosir"
        });
      }
    }

    const payload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      item_details,
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

    const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_ENV === "production";
    const apiUrl = isProduction
      ? "https://app.midtrans.com/snap/v1/transactions"
      : "https://app.sandbox.midtrans.com/snap/v1/transactions";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Basic ${authString}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Midtrans API Error:", data);
      return NextResponse.json(
        { error: "Midtrans API Error", details: data },
        { status: response.status }
      );
    }

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
  } catch (error: any) {
    console.error("Internal Tokenizer Error:", error);
    return NextResponse.json(
      { error: "Failed to generate Midtrans transaction token", details: error.message },
      { status: 500 }
    );
  }
}
