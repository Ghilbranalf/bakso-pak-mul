import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { items = [], totalPrice = 0, shippingCost = 0, discount = 0, shippingInfo = {}, paymentType = "online" } = body;

    const serverKey = process.env.MIDTRANS_SERVER_KEY || "SB-Mid-server-DemoKey12345";
    const authString = Buffer.from(`${serverKey}:`).toString("base64");

    const orderId = body.orderNumber || body.orderId || `BPM-${Date.now()}`;

    const computedTotal = items.length > 0
      ? items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
      : totalPrice || 100;

    const shipping = Number(shippingCost) || 0;
    const disc = Number(discount) || 0;
    const grossAmount = Math.max(1, computedTotal + shipping - disc);

    // Save order to database if not created yet
    const existingOrder = await prisma.order.findUnique({
      where: { orderNumber: orderId }
    });

    if (!existingOrder) {
      await prisma.order.create({
        data: {
          orderNumber: orderId,
          status: paymentType === "cod" ? "PENDING" : "AWAITING_PAYMENT",
          finalTotal: grossAmount,
          shippingCost: shipping,
          discount: disc,
          paymentType: paymentType,
          customerName: shippingInfo.name || "Unknown",
          phone: shippingInfo.phone || "Unknown",
          province: shippingInfo.province || "Unknown",
          city: shippingInfo.city || "Unknown",
          address: shippingInfo.address || "Unknown",
          notes: shippingInfo.notes || "",
          items: {
            create: items.map((item: any) => ({
              product: { connect: { id: item.id } },
              quantity: Number(item.quantity),
              priceAtTime: Number(item.price)
            }))
          }
        }
      });
    }

    if (paymentType === "cod") {
      // If COD, skip Midtrans and return success
      return NextResponse.json({
        success: true,
        orderId,
      });
    }

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
        first_name: shippingInfo.name || "Mitra",
        last_name: "Pak Mul",
        email: "mitra@baksopakmul.com",
        phone: shippingInfo.phone || "081234567890",
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
    const snapUrl = isProduction
      ? "https://app.midtrans.com/snap/v1/transactions"
      : "https://app.sandbox.midtrans.com/snap/v1/transactions";

    // 1. Generate Snap Token first
    const response = await fetch(snapUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Basic ${authString}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("[MIDTRANS SNAP RESPONSE]:", data);

    let token = data.token;
    let redirect_url = data.redirect_url;

    // 2. Generate QRIS URL from Midtrans Redirect URL
    let qrisUrl = "";
    if (redirect_url) {
      qrisUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(redirect_url)}`;
    }

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Gagal membuat token pembayaran Midtrans." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      token,
      redirect_url,
      orderId,
      qrisUrl,
    });
  } catch (error: any) {
    console.error("Internal Tokenizer Error:", error);
    return NextResponse.json(
      { error: "Failed to generate Midtrans transaction token", details: error.message },
      { status: 500 }
    );
  }
}
